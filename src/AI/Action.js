export default class Action {
  constructor(name, actionFunc) {
    this.name = name;
    this.actionFunc = actionFunc;
  }

  execute(env) {
    this.actionFunc(env);
  }
}
