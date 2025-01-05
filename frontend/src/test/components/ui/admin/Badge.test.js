import React from "react";
import { render, screen } from "@testing-library/react";
import Badge from "../../../../../src/components/ui/admin/Badge";

test("renders Badge with default variant", () => {
  render(<Badge>Default Badge</Badge>);
  const badge = screen.getByText(/default badge/i);
  expect(badge).toHaveClass("bg-yellow-200 text-gray-800");
});

test("renders Badge with success variant", () => {
  render(<Badge variant="success">Success Badge</Badge>);
  const badge = screen.getByText(/success badge/i);
  expect(badge).toHaveClass("bg-green-500 text-white");
});
