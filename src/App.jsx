import { useState, useEffect } from "react";
import { startGame, makeMove, getValidMoves, aiMove, connectSearchStream } from "./api";
import "./App.css";
import GraphRenderer from "./GraphRenderer"
import HelpTooltip from "./HelpTooltip";
import GraphTooltip from "./GraphToolTip";

function App() {
  const [gameState, setGameState] = useState(null);
  const [selectedChecker, setSelectedChecker] = useState(null);
  const [screen, setScreen] = useState("start");
  const [selectedAI, setSelectedAI] = useState(null);
  const [events, setEvents] = useState([]);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const source = connectSearchStream("https://backgammonai-backend.onrender.com/stream", (evt) => {
      // console.log("[SSE] Recieven Event:", evt);
      setEvents(prev => [...prev, evt]);
    });
    return () => source.close();
  }, []);

  useEffect(() => {
    console.log("useEffect triggered, current_player:", gameState?.current_player, "game_over:", gameState?.game_over);
    if (gameState && gameState.current_player === -1 && !gameState.game_over) {
      setTimeout(() => {
        aiMove().then(data => {
          console.log("AI move complete", data);
          setGameState(data);
        }).catch(err => console.error("AI move error:", err));
      },);
    }
  }, [gameState]);
  
  const handleStartGame = async (aiType) => {
    setSelectedAI(aiType);
    const data = await startGame(aiType);
    setGameState(data);
    setScreen("game");
  }
  
  const handleMove = async (start, end) => {
    const data = await makeMove(start, end);
    if (data.error) {
      alert("Invalid move!");
    } else {
      setGameState(data);
      setSelectedChecker(null);
      setEvents([]) // see if needed
      setResetKey(prev => prev+1)
    }
  };

  if (screen === "start") {
    return (
      <div className = "container">
        <h1>Welcome to Shesh Besh AI</h1>
        <button onClick={() => setScreen("selectAI")}>
          Click here to play agaist the AI
        </button>
      </div>
    );
  }

  if (screen === "selectAI") {
    return (
      <div className = "container">
        <h1>Select AI Opponent</h1>
        <button onClick={() => handleStartGame("random")}>
          Random Bot
        </button>
        <button onClick={() => handleStartGame("minimax")}>
          Minimax AI
        </button>
      </div>
    );
  }

  if (screen === "game") {
    return (

    <div className="container">

      <button onClick={() => setScreen("start")}>
        New Game
      </button>
      <HelpTooltip tipText="test"/>
      <p>Moves Remaining: {gameState?.moves_remaining ? gameState.moves_remaining.join(", ") : "None"}</p>

      <p>Current Player: {gameState?.current_player === 1 ? "White" : "Black"}</p>


      {gameState?.current_player === 1 && gameState?.bar_white > 0 && (
  <div className="bar-selector" onClick={() => setSelectedChecker(-1)}>
    Re-enter White Checker from Bar (You have {gameState.bar_white})
  </div>
)}




      <div className="backgammon-board">
{gameState && gameState.game_over && (
  <div className="board-game-over-overlay">
    <div className="board-game-over-message">
      {gameState.game_over === 1 ? "White Wins!" : "Black Wins!"}
      <button onClick={() =>{
        setScreen("start");
        setGameState(null);
        setSElectedChecker(null);
        setSelectedAI(null);
      }}>
      Play Again 
      </button>
    </div>
  </div>
)}

        <div className="board-container">
          <div className="top-section">
            {/* top left (6-11 reversed) */}
            <div className="left-side">
              {gameState?.board?.slice(6, 12).reverse().map((point, idx) => {
                const actualIndex = 11 - idx;
                return (
                  <div
                  key={actualIndex}
                  className={`point ${selectedChecker === actualIndex ? "selected" : ""}`}
                  onClick={() => {
                    if (gameState.current_player !== 1) return;
                    if (selectedChecker === null) {
                      if (gameState.board[actualIndex] > 0) {
                        setSelectedChecker(actualIndex);
                      } else {
                        alert("you are white, select white");
                      }
                    } else if (selectedChecker === actualIndex) {
                      setSelectedChecker(null);
                    } else {
                      handleMove(selectedChecker, actualIndex);
                    }
                  }}
                >
                    <div className="index-label">{actualIndex}</div>
                    {point !== 0 && (
                      <span className={`checker ${point > 0 ? "white" : "black"}`}>
                        {Math.abs(point)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="middle-separator"></div>

            {/* top right (0-5 reversed) */}
            <div className="right-side">
              {gameState?.board?.slice(0, 6).reverse().map((point, idx) => {
                const actualIndex = 5 - idx;
                return (
                  <div
                  key={actualIndex}
                  className={`point ${selectedChecker === actualIndex ? "selected" : ""}`}
                  onClick={() => {
                    if (gameState.current_player !== 1) return;
                    if (selectedChecker === null) {
                      if (gameState.board[actualIndex] > 0) {
                        setSelectedChecker(actualIndex);
                      } else {
                        alert("you are white, select white");
                      }
                    } else if (selectedChecker === actualIndex) {
                      setSelectedChecker(null);
                    } else {
                      handleMove(selectedChecker, actualIndex);
                    }
                  }}
                >
                    <div className="index-label">{actualIndex}</div>
                    {point !== 0 && (
                      <span className={`checker ${point > 0 ? "white" : "black"}`}>
                        {Math.abs(point)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

            {/* center vertical bar for jail */}
            <div className="bar">
              {gameState && (gameState.bar_black > 0 || gameState.bar_white > 0) ? (
                <>
                  {gameState.bar_black > 0 && (
                    <div className="bar-checkers">
                      {Array(gameState.bar_black)
                        .fill(null)
                        .map((_, i) => (
                          <span key={`b-${i}`} className="checker black"></span>
                        ))}
                    </div>
                  )}
                  {gameState.bar_white > 0 && (
                    <div className="bar-checkers">
                      {Array(gameState.bar_white)
                        .fill(null)
                        .map((_, i) => (
                          <span key={`w-${i}`} className="checker white"></span>
                        ))}
                    </div>
                  )}
                </>
              ) : null}
            </div>

              {/* borne off area */}
              <div className="borne-off">
                {gameState && (
                  <>
                    {gameState.borne_off_white > 0 && (
                      <div className="borne-off-white">
                        <span className="label">White Off:</span> {gameState.borne_off_white}
                      </div>
                    )}
                    {gameState.borne_off_black > 0 && (
                      <div className="borne-off-black">
                        <span className="label">Black Off:</span> {gameState.borne_off_black}
                      </div>
                    )}
                  </>
                )}
              </div>

              {gameState && gameState.all_in_home && selectedChecker !== null && gameState.current_player === 1 && (() => {
                const bearOffMove = gameState.all_moves.find(
                  m => m[0] === selectedChecker && m[3] === "bear_off"
                );
                return bearOffMove ? (
                  <div className="borne-off-selector" onClick={() => handleMove(selectedChecker, bearOffMove[1])}>
                    Bear Off Selected White Checker
                  </div>
                ) : null;
              })()}

          <div className="bottom-section">
            {/* bottom left (12-17) */}
            <div className="left-side">
              {gameState?.board?.slice(12, 18).map((point, idx) => {
                const actualIndex = idx + 12;
                return (
                  <div
                  key={actualIndex}
                  className={`point ${selectedChecker === actualIndex ? "selected" : ""}`}
                  onClick={() => {
                    if (gameState.current_player !== 1) return;
                    if (selectedChecker === null) {
                      if (gameState.board[actualIndex] > 0) {
                        setSelectedChecker(actualIndex);
                      } else {
                        alert("you are white, select white");
                      }
                    } else if (selectedChecker === actualIndex) {
                      setSelectedChecker(null);
                    } else {
                      handleMove(selectedChecker, actualIndex);
                    }
                  }}
                >
                    <div className="index-label">{actualIndex}</div>
                    {point !== 0 && (
                      <span className={`checker ${point > 0 ? "white" : "black"}`}>
                        {Math.abs(point)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="middle-separator"></div>

            {/* bottom right (18-23) */}
            <div className="right-side">
              {gameState?.board?.slice(18, 24).map((point, idx) => {
                const actualIndex = idx + 18;
                return (
                  <div
                  key={actualIndex}
                  className={`point ${selectedChecker === actualIndex ? "selected" : ""}`}
                  onClick={() => {
                    if (gameState.current_player !== 1) return;
                    if (selectedChecker === null) {
                      if (gameState.board[actualIndex] > 0) {
                        setSelectedChecker(actualIndex);
                      } else {
                        alert("you are white, select white");
                      }
                    } else if (selectedChecker === actualIndex) {
                      setSelectedChecker(null);
                    } else {
                      handleMove(selectedChecker, actualIndex);
                    }
                  }}
                >
                    <div className="index-label">{actualIndex}</div>
                    {point !== 0 && (
                      <span className={`checker ${point > 0 ? "white" : "black"}`}>
                        {Math.abs(point)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
              {/* search graph tree */}
              <GraphTooltip tipText="test"/>

              <div>
                  <GraphRenderer 
                  events={events}
                  resetKey={resetKey}
                  />
              </div>


    </div>
  );
}
return null;
}
export default App;