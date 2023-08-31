// wait for the DOM to load before any codes
document.addEventListener("DOMContentLoaded", () => {
  let board = null; //init the chessbaord
  const game = new Chess(); //creating new chess.js game instance
  const moveHistory = document.getElementById("move-history");
  //get move history container
  let moveCount = 1; //init the move count
  let userColor = "w"; //init user color

  //functions to make a random move for the computer

  const makeRandomMove = () => {
    const possibleMoves = game.moves();
    if (game.game_over()) {
      alert("CheckMate");
    } else {
      const randomIdx = Math.floor(Math.random() * possibleMoves.length);
      const move = possibleMoves[randomIdx];
      game.move(move);
      board.position(game.fen());
      recordMove(move, moveCount); // Record and display the moves with counts
      moveCount++;
    }
  };
  //function to record and display a move in history
  const recordMove = (move, count) => {
    const formattedMove =
      count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
    moveHistory.textContent += formattedMove + "";
    moveHistory.scrollTop = moveHistory.scrollHeight; //autoscroll to the latest move
  };

  //function to handle the start of drag position

  const onDragStart = (source, piece) => {
    //allow the user to drag only theirs
    return !game.game_over() && piece.search(userColor) === 0;
  };

  //function to handle a piece drop on the board

  const onDrop = (source, target) => {
    const move = game.move({
      from: source,
      to: target,
      promotion: "q",
    });
    if (move === null) return "snapback";

    window.setTimeout(makeRandomMove, 250);
    recordMove(move.san, moveCount);

    moveCount++;
  };

  //function for end of a piece snap animation

  const onSnapEnd = () => {
    board.position(game.fen());
  };

  //configureation options for the chessboard
  const boardConfig = {
    showNotation: true,
    draggable: true,
    position: "start",
    onDragStart,
    onDrop,
    onSnapEnd,
    moveSpeed: "fast",
    snapBackSpeed: 500,
    snapSpeed: 100,
  };

  //init the chessbaord

  board = Chessboard("board", boardConfig);

  //event listener

  //eventlistener for play again
  document.querySelector(".play-again").addEventListener("click", () => {
    game.reset();
    board.start();
    moveHistory.innerHTML = "";
    moveCount = 1;
    userColor = "w";
  });

  //eventlistener for 'set position'

  document.querySelector(".set-pos").addEventListener("click", () => {
    const fen = prompt("Enter the FEN notation for the desired position!");
    if (fen !== null) {
      if (game.load(fen)) {
        board.position(fen);
        moveHistory.textContent = "";
        moveCount = 1;
        userColor = "w";
      } else {
        alert("Invalid FEN notation.");
      }
    }
  });

  //eventlistener for the 'flip board'
  document.querySelector(".flip-board").addEventListener("click", () => {
    board.flip();
    makeRandomMove();
    //user's color
    userColor = userColor === "w" ? "b" : "w";
  });
});
