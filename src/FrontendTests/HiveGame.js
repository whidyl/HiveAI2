import React from "react";
import { getByTestId, render } from "@testing-library/react";
import HiveGame from "../Components/HiveGame";
import { screen } from '@testing-library/react'
import App from "../App";

describe("HiveGame", () => {
    it("renders hand container", () => {
        render(<HiveGame />);

        expect(screen.getByTestId('hand-container')).toBeInTheDocument();
    })

    it("renders expected starting hand", () => {
        render(<HiveGame />);
        
        expect(screen.getByTestId('hand-piece-ant')).toBeInTheDocument();
    })
})