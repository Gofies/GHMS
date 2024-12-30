import { render, screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "../../../../../src/components/ui/admin/Card";

test("renders Card with children", () => {
  render(<Card>Card Content</Card>);
  const card = screen.getByText(/card content/i);
  expect(card).toBeInTheDocument();
});

test("renders Card components correctly", () => {
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
