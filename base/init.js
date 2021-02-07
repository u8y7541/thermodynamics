const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 700; canvas.height = 500;
document.body.appendChild(canvas);

const X_LIMIT = canvas.width/2;
const Y_LIMIT = canvas.height/2;

convert = (x,y) => new Vector(x-X_LIMIT,Y_LIMIT-y);
convertInv = (v) => [v.x+X_LIMIT,Y_LIMIT-v.y];
