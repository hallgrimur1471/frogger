const MAX_TIME_BETWEEN_UPDATES_MS = 50;
const keys = [];
let lastTime = 0;
const canvas = document.createElement("canvas");
canvas.setAttribute("height", 800);   
canvas.setAttribute("width", 800);
const ctx = canvas.getContext("2d");
ctx.fillStyle = "#cccccc";
const body = document.querySelector("body");
body.append(canvas);
body.style = "background-color: black; text-align: center; margin: 0";
let score = 5;


const laneWidth = 50;
const laneStartY = 250;

Number.prototype.times = function(func) {
    for (var i = 0; i < Number(this); i++) {
        func(i);
    }
}

util = {
    colors: [
        "yellow",
        "red",
        "cyab",
        "orange",
        "blue",
        "magenta",
        "pink",
        "purple",
        "brown",
    ],
    wrap: function(number, range){
        const ratio = number / range;
        if(number > 0){
            if(number < range){
                return number;
            }else{
                return (number - Math.floor(ratio) * range);
            }
        }else{
            return (number + Math.ceil(Math.abs(ratio)) * range);
        }
    },
    randomColor: function(){
        return util.colors[Math.floor(Math.random()*util.colors.length)];
    }
}

class Renderable {
    constructor(name) {
        this.name = name;
    }

    render() {
        console.log("rendering:", this.name)
    }
}

class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Car extends Renderable {
    constructor(pos, color) {
        super("Car");
        this.pos = pos;
        this.height = 40;
        this.width = 60;
        this.color = color;
        this.speed = 250 + Math.random()*100;
        this.directions = {
            EAST: 0,
            WEST: 1,
        }
        this.direction = Math.random() > 0.5 ? this.directions.EAST : this.directions.WEST;
    }

    update(du) {
        const direction = this.direction === this.directions.EAST ? 1 : -1;
        const oldX = this.pos.x;
        const newX = this.pos.x + this.speed * du/1000 * direction;
        this.pos.x = util.wrap(newX, canvas.width);
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        if (this.direction === this.directions.WEST) {
            ctx.rotate(Math.PI);
        }
        ctx.fillStyle = this.color;
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.strokeStyle = "black";
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();
    }
}

class Frog extends Renderable {
    constructor(pos) {
        super("Frog");
        this.pos = pos;
        this.height = 40;
        this.width = 40;
        this.speed = 350;
        this.jumpDistance = laneWidth;
        this.directions = {
            NORTH: 0,
            SOUTH: 1,
        }
        this.direction = this.directions.NORTH;
    }

    render(ctx) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        if (this.direction === this.directions.NORTH) {
            ctx.rotate(Math.PI);
        }

        ctx.beginPath();
        ctx.moveTo(this.width / 2, -this.height / 2);
        ctx.lineTo(-this.width / 2, -this.height / 2);
        ctx.lineTo(0, this.height / 2);
        ctx.lineTo(this.width / 2, -this.height / 2);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.restore();
    }

    moveDown() {
        this.pos.y += frog.jumpDistance;
        this.direction = this.directions.SOUTH;
    }

    moveUp() {
        this.pos.y -= frog.jumpDistance;
        this.direction = this.directions.NORTH;
    }

    moveRight(du) {
        this.pos.x += frog.speed * du / 1000;
    }

    moveLeft(du) {
        this.pos.x -= frog.speed * du / 1000;
    }
}

class EntityManager {
    constructor() {
        this.entities = [];
    }

    add(entity) {
        this.entities.push(entity);
    }

    remove(entity) {
        this.entities = thie.entities.filter(e=>(e !== entity));
    }

    renderEntities(ctx) {
        this.entities.forEach(e=>{
            if (e instanceof Renderable) {
                e.render(ctx);
            }
        }
        );
    }
}

////////////////////// INITIALIZE GAME ///////////////////////
const entityManager = new EntityManager();

