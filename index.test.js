const { Room, Booking } = require("./index");

const bookingsTest = [
  {
    name: "Krista Rothschild",
    email: "krothschild0@360.cn",
    checkIn: "2023-04-19",
    checkOut: "2023-04-22",
    discount: 15,
    room: {
      name: "AFR 170",
      bookings: [],
      rate: 500,
      discount: 15,
    },
  },
  {
    name: "Krista Rothschild",
    email: "krothschild0@360.cn",
    checkIn: "2023-04-20",
    checkOut: "2023-04-30",
    discount: 0,
    room: {
      name: "AFR 250",
      bookings: [],
      rate: 500,
      discount: 0,
    },
  },
  {
    name: "Krista Rothschild",
    email: "krothschild0@360.cn",
    checkIn: "2023-04-15",
    checkOut: "2023-04-17",
    discount: 5,
    room: {
      name: "AFR 380",
      bookings: [],
      rate: 500,
      discount: 5,
    },
  },
];

describe("Constructor method of room object", () => {
  test("Values are assigned correctly", () => {
    const expectedValue = {
      name: "room name",
      bookings: [],
      rate: 300,
      discount: 10,
    };
    const room = new Room("room name", [], 300, 10);
    const actualValue = {
      name: room.name,
      bookings: room.bookings,
      rate: room.rate,
      discount: room.discount,
    };
    expect(actualValue).toEqual(expectedValue);
  });
  test("Discount value is 0 when no one value is passed", () => {
    const room = new Room("room name", [], 300);
    expect(room.discount).toBe(0);
  });
});

describe("isOcuppied method of room object", () => {
  test("Returns true when the room is booked", () => {
    const room = new Room("AFR 170", bookingsTest, 500, 0);
    expect(room.isOcuppied("2023-04-20")).toBe(true);
  });
  test("Returns false when the room is not booked", () => {
    const room = new Room("AFR 170", bookingsTest, 500, 0);
    expect(room.isOcuppied("2023-04-25")).toBe(false);
  });
});

describe("ocuppancyPercentage method of room object", () => {
  test("Returns 100% when it recive one day range and is occupied", () => {
    const room = new Room("AFR 170", bookingsTest, 500, 0);
    expect(room.occupancyPercentage("2023-04-20", "2023-04-20")).toBe(100);
  });
  test("Returns 100% when the room it's occupied for the whole range", () => {
    const room = new Room("AFR 170", bookingsTest, 500, 0);
    expect(room.occupancyPercentage("2023-04-19", "2023-04-21")).toBe(100);
  });
  test("Returns 75% when the room is occupied 3 days in a range of 4 days", () => {
    const room = new Room("AFR 170", bookingsTest, 500, 0);
    expect(room.occupancyPercentage("2023-04-18", "2023-04-21")).toBe(75);
  });
  test("Returns 0% when the room is available for the whole date range", () => {
    const room = new Room("AFR 170", bookingsTest, 500, 0);
    expect(room.occupancyPercentage("2023-04-10", "2023-04-15")).toBe(0);
  });
  test("Returns 0% when the room doesn't appear in any booking", () => {
    const room = new Room("AFR 270", bookingsTest, 500, 0);
    expect(room.occupancyPercentage("2023-04-20", "2023-04-22")).toBe(0);
  });
});

describe("totalOccupancyPercentage static method of Room class", () => {
  test("Returns 100% when all rooms passed have 100% of occupancy", () => {
    const room1 = new Room("AFR 170", bookingsTest, 500, 0);
    const room2 = new Room("AFR 250", bookingsTest, 500, 0);
    expect(
      Room.totalOccupancyPercentage([room1, room2], "2023-04-20", "2023-04-22")
    ).toBe(100);
  });
  test("Returns 50% when one room has 100% and the other 0% of occupancy", () => {
    const room1 = new Room("AFR 170", bookingsTest, 500, 0);
    const room2 = new Room("AFR 250", bookingsTest, 500, 0);
    expect(
      Room.totalOccupancyPercentage([room1, room2], "2023-04-23", "2023-04-28")
    ).toBe(50);
  });
  test("Returns 0% when all rooms passed have 0% of occupancy", () => {
    const room1 = new Room("AFR 170", bookingsTest, 500, 0);
    const room2 = new Room("AFR 250", bookingsTest, 500, 0);
    expect(
      Room.totalOccupancyPercentage([room1, room2], "2023-04-10", "2023-04-18")
    ).toBe(0);
  });
  test("Returns 33% when one room has 100%, and the two rooms left have 0% of occupancy", () => {
    const room1 = new Room("AFR 170", bookingsTest, 500, 0);
    const room2 = new Room("AFR 250", bookingsTest, 500, 0);
    const room3 = new Room("AFR 380", bookingsTest, 500, 0);
    expect(
      Room.totalOccupancyPercentage(
        [room1, room2, room3],
        "2023-04-15",
        "2023-04-17"
      )
    ).toBe(33);
  });
});

