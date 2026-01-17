import { render, screen, act } from "@testing-library/react";

import Card from "@/components/shared/Card";

// Mock Next.js components
jest.mock("next/link", () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

jest.mock("next/image", () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src || "/placeholder.svg"} alt={alt} {...props} />;
  };
});

// Mock Clerk auth
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(),
}));

// Mock utility functions
jest.mock("@/lib/utils", () => ({
  formatDateTime: jest.fn(),
}));

// Mock DeleteConfirmation component
jest.mock("@/components/shared/DeleteConfirmation", () => {
  return function MockDeleteConfirmation({ eventId }: { eventId: string }) {
    return <div data-testid="delete-confirmation">{eventId}</div>;
  };
});

describe("Card Component", () => {
  const mockEvent: any = {
    _id: "event123",
    title: "Test Event",
    description: "A test event description",
    location: "Test Location",
    createdAt: new Date("2024-01-01T00:00:00Z"),
    imageUrl: "https://example.com/image.jpg",
    startDateTime: new Date("2024-12-25T10:00:00Z"),
    endDateTime: new Date("2024-12-25T12:00:00Z"),
    price: "5000",
    isFree: false,
    url: "https://example.com/event",
    category: {
      _id: "category123",
      name: "Music",
    },
    organizer: {
      _id: "user123",
      firstName: "John",
      lastName: "Doe",
    },
  };

  const mockAuth = require("@clerk/nextjs/server").auth as jest.Mock;
  const mockFormatDateTime = require("@/lib/utils").formatDateTime as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    // Default auth mock - user is not the event creator
    mockAuth.mockResolvedValue({
      sessionClaims: { userId: "different-user" },
    });

    // Default date formatting mock
    mockFormatDateTime.mockReturnValue({
      dateTime: "December 25, 2024 at 10:00 AM",
    });
  });

  describe("Basic Rendering", () => {
    it("renders event card with basic information", async () => {
      await act(async () => {
        render(<Card event={mockEvent} />);
      });

      expect(screen.getByText("Test Event")).toBeInTheDocument();
      expect(screen.getByText("5000MMK")).toBeInTheDocument();
      expect(screen.getByText("Music")).toBeInTheDocument();
      expect(
        screen.getByText("December 25, 2024 at 10:00 AM")
      ).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("ပွဲစီစဥ်သူ")).toBeInTheDocument();
    });

    it("renders free event correctly", async () => {
      const freeEvent = { ...mockEvent, isFree: true };
      await act(async () => {
        render(<Card event={freeEvent} />);
      });

      expect(screen.getByText("အခမဲ့")).toBeInTheDocument();
      expect(screen.queryByText("5000MMK")).not.toBeInTheDocument();
    });

    it("renders event image with correct background style", async () => {
      await act(async () => {
        render(<Card event={mockEvent} />);
      });

      const imageLink = screen.getByRole("link", { name: "" });
      expect(imageLink).toHaveStyle({
        backgroundImage: "url(https://example.com/image.jpg)",
      });
    });
  });

  //   describe("Event Creator Features", () => {
  //     beforeEach(() => {
  //       mockAuth.mockResolvedValue({
  //         sessionClaims: { userId: "user123" },
  //       });
  //     });

  //     it("shows edit and delete buttons for event creator", async () => {
  //       await act(async () => {
  //         render(<Card event={mockEvent} />);
  //       });

  //       await waitFor(async () => {
  //         const editIcon = screen.queryByAltText("edit icon");
  //         expect(editIcon).toBeInTheDocument();
  //       });

  //       expect(
  //         await screen.findByTestId("delete-confirmation")
  //       ).toBeInTheDocument();
  //     });

  //     it("edit button links to correct update page", async () => {
  //       await act(async () => {
  //         render(<Card event={mockEvent} />);
  //       });

  //       const editIcon = await screen.findByAltText("edit icon");
  //       const editLink = editIcon.closest("a");
  //       expect(editLink).toHaveAttribute("href", "/events/event123/update");
  //     });

  //     it("hides edit/delete buttons when hidePrice is true", async () => {
  //       await act(async () => {
  //         render(<Card event={mockEvent} hidePrice={true} />);
  //       });

  //       await waitFor(() => {
  //         expect(screen.queryByAltText("edit icon")).not.toBeInTheDocument();
  //         expect(
  //           screen.queryByTestId("delete-confirmation")
  //         ).not.toBeInTheDocument();
  //       });
  //     });
  //   });

  describe("Non-Event Creator", () => {
    it("does not show edit and delete buttons for non-creator", async () => {
      await act(async () => {
        render(<Card event={mockEvent} />);
      });

      expect(screen.queryByAltText("edit icon")).not.toBeInTheDocument();
      expect(
        screen.queryByTestId("delete-confirmation")
      ).not.toBeInTheDocument();
    });
  });

  describe("Price Display", () => {
    it("hides price section when hidePrice is true", async () => {
      await act(async () => {
        render(<Card event={mockEvent} hidePrice={true} />);
      });

      expect(screen.queryByText("5000MMK")).not.toBeInTheDocument();
      expect(screen.queryByText("Music")).not.toBeInTheDocument();
    });

    it("shows price section by default", async () => {
      await act(async () => {
        render(<Card event={mockEvent} />);
      });

      expect(screen.getByText("5000MMK")).toBeInTheDocument();
      expect(screen.getByText("Music")).toBeInTheDocument();
    });
  });

  describe("Order Link", () => {
    it("shows order link when hasOrderLink is true", async () => {
      await act(async () => {
        render(<Card event={mockEvent} hasOrderLink={true} />);
      });

      expect(screen.getByText("အော်ဒါ အသေးစိတ်")).toBeInTheDocument();
      expect(screen.getByAltText("arrow image")).toBeInTheDocument();

      const orderLink = screen.getByText("အော်ဒါ အသေးစိတ်").closest("a");
      expect(orderLink).toHaveAttribute("href", "/orders?eventId=event123");
    });

    it("hides order link by default", async () => {
      await act(async () => {
        render(<Card event={mockEvent} />);
      });

      expect(screen.queryByText("အော်ဒါ အသေးစိတ်")).not.toBeInTheDocument();
      expect(screen.queryByAltText("arrow image")).not.toBeInTheDocument();
    });
  });

  describe("Navigation Links", () => {
    it("event title links to event details page", async () => {
      await act(async () => {
        render(<Card event={mockEvent} />);
      });

      const titleLink = screen.getByText("Test Event").closest("a");
      expect(titleLink).toHaveAttribute("href", "/events/event123");
    });

    it("event image links to event details page", async () => {
      await act(async () => {
        render(<Card event={mockEvent} />);
      });

      const imageLinks = screen.getAllByRole("link");
      const imageLink = imageLinks.find(
        (link) =>
          link.getAttribute("href") === "/events/event123" &&
          !link.textContent?.includes("Test Event")
      );
      expect(imageLink).toBeInTheDocument();
    });
  });

  describe("Organizer Information", () => {
    it("displays organizer name correctly", async () => {
      await act(async () => {
        render(<Card event={mockEvent} />);
      });

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("ပွဲစီစဥ်သူ")).toBeInTheDocument();
    });

    it("capitalizes organizer name", async () => {
      const eventWithLowercaseName = {
        ...mockEvent,
        organizer: {
          ...mockEvent.organizer,
          firstName: "john",
          lastName: "doe",
        },
      };

      await act(async () => {
        render(<Card event={eventWithLowercaseName} />);
      });

      const organizerElement = screen.getByText("john doe");
      expect(organizerElement).toHaveClass("capitalize");
    });
  });

  describe("Date Formatting", () => {
    it("calls formatDateTime with correct date", async () => {
      await act(async () => {
        render(<Card event={mockEvent} />);
      });

      expect(mockFormatDateTime).toHaveBeenCalledWith(mockEvent.startDateTime);
      expect(
        screen.getByText("December 25, 2024 at 10:00 AM")
      ).toBeInTheDocument();
    });
  });

  describe("Myanmar Text", () => {
    it("displays Myanmar text for free events", async () => {
      const freeEvent = { ...mockEvent, isFree: true };
      await act(async () => {
        render(<Card event={freeEvent} />);
      });

      expect(screen.getByText("အခမဲ့")).toBeInTheDocument();
    });

    it("displays Myanmar text for organizer label", async () => {
      await act(async () => {
        render(<Card event={mockEvent} />);
      });

      expect(screen.getByText("ပွဲစီစဥ်သူ")).toBeInTheDocument();
    });

    it("displays Myanmar text for order details when hasOrderLink is true", async () => {
      await act(async () => {
        render(<Card event={mockEvent} hasOrderLink={true} />);
      });

      expect(screen.getByText("အော်ဒါ အသေးစိတ်")).toBeInTheDocument();
    });
  });
});
