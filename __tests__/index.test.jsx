import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Hero from "@/components/shared/Hero";
import Home from "@/app/(root)/page";

describe("Render Home", () => {
  it("renders a heading", () => {
    render(<Home />);
    const heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toBeInTheDocument();
  });
});
