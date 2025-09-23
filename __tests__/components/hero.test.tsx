import React from "react";

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Hero from "@/components/shared/Hero";

// Mock the UI components with proper asChild handling
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, asChild, ...props }: any) => {
    if (asChild) {
      // When asChild is true, render the child element with button props
      return React.cloneElement(children, {
        ...props,
        ...children.props,
        className: `${props.className || ""} ${
          children.props.className || ""
        }`.trim(),
      });
    }
    return <button {...props}>{children}</button>;
  },
}));

describe("Hero Component", () => {
  it("renders the main heading", () => {
    render(<Hero />);

    expect(
      screen.getByText("Elevate Your Nightlife Experience!")
    ).toBeInTheDocument();
  });

  it("renders the description text", () => {
    render(<Hero />);

    expect(
      screen.getByText(
        "Ready to turn your night into a legend? Join our global party community and let the celebrations begin!"
      )
    ).toBeInTheDocument();
  });

  it("renders action buttons", () => {
    render(<Hero />);

    expect(screen.getByText("Explore Events")).toBeInTheDocument();
  });

  it('render the hero image with alt text "hero"', () => {
    render(<Hero />);

    const heroImage = screen.getByAltText("hero");
    expect(heroImage).toBeInTheDocument();
  });

  it("renders Explore Events as a link when asChild is used", () => {
    render(<Hero />);

    const ExplorEventsLink = screen.getByText("Explore Events");
    expect(ExplorEventsLink.tagName).toBe("A");
    expect(ExplorEventsLink).toHaveAttribute("href", "#events");
  });

  it("has proper semantic structure", () => {
    render(<Hero />);

    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("Explore Events").tagName).toBe("A");
    expect(screen.getByRole("img")).toBeInTheDocument();
  });
});
