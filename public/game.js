var gameState = function(){};

var score = 0;
var scoreDisplay;

var env = {};
env.getNumStates = function () { return 8; }
env.getMaxNumActions = function () { return 3; }
var spec = { };
spec.update = 'qlearn';
spec.gamme = .9;
spec.epsilon = .1;
spec.alpha = .5;
var moves = [0,1,2];
var agent = store.get ('agent') [0];
if (agent === undefined) {
  agent = new RL.DQNAgent(env, spec);
  store.set ('agent', agent);
}
console.log("Agent:" + agent);

var game_counter = 0; //Keeps track of games played
var score_amt = 0; //Keeps track of total goals scored

gameState.prototype = {


  preload: function() {
    //Load the snake and the food that the snake will try to get.
    this.game.load.image('snake', 'assets/snake.png');
    this.game.load.image('food', 'assets/food.png');
  },

  create: function(){
    this.game.delay = 0;
    //console.log("Agent: " + agent);
    this.initializeScore();
    this.initializeSnake();
    this.createFood();
  },

  update: function() {
    if (game_counter == 100) {
      this.getProgress ();
    }
    this.moveSnake();
  },

  createFood: function() {
    var random_x_pos = Math.floor(Math.random() * 20 ) * this.game.snakeSize;
    var random_y_pos = Math.floor(Math.random() * 20 ) * this.game.snakeSize;

    //Add the food for the snake to grab.
    this.game.food = game.add.sprite(random_x_pos, random_y_pos, 'food');
  },

  initializeAgent: function () {

    var action = agent.act(s); // s is an array of length 8
    // execute action in environment and get the reward
    agent.learn(reward); // the agent improves its Q,policy,model, etc. reward is a float

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

  handleInput: function(action) {
    //Keyboard input. Our indicated direction will be based on key press.
    this.game.keys = game.input.keyboard.createCursorKeys();

    /*
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
    }*/
  },

  moveSnake: function(action) {
    //Move the snake by simply removing the last part of the snake and putting it at the front.
    //We only care about the positions of the head and tail, and we want to add the tail in front
    //of the head. So we need the size of the snake as well.
    //This delay is here because we want to not be as fast.
    this.game.delay++;
    var action;
    if(true) {
      action = agent.act(moves);
      this.game.head = this.game.snake[this.game.snake.length - 1];
      this.game.tail = this.game.snake.shift();

      var current_head_x = this.game.head.x;
      var current_head_y = this.game.head.y;

      var change_x = this.negativeCheck(current_head_x, this.game.food.x);
      var change_y = this.negativeCheck(current_head_y, this.game.food.y);
      
      var wall_change_x;
      var wall_change_y;

      this.game.new_node_x = this.game.tail.x;
      this.game.new_node_y = this.game.tail.y;

      if(this.game.snakeDirection === 'right') {
        wall_change_x = 600;
        if (action === 1) {
          this.game.tail.x = this.game.head.x;
          this.game.tail.y = this.game.head.y - this.game.snakeSize;
          this.game.snakeDirection = 'up';
          
        }

        else if (action === 2) {
          this.game.tail.x = this.game.head.x;
          this.game.tail.y = this.game.head.y + this.game.snakeSize;
          this.game.snakeDirection = 'down';
        }

        else if (action === 0) {
          this.game.tail.x = this.game.head.x + this.game.snakeSize;
          this.game.tail.y = this.game.head.y;
        } 

      } else if(this.game.snakeDirection === 'left') {
        wall_change_x = -200;
        if (action === 1) {
          this.game.tail.x = this.game.head.x;
          this.game.tail.y = this.game.head.y + this.game.snakeSize;
          this.game.snakeDirection = 'down';
        }

        else if (action === 2) {
          this.game.tail.x = this.game.head.x;
          this.game.tail.y = this.game.head.y - this.game.snakeSize;
          this.game.snakeDirection = 'up';
        }

        else if (action === 0) {
          this.game.tail.x = this.game.head.x - this.game.snakeSize;
          this.game.tail.y = this.game.head.y;
        }

      } else if(this.game.snakeDirection === 'up') {
          wall_change_y = -75;
          if (action === 1) {
            this.game.tail.x = this.game.head.x - this.game.snakeSize;
            this.game.tail.y = this.game.head.y;
            this.game.snakeDirection = 'left';
          }

          else if (action === 2) {
            this.game.tail.x = this.game.head.x + this.game.snakeSize;
            this.game.tail.y = this.game.head.y;
            this.game.snakeDirection = 'right';
          }

          else if (action === 0) {
            this.game.tail.x = this.game.head.x;
            this.game.tail.y = this.game.head.y - this.game.snakeSize;
          }

      } else if(this.game.snakeDirection === 'down') {
          wall_change_y = 525;
          if (action === 1) {
            this.game.tail.x = this.game.head.x + this.game.snakeSize;
            this.game.tail.y = this.game.head.y;
            this.game.snakeDirection = 'right';
          }

          else if (action === 2) {
            this.game.tail.x = this.game.head.x - this.game.snakeSize;
            this.game.tail.y = this.game.head.y;
            this.game.snakeDirection = 'left';
          }

          else if (action === 0) {
            this.game.tail.x = this.game.head.x;
            this.game.tail.y = this.game.head.y + this.game.snakeSize;
          }
      }

      //console.log("x:" + this.game.head.x + " y: " + this.game.head.y);
      this.game.snake.push(this.game.tail);
      
      
      this.rewardDistance (change_x, change_y);
      this.wallCheck ();
      this.checkCollisions();
      
    }

  },

  checkCollisions: function() {
    //Check if you hit yourself
    this.game.fatalCollision = false;
    this.game.goodCollision  = false;

    for(var i = 0; i < this.game.snake.length - 2; i++) {
      if(this.game.head.x === this.game.snake[i].x && this.game.head.y === this.game.snake[i].y) {
        //console.log('Collision');
        this.game.fatalCollision = true;
      }
    }

    if(this.game.head.x >= 600 || this.game.head.x <= -200
      || this.game.head.y >= 525 || this.game.head.y <= -75) {
      this.game.fatalCollision = true;
    }

    if(this.game.food.x === this.game.head.x && this.game.food.y === this.game.head.y) {
      //console.log("COLLISION");
      this.game.goodCollision = true;
      this.game.food.destroy();
      this.createFood();
    }

    if(this.game.fatalCollision) {
      agent.learn(-400);
      store.set ('agent', agent);
      game_counter ++;
      game.state.start('gameState');
      score = 0;

    } else if(this.game.goodCollision) {
      this.game.snake.unshift(game.add.sprite(this.game.new_node_x, this.game.new_node_y, 'snake'));
      score++;
      this.updateScore();
      score_amt ++;
      agent.learn(100);
    }
    
  },

  rewardDistance: function (first_x, first_y) {
    //Need x and y of head of snake
    var head_x = this.game.head.x;
    var head_y = this.game.head.y;

    //Need x and y of apple
    var apple_x = this.game.food.x;
    var apple_y = this.game.food.y;

    //Compute distance between
    var new_x = this.negativeCheck (head_x, apple_x);
    var new_y = this.negativeCheck (head_y, apple_y);
    
    if(new_x > first_x && new_y > first_y) {
      agent.learn (-10);
    } else if (new_x < first_x && nex_y < first_y) {
        agent.learn (10);
    }

  },

  //Deals with negatives in the x and y
  negativeCheck: function (num1, num2) {
    if (num1 >= 0 && num2 >= 0) {
      if (num1 > num2) {
        return num1 - num2;
      }
      else {
        return num2 - num1;
      }
    }

    else if (num1 < 0 && num2 < 0) {
      if (num1 > num2) {
        num1 = Math.abs (num1);
        return num1 - num2;
      }
      else {
        num2 = Math.abs (num2)
        return num2 - num1;
      }
    }

    else {
      num1 = Math.abs (num1);
      num2 = Math.abs (num2);
      return num1 + num2;
    }
  },

  //If head gets close to the wall, give agent a negative score
  wallCheck: function () {
    //Get wall placement
    var right_wall = 600;
    var left_wall = -200
    var top_wall = 525;
    var bottom_wall = -75;


    //Check how close the head is to the wall
    var right_difference = this.negativeCheck (this.game.head.x, right_wall);
    var left_difference = this.negativeCheck (this.game.head.x, left_wall);
    var top_difference = this.negativeCheck (this.game.head.y, top_wall);
    var bottom_difference = this.negativeCheck (this.game.head.y, bottom_wall);

    //If within 50, give a negative score
    if (right_difference <= 50 || left_difference <= 50 || top_difference <= 50 || bottom_difference <= 50) {
      agent.learn (-25);
    } 
  },

  //Function to be called to see if snake is getting better over time
  getProgress: function () {
    //Need to print death amount
    console.log ("Games: " + game_counter);
    //Need to print score
    console.log ("Scores: " + score_amt);
    //Print out a ratio of scores to deaths
    console.log ("Score Death Ratio: " + score_amt/game_counter);
    //Clear all values
    game_counter = 0;
    score_amt = 0;
  }

};