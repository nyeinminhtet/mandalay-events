import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CategoryFilter from "@/components/shared/CategoryFilter";

// Mock Next.js navigation hooks
const mockPush = jest.fn();
const mockSearchParams = new URLSearchParams();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => mockSearchParams,
}));

// Mock category action
jest.mock("@/lib/actions/category.action", () => ({
  getAllCategories: jest.fn(),
}));

// Mock utility functions
jest.mock("@/lib/utils", () => ({
  formUrlQuery: jest.fn(),
  removeKeysFromQuery: jest.fn(),
}));

// Mock UI Select components
let storedOnValueChange: ((value: string) => void) | null = null;

jest.mock("@/components/ui/select", () => {
  return {
    Select: ({ children, onValueChange }: any) => {
      storedOnValueChange = onValueChange;
      return <div data-testid="select">{children}</div>;
    },
    SelectContent: ({ children }: any) => (
      <div data-testid="select-content">{children}</div>
    ),
    SelectItem: ({ children, value, ...props }: any) => (
      <div
        data-testid={`select-item-${value}`}
        data-value={value}
        onClick={() => {
          if (storedOnValueChange) {
            storedOnValueChange(value);
          }
        }}
        {...props}
      >
        {children}
      </div>
    ),
    SelectTrigger: ({ children, className }: any) => (
      <div data-testid="select-trigger" className={className}>
        {children}
      </div>
    ),
    SelectValue: ({ placeholder }: any) => (
      <div data-testid="select-value">{placeholder}</div>
    ),
  };
});

// Mock category model interface
jest.mock("@/lib/database/models/category.model", () => ({
  ICategory: {},
}));

