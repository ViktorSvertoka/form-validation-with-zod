import { createBookingSchema } from './bookingSchema';

describe('Booking Schema', () => {
  const availableTimeSlots = ['10:00 AM', '2:00 PM'];
  const schema = createBookingSchema(availableTimeSlots);
  const baseBookingData = {
    bookerName: 'John Doe',
    bookerEmail: 'john.doe@example.com',
    eventName: 'React Workshop',
    eventDate: new Date(Date.now() + 5*24*60*60*1000),
    numberOfGuests: 3,
    timeSlot: '10:00 AM',
    eventLink: 'https://example.com'
  };
  const createBookingData = (overrides = {}) => {
    return { ...baseBookingData, ...overrides };
  };


  test('validates correctly for a valid input', () => {
    const result = schema.safeParse(createBookingData());

    expect(result.success).toBe(true);
  });

  test('fails when bookerName is too short', () => {
    const result = schema.safeParse(createBookingData({ bookerName: 'J' }));

    expect(result.success).toBe(false);
    expect(result.error?.format().bookerName._errors).toContain(
      'Booker name must be at least 2 characters long'
    );
  });

  test('fails when bookerEmail is invalid', () => {
    const result = schema.safeParse(createBookingData({ bookerEmail: 'not-an-email' }));

    expect(result.success).toBe(false);
    expect(result.error?.format().bookerEmail._errors).toContain(
      'Invalid email address'
    );
  });

  test('passes when bookerEmail is omitted or empty', () => {
    const result = schema.safeParse(createBookingData({ bookerEmail: ''}));
 
    expect(result.success).toBe(true);
  });

  test('fails when eventName is too short', () => {
    const result = schema.safeParse(createBookingData({ eventName: 'R' }));

    expect(result.success).toBe(false);
    expect(result.error?.format().eventName._errors).toContain(
      'Event name must be at least 2 characters long'
    );
  });

  test('fails when eventDate is in the past', () => {
    const result = schema.safeParse(createBookingData({ eventDate: new Date(Date.now() - 5*24*60*60*1000)}));

    expect(result.success).toBe(false);
    expect(result.error?.format().eventDate._errors).toContain(
      'Event date must be in the future'
    );
  });

  test('fails when numberOfGuests is out of bounds', () => {
    const result = schema.safeParse(createBookingData({ numberOfGuests: 11 }));

    expect(result.success).toBe(false);
    expect(result.error?.format().numberOfGuests._errors).toContain(
      'Number of Guests must be less than or equal to 10'
    );
  });

  test('fails when timeSlot is unavailable', () => {
    const result = schema.safeParse(createBookingData({ timeSlot: '12:00 PM' }));

    expect(result.success).toBe(false);
    expect(result.error?.format().timeSlot._errors).toContain(
      'Selected time slot is unavailable'
    );
  });

  test('fails when eventLink is not a valid URL', () => {
    const result = schema.safeParse(createBookingData({ eventLink: 'invalid-url' }));

    expect(result.success).toBe(false);
    expect(result.error?.format().eventLink._errors).toContain(
      'Invalid URL. Please enter a valid event link'
    );
  });

  test('fails when eventLink is omitted', () => {
    const result = schema.safeParse(createBookingData({ eventLink: undefined }));

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe('Required');
  });


});
