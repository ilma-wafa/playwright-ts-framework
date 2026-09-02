import { Booking } from '../api/BookingApi';

export const validBooking: Booking = {
  firstname: 'Ilma',
  lastname: 'Wafa',
  totalprice: 250,
  depositpaid: true,
  bookingdates: { checkin: '2026-10-01', checkout: '2026-10-05' },
  additionalneeds: 'Breakfast',
};

export const updatedBooking: Booking = {
  firstname: 'Ilma',
  lastname: 'Wafa',
  totalprice: 400,
  depositpaid: false,
  bookingdates: { checkin: '2026-11-10', checkout: '2026-11-15' },
  additionalneeds: 'Late checkout',
};