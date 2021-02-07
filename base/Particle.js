class Particle {
	constructor(pos,vel,mass,radius,color,ctx) {
		this.pos = pos; this.vel = vel;
		this.mass = mass;
		this.radius = radius;
		this.color = color;
		this.ctx = ctx;
	}
	update() {
		this.pos = this.pos.add(this.vel.mult(TIMESTEP));
	}
	render() {
		this.ctx.beginPath();
		this.ctx.arc(...convertInv(this.pos),this.radius,0,2*Math.PI);
		this.ctx.stroke();
		this.ctx.fillStyle = this.color;
		this.ctx.fill();
	}
	static collide(a,b) {
		return (a.pos.dist(b.pos)<a.radius+b.radius);
	}
	static calcCollision(a,b) {
		let m1 = a.mass; let m2 = b.mass;
		let p1 = a.vel.mult(m1);
		let p2 = b.vel.mult(m2);
		let n = a.pos.sub(b.pos).normalize();
		let k = 2*(p2.mult(m1).sub(p1.mult(m2)).dot(n))/(m1+m2);
		let v1 = p1.add(n.mult(k)).div(m1);
		let v2 = p2.sub(n.mult(k)).div(m2);

		// Comment out this line if the sweep test is fixed
		// The sweep test uses a.vel and b.vel as the initial velocities
		a.vel = v1; b.vel = v2;

		// Sweep test
		// TODO: Fix "sticking" bug
		/*let solveQuadratic = (a1,b1,c1) => {
			let disc = Math.sqrt(b1*b1-4*a1*c1);
			return [(disc-b1)/(2*a1),(-disc-b1)/(2*a1)];
		}

		let r1 = a.pos.sub(a.vel.mult(TIMESTEP));
		let r2 = b.pos.sub(b.vel.mult(TIMESTEP));

		let a1 = a.vel.sub(b.vel).squared();
		let b1 = 2*r1.sub(r2).dot(a.vel.sub(b.vel));
		let c1 = r1.sub(r2).squared()-(a.radius+b.radius)*(a.radius+b.radius);
		let t = Math.min(...solveQuadratic(a1,b1,c1));

		a.pos = r1.add(a.vel.mult(t));
		b.pos = r2.add(b.vel.mult(t));
		a.vel = v1;
		b.vel = v2;*/

		// Approximate sweep test, the above is exact but buggy
		let mid = a.pos.mult(b.radius).add(b.pos.mult(a.radius)).div(a.radius+b.radius);
		a.pos = a.pos.sub(mid).normalize().mult(a.radius).add(mid);
		b.pos = b.pos.sub(mid).normalize().mult(b.radius).add(mid);
	}
}

class ParticleList {
	constructor() {
		this.list = [];
		this.length = 0;
		this.totalEnergy = 0;
	}
	push = (p) => {this.list.push(p); this.length++;}
	render() {
		for (const p of this.list) {
			p.render();
		}
	}
	update() {
		for (const p of this.list) {
			p.update();
		}
		for (let i = 0; i<this.length; i++) {
			for (let j = i+1; j<this.length; j++) {
				let p = this.list[i]; let q = this.list[j];
				if (Particle.collide(p,q)) {
					Particle.calcCollision(p,q);
				}
			}
		}
		for (const p of this.list) {
			if (Math.abs(p.pos.x)>X_LIMIT) {
				p.vel.x *= -1;
				p.pos.x = X_LIMIT*Math.sign(p.pos.x);
			}
			if (Math.abs(p.pos.y)>Y_LIMIT) {
				p.vel.y *= -1;
				p.pos.y = Y_LIMIT*Math.sign(p.pos.y);
			}
		}
		this.totalEnergy = 0;
		for (const p of this.list) {
			this.totalEnergy += 0.5*p.mass*p.vel.squared();
		}
	}
}
