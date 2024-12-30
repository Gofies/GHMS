import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../../../../../src/components/ui/admin/Input";

test("renders Input with placeholder", () => {
  render(<Input placeholder="Enter text" />);
  const input = screen.getByPlaceholderText(/enter text/i);
  expect(input).toBeInTheDocument();
});

test("updates Input value", async () => {
  render(<Input placeholder="Enter text" />);
  const input = screen.getByPlaceholderText(/enter text/i);
  await userEvent.type(input, "Hello");
  expect(input).toHaveValue("Hello");
});
