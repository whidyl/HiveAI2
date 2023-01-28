import Agent from "./Agent";
import Action from "./Action";
const _ = require("lodash");

export class VacuumWorldProblem {
  constructor() {
    this.initState = { agentLocation: 0, dirtVector: [1, 1] };
  }

  actions = (state) => ["Left", "Right", "Suck"];

  stepCost = (state, action) => 1;

  get transitionModel() {
    return {
      Right: (state) => {
        if (state.agentLocation < 1) {
          state.agentLocation += 1;
        }
      },
      Left: (state) => {
        if (state.agentLocation > 0) {
          state.agentLocation -= 1;
        }
      },
      Suck: (state) => {
        state.dirtVector[state.agentLocation] = 0;
      },
    };
  }

  goalTest(state) {
    return _.isEqual(state.dirtVector, [0, 0]);
  }
}
