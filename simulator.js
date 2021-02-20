window.onload = () => {

init()
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

for (let i = 0; i<30; i++) {
	let pos = new Vector(500*Math.random()-250,400*Math.random()-200);
	let vel = new Vector(10*Math.random()-5,10*Math.random()-5);
	let particles = []
	for (let j = 0; j<3; j++) {
		let color = colors[Math.floor(Math.random()*colors.length)];
		particles.push(new Particle(pos.add(new Vector(20,0).rot(j*2*Math.PI/3)),new Vector(0,0),100,10,color,ctx));
	}
	let body = new ConstrainedBody(particles, vel, Math.random()/10,ctx); 
	body.addBond(particles[0],particles[1]);
	body.addBond(particles[1],particles[2]);
	body.addBond(particles[2],particles[0]);
	renderList.push(body);
}

energy = document.getElementById("energy");
timestep = document.getElementById("timestep");

timestep.value = TIMESTEP*1000;

t = 0;
mainLoop = () => {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = "#def6ff";
	ctx.fillRect(0,0,canvas.width,canvas.height);
	renderList.render();
	for (let i = 0; i<SUBDIVISIONS; i++) {
		renderList.update();
	}
	TIMESTEP = timestep.value/(1000*SUBDIVISIONS);//Math.sin(t/100);
	t++;
	energy.innerHTML = "Total energy: " + renderList.totalEnergy.toPrecision(8);
	window.requestAnimationFrame(mainLoop);
}

window.requestAnimationFrame(mainLoop);

}
