class Body {
	constructor(cm,vel,mass,theta,omega,moment,ctx) {
		this.cm = cm; this.vel = vel; this.mass = mass;
		this.theta = theta; this.omega = omega; this.moment = moment;
		this.ctx = ctx;
	}
	update() {
		// Small optimization
		this.cm.x += this.vel.x*TIMESTEP;
		this.cm.y += this.vel.y*TIMESTEP;
		//this.cm.addInPlace(this.vel.mult(TIMESTEP));
		this.theta += this.omega*TIMESTEP;
		this.theta %= 2*Math.PI;
	}
	energy = () => 0.5*(this.mass*this.vel.squared()+this.moment*this.omega*this.omega);
	render() {}
	getParticleList() {}
	static collide(a,b) {
		for (let p of a.getParticleList()) {
			for (let q of b.getParticleList()) {
				if (Particle.collide(p,q))
					return [p,q,true];
			}
		}
		return [0,0,false];
	}
	static calcCollision(a,b,p,q,d1,d2) {
		let n = p.cm.sub(q.cm).normalizeInPlace();
		let [m1,m2] = [a.mass,b.mass];
		let [v1,v2] = [a.vel,b.vel];
		let [I1,I2] = [a.moment,b.moment];
		let [w1,w2] = [a.omega,b.omega];
		let [u1,u2] = [d1.cross(n),d2.cross(n)];
		
		let denom = 0.5*(1/m1+1/m2 + u1*u1/I1+u2*u2/I2);
		let num = (v2.sub(v1)).dot(n) + (w2*u2-w1*u1);
		let k = num/denom;

		a.vel.addInPlace(n.mult(k/m1));
		b.vel.subInPlace(n.mult(k/m2));

		a.omega += u1*k/I1; b.omega -= u2*k/I2;

		let mid = p.cm.mult(q.radius).addInPlace(q.cm.mult(p.radius)).divInPlace(p.radius+q.radius);
		a.cm.addInPlace(p.cm.sub(mid).normalizeInPlace().multInPlace(p.radius).addInPlace(mid).subInPlace(p.cm));
		b.cm.addInPlace(q.cm.sub(mid).normalizeInPlace().multInPlace(q.radius).addInPlace(mid).subInPlace(q.cm));
	}
}
