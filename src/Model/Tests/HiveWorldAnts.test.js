import HiveWorld from "../HiveWorld.js";

describe("getPlaceMoves()", () => {
    test("place ant is in first place moves.", () => {
        let hw = new HiveWorld();

        let placeMoves = hw.getPlaceMoves();

        expect(placeMoves).toContainEqual({})
    })
    
});