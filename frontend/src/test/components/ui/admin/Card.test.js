import React from "react";
import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../../../../../src/components/ui/admin/Card";

jest.mock("../../../../../src/helpers/DarkModeContext", () => ({
  useDarkMode: jest.fn(),
}));

import { useDarkMode } from "../../../../../src/helpers/DarkModeContext";

test("renders Card with children", () => {
  useDarkMode.mockReturnValue({ darkMode: false });

  render(<Card>Card Content</Card>);
  const card = screen.getByText(/card content/i);
  expect(card).toBeInTheDocument();
});

test("renders Card components correctly", () => {
  useDarkMode.mockReturnValue({ darkMode: true });

  render(
    <Card>
      <CardHeader>Header</CardHeader>
      <CardContent>Content</CardContent>
      <CardFooter>Footer</CardFooter>
    </Card>
  );
  expect(screen.getByText(/header/i)).toHaveClass("border-b");
  expect(screen.getByText(/content/i)).toBeInTheDocument();
  expect(screen.getByText(/footer/i)).toHaveClass("border-t");
});
