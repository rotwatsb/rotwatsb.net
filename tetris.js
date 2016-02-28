
var shape =  [[0,0,0,0],
	      [0,0,0,0],
	      [0,0,0,0],
	      [0,0,0,0]];

var next_shape =  [[0,0,0,0],
		   [0,0,0,0],
		   [0,0,0,0],
		   [0,0,0,0]];

var temp =  [[0,0,0,0],
	     [0,0,0,0],
	     [0,0,0,0],
	     [0,0,0,0]];

var shapes = [
    [[0,0,0,0],
     [0,0,0,0],
     [1,1,1,1],
     [0,0,0,0]],
    
    [[0,0,0,0],
     [0,2,2,0],
     [0,2,2,0],
     [0,0,0,0]],

    [[0,0,0],
     [3,3,3],
     [0,0,3]],

    [[0,0,0],
     [4,4,4],
     [4,0,0]],
    
    [[0,0,0],
     [0,5,5],
     [5,5,0]],

    [[0,0,0],
     [6,6,0],
     [0,6,6]],

    [[0,0,0],
     [7,7,7],
     [0,7,0]]
];

var shape_colors = ["#00FFFF",
		    "#FFFF00",
		    "#FFA500",
		    "#0000FF",
		    "#00FF00",
		    "#FF0000",
		    "#800080"];

var canvas = document.getElementById("tetris_canvas");
var ctx = canvas.getContext("2d");
var width = canvas.width, height = canvas.height, play_height = .9 * height;
var cols = 10, rows = 22;
var board = new Array(rows);
var sc = 0, sr = 0; //"shape row" and "shape col"
var score = 0, level = 100, time_interval = 100, level_interval = 100;
var timer;
var k = 0, nk = 0;
var background_color = "#000000";
var is_paused = false;


window.addEventListener('keydown', function (e) {
    if (e.keyCode == 37) {
	if (!collision(-1, 0)) {
	    sc--;
	}}
    else if (e.keyCode == 65) {
	if (!collision(-1, 0)) {
	    sc--;
	}}
    else if (e.keyCode == 39) {
	if (!collision(1, 0)) {
	    sc++;
	}}
    else if (e.keyCode == 68) {
	if (!collision(1, 0)) {
	    sc++;
	}}
    else if (e.keyCode == 38) {
	rotate();
	if (collision(0, 0)) {
	    rotate();
	    rotate();
	    rotate();
	}}
    else if (e.keyCode == 87) {
	rotate();
	if (collision(0, 0)) {
	    rotate();
	    rotate();
	    rotate();
	}}
    else if (e.keyCode == 40) {
	if (!collision(0, 1)) {
	    sr++;
	}}
    else if (e.keyCode == 83) {
	if (!collision(0, 1)) {
	    sr++;
	}}
    else if (e.keyCode == 32) {
	while (!collision(0, 1)) {
	    sr++;
	}}
    else if (e.keyCode == 80) {
	is_paused = !is_paused;
    }
    drawBoard();
}, false);

begin();

function clearLines() {
    var linesCleared = 0;
    var clearLine = true;
    for (var i = 0; i < board.length; i++) {
	clearLine = true;
	for (var j = 0; j < board[i].length; j++) {
	    if (board[i][j] == 0) {
		clearLine = false;
		break;
	    }}
	if (clearLine) {
	    linesCleared++;
	    deleteLine(i);
	}}
    scoreLines(linesCleared);
}

function scoreLines(lines) {
    score+=Math.pow(2, 2 * lines);
    if (score > level) {
	level+=level_interval;
	clearInterval(timer);
	time_interval*=.8;
	timer = setInterval(function(){moveDown();}, time_interval);
    }
    
}

function deleteLine(line) {
    for (var i = line; i > 0; i--) {
	for (var j = 0; j < board[i].length; j++) {
	    board[i][j] = board[i-1][j];
	}}}

function collision(dc, dr) {
    var n = shape.length;
    var nc = sc + dc, nr = sr + dr;
    for (var i = 0; i < shape.length; i++) {
	for (var j = 0; j < shape.length; j++) {
	    if (shape[i][j] > 0) {
		if ((i+nr) < rows && (i+nr) >= 0 && (j+nc) < cols && (j+nc) >= 0) {
		    if (board[i+nr][j+nc] > 0) {
			return true;
		    }}
		else {
		    return true;
		}}}}
    return false;
}

function begin() {
    initBoard();
    clearBoard();
    reset();
}

