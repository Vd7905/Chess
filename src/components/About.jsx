import React from 'react';

const About = () => {
  return (
    <div className="about-container">
      <h1>About Chess Online</h1>
      <p>
        Chess Online is a multiplayer chess game that allows players to compete in real-time 
        with friends or random opponents. The game supports seamless gameplay, real-time 
        updates, and an interactive chessboard.
      </p>
      <h2>Features</h2>
      <ul>
        <li>Play chess online with friends or random opponents</li>
        <li>Real-time game updates using Firebase</li>
        <li>Responsive and interactive chessboard</li>
        <li>Fullscreen mode for immersive gameplay</li>
        <li>Game result display for checkmate and draws</li>
      </ul>
      <h2>How to Play</h2>
      <p>
        To start a game, create a new game session or join an existing one by entering the game ID. 
        Make strategic moves and try to checkmate your opponent!
      </p>
    </div>
  );
};

export default About;
