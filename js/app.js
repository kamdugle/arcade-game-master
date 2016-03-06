"use strict";

//Set up globals
var canvas = document.getElementsByTagName('canvas')[0];
var NUM_ENEMIES = 5;
var ENEMY_SPEED = 90;
var score = 0;
var allEnemies = [];

//introduce sprite logic
var sprites = ['images/char-boy.png', 'images/char-cat-girl.png', 'images/char-horn-girl.png', 'images/char-pink-girl.png', 'images/char-princess-girl.png'];
var spriteNum = Math.floor(Math.random()*sprites.length);
Resources.load(sprites);

//this is an object that records the offset of an images boundaries from its top-left corner
var OffSet = function (left, right, top, bottom) {
    this.right = right;
    this.left = left;
    this.top = top;
    this.bottom = bottom;
};

//Intoduces the Creature superclass
var Creature = function(x, y, offSetObj) {
    if (offSetObj instanceof OffSet) {
        this.offSet = offSetObj;
    }
    this.x = x;
    this.y = y;
};

Creature.prototype.getRight = function() {
    return this.x + this.offSet.right;
};

Creature.prototype.getLeft = function() {
    return this.x + this.offSet.left;
};

Creature.prototype.getTop = function() {
    return this.y + this.offSet.top;
};

Creature.prototype.getBottom = function() {
    return this.y + this.offSet.bottom;
};

// Enemies our player must avoid, created as a subclass of Creature 
var Enemy = function(x, y, offSetObj, speed) {
    Creature.call(this, x, y, offSetObj);
    this.sprite = 'images/enemy-bug.png';
    this.speed = speed;
};

Enemy.prototype = Object.create(Creature.prototype);
Enemy.constructor = Enemy.prototype;

//Checks to see if enemy will go off canvas, returns false if so
Enemy.prototype.moveCheck = function(x,y) {
        var left = this.getLeft();

        return left + x < canvas.width;
};

//moves the enemy forward after calling moveCheck to make sure further movement is possible.
//Sends enemy to left side of canvas if it falls off the map, also calls a check for collisions with
//the player and with other enemies and handles if so.
Enemy.prototype.update = function(dt) {
    if (this.moveCheck(1, 1)) {
        this.x = this.x + dt*this.speed;
    }
    else {
        this.x = -(this.offSet.right);
        this.y = 55 + 85*(Math.floor(Math.random()*4));
    }
    if (this.collisionCheck(player)) {
        player.collision();
    }

    for (var i = 0; i < NUM_ENEMIES; i++) {
        if (this !== allEnemies[i]) {
            if (this.collisionCheck(allEnemies[i])) {
                this.y = 55 + 85*(Math.floor(Math.random()*4));
            }
        }
    } 
};

//Checks for the collision of enemy against a given target.
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
};

// Draw the enemy on the screens
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Creates a player, a subclass of Creature
var Player = function(x, y, offSetObj) {
    Creature.call(this, x, y, offSetObj);
    this.sprite = sprites[spriteNum];
    this.X_STEP = 101;
    this.Y_STEP = 171/2;
};

Player.prototype = Object.create(Creature.prototype);
Player.constructor = Player.prototype;

//Checks for legal moves, returns true if so
Player.prototype.moveCheck = function(x,y) {
    var bottom = this.getBottom();
    var top = this.getTop();
    var left = this.getLeft();
    var right = this.getRight();

    if (top + y <= 60) {
        score++;
        this.x = startingX;
        this.y = startingY;
    } else return (
        (right + x < canvas.width) &&
        (left + x > 0) &&
        (bottom + y < canvas.height) &&
        (top + y > 60)
        );
};

//handles keyboard input, confirming legal moves with moveCheck before allowing. Also handles sprite changing.
Player.prototype.handleInput = function(dir) {
        if (dir === "change") {
            spriteNum = (spriteNum + 1) % sprites.length;
            this.sprite = sprites[spriteNum];

        }
        else if (dir === "left") {
            if (this.moveCheck(-(this.X_STEP), 0)) {
                this.x = this.x - this.X_STEP;
            }
        } else if (dir === "right") {
            if (this.moveCheck(this.X_STEP, 0)) {
                this.x = this.x + this.X_STEP;
            }
        } else if (dir === "up") {
            if (this.moveCheck(0, -(this.Y_STEP))) {
            this.y = this.y - this.Y_STEP;
        }
        } else {
            if (this.moveCheck(0, this.X_STEP)) {
            this.y = this.y + this.Y_STEP;
        }
        }
    };

//renders the player sprite.
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//resets the game board when an enemy collides with player
Player.prototype.collision = function () {
    score = 0;
    allEnemies = [];
    initiateEnemies();
    this.x = startingX;
    this.y = startingY;
};

// Place all enemy objects in an array called allEnemies
var allEnemies = [];

function initiateEnemies() {
    while (allEnemies.length < NUM_ENEMIES) {
        var x = Math.floor(Math.random()*canvas.width);
        var y = 55 + 85*(Math.floor(Math.random()*4));
        allEnemies.push(new Enemy(x, y, new OffSet(0, 100, 78, 144), ENEMY_SPEED));
        }
}

initiateEnemies();

// Places the player object in a variable called player
var startingX = 0;
var startingY = canvas.height - 200;
var player = new Player(startingX, startingY, new OffSet(23, 89, 69, 145));


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keydown', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        67: 'change'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});