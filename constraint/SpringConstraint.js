class SpringConstraint extends Constraint {
	constructor(a,b,dist,k,ctx) {
		super(a,b,dist,ctx);
		this.k = k;
	}
	restoringForce(x) {
		return this.k*x; //this.k*100*Math.atan(x);
	}
	update() {
		let n = this.b.cm.sub(this.a.cm).normalizeInPlace();
		let F = n.mult(this.k*(this.a.cm.dist(this.b.cm)-this.dist));
		let dF = this.b.vel.sub(this.a.vel).multInPlace(this.k);
		let ddF = F.div(this.a.mass).addInPlace(F.div(this.b.mass)).mult(-this.k)
		this.a.applyContinuousForce(F,dF,ddF,new Vector(0,0));
		this.b.applyContinuousForce(F.mult(-1),dF.mult(-1),ddF.mult(-1),new Vector(0,0));


		/*let n = this.a.cm.sub(this.b.cm).normalizeInPlace();
		let F = n.mult(this.restoringForce(this.a.cm.dist(this.b.cm)-this.dist));
		let dF = n.mult(this.restoringForce(this.a.vel.))
		this.a.vel.subInPlace(F.divInPlace(this.a.mass/TIMESTEP));
		this.b.vel.addInPlace(F.divInPlace(this.b.mass/TIMESTEP));*/
	}
}
