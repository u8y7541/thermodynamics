class CollisionConstraint extends Constraint {
	constructor(a,b,dist,ctx) {
		super(a,b,dist,ctx);
	}
	update() {
		Particle.calcCollisionNoSweep(this.a,this.b);
		let cm = this.a.pos.mult(this.a.mass).add(this.b.pos.mult(this.b.mass)).div(this.mass);
		this.a.pos = this.a.pos.sub(cm).normalize().mult(this.dist*this.b.mass/this.mass);
		this.b.pos = this.b.pos.sub(cm).normalize().mult(this.dist*this.a.mass/this.mass);
		this.a.pos = this.a.pos.add(cm);
		this.b.pos = this.b.pos.add(cm);
	}
}
