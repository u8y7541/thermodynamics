class ConstrainedBody extends Body {
	constructor(list, vel, omega, ctx) {
		// Find mass and cm (for rotation purposes)
		let cm = new Vector(0,0);
		let mass = 0;
		for (let p of list) {
			cm.addInPlace(p.cm.mult(p.mass));
			mass += p.mass;
		}
		cm.divInPlace(mass);
		let moment = list.reduce((p,q) => p+q.mass*q.cm.sub(cm).squared(),0);
		super(cm,vel,mass,0,omega,moment,ctx);

		// List of nonrotated displacement vectors relative to the cm
		this.disp = list.map(p => p.cm.sub(cm)); 
		this.list = list;
		this.bonds = [];
	}
	update() {
		super.update();
		for (let i = 0; i<this.list.length; i++)
			this.list[i].cm = this.disp[i].rot(this.theta).addInPlace(this.cm);
	}
	render() {
		for (let b of this.bonds) {
			this.ctx.strokeStyle = contrastColor;
			this.ctx.lineWidth = 5*scale;
			this.ctx.beginPath();
			this.ctx.moveTo(...convertInv(b[0].cm));
			this.ctx.lineTo(...convertInv(b[1].cm));
			this.ctx.stroke();
		}
		for (let p of this.list)
			p.render();
	}
	getParticleList() {return this.list};
	addBond(a,b) {
		this.bonds.push([a,b]);
	}
}
