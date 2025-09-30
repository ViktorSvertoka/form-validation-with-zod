import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BookingForm from './BookingForm'; 
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/time-slots', () => {
    return HttpResponse.json(['10:00 AM', '11:00 AM', '1:00 PM']);
  })
);

beforeAll(() => {
  server.listen();
  global.alert = jest.fn();
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('BookingForm Component', () => {
  test('shows validation errors when required fields are omitted', async () => {
    render(<BookingForm />); 

    const user = userEvent.setup();
    await user.click(screen.getByText(/Book Event/i));

    expect(
      await screen.findByText(/Booker name must be at least 2 characters long/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Event name must be at least 2 characters long/i)
    ).toBeInTheDocument();
    expect(await screen.findByText(/Invalid date/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/Number of Guests must be integer/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Selected time slot is unavailable/i)
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/Invalid URL. Please enter a valid event link/i)
    ).toBeInTheDocument();
  });

  test('submits form successfully when all required fields are provided', async () => {
    render(<BookingForm />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Booker Name/i), 'John Doe');
    await user.type(
      screen.getByLabelText(/Booker Email/i),
      'john.doe@example.com'
    );
    await user.type(screen.getByLabelText(/Event Name/i), 'React Workshop');
    const eventDate = new Date(Date.now() + 5*24*60*60*1000);
    await user.type(screen.getByLabelText(/Event Date/i), eventDate.toISOString().split('T')[0]);
    await user.type(screen.getByLabelText(/Number of Guests/i), '3');

    await waitFor(() => screen.getByLabelText(/Time Slot/i));
    await user.selectOptions(screen.getByLabelText(/Time Slot/i), '10:00 AM');

    await user.type(
      screen.getByLabelText(/Event Link/i),
      'https://example.com'
    );

    await user.click(screen.getByText(/Book Event/i));

    await waitFor(() =>
      expect(global.alert).toHaveBeenCalledWith('Booking successful!')
    );
    expect(global.alert).toHaveBeenCalledTimes(1);
  });

  test('shows error if the selected time slot is unavailable', async () => {
    render(<BookingForm />);

    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/Booker Name/i), 'John Doe');
    await user.type(
      screen.getByLabelText(/Booker Email/i),
      'john.doe@example.com'
    );
    await user.type(screen.getByLabelText(/Event Name/i), 'React Workshop');
    const eventDate = new Date(Date.now() + 5*24*60*60*1000);
    await user.type(screen.getByLabelText(/Event Date/i), eventDate.toISOString().split('T')[0]);
    await user.type(screen.getByLabelText(/Number of Guests/i), '3');

    await user.type(
      screen.getByLabelText(/Event Link/i),
      'https://example.com'
    );

    await user.click(screen.getByText(/Book Event/i));

    expect(
      await screen.findByText(/Selected time slot is unavailable/i)
    ).toBeInTheDocument();
  });
});
