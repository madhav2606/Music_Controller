import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage";
import MusicPlayer from "./MusicPlayer";

function Room({ leaveRoomCallback }) {
  const { roomCode } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState({
    votesToSkip: 2,
    guestCanPause: false,
    isHost: false,
    showSettings: false,
    spotifyAuthenticated: false,
  });
  const [song, setSong] = useState(null);

  function getRoomDetails() {
    fetch("/api/get-room?code=" + roomCode)
      .then((response) => {
        if (!response.ok) {
          leaveRoomCallback();
          navigate("/");
        }
        return response.json();
      })
      .then((data) => {
        setState((prev) => ({
          ...prev,
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        }));
        if (data.is_host) authenticateSpotify();
      })
      .catch((error) => {
        console.error("Error fetching room details:", error);
      });
  }

  function authenticateSpotify() {
    fetch("/spotify/is-authenticated")
      .then((response) => response.json())
      .then((data) => {
        setState((prev) => ({
          ...prev,
          spotifyAuthenticated: data.status,
        }));
        if (!data.status) {
          fetch("/spotify/get-auth-url")
            .then((response) => response.json())
            .then((data) => {
              window.location.replace(data.url);
            });
        }
      })
      .catch((error) => {
        console.error("Error authenticating Spotify:", error);
      });
  }

  function getCurrentSong() {
    fetch("/spotify/current-song")
      .then((response) => {
        if (!response.ok) return null;
        return response.text().then((text) => {
          if (!text) return null;
          try {
            return JSON.parse(text);
          } catch {
            return null;
          }
        });
      })
      .then((data) => setSong(data))
      .catch((error) => {
        console.error("Error fetching current song:", error);
        setSong(null);
      });
  }

  function leaveButtonPressed() {
    fetch("/api/leave-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    })
      .then(() => {
        leaveRoomCallback();
        navigate("/");
      })
      .catch((error) => {
        console.error("Error leaving room:", error);
      });
  }

  function updateShowSettings(value) {
    setState((prev) => ({ ...prev, showSettings: value }));
  }

  function renderSettings() {
    return (
      <div style={{ margin: "20px", textAlign: "center" }}>
        <CreateRoomPage
          update={true}
          votesToSkip={state.votesToSkip}
          guestCanPause={state.guestCanPause}
          roomCode={roomCode}
          updateCallback={getRoomDetails}
        />
        <button onClick={() => updateShowSettings(false)} style={{ marginTop: 12 }}>
          Close
        </button>
      </div>
    );
  }

  function renderSettingsButton() {
    return (
      <div style={{ marginTop: 16 }}>
        <button onClick={() => updateShowSettings(true)}>Settings</button>
      </div>
    );
  }

  useEffect(() => {
    getRoomDetails();
    getCurrentSong();
    const interval = setInterval(getCurrentSong, 1000);
    return () => clearInterval(interval);
  }, [roomCode]);

  if (state.showSettings) {
    return renderSettings();
  }

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "20px auto",
        padding: 20,
        border: "1px solid #ccc",
        borderRadius: 8,
        textAlign: "center",
      }}
    >
      <h2>Room Code: {roomCode}</h2>
      <p>Votes Required to Skip: <strong>{state.votesToSkip}</strong></p>
      <p>Guest Can Pause: <strong>{state.guestCanPause.toString()}</strong></p>
      <p>Host: <strong>{state.isHost.toString()}</strong></p>

      <div style={{ margin: "20px 0" }}>
        <MusicPlayer song={song} refreshSong={getCurrentSong} />
      </div>

      {state.isHost && renderSettingsButton()}

      <div style={{ marginTop: 16 }}>
        <button onClick={leaveButtonPressed}>Leave Room</button>
      </div>
    </div>
  );
}

export default Room;
