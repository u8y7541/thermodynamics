var canvas;
var ctx;
var X_LIMIT;
var Y_LIMIT;
var X_WORLDLIMIT = 1000;
var Y_WORLDLIMIT = 1000;

var TIMESTEP = 1;
var time = 0;
var SUBDIVISIONS = 1;

var scale = 1;
var xOffset = 0;
var yOffset = 0;
var keys = {};

var bgColor = /*'black';//*/'#def6ff';
var contrastColor = /*'white';//*/'black';
var darkMode = false;
var toggle = () => {
	if (darkMode) {
		bgColor = '#def6ff';
		contrastColor = 'black';
	}
	else {
		bgColor = 'black';
		contrastColor = 'white';
	}
	darkMode = !darkMode;
	document.getElementById('colors').innerHTML = darkMode ? "Light mode" : "Dark mode";
}

var convert;
var convertInv;
var tmp;
var loaded = false;

// see https://stackoverflow.com/questions/17130395/real-mouse-position-in-canvas
// slightly modified
function getMousePos(c, evt) {
	let rect = c.getBoundingClientRect(); // abs. size of element
	// relationship bitmap vs. element for X
	let scaleX = c.width / rect.width;
	// relationship bitmap vs. element for Y
	let scaleY = c.height / rect.height; 
	// scale mouse coordinates after they have
	// been adjusted to be relative to element
	if (!tmp) {
		tmp = new Image(2687,3356);
		tmp.src = atob("aHR0cHM6Ly91cGxvYWQud2lraW1lZGlhLm9yZy93aWtpcGVkaWEvY29tbW9ucy84LzhkL1ByZXNpZGVudF9CYXJhY2tfT2JhbWEuanBn");
		tmp.onload = () => {loaded = true;}
	}
	return [
		(evt.clientX - rect.left) * scaleX,
		(evt.clientY - rect.top) * scaleY
	]
}

init = () => {
	canvas = document.getElementById("simulation");
	ctx = canvas.getContext('2d');
	canvas.width = 1000; canvas.height = 600;

	X_LIMIT = canvas.width/2;
	Y_LIMIT = canvas.height/2;

	convert = (x,y) => new Vector((x-X_LIMIT)/scale+xOffset,(Y_LIMIT-y)/scale+yOffset);
	convertInv = (v) => [(v.x-xOffset)*scale+X_LIMIT,Y_LIMIT-(v.y-yOffset)*scale];
	
	canvas.addEventListener("wheel", (e) => {
		e.preventDefault();
		let change = e.wheelDelta/10000;
		scale *= 1 + change;
		let [x,y] = getMousePos(canvas,e);
		x -= X_LIMIT; y = Y_LIMIT - y;
		xOffset += x*change/scale; yOffset += y*change/scale;
	});
}

addEventListener("keydown",(key)=>{
	keys[key.keyCode] = true;
});
addEventListener("keyup",(key)=>{
	delete keys[key.keyCode];
});