const frog = new Frog(new Position(400,600));
entityManager.add(frog);
const cars = [
    new Car(new Position(Math.random()*canvas.width, laneStartY + 0 * laneWidth), util.randomColor()), 
    new Car(new Position(Math.random()*canvas.width, laneStartY + 1 * laneWidth), util.randomColor()), 
    new Car(new Position(Math.random()*canvas.width, laneStartY + 2 * laneWidth), util.randomColor()), 
    new Car(new Position(Math.random()*canvas.width, laneStartY + 3 * laneWidth), util.randomColor()), 
    new Car(new Position(Math.random()*canvas.width, laneStartY + 4 * laneWidth), util.randomColor()), 
];
cars.forEach(car=>entityManager.add(car));

function gameFunction(du) {
    update(du);
    render(ctx);
}

function update(du) {
    if (checkKey("a")) {
        frog.moveLeft(du);
    }
    if (checkKey("d")) {
        frog.moveRight(du);
    }
    if (eatKey("w")) {
        frog.moveUp(du);
    }
    if (eatKey("s")) {
        frog.moveDown(du);
    }
    updateCars(du);
    //collisionDetect();
}

function updateCars(du) {
    cars.forEach(car=>car.update(du));
}

function render(ctx) {
    renderBackground(ctx);
    entityManager.renderEntities(ctx);
    renderScore(ctx);
}

function renderBackground(ctx) {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    renderLanes(ctx);
}

laneOffsets = [0, 0, 0, 0, 0].map(n => Math.random()*250);
function renderLanes(ctx) {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.strokeStyle = "#aaa";
    ctx.lineWidth = 2;
    (5).times(i=>{
        const laneY = laneStartY + (i-0.5)*laneWidth
        ctx.fillRect(0, laneY, canvas.width, laneWidth);
        ctx.strokeRect(0, laneY, canvas.width, laneWidth);

        ctx.save();
        ctx.setLineDash([20, 50]);
        ctx.strokeStyle = "yellow";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0-laneOffsets[i], laneY+laneWidth*0.5);
        ctx.lineTo(canvas.width, laneY+laneWidth*0.5);
        ctx.stroke();
        ctx.restore();
    })
    ctx.restore();
}

function renderScore() {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.font = "30px sans-serif";
    const scoreText = "SCORE";
    const textBaselineY = 50;
    const scoreTextStartX = 30;
    ctx.fillText(scoreText, scoreTextStartX, textBaselineY);

    ctx.fillStyle = "red";
    const scoreX = ctx.measureText(scoreText).width;
    const scoreBarHeight = 22;
    const scoreBarWidth = 3;
    const scoreBarTopY = textBaselineY - scoreBarHeight;
    (score).times(i=>{
        const x = scoreTextStartX + scoreX + 25 + 10 * i;
        ctx.fillRect(x, scoreBarTopY, scoreBarWidth, scoreBarHeight);
    }
    );
    ctx.restore();
}

window.addEventListener("keydown", e=>{
    if (e.repeat) {// Do nothing, dont reacognize repeat keys
    } else {
        keys[e.key] = true;
    }
}
);

window.addEventListener("keyup", e=>{
    keys[e.key] = false;
}
);

// eatKey :: key => Boolean
// Returns true if "key" was down, and disables it
// returns false otherwise.
function eatKey(key) {
    if (keys[key]) {
        keys[key] = false;
        return true;
    } else {
        return false;
    }
}

// checkKey :: key => Boolean
// Returns true if "key" is down
// returns false otherwise.
function checkKey(key) {
    return keys[key];
}

running = true;
function main(time) {
    if(time === undefined){
        time = lastTime + MAX_TIME_BETWEEN_UPDATES_MS;
    }
    if(eatKey("p")) {
        running = !running;
    }
    if(running){
        const du = time === undefined ? MAX_TIME_BETWEEN_UPDATES_MS : Math.min(time - lastTime, MAX_TIME_BETWEEN_UPDATES_MS);
        lastTime = time;
        if(isNaN(du)){
            gameFunction(MAX_TIME_BETWEEN_UPDATES_MS);
        }else{
            gameFunction(du);
        }
    }
    requestAnimationFrame(main);
}

// Start game
main();