import { useMemo, useState } from "react";
import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Tic Tac Toe — Ocean Professional" },
    {
      name: "description",
      content:
        "A modern, minimalist Tic Tac Toe game built with Remix. Two-player, responsive, with Ocean Professional theme.",
    },
  ];
};

type Player = "X" | "O" | null;
type Board = Player[];

// Compute winner and winning line
function calculateWinner(squares: Board): { winner: Player; line: number[] } | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diags
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return null;
}

export default function Index() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const winnerInfo = useMemo(() => calculateWinner(board), [board]);
  const isDraw = useMemo(() => !winnerInfo && board.every((s) => s !== null), [board, winnerInfo]);
  const currentPlayer: Player = xIsNext ? "X" : "O";

  function handleClick(index: number) {
    // Ignore clicks if game is over or cell is occupied
    if (winnerInfo || board[index]) return;

    const next = board.slice();
    next[index] = currentPlayer;
    setBoard(next);
    setXIsNext(!xIsNext);
  }

  function resetGame() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  const status = winnerInfo
    ? `Winner: ${winnerInfo.winner}`
    : isDraw
    ? "It's a draw!"
    : `Next player: ${currentPlayer}`;

  // Styling helpers (Ocean Professional theme)
  const cellBase =
    "aspect-square w-24 sm:w-28 md:w-32 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur " +
    "shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer select-none border border-blue-100";
  const cellText =
    "text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight";
  const xStyles = "text-blue-600";
  const oStyles = "text-amber-500";
  const disabledCell = "opacity-60 cursor-not-allowed";
  const winningCell =
    "ring-2 ring-offset-2 ring-blue-400 ring-offset-blue-50 shadow-lg";

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-500/10 to-gray-50 text-gray-900 flex items-center justify-center px-4">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-6">
        {/* Header */}
        <header className="w-full rounded-3xl bg-white/80 backdrop-blur p-6 shadow-md border border-blue-100">
          <h1 className="text-center text-2xl sm:text-3xl font-extrabold text-blue-700">
            Classic Tic Tac Toe
          </h1>
          <p className="mt-2 text-center text-sm sm:text-base text-gray-600">
            Two players. Take turns placing X and O. First to align three wins.
          </p>
        </header>

        {/* Status */}
        <div className="w-full rounded-2xl bg-white/70 backdrop-blur p-4 shadow-sm border border-blue-100">
          <p className="text-center text-base sm:text-lg font-medium">
            <span
              className={
                winnerInfo
                  ? "text-blue-700"
                  : isDraw
                  ? "text-gray-700"
                  : xIsNext
                  ? "text-blue-700"
                  : "text-amber-600"
              }
            >
              {status}
            </span>
          </p>
        </div>

        {/* Board */}
        <div
          className="grid grid-cols-3 gap-3 sm:gap-4"
          role="grid"
          aria-label="Tic Tac Toe board"
        >
          {board.map((value, idx) => {
            const isWinning = winnerInfo?.line.includes(idx) ?? false;
            const isDisabled = Boolean(winnerInfo || value);
            return (
              <button
                key={idx}
                role="gridcell"
                aria-label={`Cell ${idx + 1} ${value ? "occupied by " + value : "empty"}`}
                onClick={() => handleClick(idx)}
                className={[
                  cellBase,
                  isDisabled ? disabledCell : "",
                  isWinning ? winningCell : "",
                ].join(" ")}
                disabled={isDisabled && !(!winnerInfo && value === null)}
              >
                <span
                  className={[
                    cellText,
                    value === "X" ? xStyles : "",
                    value === "O" ? oStyles : "",
                  ].join(" ")}
                >
                  {value ?? ""}
                </span>
              </button>
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex w-full items-center justify-center">
          <button
            onClick={resetGame}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-white shadow-md transition-all duration-200 hover:bg-blue-700 hover:shadow-lg active:translate-y-px focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M4 4v6h6M20 20v-6h-6M5.64 18.36A9 9 0 1018.36 5.64"
              />
            </svg>
            Restart
          </button>
        </div>

        {/* Footer note */}
        <footer className="mt-2 text-center text-xs text-gray-500">
          Theme: Ocean Professional — blue and amber accents, clean and modern.
        </footer>
      </div>
    </div>
  );
}
