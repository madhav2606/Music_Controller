import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
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
      <div style={styles.container}>
        <h2 style={styles.title}>House Party</h2>
        <div style={styles.buttonContainer}>
          <Link to="/join" style={styles.link}>
            <button style={styles.button}>Join a Room</button>
          </Link>
          <Link to="/create" style={styles.link}>
            <button style={styles.button}>Create a Room</button>
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
            roomCode ? <Navigate to={`/room/${roomCode}`} /> : renderHomePage()
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

// 🧾 Inline Styles
const styles = {
  container: {
    margin: "60px auto",
    textAlign: "center",
    padding: 24,
    maxWidth: 400,
    border: "1px solid #ccc",
    borderRadius: 8,
  },
  title: {
    fontSize: "28px",
    marginBottom: 24,
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  button: {
    padding: "10px 20px",
    fontSize: 16,
    backgroundColor: "#3f51b5",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  link: {
    textDecoration: "none",
  },
};

export default HomePage;
