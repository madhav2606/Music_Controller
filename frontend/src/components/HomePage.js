import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Room from "./Room";
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";

function HomePage() {
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    fetch("/api/user-in-room")
      .then((res) => res.json())
      .then((data) => {
        if (data.code) setRoomCode(data.code);
      });
  }, []);

  function clearRoomCode() {
    setRoomCode(null);
  }

  function renderHomePage() {
    return (
      <div style={{ margin: "20px", textAlign: "center" }}>
        <h2>House Party</h2>
        <div>
          <Link to="/join">
            <button>Join a Room</button>
          </Link>
          <Link to="/create">
            <button>Create a Room</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            roomCode ? (
              <Navigate to={`/room/${roomCode}`} />
            ) : (
              renderHomePage()
            )
          }
        />
        <Route path="/join" element={<RoomJoinPage />} />
        <Route path="/create" element={<CreateRoomPage />} />
        <Route
          path="/room/:roomCode"
          element={<Room leaveRoomCallback={clearRoomCode} />}
        />
      </Routes>
    </Router>
  );
}
export default HomePage;
