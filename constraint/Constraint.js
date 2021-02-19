class Constraint {
	constructor(a,b,dist,ctx) {
		this.a = a; this.b = b;
		this.mass = this.a.mass+this.b.mass;
		this.dist = dist;
		this.ctx = ctx;
	}
	render() {
		this.ctx.strokeStyle = "black";
		this.ctx.lineWidth = 5;
		this.ctx.beginPath();
		this.ctx.moveTo(...convertInv(this.a.cm));
		this.ctx.lineTo(...convertInv(this.b.cm));
		this.ctx.stroke();
	}
	update() {}	
}
