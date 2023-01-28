export default class Sensor {
  constructor(name, perceptionFunc = (e) => null) {
    this.name = name;
    this.percieve = perceptionFunc;
  }
}
