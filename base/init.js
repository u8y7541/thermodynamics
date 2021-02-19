var canvas;
var ctx;
var X_LIMIT;
var Y_LIMIT;
var TIMESTEP = 1;
const SUBDIVISIONS = 1;
var convert;
var convertInv;
init = () => {
	canvas = document.getElementById("simulation");
	ctx = canvas.getContext('2d');
	canvas.width = 1000; canvas.height = 600;

	X_LIMIT = canvas.width/2;
	Y_LIMIT = canvas.height/2;

	convert = (x,y) => new Vector(x-X_LIMIT,Y_LIMIT-y);
	convertInv = (v) => [v.x+X_LIMIT,Y_LIMIT-v.y];
}
