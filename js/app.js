var canvas = document.getElementsByTagName('canvas')[0];
var numEnemies = 3;

var OffSet = function (left, right, top, bottom) {
    this.right = right;
    this.left = left;
    this.top = top;
    this.bottom = bottom;
}

var Creature = function(x, y, offSetObj) {
    if (offSetObj instanceof OffSet) {
        this.offSet = offSetObj;
    }
    this.x = x;
    this.y = y;
}

Creature.prototype.getRight = function() {
    return this.x + this.offSet.right;
}

Creature.prototype.getLeft = function() {
    return this.x + this.offSet.left;
}

Creature.prototype.getTop = function() {
    return this.y + this.offSet.top;
}

Creature.prototype.getBottom = function() {
    return this.y + this.offSet.bottom;
}

Creature.prototype.moveCheck = function(x,y) {
    var bottom = this.getBottom();
    var top = this.getTop();
    var left = this.getLeft();
    var right = this.getRight();

    return (right + x < canvas.width)
    && (left + x > 0) 
    && (bottom + y < canvas.height) 
    && (top + y > 60);
}
// Enemies our player must avoid
var Enemy = function(x, y, offSetObj) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    Creature.call(this, x, y, offSetObj);
    this.sprite = 'images/enemy-bug.png';

//    this.height = 171;
//    this.width  = 101;
//    this.x = x;
//    this.y = y;
};

Enemy.prototype = Object.create(Creature.prototype);
Enemy.constructor = Enemy.prototype;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    if (this.moveCheck(1, 1)) {
        this.x = this.x + dt*50;
        this.y = this.y + dt*5;
    }
    else {
        this.x = Math.abs((Math.floor(Math.random()*canvas.width))-this.offSet.right);
        this.y = Math.abs(40 + Math.floor(Math.random()*canvas.width-40)-this.offSet.bottom);
    }
    if (this.collisionCheck(player)) {
        player.collision();
    }
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

Enemy.prototype.collisionCheck = function(target) {
    var enemyLeft = this.getLeft();
    var enemyRight = this.getRight();
    var targetLeft = target.getLeft();
    var targetRight = target.getRight();

    var enemyTop = this.getTop();
    var enemyBottom = this.getBottom();
    var targetTop = target.getTop();
    var targetBottom = target.getBottom();

    function collisionX() {
        return (enemyRight >= targetLeft && enemyLeft < targetRight);
    }

    function collisionY() {
        return (enemyBottom >= targetTop && enemyTop < targetBottom);
    }

    if (collisionX() && collisionY()) {
        return true;
    } else {
        return false;
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function(x, y, offSetObj) {
    Creature.call(this, x, y, offSetObj);
    this.sprite = 'images/char-boy.png';
    this.Xstep = 101;
    this.Ystep = 171/2;
};

Player.prototype = Object.create(Creature.prototype);
Player.constructor = Player.prototype;

Player.prototype.update = function(dt) {

};


Player.prototype.handleInput = function(dir) {
        if (dir === "left") {
            if (this.moveCheck(-(this.Xstep), 0)) {
                this.x = this.x - this.Xstep;
            }
        } else if (dir === "right") {
            if (this.moveCheck(this.Xstep, 0)) {
                this.x = this.x + this.Xstep;
            }
        } else if (dir === "up") {
            if (this.moveCheck(0, -(this.Ystep))) {
            this.y = this.y - this.Ystep;
        }
        } else {
            if (this.moveCheck(0, this.Xstep)) {
            this.y = this.y + this.Ystep;
        }
        }
    }

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.collision = function () {
    this.x = startingX;
    this.y = startingY;
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
var allEnemies = new Array();

var worldUpdate = function(dt) {
if (dt % 3 === 0) {
    for (i = 0; i < numEnemies; i++) {
        var x = Math.floor(Math.random()*canvas.width);
        var y = 40 + Math.floor(Math.random()*canvas.width-40);
        allEnemies.push(new Enemy(x, y, new OffSet(0, 100, 78, 144)));
        }
    }
}
// Place the player object in a variable called player
var startingX = 0;
var startingY = canvas.height - 200;
console.log(startingY);

var player = new Player(startingX, startingY, new OffSet(17, 84, 64, 140));


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
