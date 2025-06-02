import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CreateRoomPage({ votesToSkip = 2, guestCanPause = true, update = false, roomCode = null, updateCallback = () => {} }) {
  const [votes, setVotes] = useState(votesToSkip);
  const [guestControl, setGuestControl] = useState(guestCanPause);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const navigate = useNavigate();

  const handleRoomButtonPressed = () => {
    fetch("/api/create-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ votes_to_skip: votes, guest_can_pause: guestControl }),
    })
      .then(response => response.json())
      .then(data => navigate(`/room/${data.code}`));
  };

  const handleUpdateButtonPressed = () => {
    fetch("/api/update-room", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ votes_to_skip: votes, guest_can_pause: guestControl, code: roomCode }),
    }).then(response => {
      if (response.ok) {
        setSuccessMsg("Room updated successfully!");
      } else {
        setErrorMsg("Error updating room...");
      }
      updateCallback();
    });
  };

  return (
    <div>
      {errorMsg && <div style={{ color: "red" }}>{errorMsg}</div>}
      {successMsg && <div style={{ color: "green" }}>{successMsg}</div>}
      <h2>{update ? "Update Room" : "Create a Room"}</h2>
      <div>
        <p>Guest Control of Playback State:</p>
        <label>
          <input
            type="radio"
            value="true"
            checked={guestControl === true}
            onChange={() => setGuestControl(true)}
          /> Play/Pause
        </label>
        <label>
          <input
            type="radio"
            value="false"
            checked={guestControl === false}
            onChange={() => setGuestControl(false)}
          /> No Control
        </label>
      </div>
      <div>
        <p>Votes Required To Skip Song:</p>
        <input
          type="number"
          min="1"
          value={votes}
          onChange={e => setVotes(Number(e.target.value))}
        />
      </div>
      {update ? (
        <button onClick={handleUpdateButtonPressed}>Update Room</button>
      ) : (
        <>
          <button onClick={handleRoomButtonPressed}>Create A Room</button>
          <Link to="/"><button>Back</button></Link>
        </>
      )}
    </div>
  );
}

export default CreateRoomPage;
