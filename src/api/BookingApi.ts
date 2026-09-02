import { APIRequestContext } from '@playwright/test';

export const BASE_URL = 'https://restful-booker.herokuapp.com';

export interface Booking {
  firstname: string;
  lastname: string;
  totalprice: number;
  depositpaid: boolean;
  bookingdates: { checkin: string; checkout: string };
  additionalneeds?: string;
}

export class BookingApi {
  constructor(private request: APIRequestContext) {}

  async createToken(username = 'admin', password = 'password123') {
    const response = await this.request.post(`${BASE_URL}/auth`, {
      data: { username, password },
    });
    return response;
  }

  async getToken(): Promise<string> {
    const response = await this.createToken();
    const body = await response.json();
    return body.token;
  }

  async createBooking(booking: Booking) {
    return this.request.post(`${BASE_URL}/booking`, { data: booking });
  }

  async getBooking(id: number) {
    return this.request.get(`${BASE_URL}/booking/${id}`);
  }

  async updateBooking(id: number, booking: Booking, token: string) {
    return this.request.put(`${BASE_URL}/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
      data: booking,
    });
  }

  async updateBookingWithoutAuth(id: number, booking: Booking) {
    return this.request.put(`${BASE_URL}/booking/${id}`, { data: booking });
  }

  async deleteBooking(id: number, token: string) {
    return this.request.delete(`${BASE_URL}/booking/${id}`, {
      headers: { Cookie: `token=${token}` },
    });
  }
}