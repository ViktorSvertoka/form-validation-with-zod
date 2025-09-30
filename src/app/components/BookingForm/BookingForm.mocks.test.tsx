import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BookingForm from "./BookingForm";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
jest.mock("../../schemas/bookingSchema", () => {
  return {
    __esModule: true,
    ...jest.requireActual("../../schemas/bookingSchema"),
  };
});
import * as schema from "../../schemas/bookingSchema";

jest.mock("../ErrorMessage", () => {
  const ErrorMessage = ({ message }) => <div>ErrorMessage: {message}</div>;
  ErrorMessage.displayName = "ErrorMessage";

  return ErrorMessage;
});

const server = setupServer(
  http.get("/api/time-slots", () => {
    return HttpResponse.json(["10:00 AM", "11:00 AM", "1:00 PM"]);
  })
);

beforeAll(() => {
  server.listen();
  global.alert = jest.fn();
});

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

describe("BookingForm Component", () => {
  it("uses BookingSchema for validation", async () => {
    const spy = jest.spyOn(schema, "createBookingSchema");

    render(<BookingForm />);

    expect(spy).toHaveBeenCalled();
  });

  test("uses ErrorMessage component", async () => {
    render(<BookingForm />);

    const user = userEvent.setup();
    await user.click(screen.getByText(/Book Event/i));

    const errorMessages = await screen.findAllByRole("alert");
    expect(errorMessages).toHaveLength(6);
  });
});
