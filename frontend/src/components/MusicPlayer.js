import React, { useState } from "react";

function MusicPlayer({ song, refreshSong }) {
  const [error, setError] = useState(null);

  if (!song) {
    return <div>No song is currently playing.</div>;
  }

  const {
    title,
    artist,
    image_url,
    is_playing,
    time,
    duration,
    votes,
    votes_required,
  } = song;

  const handleError = (err) => {
    console.error("Error:", err);
    setError("Failed to perform action. Please try again.");
    setTimeout(() => setError(null), 3000); // Clear error after 3 seconds
  };

  const skipSong = () => {
  console.log("Skip button clicked");
  fetch("/spotify/skip", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      console.log("Skip response:", response);
      refreshSong();
    })
    .catch((error) => {
      console.error("Skip error:", error);
    });
};

const pauseSong = () => {
  console.log("Pause button clicked");
  fetch("/spotify/pause", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      console.log("Pause response:", response);
      refreshSong();
    })
    .catch((error) => {
      console.error("Pause error:", error);
    });
};

const playSong = () => {
  console.log("Play button clicked");
  fetch("/spotify/play", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => {
      console.log("Play response:", response);
      refreshSong();
    })
    .catch((error) => {
      console.error("Play error:", error);
    });
};


  const songProgress = (time / duration) * 100 || 0;

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: 8,
        padding: 16,
        maxWidth: 600,
        display: "flex",
        gap: 16,
        alignItems: "center",
      }}
    >
      <img
        src={image_url}
        alt="Album cover"
        style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 4 }}
      />
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: "0 0 8px 0" }}>{title}</h3>
        <p style={{ margin: "0 0 16px 0", color: "#666" }}>{artist}</p>
        {error && (
          <div style={{ color: "red", marginBottom: 8 }}>
            {error}
          </div>
        )}
        <div>
          <button
            onClick={() => {
              is_playing ? pauseSong() : playSong();
            }}
            style={{ marginRight: 8 }}
          >
            {is_playing ? "Pause" : "Play"}
          </button>
          <button onClick={skipSong}>
            Skip ({votes} / {votes_required})
          </button>
        </div>
        <div
          style={{
            marginTop: 16,
            height: 8,
            width: "100%",
            backgroundColor: "#eee",
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${songProgress}%`,
              backgroundColor: "#3f51b5",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default MusicPlayer;
