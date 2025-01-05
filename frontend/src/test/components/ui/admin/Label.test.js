import React from "react";
import { render, screen } from "@testing-library/react";
import { Label } from "../../../../../src/components/ui/admin/Label";

// Correct the mock path
jest.mock("../../../../../src/helpers/DarkModeContext", () => ({
  useDarkMode: jest.fn(),
}));

import { useDarkMode } from "../../../../../src/helpers/DarkModeContext";

test("renders Label with text", () => {
  // Mock darkMode to false
  useDarkMode.mockReturnValue({ darkMode: false });

  render(<Label htmlFor="input-id">Input Label</Label>);
  const label = screen.getByText(/input label/i);
  expect(label).toBeInTheDocument();
  expect(label).toHaveAttribute("for", "input-id");
});
