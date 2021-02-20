class Vector {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}
	add = (v) => new Vector(this.x+v.x,this.y+v.y);
	addInPlace = (v) => {this.x+=v.x; this.y+=v.y; return this;};
	sub = (v) => new Vector(this.x-v.x,this.y-v.y);
	subInPlace = (v) => {this.x-=v.x; this.y-=v.y; return this;};
	mult = (k) => new Vector(k*this.x,k*this.y);
	multInPlace = (k) => {this.x*=k; this.y*=k; return this;}
	div = (k) => this.mult(1/k);
	divInPlace = (k) => this.multInPlace(1/k);
	dot = (v) => this.x*v.x+this.y*v.y;
	cross = (v) => this.x*v.y-this.y*v.x;
	rot(theta) {
		const c = Math.cos(theta); const s = Math.sin(theta);
		return new Vector(c*this.x-s*this.y,s*this.x+c*this.y);
	}
	norm = () => Math.hypot(this.x,this.y);
	squared = () => this.dot(this);
	// Can be implemented with sub and norm, but this is faster
	// because it avoids the overhead of creating a Vector
	dist = (v) => Math.hypot(this.x-v.x,this.y-v.y); 
	normalize = () => this.div(this.norm());
	normalizeInPlace = () => this.divInPlace(this.norm());
}

