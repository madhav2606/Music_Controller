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
        setState({
          ...state,
          votesToSkip: data.votes_to_skip,
          guestCanPause: data.guest_can_pause,
          isHost: data.is_host,
        });
        if (data.is_host) {
          authenticateSpotify();
        }
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
        if (!response.ok) {
          console.warn("Response not OK:", response.status);
          return null;
        }
        return response.text().then((text) => {
          if (!text) {
            console.warn("Empty response body");
            return null;
          }
          try {
            return JSON.parse(text);
          } catch (err) {
            console.error("JSON parse error:", err);
            return null;
          }
        });
      })
      .then((data) => {
        console.log("Fetched song data:", data);
        setSong(data);
      })
      .catch((error) => {
        console.error("Error fetching current song:", error);
        setSong(null);
      });
  }

  function leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions)
      .then((_response) => {
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
      <div style={{ textAlign: "center" }}>
        <CreateRoomPage
          update={true}
          votesToSkip={state.votesToSkip}
          guestCanPause={state.guestCanPause}
          roomCode={roomCode}
          updateCallback={getRoomDetails}
        />
        <button onClick={() => updateShowSettings(false)}>Close</button>
      </div>
    );
  }

  function renderSettingsButton() {
    return (
      <div style={{ textAlign: "center" }}>
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
    <div style={{ margin: "20px", textAlign: "center" }}>
      <h4>Code: {roomCode}</h4>
      <p>Votes: {state.votesToSkip}</p>
      <p>Guest Can Pause: {state.guestCanPause.toString()}</p>
      <p>Host: {state.isHost.toString()}</p>
      <MusicPlayer song={song} refreshSong={getCurrentSong} />
      {state.isHost && renderSettingsButton()}
      <div>
        <button onClick={leaveButtonPressed}>Leave Room</button>
      </div>
    </div>
  );
}

export default Room;