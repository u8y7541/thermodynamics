renderList = new ParticleList();
let colors = ['red','blue','green','orange'];
for (let i = 0; i<100; i++) {
	let pos = new Vector(100*Math.random()-50,100*Math.random()-50);
	let vel = new Vector(20*Math.random()-10,20*Math.random()-10);
	let color = colors[Math.floor(Math.random()*colors.length)];
	let radius = Math.random()*10+5;
	let mass = radius*radius;
	let p = new Particle(pos,vel,mass,radius,color,ctx);
	renderList.push(p);
}

energy = document.getElementById("energy");
timestep = document.getElementById("timestep");

var TIMESTEP = 1;
timestep.value = TIMESTEP*1000;
const SUBDIVISIONS = 1;

t = 0;
mainLoop = () => {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = "#def6ff";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	renderList.render();
	for (let i = 0; i<SUBDIVISIONS; i++) {
		renderList.update();
	}
	TIMESTEP = timestep.value/(1000*SUBDIVISIONS);//Math.sin(t/100)/5;
	t++;
	energy.innerHTML = "Total energy: " + renderList.totalEnergy.toPrecision(8);
	window.requestAnimationFrame(mainLoop);
}

window.requestAnimationFrame(mainLoop);
//window.onload = () => setInterval(mainLoop, 16.6666);
