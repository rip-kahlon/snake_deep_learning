var env = {};

env.getNumStates = function () { return 8 };
env.getMaxNumActions = function () { return 4; }

// create the agent, yay!
var spec = { alpha: 0.01 } // see full options on top of this page
var agent = new RL.DQNAgent(env, spec);

setInterval(function(){ // start the learning loop
    var action = agent.act(s); // s is an array of length 8
    // execute action in environment and get the reward
    agent.learn(reward); // the agent improves its Q,policy,model, etc. reward is a float
  }, 0);



