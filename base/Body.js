class Body {
	constructor(cm,vel,mass,theta,omega,moment,ctx) {
		this.cm = cm; this.vel = vel; this.mass = mass;
		this.theta = theta; this.omega = omega; this.moment = moment;
		this.ctx = ctx;
	}
	update() {
		this.cm = this.cm.add(this.vel.mult(TIMESTEP));
		this.theta += this.omega*TIMESTEP;
	}
	energy = () => 0.5*(this.mass*this.vel.squared()+this.moment*this.omega*this.omega);
	render() {}
	getParticleList() {}
	static collide(a,b) {
		for (let p of a.getParticleList()) {
			for (let q of b.getParticleList()) {
				if (p.cm.dist(q.cm)<p.radius+q.radius)
					return [p,q,true];
			}
		}
		return [0,0,false];
	}
	static calcCollision(a,b,p,q,d1,d2) {
		let n = p.cm.sub(q.cm).normalize();
		let [m1,m2] = [a.mass,b.mass];
		let [v1,v2] = [a.vel,b.vel];
		let [I1,I2] = [a.moment,b.moment];
		let [w1,w2] = [a.omega,b.omega];
		let [u1,u2] = [d1.cross(n),d2.cross(n)];
		
		let denom = 0.5*(1/m1+1/m2 + u1*u1/I1+u2*u2/I2);
		let num = (v2.sub(v1)).dot(n) + (w2*u2-w1*u1);
		let k = num/denom;

		a.vel = a.vel.add(n.mult(k/m1));
		b.vel = b.vel.sub(n.mult(k/m2));

		a.omega += u1*k/I1; b.omega -= u2*k/I2;

		let mid = p.cm.mult(q.radius).add(q.cm.mult(p.radius)).div(p.radius+q.radius);
		a.cm = a.cm.add(p.cm.sub(mid).normalize().mult(p.radius).add(mid).sub(p.cm));
		b.cm = b.cm.add(q.cm.sub(mid).normalize().mult(q.radius).add(mid).sub(q.cm));
	}
}
