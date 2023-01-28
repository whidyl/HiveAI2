import "@testing-library/jest-dom/extend-expect";
import Agent from ".././Agent";
import { AtomicEnvironment } from ".././Environments";
import Sensor from ".././Sensor";
import Action from ".././Action";

describe("constructor", () => {
  test("given an atomic environment, has expected environment.", () => {
    const env = new AtomicEnvironment();
    var agent = new Agent(env);

    expect(agent.getEnvironment()).toBe(env);
  });
});

describe("addSensor", () => {
  test("an agent given a blank sensor, percieves null", () => {
    var agent = new Agent(new AtomicEnvironment());

    agent.addSensor(new Sensor("blank"));

    expect(agent.percieve()).toStrictEqual({ blank: null });
  });

  test("an agent given two blank sensors, percieves multiple null", () => {
    var agent = new Agent(new AtomicEnvironment());

    agent.addSensor(new Sensor("blank1"));
    agent.addSensor(new Sensor("blank2"));

    expect(agent.percieve()).toStrictEqual({ blank1: null, blank2: null });
  });

  test("a sensor which reads state of AE, gets expected percepts", () => {
    var agent = new Agent({ cleanliness: "dirty" });

    agent.addSensor(
      new Sensor("cleanlinessDetector", (env) => env.cleanliness)
    );

    expect(agent.percieve()).toStrictEqual({ cleanlinessDetector: "dirty" });
  });
});

describe("addAction", () => {
  test("a action which increments counter, changes state as expected when executed.", () => {
    var agent = new Agent({ counter: 0 });

    agent.addAction(
      new Action("Inc", (env) => {
        env.counter += 1;
      })
    );
    agent.doAction("Inc");

    expect(agent.environment).toStrictEqual({ counter: 1 });
  });

  test("multiple actions, changes state as expected when executed multiple times.", () => {
    var agent = new Agent({ n: 5 });

    agent.addAction(
      new Action("Square", (env) => {
        env.n *= env.n;
      })
    );
    agent.addAction(
      new Action("Subtract3", (env) => {
        env.n -= 3;
      })
    );

    agent.doAction("Square");
    agent.doAction("Subtract3");
    agent.doAction("Subtract3");
    agent.doAction("Square");

    expect(agent.environment).toStrictEqual({ n: 361 });
  });
});

describe("predictAction", () => {
  test("counter incrementor, is predicted as expected and doesn't change env", () => {
    let agent = new Agent({ foo: 1 });
    agent.addAction(
      new Action("Inc2", (env) => {
        env.foo += 2;
      })
    );

    const predictedEnv = agent.predictAction("Inc2");

    expect(predictedEnv).toStrictEqual({ foo: 3 });
    expect(agent.getEnvironment()).toStrictEqual({ foo: 1 });
  });
});

//TODO: doAction, when no action, throws Exception
