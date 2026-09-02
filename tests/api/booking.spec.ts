import { test, expect } from '@playwright/test';
import { BookingApi } from '../../src/api/BookingApi';
import { validBooking, updatedBooking } from '../../src/data/bookings';

test.describe('Booking API', () => {
  let api: BookingApi;
  let token: string;

  test.beforeEach(async ({ request }) => {
    api = new BookingApi(request);
    token = await api.getToken();
  });

  test('valid credentials return a token', async () => {
    const response = await api.createToken();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token).toBeTruthy();
  });

  test('invalid credentials do not return a token', async () => {
    const response = await api.createToken('wrong_user', 'wrong_password');
    const body = await response.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });

  test('a booking can be created and returns the submitted data', async () => {
    const response = await api.createBooking(validBooking);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.bookingid).toBeTruthy();
    expect(body.booking.firstname).toBe(validBooking.firstname);
    expect(body.booking.totalprice).toBe(validBooking.totalprice);
  });

  test('a created booking can be retrieved by id', async () => {
    const created = await api.createBooking(validBooking);
    const { bookingid } = await created.json();

    const response = await api.getBooking(bookingid);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.lastname).toBe(validBooking.lastname);
  });

  test('a booking can be updated with a valid token', async () => {
    const created = await api.createBooking(validBooking);
    const { bookingid } = await created.json();

    const response = await api.updateBooking(bookingid, updatedBooking, token);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.totalprice).toBe(updatedBooking.totalprice);
  });

  test('updating without a token is rejected', async () => {
    const created = await api.createBooking(validBooking);
    const { bookingid } = await created.json();

    const response = await api.updateBookingWithoutAuth(bookingid, updatedBooking);
    expect(response.status()).toBe(403);
  });

  test('a deleted booking can no longer be retrieved', async () => {
    const created = await api.createBooking(validBooking);
    const { bookingid } = await created.json();

    const deleteResponse = await api.deleteBooking(bookingid, token);
    expect(deleteResponse.status()).toBe(201);

    const getResponse = await api.getBooking(bookingid);
    expect(getResponse.status()).toBe(404);
  });
});