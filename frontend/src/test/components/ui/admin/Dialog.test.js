import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog } from "../../../../../src/components/ui/admin/Dialog";

// Mock the DarkModeContext
jest.mock("../../../../../src/helpers/DarkModeContext", () => ({
  useDarkMode: jest.fn(),
}));

import { useDarkMode } from "../../../../../src/helpers/DarkModeContext";

test("opens and closes Dialog on trigger click", async () => {
  // Mock darkMode to false
  useDarkMode.mockReturnValue({ darkMode: false });

  render(
    <Dialog>
      <button>Open Dialog</button>
      <div>Dialog Content</div>
    </Dialog>
  );

  // Open the dialog
  const openButton = screen.getByText(/open dialog/i);
  await userEvent.click(openButton);
  expect(screen.getByText(/dialog content/i)).toBeInTheDocument();

  // Close the dialog
  const closeButton = screen.getByText(/✕/); // Close button
  await userEvent.click(closeButton);
  expect(screen.queryByText(/dialog content/i)).not.toBeInTheDocument();
});
