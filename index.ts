import { IRoom, IBooking } from "./utils";

export class Room implements IRoom {
  name: string;
  bookings: IBooking[];
  rate: number;
  discount: number;
  constructor(name: string, bookings: IBooking[], rate: number, discount = 0) {
    this.name = name;
    this.bookings = bookings;
    this.rate = rate;
    this.discount = discount;
  }
  //busca la habitacion dentro del array de bookings y corrobora si la fecha ingresada esta en el rango de la fecha de reserva. Retorna true o false
  isOcuppied(date: Date): boolean {
    const formatDate = new Date(date).getTime();
    const roomInBooking = this.bookings.filter(
      (book) => book.room.name === this.name
    );
    let ocuppied = false;
    let formatCheckIn: number;
    let formatCheckOut: number;
    for (let i = 0; i < roomInBooking.length; i++) {
      formatCheckIn = new Date(roomInBooking[i].checkIn).getTime();
      formatCheckOut = new Date(roomInBooking[i].checkOut).getTime();
      if (formatDate >= formatCheckIn && formatDate <= formatCheckOut) {
        ocuppied = true;
      }
    }
    return ocuppied;
  }
  //busca la habitacion en el array de bookings y se fija cuantos días del rango ingresado como parámetros esa habitacion esta ocupada. Devuelve porcentaje
  occupancyPercentage(startDate: Date, endDate: Date) {
    const formatStartDate = new Date(startDate).getTime();
    const formatEndDate = new Date(endDate).getTime();
    const step = 24 * 3600 * 1000;
    let mult = 0;
    const occupied: boolean[] = [];
    do {
      occupied.push(this.isOcuppied(new Date(formatStartDate + mult * step)));
      mult++;
    } while (formatStartDate + step * mult <= formatEndDate);
    const totalOccupied = occupied.filter((item) => item).length;
    const total = occupied.length;
    return Math.round((totalOccupied / total) * 100);
  }
  //para todas las habitaciones ingresadas, aplica la funcion anterior y devuelve el porcentaje promedio de ocupacion?
  static totalOccupancyPercentage(
    rooms: IRoom[],
    startDate: Date,
    endDate: Date
  ): number {
    const occupancyArr = rooms.map((room) =>
      room.occupancyPercentage(startDate, endDate)
    );
    const totalPercentage = occupancyArr.reduce((acum, act) => acum + act, 0);
    return Math.round(totalPercentage / occupancyArr.length);
  }
  //para todas las habitaciones ingresadas, aplica la funcion anterior y devuelve un array con aquellas habitaciones que tiene una ocupacion de 0%
  static availableRooms(rooms: IRoom[], startDate: Date, endDate: Date) {
    const availableRooms = rooms.filter(
      (room) => room.occupancyPercentage(startDate, endDate) === 0
    );
    return availableRooms;
  }
}

export class Booking implements IBooking {
  name: string;
  email: string;
  checkIn: Date;
  checkOut: Date;
  discount: number;
  room: IRoom;
  constructor(
    name: string,
    email: string,
    checkIn: Date,
    checkOut: Date,
    discount: number,
    room: IRoom
  ) {
    this.name = name;
    this.email = email;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.discount = discount;
    this.room = room;
  }
  getFee(): number {
    if (this.discount > 100 || this.discount < 0) return -1;
    if (this.room.discount > 100 || this.room.discount < 0) return -1;
    const formatCheckIn = new Date(this.checkIn).getTime();
    const formatCheckOut = new Date(this.checkOut).getTime();
    const totalDays = (formatCheckOut - formatCheckIn) / (24 * 3600 * 1000);
    const roomDailyPrice = this.room.rate * (1 - this.room.discount / 100);
    const totalFee = roomDailyPrice * totalDays * (1 - this.discount / 100);
    return totalFee;
  }
}

/* module.exports = {
  Room,
  Booking,
}; */
