class Room {
  constructor(name, bookings, rate, discount = 0) {
    /* if (!name || !bookings || !rate)
      throw new Error("There is arguments missings"); */
    this.name = name;
    this.bookings = bookings;
    this.rate = rate;
    this.discount = discount;
  }
  //busca la habitacion dentro del array de bookings y corrobora si la fecha ingresada esta en el rango de la fecha de reserva. Retorna true o false
  isOcuppied(date) {
    const formatDate = new Date(date).getTime();
    const roomInBooking = this.bookings.filter(
      (book) => book.room.name === this.name
    );
    let ocuppied = false;
    let formatCheckIn;
    let formatCheckOut;
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
  occupancyPercentage(startDate, endDate) {
    const formatStartDate = new Date(startDate).getTime();
    const formatEndDate = new Date(endDate).getTime();
    const step = 24 * 3600 * 1000;
    let mult = 0;
    const occupied = [];
    do {
      occupied.push(this.isOcuppied(formatStartDate + mult * step));
      mult++;
    } while (formatStartDate + step * mult <= formatEndDate);
    const totalOccupied = occupied.filter((item) => item).length;
    const total = occupied.length;
    return Math.round((totalOccupied / total) * 100);
  }
  //para todas las habitaciones ingresadas, aplica la funcion anterior y devuelve el porcentaje promedio de ocupacion?
  static totalOccupancyPercentage(rooms, startDate, endDate) {
    const occupancyArr = rooms.map((room) =>
      room.occupancyPercentage(startDate, endDate)
    );
    const totalPercentage = occupancyArr.reduce((acum, act) => acum + act, 0);
    return Math.round(totalPercentage / occupancyArr.length);
  }
  //para todas las habitaciones ingresadas, aplica la funcion anterior y devuelve un array con aquellas habitaciones que tiene una ocupacion de 0%
  static availableRooms(rooms, startDate, endDate) {
    const availableRooms = rooms.filter(
      (room) => room.occupancyPercentage(startDate, endDate) === 0
    );
    return availableRooms;
  }
}

class Booking {
  constructor(name, email, checkIn, checkOut, discount, room) {
    this.name = name;
    this.email = email;
    this.checkIn = checkIn;
    this.checkOut = checkOut;
    this.discount = discount;
    this.room = room;
  }
  getFee() {
    const formatCheckIn = new Date(this.checkIn).getTime();
    const formatCheckOut = new Date(this.checkOut).getTime();
    const totalDays = (formatCheckOut - formatCheckIn) / (24 * 3600 * 1000);
    const roomDailyPrice = this.room.rate * (1 - this.room.discount / 100);
    const totalFee = roomDailyPrice * totalDays * (1 - this.discount / 100);
    return totalFee;
  }
}

module.exports = {
  Room,
  Booking,
};

/* const bookingsTest = [
  {
    fullName: "Krista Rothschild",
    email: "krothschild0@360.cn",
    checkIn: "2023-04-19",
    checkOut: "2023-04-22",
    room: {
      name: "AFR 170",
      rate: 500,
    },
  },
  {
    fullName: "Krista Rothschild",
    email: "krothschild0@360.cn",
    checkIn: "2023-04-20",
    checkOut: "2023-04-30",
    room: {
      name: "AFR 250",
      rate: 500,
    },
  },
  {
    fullName: "Krista Rothschild",
    email: "krothschild0@360.cn",
    checkIn: "2023-04-15",
    checkOut: "2023-04-17",
    room: {
      name: "AFR 380",
      rate: 500,
    },
  },
];

const room1 = new Room("AFR 170", bookingsTest, 500, 0);
const room2 = new Room("AFR 250", bookingsTest, 500, 0);
const room3 = new Room("AFR 380", bookingsTest, 500, 0);
const room4 = new Room("AFR 420", bookingsTest, 500, 0);
const room5 = new Room("AFR 160", bookingsTest, 500, 0);

console.log(Room.availableRooms([room1, room3], "2023-04-19", "2023-04-23")); */

/* function prueba(checkIn, checkOut) {
  const formatCheckIn = new Date(checkIn).getTime();
  const formatCheckOut = new Date(checkOut).getTime();
  const totalDays = (formatCheckOut - formatCheckIn) / (24 * 3600 * 1000);
  console.log(totalDays);
}

prueba("2023-04-23", "2023-04-27"); */
