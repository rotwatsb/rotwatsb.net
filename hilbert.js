
var canvas = document.getElementById("hilbert_canvas");
var ctx = canvas.getContext("2d");
var n = 5;
var width = canvas.width, height = canvas.width;
var line_color = "0xFFFFFF";
var background_color = "0xFFFFFF";
var rot_right = [[0, 1], [-1, 0]];
var rot_left = [[0, -1], [1, 0]];
var base_transform = [[1, 0], [0,1]];
var temp_transform = [[0,0],[0,0]];

begin();

function begin() {
    ctx.fillStyle = background_color;
    ctx.fillRect = (0, 0, width, height);
    ctx.beginPath();
    ctx.fillStyle = line_color;
    drawHilbert(width / 2, height / 2, width, height, n, base_transform, true, true);
}

function apply_transform(m, rot, temp) {
    for (var mr = 0; mr < m.length; mr++) {
	for (var rotc = 0; rotc < rot[0].length; rotc++) {
		var a = 0;
		for (var rotr = 0; rotr < rot.length; rotr++) {
		    a+=m[mr][rotr]*rot[rotr][rotc];
		}
	    temp[mr][rotc] = a;
	}}
	
    
    for (var i = 0; i < m.length; i++) {
	for (var j = 0; j < m[i].length; j++) {
	    m[i][j] = temp[i][j];
	}}}

function drawHilbert(xcenter, ycenter, width, height, n, t, draw_forward, first) {
    var deltas = [[0,0],[0,0],[0,0],[0,0]];
    deltas[0][0] = t[0][0] * (width / -4) + t[0][1] * (height / -4);
    deltas[0][1] = t[1][0] * (width / -4) + t[1][1] * (height / -4);
    deltas[1][0] = t[0][0] * (width / -4) + t[0][1] * (height / 4);
    deltas[1][1] = t[1][0] * (width / -4) + t[1][1] * (height / 4);
    deltas[2][0] = t[0][0] * (width / 4) + t[0][1] * (height / 4);
    deltas[2][1] = t[1][0] * (width / 4) + t[1][1] * (height / 4);
    deltas[3][0] = t[0][0] * (width / 4) + t[0][1] * (height / -4);
    deltas[3][1] = t[1][0] * (width / 4) + t[1][1] * (height / -4);
    
    if (n > 1) {
	if (draw_forward) {
	    apply_transform(t, rot_right, temp_transform);
	    drawHilbert(xcenter + deltas[0][0], ycenter + deltas[0][1], width / 2, height / 2, n-1, t, !draw_forward, false);
	    apply_transform(t, rot_left, temp_transform);
	    drawHilbert(xcenter + deltas[1][0], ycenter + deltas[1][1], width / 2, height / 2, n-1, t, draw_forward, false);
	    drawHilbert(xcenter + deltas[2][0], ycenter + deltas[2][1], width / 2, height / 2, n-1, t, draw_forward, false);
	    apply_transform(t, rot_left, temp_transform);
	    drawHilbert(xcenter + deltas[3][0], ycenter + deltas[3][1], width / 2, height / 2, n-1, t, !draw_forward, false);
	    apply_transform(t, rot_right, temp_transform);
	}
	else {
	    apply_transform(t, rot_left, temp_transform);
	    drawHilbert(xcenter + deltas[3][0], ycenter + deltas[3][1], width / 2, height / 2, n-1, t, !draw_forward, false);
	    apply_transform(t, rot_right, temp_transform);
	    drawHilbert(xcenter + deltas[2][0], ycenter + deltas[2][1], width / 2, height / 2, n-1, t, draw_forward, false);
	    drawHilbert(xcenter + deltas[1][0], ycenter + deltas[1][1], width / 2, height / 2, n-1, t, draw_forward, false);
	    apply_transform(t, rot_right, temp_transform);
	    drawHilbert(xcenter + deltas[0][0], ycenter + deltas[0][1], width / 2, height / 2, n-1, t, !draw_forward, false);
	    apply_transform(t, rot_left, temp_transform);
	}}
    else {
	if (draw_forward) {
	    if (!first) {
		ctx.lineTo(xcenter + deltas[0][0], ycenter + deltas[0][1]);
		ctx.stroke();
	    }
	    for (var i = 0; i < deltas.length - 1; i++) {
		ctx.moveTo(xcenter + deltas[i][0], ycenter + deltas[i][1]);
		ctx.lineTo(xcenter + deltas[i + 1][0], ycenter + deltas[i + 1][1]);
		ctx.stroke();    
	    }
	    ctx.moveTo(xcenter + deltas[deltas.length - 1][0], ycenter + deltas[deltas.length - 1][1]);
	}
	else {
	    if (!first) {
		ctx.lineTo(xcenter + deltas[deltas.length - 1][0], ycenter + deltas[deltas.length - 1][1]);
		ctx.stroke();
	    }
	    for (var i = deltas.length - 1; i > 0; i--) {
		ctx.moveTo(xcenter + deltas[i][0], ycenter + deltas[i][1]);
		ctx.lineTo(xcenter + deltas[i - 1][0], ycenter + deltas[i - 1][1]);
		ctx.stroke();    
	    }
	    ctx.moveTo(xcenter + deltas[0][0], ycenter + deltas[0][1]);
	}}}
    



