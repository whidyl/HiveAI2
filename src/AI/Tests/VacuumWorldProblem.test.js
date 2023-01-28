import "@testing-library/jest-dom/extend-expect";
import Action from ".././Action";
import Agent from ".././Agent";
import { VacuumWorldProblem } from ".././TestBeds";

describe("construction", () => {
  test("no params, has expected intial state.", () => {
    let vacWorldProb;

    vacWorldProb = new VacuumWorldProblem();

    const initState = vacWorldProb.initState;
    expect(initState).toStrictEqual({ agentLocation: 0, dirtVector: [1, 1] });
  });

  test("no params, has expected actions for init state.", () => {
    let vacWorldProb;

    vacWorldProb = new VacuumWorldProblem();

    const actions = vacWorldProb.actions(vacWorldProb.initState);
    expect(actions).toContain("Right");
    expect(actions).toContain("Suck");
  });
});

describe("goalTest", () => {
  test("initial state, returns false", () => {
    const vacWorldProb = new VacuumWorldProblem();

    const goalTest = vacWorldProb.goalTest(vacWorldProb.initState);

    expect(goalTest).toBe(false);
  });

  test("clean states, returns true", () => {
    const vacWorldProb = new VacuumWorldProblem();

    const goalTest1 = vacWorldProb.goalTest({
      agentLocation: 1,
      dirtVector: [0, 0],
    });
    const goalTest2 = vacWorldProb.goalTest({
      agentLocation: 0,
      dirtVector: [0, 0],
    });

    expect(goalTest1 && goalTest2).toBe(true);
  });
});

describe("stepCost", () => {
  test("initial state, cost of 1 for arbitrary action", () => {
    const prob = new VacuumWorldProblem();

    const cost = prob.stepCost(prob.initState, "Right");

    expect(cost).toBe(1);
  });
});

describe("agent is given problem", () => {
  test("by default, agent has expected actions.", () => {
    let agent = new Agent();

    agent.giveSearchProblem(new VacuumWorldProblem());

    expect(agent.getAction("Right")).toBeInstanceOf(Action);
    expect(agent.getAction("Left")).toBeInstanceOf(Action);
    expect(agent.getAction("Suck")).toBeInstanceOf(Action);
    expect(agent).toBeInstanceOf(Agent);
  });

  test("agent moves right, agentLocation is updated.", () => {
    let agent = new Agent();

    agent.giveSearchProblem(new VacuumWorldProblem());
    agent.doAction("Right");

    expect(agent.getEnvironment()).toStrictEqual({
      agentLocation: 1,
      dirtVector: [1, 1],
    });
  });

  test("agent moves left and sucks, agent is in same spot and dirt is cleaned.", () => {
    let agent = new Agent();

    agent.giveSearchProblem(new VacuumWorldProblem());
    agent.doAction("Left");
    agent.doAction("Suck");

    expect(agent.getEnvironment()).toStrictEqual({
      agentLocation: 0,
      dirtVector: [0, 1],
    });
  });

  test("agent moves right and then left, agent is in the same spot.", () => {
    let agent = new Agent();

    agent.giveSearchProblem(new VacuumWorldProblem());
    agent.doAction("Right");
    agent.doAction("Left");

    expect(agent.getEnvironment()).toStrictEqual({
      agentLocation: 0,
      dirtVector: [1, 1],
    });
  });

  test("agent moves left, right, right, then sucks, agent is right and spot is clean.", () => {
    let agent = new Agent();
    agent.giveSearchProblem(new VacuumWorldProblem());

    agent.doAction("Left");
    agent.doAction("Right");
    agent.doAction("Right");
    agent.doAction("Suck");

    let env = agent.getEnvironment();
    expect(env.agentLocation).toBe(1);
    expect(env.dirtVector).toStrictEqual([1, 0]);
  });
});
