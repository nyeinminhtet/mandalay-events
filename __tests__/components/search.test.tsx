import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { useRouter, useSearchParams } from "next/navigation";

import Search from "@/components/shared/Search";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

// Mock Next.js navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

// Mock utility functions
jest.mock("@/lib/utils", () => ({
  formUrlQuery: jest.fn(),
  removeKeysFromQuery: jest.fn(),
}));

// Mock UI components
jest.mock("@/components/ui/input", () => ({
  Input: ({ onChange, placeholder, className, ...props }: any) => (
    <input
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      data-testid="search-input"
      {...props}
    />
  ),
}));

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, width, height }: any) => (
    <img
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
    />
  ),
}));

describe("Search Component", () => {
  const mockPush = jest.fn();
  const mockSearchParams = {
    toString: jest.fn().mockReturnValue(""),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (useSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (formUrlQuery as jest.Mock).mockReturnValue("/search?query=test");
    (removeKeysFromQuery as jest.Mock).mockReturnValue("/search");
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("Rendering", () => {
    it("renders with custom placeholder", () => {
      const customPlaceholder = "Search events...";
      render(<Search placeholder={customPlaceholder} />);

      expect(
        screen.getByPlaceholderText(customPlaceholder)
      ).toBeInTheDocument();
    });

    it("renders search icon with correct attributes", () => {
      render(<Search />);

      const searchIcon = screen.getByAltText("search icon");
      expect(searchIcon).toHaveAttribute("src", "/assets/icons/search.svg");
      expect(searchIcon).toHaveAttribute("width", "24");
      expect(searchIcon).toHaveAttribute("height", "24");
    });

    it("applies correct CSS classes to container", () => {
      render(<Search />);

      const container = screen.getByTestId("search-input").parentElement;
      expect(container).toHaveClass(
        "flex-center",
        "min-h-[54px]",
        "w-full",
        "overflow-hidden",
        "rounded-full",
        "bg-primary/20",
        "px-4",
        "py-2"
      );
    });
  });

  describe("Search Functionality", () => {
    it("updates input value when user types", () => {
      render(<Search />);

      const input = screen.getByTestId("search-input");
      fireEvent.change(input, { target: { value: "test query" } });

      expect(input).toHaveValue("test query");
    });

    it("debounces search queries with 300ms delay", async () => {
      render(<Search />);

      const input = screen.getByTestId("search-input");

      // Type multiple characters quickly
      fireEvent.change(input, { target: { value: "t" } });
      fireEvent.change(input, { target: { value: "te" } });
      fireEvent.change(input, { target: { value: "test" } });

      // Should not call router.push immediately
      expect(mockPush).not.toHaveBeenCalled();

      // Fast-forward time by 300ms
      jest.advanceTimersByTime(300);

      // Now it should call router.push once
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledTimes(1);
      });
    });

    it("calls formUrlQuery when query has value", async () => {
      render(<Search />);

      const input = screen.getByTestId("search-input");
      fireEvent.change(input, { target: { value: "test query" } });

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(formUrlQuery).toHaveBeenCalledWith({
          params: "",
          key: "query",
          value: "test query",
        });
        expect(mockPush).toHaveBeenCalledWith("/search?query=test", {
          scroll: false,
        });
      });
    });

    it("calls removeKeysFromQuery when query is empty", async () => {
      render(<Search />);

      const input = screen.getByTestId("search-input");

      // First add a query
      fireEvent.change(input, { target: { value: "test" } });
      jest.advanceTimersByTime(300);

      // Then clear it
      fireEvent.change(input, { target: { value: "" } });
      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(removeKeysFromQuery).toHaveBeenCalledWith({
          params: "",
          keysToRemove: ["query"],
        });
        expect(mockPush).toHaveBeenCalledWith("/search", { scroll: false });
      });
    });

    it("uses current search params in URL updates", async () => {
      mockSearchParams.toString.mockReturnValue("category=events&page=1");

      render(<Search />);

      const input = screen.getByTestId("search-input");
      fireEvent.change(input, { target: { value: "test" } });

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(formUrlQuery).toHaveBeenCalledWith({
          params: "category=events&page=1",
          key: "query",
          value: "test",
        });
      });
    });
  });

  describe("Cleanup", () => {
    it("clears timeout on component unmount", () => {
      const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

      const { unmount } = render(<Search />);

      const input = screen.getByTestId("search-input");
      fireEvent.change(input, { target: { value: "test" } });

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });

    it("clears previous timeout when new input is entered", () => {
      const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

      render(<Search />);

      const input = screen.getByTestId("search-input");

      // First input
      fireEvent.change(input, { target: { value: "test" } });

      // Second input before timeout
      fireEvent.change(input, { target: { value: "test2" } });

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });
  });

  describe("Edge Cases", () => {
    it("handles rapid consecutive inputs correctly", async () => {
      render(<Search />);

      const input = screen.getByTestId("search-input");

      // Rapid inputs
      fireEvent.change(input, { target: { value: "a" } });
      jest.advanceTimersByTime(100);

      fireEvent.change(input, { target: { value: "ab" } });
      jest.advanceTimersByTime(100);

      fireEvent.change(input, { target: { value: "abc" } });
      jest.advanceTimersByTime(300);

      // Should only call once with the final value
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledTimes(1);
        expect(formUrlQuery).toHaveBeenCalledWith({
          params: "category=events&page=1",
          key: "query",
          value: "abc",
        });
      });
    });

    it("handles whitespace-only queries as empty", async () => {
      render(<Search />);

      const input = screen.getByTestId("search-input");
      fireEvent.change(input, { target: { value: "   " } });

      jest.advanceTimersByTime(300);

      await waitFor(() => {
        expect(formUrlQuery).toHaveBeenCalledWith({
          params: "category=events&page=1",
          key: "query",
          value: "   ",
        });
      });
    });
  });
});
