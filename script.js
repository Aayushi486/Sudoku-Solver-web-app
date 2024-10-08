var arr = [[], [], [], [], [], [], [], [], []]

for (var i = 0; i < 9; i++) {
	for (var j = 0; j < 9; j++) {
		arr[i][j] = document.getElementById(i * 9 + j);
	}
}

var board = [[], [], [], [], [], [], [], [], []]

function FillBoard(board) {
	for (var i = 0; i < 9; i++) {
		for (var j = 0; j < 9; j++) {
			if (board[i][j] != 0) {
				arr[i][j].innerText = board[i][j];
			} else {
				arr[i][j].innerText = '';
			}
		}
	}
}

let GetPuzzle = document.getElementById('GetPuzzle');
let SolvePuzzle = document.getElementById('SolvePuzzle');

GetPuzzle.onclick = function () {
	var xhrRequest = new XMLHttpRequest();
	xhrRequest.onerror = function () {
        console.error("An error occurred during the transaction");
    };

	xhrRequest.onload = function () {
		if (xhrRequest.status >= 200 && xhrRequest.status < 300) {
		var response = JSON.parse(xhrRequest.response);
		console.log(response);
		board = response.board;
		FillBoard(board);
	}else {
		console.error("Failed to load the puzzle. Status:", xhrRequest.status);
	}}

	xhrRequest.open('get', 'https://sugoku.onrender.com/board?difficulty=easy');
	// we can change the difficulty of the puzzle, allowed values are easy, medium, hard, and random

	xhrRequest.setRequestHeader("Content-Type", "application/json");
	xhrRequest.send();
}

SolvePuzzle.onclick = () => {
	SudokuSolver(board, 0, 0, 9);
};

function isValid(board, i, j, num, n) {
	// Row check
	for (let x = 0; x < n; x++) {
		if (board[i][x] == num) {
			return false;
		}
	}
	// Column check
	for (let x = 0; x < n; x++) {
		if (board[x][j] == num) {
			return false;
		}
	}
	// Submatrix check
	let rn = Math.sqrt(n);
	let si = i - i % rn;
	let sj = j - j % rn;

	for (let x = si; x < si + rn; x++) {
		for (let y = sj; y < sj + rn; y++) {
			if (board[x][y] == num) {
				return false;
			}
		}
	}
	return true;
}

function SudokuSolver(board, i, j, n) {
	if (i == n) {
		FillBoard(board);
		return true;
	}
	if (j == n) {
		return SudokuSolver(board, i + 1, 0, n);
	}
	if (board[i][j] != 0) {
		return SudokuSolver(board, i, j + 1, n);
	}
	for (let num = 1; num <= 9; num++) {
		if (isValid(board, i, j, num, n)) {
			board[i][j] = num;
			let subans = SudokuSolver(board, i, j + 1, n);
			if (subans) {
				return true;
			}
			// Backtracking
			board[i][j] = 0;
		}
	}
	return false;
}
