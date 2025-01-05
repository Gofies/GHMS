import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../../../../../src/components/ui/admin/Input";

// Correct the mock path
jest.mock("../../../../../src/helpers/DarkModeContext", () => ({
  useDarkMode: jest.fn(),
}));

import { useDarkMode } from "../../../../../src/helpers/DarkModeContext";

test("renders Input with placeholder", () => {
  // Mock darkMode to false
  useDarkMode.mockReturnValue({ darkMode: false });

  render(<Input placeholder="Enter text" />);
  const input = screen.getByPlaceholderText(/enter text/i);
  expect(input).toBeInTheDocument();
});

test("updates Input value", async () => {
  // Mock darkMode to false
  useDarkMode.mockReturnValue({ darkMode: false });

  render(<Input placeholder="Enter text" />);
  const input = screen.getByPlaceholderText(/enter text/i);
  await userEvent.type(input, "Hello");
  expect(input).toHaveValue("Hello");
});
