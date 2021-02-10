renderList = new ParticleList();
let colors = ['red','blue','green','orange'];
for (let i = 0; i<30; i++) {
	let pos = new Vector(100*Math.random()-50,100*Math.random()-50);
	let vel = new Vector(20*Math.random()-10,20*Math.random()-10);
	let color = colors[Math.floor(Math.random()*colors.length)];
	let radius = Math.random()*10+5;
	let mass = radius*radius;
	let p = new Particle(pos,vel,mass,radius,color,ctx);
	renderList.push(p);
}/*
let a = new Particle(new Vector(0,0), new Vector(5,3), 225, 15, 'red', ctx);
let b = new Particle(new Vector(-40,0),new Vector(5,3),225,15, 'blue', ctx);
let c = new Particle(new Vector(-40,40),new Vector(5,3),225,15,'orange',ctx);
renderList.push(a); renderList.push(b); renderList.push(c);
let ab = new CollisionConstraint(a,b,60,ctx);
let bc = new CollisionConstraint(b,c,60,ctx);
let ca = new CollisionConstraint(c,a,60*Math.sqrt(2),ctx);*/
constraints = [];
for (let i = 0; i<30; i++) {
	let pos = new Vector(500*Math.random()-250,400*Math.random()-200);
	let vel = new Vector(10*Math.random()-5,10*Math.random()-5);
	let particles = []
	for (let j = 0; j<3; j++) {
		let color = colors[Math.floor(Math.random()*colors.length)];
		particles.push(new Particle(pos.add(new Vector(30,0).rot(j*2*Math.PI/3)),vel,100,10,color,ctx));
	}
	constraints.push(new CollisionConstraint(particles[0],particles[1],25,ctx));
	constraints.push(new CollisionConstraint(particles[1],particles[2],25,ctx));
	constraints.push(new CollisionConstraint(particles[2],particles[0],25,ctx));
	for (let p of particles) {renderList.push(p);}
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
	//ab.render(); bc.render(); ca.render();
	for (let c of constraints) {c.render();}
	renderList.render();
	for (let i = 0; i<SUBDIVISIONS; i++) {
		renderList.update();
		for (let c of constraints) {c.update();}
	}
	TIMESTEP = timestep.value/(1000*SUBDIVISIONS);//Math.sin(t/100)/5;
	t++;
	energy.innerHTML = "Total energy: " + renderList.totalEnergy.toPrecision(8);
	window.requestAnimationFrame(mainLoop);
}

window.requestAnimationFrame(mainLoop);
//window.onload = () => setInterval(mainLoop, 16.6666);
