import { cloneDeep } from "lodash";
import Action from "./Action";

export default class Agent {
  constructor(environment) {
    this.environment = environment;
    this.sensors = [];
    this.actions = {};
    this.problem = null;
  }

  getEnvironment() {
    return this.environment;
  }

  cloneEnvironment() {
    return cloneDeep(this.environment);
  }

  addSensor(sensor) {
    this.sensors.push(sensor);
  }

  addAction(action) {
    this.actions[action.name] = action;
  }

  getAction(name) {
    return this.actions[name];
  }

  giveSearchProblem(searchProblem) {
    this.problem = searchProblem;
    this.environment = cloneDeep(searchProblem.initState);
    const transModel = searchProblem.transitionModel;
    for (var actionName in transModel) {
      this.addAction(new Action(actionName, transModel[actionName]));
    }
  }

  search() {
    let exploredNodes = new Set();
    let frontier = new Set();
    frontier.add(this.cloneEnvironment());
    
    while (true) {
      if(frontier.size == 0) {
        return null;
      }
      
      const chosen = frontier.values()[0];
      frontier.remove(chosen);
      
      if(problem.goalTest(chosen)) {
        return
      }
      
    }
  }

  executeSolution(solution) {}

  percieve() {
    let perceptions = {};
    this.sensors.forEach((sensor) => {
      perceptions[sensor.name] = sensor.percieve(this.environment);
    });
    return perceptions;
  }

  doAction(actionName) {
    this.actions[actionName].execute(this.environment);
  }

  predictAction(actionName) {
    let copiedEnv = this.cloneEnvironment();
    this.actions[actionName].execute(copiedEnv);
    return copiedEnv;
  }
}