describe("availableRooms static method of Room class", () => {
  test("return all rooms from the passed array if their occupancy is 0%", () => {
    const room1 = new Room("AFR 170", bookingsTest, 500, 0);
    const room2 = new Room("AFR 250", bookingsTest, 500, 0);
    const room3 = new Room("AFR 380", bookingsTest, 500, 0);
    expect(
      Room.availableRooms([room1, room2, room3], "2023-04-05", "2023-04-08")
    ).toEqual([room1, room2, room3]);
  });
  test("return one room from the passed array if his occupancy is 0% and more than 0% for the others", () => {
    const room1 = new Room("AFR 170", bookingsTest, 500, 0);
    const room2 = new Room("AFR 250", bookingsTest, 500, 0);
    const room3 = new Room("AFR 380", bookingsTest, 500, 0);
    expect(
      Room.availableRooms([room1, room2, room3], "2023-04-15", "2023-04-19")
    ).toEqual([room2]);
  });
  test("return an empty array if the occupancy for all rooms in more than 0%", () => {
    const room1 = new Room("AFR 170", bookingsTest, 500, 0);
    const room2 = new Room("AFR 250", bookingsTest, 500, 0);
    expect(
      Room.availableRooms([room1, room2], "2023-04-20", "2023-04-22")
    ).toEqual([]);
  });
  test("return the full passed array if no one room is in the booking list", () => {
    const room1 = new Room("AFR 420", bookingsTest, 500, 0);
    const room2 = new Room("AFR 160", bookingsTest, 500, 0);
    expect(
      Room.availableRooms([room1, room2], "2023-04-19", "2023-04-23")
    ).toEqual([room1, room2]);
  });
});

describe("Constructor method of booking", () => {
  test("Values are assigned correctly", () => {
    const room = new Room("AMR 023", bookingsTest, 350, 10);
    const booking = new Booking(
      "Jean Doe",
      "JDoe@mail.com",
      "2023-04-23",
      "2023-04-28",
      10,
      room
    );

    const expectedValue = {
      name: "Jean Doe",
      email: "JDoe@mail.com",
      checkIn: "2023-04-23",
      checkOut: "2023-04-28",
      discount: 10,
      room: room,
    };

    expect(booking).toEqual(expectedValue);
    expect(booking.room).toBeInstanceOf(Room);
  });
});

describe("getFee method of booking objects", () => {
  test("Returns 1000 when the room rate is 200 for five days and without discounts", () => {
    const room = new Room("AMR 023", bookingsTest, 200);
    const booking = new Booking(
      "Jean Doe",
      "JDoe@mail.com",
      "2023-04-23",
      "2023-04-28",
      0,
      room
    );
    expect(booking.getFee()).toBe(1000);
  });
  test("Returns 500 when the room rate is 200, its discount 50% and for a five days reservation without booking discount", () => {
    const room = new Room("AMR 023", bookingsTest, 200, 50);
    const booking = new Booking(
      "Jean Doe",
      "JDoe@mail.com",
      "2023-04-23",
      "2023-04-28",
      0,
      room
    );
    expect(booking.getFee()).toBe(500);
  });
  test("Returns 900 when the room rate is 200, its discount 0, for a five day reservation with a discount of 10%", () => {
    const room = new Room("AMR 023", bookingsTest, 200);
    const booking = new Booking(
      "Jean Doe",
      "JDoe@mail.com",
      "2023-04-23",
      "2023-04-28",
      10,
      room
    );
    expect(booking.getFee()).toBe(900);
  });
  test("Returns 720 when the room rate is 200, its discount 10%, for a five days reservation and with a booking discount of 20%", () => {
    const room = new Room("AMR 023", bookingsTest, 200, 10);
    const booking = new Booking(
      "Jean Doe",
      "JDoe@mail.com",
      "2023-04-23",
      "2023-04-28",
      20,
      room
    );
    expect(booking.getFee()).toBe(720);
  });
});
