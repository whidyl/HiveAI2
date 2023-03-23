import React from "react";
import { render } from "@testing-library/react";
import HiveGame from "../Components/HiveGame";
import App from "../App";

describe("HiveGame", () => {
    it("renders hand container", () => {
        const { queryByTestId } = render(<HiveGame />);
        expect(queryByTestId('hand-container')).toBeInTheDocument();
    })
})