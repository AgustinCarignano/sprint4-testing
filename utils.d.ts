export interface IRoom {
  name: string;
  bookings: IBooking[];
  rate: number;
  discount: number;
  isOcuppied: (date: Date) => boolean;
  occupancyPercentage: (startDate: Date, endDate: Date) => number;
}

export interface IBooking {
  name: string;
  email: string;
  checkIn: Date;
  checkOut: Date;
  discount: number;
  room: IRoom;
  getFee: () => number;
}
