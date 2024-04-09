import { useEffect, useState } from "react";
import "./App.css";
import confetti from "canvas-confetti";
import { Square } from "./components/Square.jsx";
import { TURNS } from "./constants.js";
import { checkWinnerFrom } from "./logic/board.js";
import { WinnerModal } from "./components/WinnerModal.jsx";

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStrorage = window.localStorage.getItem("board");
    return boardFromStrorage
      ? JSON.parse(boardFromStrorage)
      : Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");
    // si no hay local storage inicia el x
    return turnFromStorage ?? TURNS.X;
  });

  const [winner, setWinner] = useState(null);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);

    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')

  };

  const updateBoard = (index) => {
    // no actualizamos esta posición
    // si ya tiene algo
    if (board[index] || winner) return
    // actualizar el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    // cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X
    setTurn(newTurn)
    // guardar aqui partida
    window.localStorage.setItem("board", JSON.stringify(newBoard));
    window.localStorage.setItem("turn", turn);
    // revisar si hay ganador
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGame(newBoard)) {
      setWinner(false) // empate
    }
  }

  

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null);
  };

  useEffect(()=>{
    console.log('useEffect');
  },)
  //

  return (
    <>
      <main className="board">
        <h1>Gato</h1>
        <button onClick={resetGame}>Resetear juego</button>
        <section className="game">
          {board.map((square, index) => {
            return (
              <Square key={index} index={index} updateBoard={updateBoard}>
                {square}
              </Square>
            );
          })}
        </section>

        <section className="turn">
          <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
          <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
        </section>

        <WinnerModal winner={winner} resetGame={resetGame} />
      </main>
    </>
  );
}

export default App;
