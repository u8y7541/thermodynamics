class Vector {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}
	add = (v) => new Vector(this.x+v.x,this.y+v.y);
	sub = (v) => new Vector(this.x-v.x,this.y-v.y);
	mult = (k) => new Vector(k*this.x,k*this.y);
	div = (k) => this.mult(1/k);
	dot = (v) => this.x*v.x+this.y*v.y;
	cross = (v) => this.x*v.y-this.y*v.x;
	rot(theta) {
		const c = Math.cos(theta); const s = Math.sin(theta);
		return new Vector(c*this.x-s*this.y,s*this.x+c*this.y);
	}
	norm = () => Math.hypot(this.x,this.y);
	squared = () => this.dot(this);
	dist = (v) => this.sub(v).norm();
	normalize = () => this.div(this.norm());
}

