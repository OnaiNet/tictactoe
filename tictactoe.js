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
			return;
		} else if ((oSum & goal) === goal) {
			gameOver('O wins!');
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

startGame();
