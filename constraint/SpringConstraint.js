class SpringConstraint extends Constraint {
	constructor(a,b,dist,k,ctx) {
		super(a,b,dist,ctx);
		this.k = k;
	}
	restoringForce(x) {
		return this.k*x; //this.k*100*Math.atan(x);
	}
	update() {
		let n = this.a.cm.sub(this.b.cm).normalizeInPlace();
		let F = this.restoringForce(this.a.cm.dist(this.b.cm)-this.dist);
		this.a.vel.subInPlace(n.mult(F).divInPlace(this.a.mass/TIMESTEP));
		this.b.vel.addInPlace(n.multInPlace(F).divInPlace(this.b.mass/TIMESTEP));
	}
}
