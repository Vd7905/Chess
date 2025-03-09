import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { db } from "../firebase";
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";

const ChessGame = ({ setIsFullscreen }) => {
  const [game, setGame] = useState(new Chess());
  const [gameId, setGameId] = useState("");
  const [playerColor, setPlayerColor] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [invalidMove, setInvalidMove] = useState(false);
  const [gameResult, setGameResult] = useState(null); // Store game result

  useEffect(() => {
    if (gameId) {
      const gameRef = doc(db, "games", gameId);
      const unsubscribe = onSnapshot(gameRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.fen !== game.fen()) {
            const newGame = new Chess(data.fen);
            setGame(newGame);

            // Check for game over conditions
            if (newGame.isCheckmate()) {
              setGameResult(playerColor === newGame.turn() ? "You Lost!" : "You Won!");
            } else if (newGame.isDraw()) {
              setGameResult("Game Draw!");
            }
          }
        }
      });
      return () => unsubscribe();
    }
  }, [gameId, playerColor]);

  const handleMove = async (move) => {
    if (gameResult) return; // Prevent moves after the game ends

    const newGame = new Chess(game.fen());
    const result = newGame.move(move);

    if (result) {
      setGame(newGame);
      setInvalidMove(false);
      const gameRef = doc(db, "games", gameId);
      await updateDoc(gameRef, { fen: newGame.fen() });

      // Check for game end conditions
      if (newGame.isCheckmate()) {
        setGameResult(playerColor === newGame.turn() ? "You Lost!" : "You Won!");
      } else if (newGame.isDraw()) {
        setGameResult("Game Draw!");
      }
    } else {
      setInvalidMove(true);
      setTimeout(() => setInvalidMove(false), 1000);
    }
  };

  const startNewGame = async () => {
    const newGameId = Math.random().toString(36).substring(2, 8);
    const gameRef = doc(db, "games", newGameId);
    await setDoc(gameRef, { fen: new Chess().fen(), players: 1 });

    setGameId(newGameId);
    setPlayerColor("white");
    setGameStarted(true);
    setGameResult(null); // Reset game result
  };

  const joinGame = async () => {
    const gameRef = doc(db, "games", gameId);
    const docSnap = await getDoc(gameRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.players === 1) {
        await updateDoc(gameRef, { players: 2 });
        setPlayerColor("black");
        setGameStarted(true);
        setGameResult(null); // Reset game result
      } else {
        alert("Game is full!");
      }
    } else {
      alert("Game not found!");
    }
  };

  return (
    <div className="chess-container">
      <h1 className="info">Online Chess Game</h1>
      {!gameStarted ? (
        <div className="mb-4">
          <button onClick={startNewGame} className="btn create">
            Create Game
          </button>
          <input
            type="text"
            placeholder="Enter Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="border p-2 ml-2"
          />
          <button onClick={joinGame} className="btn join">
            Join Game
          </button>
        </div>
      ) : (
        <div className={setIsFullscreen ? "fullscreen-board" : "chess-container"}>
          <h2 className="leave-btn">Game ID: {gameId}</h2>
          {invalidMove && <p className="invalid-move">Invalid Move!</p>}
          {gameResult && <p className="game-result">{gameResult}</p>} {/* Display result */}
          <Chessboard
            position={game.fen()}
            onPieceDrop={(sourceSquare, targetSquare) =>
              handleMove({ from: sourceSquare, to: targetSquare })
            }
            boardWidth={window.innerWidth > 600 ? 500 : 350}
            orientation={playerColor}
          />
        </div>
      )}
    </div>
  );
};

export default ChessGame;
