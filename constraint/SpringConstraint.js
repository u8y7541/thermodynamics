class SpringConstraint extends Constraint {
	constructor(a,b,dist,k,ctx) {
		super(a,b,dist,ctx);
		this.k = k;
	}
	update() {
		let n = this.a.pos.sub(this.b.pos).normalize();
		let F = this.k*Math.pow((this.a.pos.sub(this.b.pos).norm()-this.dist),3);
		this.a.vel = this.a.vel.sub(n.mult(F).div(this.a.mass/TIMESTEP));
		this.b.vel = this.b.vel.add(n.mult(F).div(this.b.mass/TIMESTEP));
	}
}
