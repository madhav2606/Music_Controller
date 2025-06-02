import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RoomJoinPage() {
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleTextFieldChange = (e) => {
    setRoomCode(e.target.value);
  };

  const roomButtonPressed = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: roomCode }),
    };

    fetch("/api/join-room", requestOptions)
      .then((response) => {
        if (response.ok) {
          navigate(`/room/${roomCode}`);
        } else {
          setError("Room not found.");
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <h2>Join a Room</h2>
      <div>
        <input
          type="text"
          placeholder="Enter a Room Code"
          value={roomCode}
          onChange={handleTextFieldChange}
        />
        {error && <p>{error}</p>}
      </div>
      <div>
        <button onClick={roomButtonPressed}>Enter Room</button>
      </div>
      <div>
        <Link to="/">
          <button>Back</button>
        </Link>
      </div>
    </div>
  );
}