describe("CategoryFilter Component", () => {
  const mockCategories = [
    { _id: "1", name: "Music" },
    { _id: "2", name: "Sports" },
    { _id: "3", name: "Technology" },
  ];

  let mockGetAllCategories: jest.MockedFunction<
    typeof import("@/lib/actions/category.action").getAllCategories
  >;
  let mockFormUrlQuery: jest.MockedFunction<any>;
  let mockRemoveKeysFromQuery: jest.MockedFunction<any>;

  const originalSelectMock = require("@/components/ui/select").Select;

  beforeEach(() => {
    mockGetAllCategories =
      require("@/lib/actions/category.action").getAllCategories;
    mockFormUrlQuery = require("@/lib/utils").formUrlQuery;
    mockRemoveKeysFromQuery = require("@/lib/utils").removeKeysFromQuery;

    // Set up default mock implementations
    mockGetAllCategories.mockResolvedValue(mockCategories);
    mockFormUrlQuery.mockReturnValue("/search?query=test");
    mockRemoveKeysFromQuery.mockReturnValue("/search");

    require("@/components/ui/select").Select = originalSelectMock;

    // Clear all mocks and search params
    jest.clearAllMocks();
    mockSearchParams.forEach((value, key) => {
      mockSearchParams.delete(key);
    });
  });

  describe("Rendering", () => {
    it("renders with Myanmar placeholder text", async () => {
      await act(async () => {
        render(<CategoryFilter />);
      });

      await waitFor(() => {
        expect(mockGetAllCategories).toHaveBeenCalledTimes(1);
      });

      expect(screen.getByTestId("select-trigger")).toBeInTheDocument();
      expect(screen.getByText("အမျိုးအစား")).toBeInTheDocument();
    });

    it("renders select trigger with correct className", async () => {
      await act(async () => {
        render(<CategoryFilter />);
      });

      await waitFor(() => {
        expect(mockGetAllCategories).toHaveBeenCalledTimes(1);
      });

      expect(screen.getByTestId("select-trigger")).toHaveClass("select-field");
    });
  });

  describe("Categories Loading", () => {
    it("fetches and displays categories on mount", async () => {
      await act(async () => {
        render(<CategoryFilter />);
      });

      await waitFor(() => {
        expect(mockGetAllCategories).toHaveBeenCalledTimes(1);
      });

      await waitFor(() => {
        expect(screen.getByTestId("select-item-All")).toBeInTheDocument();
      });

      expect(screen.getByText("All")).toBeInTheDocument();

      mockCategories.forEach((category) => {
        expect(
          screen.getByTestId(`select-item-${category.name}`)
        ).toBeInTheDocument();
        expect(screen.getByText(category.name)).toBeInTheDocument();
      });
    });

    it("handles empty categories response", async () => {
      mockGetAllCategories.mockResolvedValue(null);

      await act(async () => {
        render(<CategoryFilter />);
      });

      await waitFor(() => {
        expect(mockGetAllCategories).toHaveBeenCalledTimes(1);
      });

      expect(screen.getByTestId("select-item-All")).toBeInTheDocument();
      expect(screen.queryByTestId("select-item-Music")).not.toBeInTheDocument();
    });

    // it("handles categories loading error gracefully", async () => {
    //   mockGetAllCategories.mockRejectedValueOnce(new Error("Failed to fetch"));
    //   // Alternative: mockGetAllCategories.mockRejectedValue(new Error("Failed to fetch"))

    //   await act(async () => {
    //     render(<CategoryFilter />);
    //   });

    //   await waitFor(() => {
    //     expect(mockGetAllCategories).toHaveBeenCalledTimes(1);
    //   });

    //   expect(screen.getByTestId("select-item-All")).toBeInTheDocument();
    // });
  });

  describe("Category Selection", () => {
    it("updates URL when selecting a specific category", async () => {
      const mockNewUrl = "/events?category=Music";
      mockFormUrlQuery.mockReturnValue(mockNewUrl);
      mockSearchParams.set("search", "test");

      await act(async () => {
        render(<CategoryFilter />);
      });

      await waitFor(() => {
        expect(mockGetAllCategories).toHaveBeenCalled();
      });

      const musicItem = screen.getByTestId("select-item-Music");

      await act(async () => {
        await userEvent.click(musicItem);
      });

      expect(mockFormUrlQuery).toHaveBeenCalledWith({
        params: "search=test",
        key: "category",
        value: "Music",
      });

      expect(mockPush).toHaveBeenCalledWith(mockNewUrl, { scroll: false });
    });

    it("removes category from URL when selecting 'All'", async () => {
      const mockNewUrl = "/events";
      mockRemoveKeysFromQuery.mockReturnValue(mockNewUrl);
      mockSearchParams.set("category", "Music");
      mockSearchParams.set("search", "test");

      await act(async () => {
        render(<CategoryFilter />);
      });

      await waitFor(() => {
        expect(mockGetAllCategories).toHaveBeenCalled();
      });

      const allItem = screen.getByTestId("select-item-All");

      await act(async () => {
        await userEvent.click(allItem);
      });

      expect(mockRemoveKeysFromQuery).toHaveBeenCalledWith({
        params: "category=Music&search=test",
        keysToRemove: ["category"],
      });

      expect(mockPush).toHaveBeenCalledWith(mockNewUrl, { scroll: false });
    });

    it("preserves existing search parameters when filtering", async () => {
      const mockNewUrl = "/events?search=concert&category=Music";
      mockFormUrlQuery.mockReturnValue(mockNewUrl);
      mockSearchParams.set("search", "concert");
      mockSearchParams.set("page", "2");

      await act(async () => {
        render(<CategoryFilter />);
      });

      await waitFor(() => {
        expect(mockGetAllCategories).toHaveBeenCalled();
      });

      const musicItem = screen.getByTestId("select-item-Music");

      await act(async () => {
        await userEvent.click(musicItem);
      });

      expect(mockFormUrlQuery).toHaveBeenCalledWith({
        params: "search=concert&page=2",
        key: "category",
        value: "Music", // Should be "Music" not "test"
      });
    });
  });

  describe("Select Items Styling", () => {
    it("applies correct CSS classes to select items", async () => {
      await act(async () => {
        render(<CategoryFilter />);
      });

      await waitFor(() => {
        expect(mockGetAllCategories).toHaveBeenCalled();
      });

      await waitFor(() => {
        expect(screen.getByTestId("select-item-All")).toBeInTheDocument();
      });

      const allItem = screen.getByTestId("select-item-All");
      const musicItem = screen.getByTestId("select-item-Music");

      expect(allItem).toHaveClass("select-item", "p-regular-14");
      expect(musicItem).toHaveClass("select-item", "p-regular-14");
    });
  });

  describe("Integration", () => {
    it("works with existing URL parameters", async () => {
      const mockNewUrl = "/?search=event&category=Sports";
      mockFormUrlQuery.mockReturnValue(mockNewUrl);

      await act(async () => {
        render(<CategoryFilter />);
      });

      await waitFor(() => {
        expect(mockGetAllCategories).toHaveBeenCalled();
      });

      const sportsItem = screen.getByTestId("select-item-Sports");

      await act(async () => {
        await userEvent.click(sportsItem);
      });

      expect(mockFormUrlQuery).toHaveBeenCalledWith({
        params: "",
        key: "category",
        value: "Sports",
      });
    });
  });
});
