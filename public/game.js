var gameState = function(){};

var score = 0;
var scoreDisplay;

gameState.prototype = {


  preload: function() {
    //Load the snake and the food that the snake will try to get.
    this.game.load.image('snake', 'assets/snake.png');
    this.game.load.image('food', 'assets/food.png');
  },

  create: function(){
    this.game.delay = 0;
    this.initializeScore();
    this.initializeSnake();
    this.createFood();
  },

  update: function() {
    this.handleInput();
    this.moveSnake();
  },

  createFood: function() {
    var random_x_pos = Math.floor(Math.random() * 20 ) * this.game.snakeSize;
    var random_y_pos = Math.floor(Math.random() * 20 ) * this.game.snakeSize;

    //Add the food for the snake to grab.
    this.game.food = game.add.sprite(random_x_pos, random_y_pos, 'food');
    console.log(this.game.food.x + "and " + this.game.food.y);
  },

  initializeSnake: function() {
    //Initialize the snake. We will use keep track of all the parts of the snake and their positions.
    this.game.snake = [];
    this.game.snakeSize = 25;
    this.game.snakeDirection = 'right';
    var x_pos = 100;
    var y_pos = 100;

    //Create the first 4 blocks of the snake so we have something to start with.
    for(var i = 0; i < 6; i++) {
      this.game.snake[i] = game.add.sprite(x_pos + (i*this.game.snakeSize), y_pos, 'snake');
    }
  },

  initializeScore: function() {
    //Keep a score for each apple we get.
    score = 0;
    this.game.add.text(20, 20, "SCORE: ", { font: "10px", fill: "#ffffff"});
  },

  updateScore: function() {
    this.game.add.text(70, 20, score.toString(), { font: "10px", fill: "#ffffff"});
  },

  handleInput: function() {
    //Keyboard input. Our indicated direction will be based on key press.
    this.game.keys = game.input.keyboard.createCursorKeys();

    if(this.game.keys.right.isDown && this.game.snakeDirection !== 'left') {
      this.game.snakeDirection = 'right';
    }
    if(this.game.keys.left.isDown && this.game.snakeDirection !== 'right') {
      this.game.snakeDirection = 'left';
    }
    if(this.game.keys.down.isDown && this.game.snakeDirection !== 'up') {
      this.game.snakeDirection = 'down';
    }
    if(this.game.keys.up.isDown && this.game.snakeDirection !== 'down') {
      this.game.snakeDirection = 'up';
    }
  },

  moveSnake: function() {
    //Move the snake by simply removing the last part of the snake and putting it at the front.
    //We only care about the positions of the head and tail, and we want to add the tail in front
    //of the head. So we need the size of the snake as well.
    //This delay is here because we want to not be as fast.
    this.game.delay++;

    if(this.game.delay % 8 === 0) {
      this.game.head = this.game.snake[this.game.snake.length - 1];
      this.game.tail = this.game.snake.shift();
      this.game.new_node_x = this.game.tail.x;
      this.game.new_node_y = this.game.tail.y;
      if(this.game.snakeDirection === 'right') {
        this.game.tail.x = this.game.head.x + this.game.snakeSize;
        this.game.tail.y = this.game.head.y;
      } else if(this.game.snakeDirection === 'left') {
        this.game.tail.x = this.game.head.x - this.game.snakeSize;
        this.game.tail.y = this.game.head.y;
      } else if(this.game.snakeDirection === 'up') {
        this.game.tail.x = this.game.head.x;
        this.game.tail.y = this.game.head.y - this.game.snakeSize;
      } else if(this.game.snakeDirection === 'down') {
        this.game.tail.x = this.game.head.x;
        this.game.tail.y = this.game.head.y + this.game.snakeSize;
      }

      this.game.snake.push(this.game.tail);

      this.checkCollisions();
    }

  },

  checkCollisions: function() {
    //Check if you hit yourself
    this.game.fatalCollision = false;
    this.game.goodCollision  = false;

    for(var i = 0; i < this.game.snake.length - 2; i++) {
      if(this.game.head.x === this.game.snake[i].x && this.game.head.y === this.game.snake[i].y) {
        console.log('Collision');
        this.game.fatalCollision = true;
      }
    }

    if(this.game.head.x >= 600 || this.game.head.x <= -200
      || this.game.head.y >= 525 || this.game.head.y <= -75) {
      this.game.fatalCollision = true;
    }

    if(this.game.food.x === this.game.head.x && this.game.food.y === this.game.head.y) {
      console.log("COLLISION");
      this.game.goodCollision = true;
      this.game.food.destroy();
      this.createFood();
    }

    if(this.game.fatalCollision) {
      game.state.start('gameState');
      score = 0;
    } else if(this.game.goodCollision) {
      this.game.snake.unshift(game.add.sprite(this.game.new_node_x, this.game.new_node_y, 'snake'));
      score++;
      this.updateScore();
    }
  }

};