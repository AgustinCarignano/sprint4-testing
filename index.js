"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = exports.Room = void 0;
var Room = /** @class */ (function () {
    function Room(name, bookings, rate, discount) {
        if (discount === void 0) { discount = 0; }
        this.name = name;
        this.bookings = bookings;
        this.rate = rate;
        this.discount = discount;
    }
    //busca la habitacion dentro del array de bookings y corrobora si la fecha ingresada esta en el rango de la fecha de reserva. Retorna true o false
    Room.prototype.isOcuppied = function (date) {
        var _this = this;
        var formatDate = new Date(date).getTime();
        var roomInBooking = this.bookings.filter(function (book) { return book.room.name === _this.name; });
        var ocuppied = false;
        var formatCheckIn;
        var formatCheckOut;
        for (var i = 0; i < roomInBooking.length; i++) {
            formatCheckIn = new Date(roomInBooking[i].checkIn).getTime();
            formatCheckOut = new Date(roomInBooking[i].checkOut).getTime();
            if (formatDate >= formatCheckIn && formatDate <= formatCheckOut) {
                ocuppied = true;
            }
        }
        return ocuppied;
    };
    //busca la habitacion en el array de bookings y se fija cuantos días del rango ingresado como parámetros esa habitacion esta ocupada. Devuelve porcentaje
    Room.prototype.occupancyPercentage = function (startDate, endDate) {
        var formatStartDate = new Date(startDate).getTime();
        var formatEndDate = new Date(endDate).getTime();
        var step = 24 * 3600 * 1000;
        var mult = 0;
        var occupied = [];
        do {
            occupied.push(this.isOcuppied(new Date(formatStartDate + mult * step)));
            mult++;
        } while (formatStartDate + step * mult <= formatEndDate);
        var totalOccupied = occupied.filter(function (item) { return item; }).length;
        var total = occupied.length;
        return Math.round((totalOccupied / total) * 100);
    };
    //para todas las habitaciones ingresadas, aplica la funcion anterior y devuelve el porcentaje promedio de ocupacion?
    Room.totalOccupancyPercentage = function (rooms, startDate, endDate) {
        var occupancyArr = rooms.map(function (room) {
            return room.occupancyPercentage(startDate, endDate);
        });
        var totalPercentage = occupancyArr.reduce(function (acum, act) { return acum + act; }, 0);
        return Math.round(totalPercentage / occupancyArr.length);
    };
    //para todas las habitaciones ingresadas, aplica la funcion anterior y devuelve un array con aquellas habitaciones que tiene una ocupacion de 0%
    Room.availableRooms = function (rooms, startDate, endDate) {
        var availableRooms = rooms.filter(function (room) { return room.occupancyPercentage(startDate, endDate) === 0; });
        return availableRooms;
    };
    return Room;
}());
exports.Room = Room;
var Booking = /** @class */ (function () {
    function Booking(name, email, checkIn, checkOut, discount, room) {
        this.name = name;
        this.email = email;
        this.checkIn = checkIn;
        this.checkOut = checkOut;
        this.discount = discount;
        this.room = room;
    }
    Booking.prototype.getFee = function () {
        if (this.discount > 100 || this.discount < 0)
            return -1;
        if (this.room.discount > 100 || this.room.discount < 0)
            return -1;
        var formatCheckIn = new Date(this.checkIn).getTime();
        var formatCheckOut = new Date(this.checkOut).getTime();
        var totalDays = (formatCheckOut - formatCheckIn) / (24 * 3600 * 1000);
        var roomDailyPrice = this.room.rate * (1 - this.room.discount / 100);
        var totalFee = roomDailyPrice * totalDays * (1 - this.discount / 100);
        return totalFee;
    };
    return Booking;
}());
exports.Booking = Booking;
/* module.exports = {
  Room,
  Booking,
}; */
