import { render, screen } from "@testing-library/react";
import { Label } from "../../../../../src/components/ui/admin/Label";

test("renders Label with text", () => {
  render(<Label htmlFor="input-id">Input Label</Label>);
  const label = screen.getByText(/input label/i);
  expect(label).toBeInTheDocument();
  expect(label).toHaveAttribute("for", "input-id");
});
