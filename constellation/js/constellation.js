"use strict";

var points = [];
var batchedPoints = [];
var _canRun = true;

var canvas = document.getElementById("constellation");
var context = canvas.getContext("2d");
context.lineWidth = 1;
//context.translate(0.5, 0.5); // Fixes lines not being 1px wide

// Let's consider 1920*1080 the default resolution to scale everything
var scaleRatio = canvas.clientWidth / 1920 * canvas.clientHeight / 1080;
var MAX_DISTANCE = Math.floor(400 * scaleRatio);
var MIN_DISTANCE = 50;
var POINT_RADIUS = 3;
var LINE_TRIGGER = 60;

var width = canvas.clientWidth + MAX_DISTANCE;
var height = canvas.clientHeight + MAX_DISTANCE;

// the amount of points is tied to the canvas size so that it looks roughly the same everywhere
// We also want at least 100 points.
// The formula under there is pure magic.
var pointCount = Math.floor(width / 15 + height / 15 + 200 * scaleRatio);
function setup(amount)
{
	pointCount = amount || pointCount;
	window.requestAnimationFrame = window.requestAnimationFrame ||
	                               window.mozRequestAnimationFrame ||
	                               window.webkitRequestAnimationFrame ||
	                               window.msRequestAnimationFrame;

	if (window.requestAnimationFrame == "undefined")
	{
		_canRun = false;
		console.log("Couldn't find requestAnimationFrame");
	}

	// Generate points
	// Each point has:
	//  - An origin (cx, cy) that doesn't change
	//  - A rendered position (x, y) that rotates on a circle
	//  - A pair of radius (rx, ry), defining the ellipse around which the point rotates, as well as the direction
	//  - A color
	//  - A size modifier, that gets added to the regular point size
	//  - A speed, which is how often it updates
	// x, y Can be generated anywhere between -MAX_DISTANCE/2 and SCREEN_HEIGHT so we can cover the entire screen

	for (var i = 0; i < pointCount; i++)
	{
		var x = Math.floor(Math.random() * (width)) - MAX_DISTANCE/2;
		var y = Math.floor(Math.random() * (height)) - MAX_DISTANCE/2;
		points.push({
			x: x,
			y: y,
			cx: x,
			cy: y,
			speed: Math.floor(Math.random() * 8000) + 3000,
			rx: Math.floor(Math.random() * (MAX_DISTANCE - MIN_DISTANCE) + MIN_DISTANCE) * (Math.floor(Math.random() * 2) == 1 ? 1 : -1),
			ry: Math.floor(Math.random() * (MAX_DISTANCE - MIN_DISTANCE) + MIN_DISTANCE),
			sizeModifier: Math.floor(Math.random() * 2) + 1 * (Math.floor(Math.random() * 2) == 1 ? 1 : -1),
			color: pointColor(),
		});
	}

	// Let's batch each color as a separate list.
	// This avoids doing n context switches, and only does 4.
  var colors = ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.7)"]
	for (var i = 0; i < colors.length; i++) {
		var list = points.filter(function(item) {
			return item.color == colors[i];
		});

		batchedPoints.push(list);
	}

	resizeCanvas();
	window.addEventListener('resize', function() {
		resizeCanvas();
	}, false);
}

// Resize the canvas according to the window size
// Doesn't change the x,y position of the points
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

// Gets a random color for a point
function pointColor() {
	return ["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.3)", "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.7)"][Math.floor(Math.random() * 4)];
}
var batch = 0;
var i = 0;
var j = 0;

// Draw loop
// Draws points, finds out which lines needs to be drawn then draws them
function draw(timestep) {
		// Clear the render target
		context.fillStyle = "#222";
		context.fillRect(0, 0, canvas.width, canvas.height);

		// O(n²), nice.
		// Could apparently be replaced with matrix math to achieve O(n)
		for (batch = 0; batch < batchedPoints.length; batch++) {
			context.fillStyle = batchedPoints[batch][0].color;
			context.strokeStyle = batchedPoints[batch][0].color;
			for (i = 0; i < batchedPoints[batch].length; i++) {
				// Points are drawn with a filled circle
				context.beginPath();
				context.arc(batchedPoints[batch][i].x, batchedPoints[batch][i].y, POINT_RADIUS + batchedPoints[batch][i].sizeModifier, 0, Math.PI*2, false);
				context.fill();
				context.closePath();
			}

			for (i = 0; i < batchedPoints[batch].length; i++) {
				for (j = 0; j < pointCount; j++) {
					// Square root is expensive. Squaring is cheap.
					if ((batchedPoints[batch][i].x - points[j].x) * (batchedPoints[batch][i].x - points[j].x) + (batchedPoints[batch][i].y - points[j].y) * (batchedPoints[batch][i].y - points[j].y) < LINE_TRIGGER*LINE_TRIGGER
						   && i != j) {
						context.beginPath();
						context.moveTo(batchedPoints[batch][i].x + 0.5, batchedPoints[batch][i].y);
						context.lineTo(points[j].x + 0.5, points[j].y);
						context.stroke();
						context.closePath();
					}
				}
			}
		}
}

// Animation loop
// Moves points around
function animate(timestep) {
	for (var i = 0; i < pointCount; i++) {
		points[i].x = points[i].cx + points[i].rx * Math.cos(timestep / points[i].speed);
		points[i].y = points[i].cy + points[i].ry * Math.sin(timestep / points[i].speed);
	}
}

function renderLoop(timestep) {
	requestAnimationFrame(renderLoop);

	draw(timestep);
	animate(timestep); // Prepare for the next render
}
setup()

if (_canRun)
	requestAnimationFrame(renderLoop);
