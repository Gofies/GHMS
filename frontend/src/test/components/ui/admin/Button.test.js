import { render, screen } from "@testing-library/react"; 
import { Button } from "../../../../../src/components/ui/admin/Button";

test("renders Button with default style", () => {
  render(<Button>Click Me</Button>);
  const button = screen.getByText(/click me/i);
  expect(button).toHaveClass("bg-blue-600");
});
