var players;
var cells;
var boardFull = 0b111111111;

/*// Test...   null means nobody has gone there yet
cells = [
	'X', 'O', 'O',
	'X', 'X', 'O',
	'O', null, 'X'
];
//*/

var winPatterns = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]].map((winPattern) => {
	var sum = winPattern.reduce((sum, cur, idx) => {
		if (idx === 1) sum = Math.pow(2, sum);
		return sum + Math.pow(2, cur);
	});
	return sum;
});

var checkStatus = function() {
	var xSum = 0, oSum = 0;

	for (var x = 0; x < cells.length; x++) {
		xSum += cells[x] == 'X' ? Math.pow(2, x) : 0;
		oSum += cells[x] == 'O' ? Math.pow(2, x) : 0;
	}

	for (var x = 0; x < winPatterns.length; x++) {
		var goal = winPatterns[x];
		if ((xSum & goal) === goal) {
			gameOver('X wins!');
			drawWinner(goal);
			return;
		} else if ((oSum & goal) === goal) {
			gameOver('O wins!');
			drawWinner(goal);
			return;
		}
	}

	if ((xSum + oSum) === boardFull) {
		gameOver('Stalemate!');
		return;
	}

	// Swap turns
	showTurn();
	console.log('The battle continues...');
};

var gameOver = function(msg) {
	$('#status').html(msg);

	// Unbind cell events since game is over!
	$('.cell').each(function () {
		$(this).unbind();
	});
};

var startGame = function() {
	$('.cell').each(function () {
		$(this).removeClass('selected').html('');
	});

	players = ['X', 'O'];
	cells = [
		null, null, null, 
		null, null, null, 
		null, null, null
	];

	$('#status').html('Current turn: <span id="turn"><span>');
	bindCells();
	showTurn();
	$('#winner').hide();
};

var bindCells = function() {
	$('.cell').click(function() {
		var player = players[0];
		// Set the cell contents and unbind the cell
		$(this).html(player).addClass('selected').unbind();
		// Mark the appropriate cell
		cells[$(this).index()] = player;
		players = players.reverse();
		checkStatus();
	});
};

var showTurn = function() {
	$('#turn').html(players[0]);
};

var drawWinner = function(pattern) {
	$('#winner').show();
	var canvas = $('#winner').get(0);
	var context = canvas.getContext('2d');
	canvas.width = 300;
	canvas.height = 300;
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.beginPath();

	var bitsFound = 0;
	var coordinates = [];

	for (var bit = 0; bit < 9; bit++) {
		var bitValue = Math.pow(2, bit);
		if ((pattern & bitValue) === bitValue) {
			var row = Math.floor(bit / 3);
			var column = (bit % 3);
			coordinates.push([column, row]);
		}
	}
	var cellWidth = canvas.width / 3;
	var cellHeight = canvas.height / 3;
	var x1 = cellWidth * coordinates[0][0] + (((coordinates[0][0] - coordinates[2][0]) / 2 + 1) * cellWidth / 2);
	var y1 = cellHeight * coordinates[0][1] + (((coordinates[0][1] - coordinates[2][1]) / 2 + 1) * cellHeight / 2);
	var x2 = cellWidth * coordinates[2][0] + (((coordinates[2][0] - coordinates[0][0]) / 2 + 1) * cellWidth / 2);
	var y2 = cellHeight * coordinates[2][1] + (((coordinates[2][1] - coordinates[0][1]) / 2 + 1) * cellHeight / 2);
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.strokeStyle = '#F00';
	context.lineWidth = 6;
	context.lineCap = 'round';
	context.stroke();
};

startGame();
