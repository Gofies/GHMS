import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog } from "../../../../../src/components/ui/admin/Dialog";

test("opens and closes Dialog on trigger click", async () => {
  render(
    <Dialog>
      <button>Open Dialog</button>
      <div>Dialog Content</div>
    </Dialog>
  );

  const openButton = screen.getByText(/open dialog/i);
  await userEvent.click(openButton);
  expect(screen.getByText(/dialog content/i)).toBeInTheDocument();

  const closeButton = screen.getByText(/✕/);
  await userEvent.click(closeButton);
  expect(screen.queryByText(/dialog content/i)).not.toBeInTheDocument();
});
