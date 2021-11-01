window.onload = () => {

init()

centerDist = () => [new Vector(100*Math.random()-50,100*Math.random()-50),
					 new Vector(20*Math.random()-10,20*Math.random()-10)]
leftDist = () => [new Vector(50*Math.random()-1000,2000*Math.random()-1000),
				  new Vector(28*Math.random()-14,0)]
rightDist = () => [new Vector(50*Math.random()+950,2000*Math.random()-1000),
				   new Vector(28*Math.random()-14,0)]
distFunc = centerDist;
reset = () => {
	time = 0;
	renderList = new ParticleList();
	let colors = ['red','blue','green','orange'];
	for (let i = 0; i<500; i++) {
		let [pos, vel] = distFunc();
		//let pos = new Vector(100*Math.random()-50,100*Math.random()-50);
		//let vel = new Vector(20*Math.random()-10,20*Math.random()-10);
		let color = colors[Math.floor(Math.random()*colors.length)];
		let radius = Math.random()*4+2;
		let mass = radius*radius;
		let p = new Particle(pos,vel,mass,radius,color,ctx);
		renderList.push(p);
	}

	for (let i = 0; i<30; i++) {
		let [pos, vel] = distFunc();
		//let pos = new Vector(500*Math.random()-250,400*Math.random()-200);
		//let vel = new Vector(50*Math.random()-25,50*Math.random()-25);
		let particles = []
		for (let j = 0; j<3; j++) {
			let color = colors[Math.floor(Math.random()*colors.length)];
			particles.push(new Particle(pos.add(new Vector(10,0).rot(j*2*Math.PI/3)),new Vector(0,0),49,7,color,ctx));
		}
		let body = new ConstrainedBody(particles, vel, Math.random()/10,ctx); 
		body.addBond(particles[0],particles[1]);
		body.addBond(particles[1],particles[2]);
		body.addBond(particles[2],particles[0]);
		renderList.push(body);
	}
}
reset();

resetLeft = () => {distFunc = leftDist; reset();}
resetCenter = () => {distFunc = centerDist; reset();}
resetRight = () => {distFunc = rightDist; reset();}

/*let a = new Particle(new Vector(-20,0),new Vector(0,-1.5),400,20,'cyan',ctx);
let b = new Particle(new Vector(20,0),new Vector(0,1.5),400,20,'magenta',ctx);
let K = 2000000
renderList.push(a); renderList.push(b);*/

//let constraint = new SpringConstraint(a, b, a.cm.dist(b.cm),1,ctx);

energy = document.getElementById("energy");
presssure = document.getElementById("pressure");
timeElapsed = document.getElementById("timeElapsed");
timestep = document.getElementById("timestep");

timestep.value = TIMESTEP*1000;

loopnum = 0;
let t1 = performance.now();
mainLoop = () => {
	ctx.clearRect(0,0,canvas.width,canvas.height);
	ctx.fillStyle = bgColor;//"#def6ff";
	ctx.fillRect(0,0,canvas.width,canvas.height);

	ctx.strokeStyle = contrastColor;
	ctx.lineWidth = 20*scale;
	ctx.beginPath();
	ctx.rect(...convertInv(new Vector(-X_WORLDLIMIT-10,Y_WORLDLIMIT+10)),2*(X_WORLDLIMIT+10)*scale,2*(Y_WORLDLIMIT+10)*scale);
	ctx.stroke();

	renderList.render();
	//constraint.render();
	for (let i = 0; i<SUBDIVISIONS; i++) {
		renderList.update();
		//constraint.update();
	}

	/*let x = a.cm.sub(b.cm)
	let dx = a.vel.sub(b.vel);
	let n = x.normalize();
	let F = n.mult(K/(x.dot(x)));
	let dF = n.mult(-2*K*dx.dot(x)/Math.pow(x.norm(),4))
			  .add(dx.mult(x.norm()).sub(x.mult(x.dot(dx)/x.norm())).div(x.dot(x)));
	let dF = (dx.mult(x.dot(x)).sub(x.mult(3*x.dot(dx)))).mult(K/Math.pow(x.norm(),5));
	a.applyContinuousForce(F.mult(-1),dF.mult(-1),new Vector(0,0),new Vector(0,0));
	b.applyContinuousForce(F,dF,new Vector(0,0),new Vector(0,0));*/

	TIMESTEP = timestep.value/(1000*SUBDIVISIONS);//Math.sin(loopnum/100);
	energy.innerHTML = "Total kinetic energy: " + renderList.totalEnergy.toPrecision(8);
	pressure.innerHTML = "Pressure: " + renderList.pressure.toPrecision(8);
	timeElapsed.innerHTML = "Simulation time elapsed: " + Math.round(time*1000)/1000;

	let increment = 10/scale;
	if (keys[68]) xOffset += increment;
	if (keys[65]) xOffset -= increment;
	if (keys[87]) yOffset += increment;
	if (keys[83]) yOffset -= increment;

	let t2 = performance.now();
	//if (loopnum%120==0) {console.log(1000/(t2-t1));}
	t1 = t2;
	loopnum++;
	time += TIMESTEP;
	
	window.requestAnimationFrame(mainLoop);
}

window.requestAnimationFrame(mainLoop);

}