function reset() {
    score = 0;
    level = 100;
    time_interval = 1000;
    level_interval = 100;
    clearInterval(timer);
    selectNextShape(next_shape);
    updateShape();
    selectNextShape(next_shape);
    sc = (board[0].length / 2) - (shape.length / 2);
    sr = 0;
    timer = setInterval(function(){moveDown();}, time_interval);
}

function moveDown() {
    if (!is_paused) {
	sr++;
	if (collision(0,0)){
	    sr--;
	    pieceToBoard();
	    clearLines();
	    sc = (board[0].length / 2) - (shape.length / 2);
	    sr = 0;
	    updateShape()
	    selectNextShape(next_shape);
	}
	drawBoard();
    }
    else {
	drawPauseScreen();
    }
}

function updateShape() {
    k = nk;
    n = shape.length;
    for (var i = 0; i < n; i++) {
	for (var j = 0; j < n; j++) {
	    shape[i][j] = next_shape[i][j];
	}}}


function gameOver() {
    clearBoard();
    reset();
}

function pieceToBoard() {
    var lost = false;
    for (var i = 0; i < shape.length; i++) {
	for (var j = 0; j < shape.length; j++) {
	    if (shape[i][j] > 0) {
		if (board[i+sr][j+sc] > 0) {
		    lost = true;
		}
		board[i+sr][j+sc] = shape[i][j];
	    }}}
    if (lost) {
	gameOver();
    }
}

function rotate() {
    var n = shape.length;
    var m = (k < 2) ? n : n - 1;
    for (var i = 0; i < n; i++) {
	for (var j = 0; j < n; j++) {
	    temp[i][j] = shape[i][j];
	}}
    
    for (var i = 0; i < n; i++) {
	for (var j = 0; j < n; j++) {
	    shape[j][m-1-i] = temp[i][j];
	}}}

function selectNextShape(shape) {
    nk = Math.floor(Math.random()*(shapes.length));
    var n = shape.length;
    for (var i = 0; i < n; i++) {
	for (var j = 0; j < n; j++) {
	    shape[i][j] = (nk > 1) && ((i == (n-1)) || (j == (n-1))) ? 0 : shapes[nk][i][j];
	}}}

function initBoard() {
    for (var i = 0; i < rows; i++) {
	board[i] = new Array(cols);
    }}

function clearBoard() {
    for (var i = 0; i < rows; i++) {
	for (var j = 0; j < cols; j++) {
	    board[i][j] = 0;
	}}}

function drawPauseScreen() {
    ctx.fillStyle = shape_colors[k];
    ctx.fillRect(0,0,width,height);
    ctx.font = "50px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText("Paused", width / 2 - 100, height / 2 + 25);
}

function drawBoard() {
    // draw board
    for (var i = 2; i < rows; i++) {
	for (var j = 0; j < cols; j++) {
	    ctx.fillStyle = (board[i][j] > 0) ? shape_colors[board[i][j] - 1] : background_color;
	    ctx.fillRect(j * (width / cols), i * (play_height / rows), (width / cols), (play_height / rows));
	}}
    
    // draw current piece
    for (var i = 0; i < shape.length; i++) {
	for (var j = 0; j < shape.length; j++) {
	    if (shape[i][j] > 0) {
		ctx.fillStyle = shape_colors[k];
		ctx.fillRect((j+sc) * (width / cols), (i+sr) * (play_height / rows), (width / cols), (play_height / rows));
	    }}}

    // overlay grid
    for (var i = 0; i < rows; i++) {
	for (var j = 0; j < cols; j++) {
	    ctx.beginPath();
	    ctx.fillStyle = background_color;
	    ctx.rect(j * (width / cols), i * (play_height / rows), (width / cols), (play_height / rows));
	    ctx.stroke();
	}}

    // draw info area
    ctx.fillStyle = background_color;
    ctx.fillRect(0, 0, width, 2 * play_height / rows);
    ctx.fillStyle = "white";
    ctx.fillRect(0, play_height, width, height - play_height);

    // draw next piece
    for (i = 0; i < next_shape.length; i++) {
	for (j = 0; j < next_shape.length; j++) {
	    ctx.fillStyle = next_shape[i][j] > 0 ? shape_colors[nk] : "white";
	    ctx.fillRect(3 * width / 4 + j * 10, play_height + 20 + i * 10, 10, 10)
	}}
    
    // display score
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "left";
    ctx.fillText(score, 20, play_height + 50);
}


