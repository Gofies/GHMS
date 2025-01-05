import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "../../../../../src/components/ui/admin/Button";

jest.mock("frontend/helpers/DarkModeContext", () => ({
  useDarkMode: jest.fn(),
}));

import { useDarkMode } from "frontend/helpers/DarkModeContext";

test("renders Button with default style", () => {
  useDarkMode.mockReturnValue({ darkMode: false });

  render(<Button>Click Me</Button>);
  const button = screen.getByText(/click me/i);
  expect(button).toHaveClass("bg-blue-600");
});

test("renders Button with dark mode", () => {
  useDarkMode.mockReturnValue({ darkMode: true });

  render(<Button>Click Me</Button>);
  const button = screen.getByText(/click me/i);
  expect(button).toHaveClass("bg-blue-700");
});