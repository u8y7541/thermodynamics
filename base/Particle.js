class Particle extends Body {
	constructor(cm,vel,mass,radius,color,ctx) {
		super(cm,vel,mass,0,0,0.5*mass*radius*radius,ctx);
		this.radius = radius;
		this.color = color;
	}
	render() {
		// Culling
		let [x,y] = convertInv(this.cm);
		if ((x-this.radius*scale>2*X_LIMIT || x+this.radius*scale<0) || 
			(y-this.radius*scale>2*Y_LIMIT || y+this.radius*scale<0))
			return;
		// Render circle
		this.ctx.strokeStyle = contrastColor;
		this.ctx.lineWidth = 1*scale;
		this.ctx.beginPath();
		this.ctx.arc(...convertInv(this.cm),this.radius*scale,0,2*Math.PI);
		this.ctx.stroke();
		this.ctx.fillStyle = this.color;
		this.ctx.fill();
	}
	static segmentIntersect(a,b,c,d) {return (b>=c && d>=a);}
	static collide(p,q) {
		// Bounding box test
		if (!Particle.segmentIntersect(p.cm.x-p.radius,p.cm.x+p.radius,q.cm.x-q.radius,q.cm.x+q.radius) ||
			!Particle.segmentIntersect(p.cm.y-p.radius,p.cm.y+p.radius,q.cm.y-q.radius,q.cm.y+q.radius))
			return false;
		// Real circle intersection test
		return (p.cm.dist(q.cm)<p.radius+q.radius);
	}
	getParticleList() {return [this]};
	static calcCollisionNoSweep(a,b) {
		let m1 = a.mass; let m2 = b.mass;
		let p1 = a.vel.mult(m1);
		let p2 = b.vel.mult(m2);
		let n = a.cm.sub(b.cm).normalize();
		let k = 2*(p2.mult(m1).sub(p1.mult(m2)).dot(n))/(m1+m2);
		let v1 = p1.add(n.mult(k)).div(m1);
		let v2 = p2.sub(n.mult(k)).div(m2);
		a.vel = v1; b.vel = v2;
	}
	static calcCollision(a,b) {
		let m1 = a.mass; let m2 = b.mass;
		let p1 = a.vel.mult(m1);
		let p2 = b.vel.mult(m2);
		let n = a.cm.sub(b.cm).normalize();
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

		let r1 = a.cm.sub(a.vel.mult(TIMESTEP));
		let r2 = b.cm.sub(b.vel.mult(TIMESTEP));

		let a1 = a.vel.sub(b.vel).squared();
		let b1 = 2*r1.sub(r2).dot(a.vel.sub(b.vel));
		let c1 = r1.sub(r2).squared()-(a.radius+b.radius)*(a.radius+b.radius);
		let t = Math.min(...solveQuadratic(a1,b1,c1));

		a.cm = r1.add(a.vel.mult(t));
		b.cm = r2.add(b.vel.mult(t));
		a.vel = v1;
		b.vel = v2;*/

		// Approximate sweep test, the above is exact but buggy
		let mid = a.cm.mult(b.radius).add(b.cm.mult(a.radius)).div(a.radius+b.radius);
		a.cm = a.cm.sub(mid).normalize().mult(a.radius).add(mid);
		b.cm = b.cm.sub(mid).normalize().mult(b.radius).add(mid);
	}
}

class ParticleList {
	constructor() {
		this.list = [];
		this.length = 0;
		this.totalEnergy = 0;
		this.totalWallImpulse = 0;
		this.pressure = 0;
		this.lastPressureUpdate = 0;
		this._func = new Function(atob("aWYgKGxvYWRlZCAmJiBzY2FsZT4yLjUgJiYgeE9mZnNldD4xNTAwICYmIHlPZmZzZXQ+NzAwKSB7CgkJCWN0eC5kcmF3SW1hZ2UodG1wLC4uLmNvbnZlcnRJbnYobmV3IFZlY3RvcigyMDAwLDEwMDApKSx0bXAud2lkdGgqc2NhbGUvMTAwMCx0bXAuaGVpZ2h0KnNjYWxlLzEwMDApOwoJCQljdHguZmlsbFN0eWxlID0gY29udHJhc3RDb2xvcjsKCQkJY3R4LmZvbnQgPSAyMDAqc2NhbGUvMTAwMCArICJweCBBcmlhbCI7CgkJCWN0eC5maWxsVGV4dCgiUHJlc2lkZW50IEJhcmFjayBIdXNzZWluIE9iYW1hLCB0aGUgNDR0aCBwcmVzaWRlbnQgb2YgdGhlIFVuaXRlZCBTdGF0ZXMgb2YgQW1lcmljYSwgYXBwcm92ZXMgb2YgdGhpcyBzaW11bGF0aW9uIiwgLi4uY29udmVydEludihuZXcgVmVjdG9yKDE5OTYuMjUsMTAwMC4yNSkpKTsKCQl9"))

	}
	push = (p) => {this.list.push(p); this.length++;}
	render() {
		for (const p of this.list) {
			p.render();
		}
		this._func(ctx,tmp);
	}
	update() {
		for (const p of this.list) {
			p.update();
		}
		for (let i = 0; i<this.length; i++) {
			for (let j = i+1; j<this.length; j++) {
				let p = this.list[i]; let q = this.list[j];
				let [p1,q1,collides] = Body.collide(p,q);
				if (collides) {
					Body.calcCollision(p,q,p1,q1,p1.cm.sub(p.cm),q1.cm.sub(q.cm));
				}
			}
		}
		for (let p of this.list) {
			for (let q of p.getParticleList()) {
				let n;
				if (Math.abs(q.cm.x)>X_WORLDLIMIT) {
					n = new Vector(-Math.sign(q.cm.x),0);
					//p.vel.x *= -1;
					p.cm.x -= q.cm.x-X_WORLDLIMIT*Math.sign(q.cm.x);
				}
				else if (Math.abs(q.cm.y)>Y_WORLDLIMIT) {
					n = new Vector(0,-Math.sign(q.cm.y));
					//p.vel.y *= -1;
					p.cm.y -= q.cm.y-Y_WORLDLIMIT*Math.sign(q.cm.y);
				}
				else {continue;}
				let u = q.cm.sub(p.cm).cross(n);
				let num = -p.vel.dot(n)-p.omega*u;
				let denom = 0.5*(1/p.mass+u*u/p.moment);
				let k = num/denom;
				p.vel.addInPlace(n.mult(k/p.mass));
				p.omega += u*k/p.moment; 
				this.totalWallImpulse += k;
			}
		}
		this.totalEnergy = 0;
		for (const p of this.list) {
			this.totalEnergy += p.energy();
		}

		if (time - this.lastPressureUpdate > 100) {
			this.pressure = this.totalWallImpulse/(100*4*(X_WORLDLIMIT+Y_WORLDLIMIT));
			this.totalWallImpulse = 0;
			this.lastPressureUpdate = time;
		}
	}
}
