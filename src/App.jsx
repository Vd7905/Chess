// import { useState, useEffect } from "react";
// import { Chess } from "chess.js";
// import { Chessboard } from "react-chessboard";
// import { db } from "./firebase";
// import { doc, getDoc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";
// // import Navbar from "./Navbar";

// const App = () => {
//   const [game, setGame] = useState(new Chess());
//   const [gameId, setGameId] = useState("");
//   const [playerColor, setPlayerColor] = useState("white");
//   const [gameStarted, setGameStarted] = useState(false);
//   const [validMoves, setValidMoves] = useState([]);

//   useEffect(() => {
//     if (gameId) {
//       const gameRef = doc(db, "games", gameId);
//       const unsubscribe = onSnapshot(gameRef, (snapshot) => {
//         if (snapshot.exists()) {
//           const data = snapshot.data();
//           if (data.fen !== game.fen()) {
//             setGame(new Chess(data.fen));
//           }
//         }
//       });
//       return () => unsubscribe();
//     }
//   }, [gameId]);

//   const handleMove = async (move) => {
//     const newGame = new Chess(game.fen());
//     const result = newGame.move(move);

//     if (result) {
//       setGame(newGame);
//       setValidMoves([]);
//       const gameRef = doc(db, "games", gameId);
//       await updateDoc(gameRef, { fen: newGame.fen() });
//     }
//   };

//   const startNewGame = async () => {
//     const newGameId = Math.random().toString(36).substring(2, 8);
//     const gameRef = doc(db, "games", newGameId);
//     await setDoc(gameRef, { fen: new Chess().fen() });
//     setGameId(newGameId);
//     setPlayerColor("white");
//     setGameStarted(true);
//   };

//   const joinGame = async () => {
//     const gameRef = doc(db, "games", gameId);
//     const docSnap = await getDoc(gameRef);
//     if (docSnap.exists()) {
//       setGameStarted(true);
//       setPlayerColor("black");
//     } else {
//       alert("Game not found!");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center p-4">
//        {/* <Navbar /> */}
//       <h1 className="text-2xl font-bold mb-4">Online Chess Game</h1>
//       {!gameStarted ? (
//         <div className="mb-4">
//           <button onClick={startNewGame} className="p-2 bg-blue-500 text-white rounded">
//             Create Game
//           </button>
//           <input
//             type="text"
//             placeholder="Enter Game ID"
//             value={gameId}
//             onChange={(e) => setGameId(e.target.value)}
//             className="border p-2 ml-2"
//           />
//           <button onClick={joinGame} className="p-2 bg-green-500 text-white rounded ml-2">
//             Join Game
//           </button>
//         </div>
//       ) : (
//         <div>
//           <h2 className="text-lg mb-2">Game ID: {gameId}</h2>
//           <Chessboard
//             position={game.fen()}
//             onPieceDrop={(sourceSquare, targetSquare) =>
//               handleMove({ from: sourceSquare, to: targetSquare })
//             }
//             boardWidth={400}
//             orientation={playerColor}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;

import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Navbar from "./components/Navbar";
import ChessGame from "./components/ChessGame";
import { Chess } from "chess.js";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import About from "./components/About";

const App = () => {
  const [gameId, setGameId] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const startGame = async () => {
    const newGameId = Math.random().toString(36).substring(2, 8);
    const gameRef = doc(db, "games", newGameId);
    await setDoc(gameRef, { fen: new Chess().fen() });
    setGameId(newGameId);
  };

  const leaveGame = () => {
    setGameId(null);
    setIsFullscreen(false);
  };

  return (
    <Router>
      <div className={`app-container ${isFullscreen ? "fullscreen-mode" : ""}`}>
        {!isFullscreen && <Navbar setIsFullscreen={setIsFullscreen} />}
        <div className="main-content">
          <Routes>
            <Route 
              path="/" 
              element={!gameId ? <Homepage startGame={startGame} /> : <ChessGame gameId={gameId} leaveGame={leaveGame} setIsFullscreen={setIsFullscreen} />}
            />
            <Route path="/about" element = {<About/>} />
          </Routes>
        </div>
       
      </div>
    </Router>
  );
};

export default App;
