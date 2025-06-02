import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CreateRoomPage({
  votesToSkip = 2,
  guestCanPause = true,
  update = false,
  roomCode = null,
  updateCallback = () => {},
}) {
  const [votes, setVotes] = useState(votesToSkip);
  const [guestControl, setGuestControl] = useState(guestCanPause);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleRoomButtonPressed = () => {
    fetch("/api/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votes,
        guest_can_pause: guestControl,
      }),
    })
      .then((response) => response.json())
      .then((data) => navigate(`/room/${data.code}`));
  };

  const handleUpdateButtonPressed = () => {
    fetch("/api/update-room", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: votes,
        guest_can_pause: guestControl,
        code: roomCode,
      }),
    }).then((response) => {
      if (response.ok) {
        setSuccessMsg("Room updated successfully!");
        setErrorMsg("");
      } else {
        setErrorMsg("Error updating room...");
        setSuccessMsg("");
      }
      updateCallback();
    });
  };

  // Inline styles
  const containerStyle = {
    maxWidth: "500px",
    margin: "40px auto",
    padding: "20px",
    backgroundColor: "#ffffff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  };

  const headingStyle = {
    textAlign: "center",
    marginBottom: "20px",
  };

  const inputGroupStyle = {
    marginBottom: "20px",
  };

  const labelStyle = {
    display: "block",
    margin: "10px 0 5px",
  };

  const radioGroupStyle = {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "10px",
  };

  const buttonStyle = {
    padding: "10px 20px",
    margin: "5px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
  };

  const backButtonStyle = {
    ...buttonStyle,
    backgroundColor: "#6c757d",
  };

  const messageStyle = (color) => ({
    color,
    marginBottom: "10px",
    textAlign: "center",
  });

  return (
    <div style={containerStyle}>
      {errorMsg && <div style={messageStyle("red")}>{errorMsg}</div>}
      {successMsg && <div style={messageStyle("green")}>{successMsg}</div>}

      <h2 style={headingStyle}>{update ? "Update Room" : "Create a Room"}</h2>

      <div style={inputGroupStyle}>
        <p style={labelStyle}>Guest Control of Playback State:</p>
        <div style={radioGroupStyle}>
          <label>
            <input
              type="radio"
              value="true"
              checked={guestControl === true}
              onChange={() => setGuestControl(true)}
            />{" "}
            Play/Pause
          </label>
          <label>
            <input
              type="radio"
              value="false"
              checked={guestControl === false}
              onChange={() => setGuestControl(false)}
            />{" "}
            No Control
          </label>
        </div>
      </div>

      <div style={inputGroupStyle}>
        <label style={labelStyle}>Votes Required To Skip Song:</label>
        <input
          type="number"
          min="1"
          value={votes}
          onChange={(e) => setVotes(Number(e.target.value))}
          style={{ padding: "5px", width: "100%", borderRadius: "4px", border: "1px solid #ccc" }}
        />
      </div>

      {update ? (
        <button style={buttonStyle} onClick={handleUpdateButtonPressed}>
          Update Room
        </button>
      ) : (
        <>
          <button style={buttonStyle} onClick={handleRoomButtonPressed}>
            Create A Room
          </button>
          <Link to="/">
            <button style={backButtonStyle}>Back</button>
          </Link>
        </>
      )}
    </div>
  );
}

export default CreateRoomPage;
