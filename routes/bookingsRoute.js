const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");
const Room = require("../models/room");
const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(
  "sk_test_51PQ8yAIaNCLAzxAAOYzdK53SOB46CDvi9SaJ5CMlRRGaUiQ509teCMbHskuuDT6LRJ2l1nWTZ0QDPzpkGT0NzYOY00T3RVBR4f"
);

// New endpoint to check for existing bookings
router.post("/checkbooking", async (req, res) => {
  const { roomid, date, starttime, endtime } = req.body;

  try {
    const existingBooking = await Booking.findOne({
      roomid,
      date,
      starttime,
      endtime,
    });

    if (existingBooking) {
      return res.status(200).json({ exists: true });
    } else {
      return res.status(200).json({ exists: false });
    }
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/bookroom", async (req, res) => {
  const { room, userid, date, starttime, endtime, totalamount, token } = req.body;

  try {
    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const payment = await stripe.charges.create(
      {
        amount: totalamount * 100,
        customer: customer.id,
        currency: "inr",
        receipt_email: token.email,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );

    if (payment) {
      const newBooking = new Booking({
        room: room.name,
        roomid: room._id,
        userid,
        date,
        starttime,
        endtime,
        totalamount,
        transactionId: "1234", // Example, should be generated or provided
      });

      const booking = await newBooking.save();

      const roomToUpdate = await Room.findOne({ _id: room._id });
      if (!roomToUpdate) {
        return res.status(404).json({ error: "Room not found" });
      }

      roomToUpdate.currentbookings.push({
        bookingid: booking._id,
        date: date,
        starttime: starttime,
        endtime: endtime,
        userid: userid,
        status: booking.status,
      });

      await roomToUpdate.save();
    }

    res.send("Payment Successful, Your room is booked");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post('/getbookingsbyuserid', async (req, res) => {
  const { userid } = req.body;

  try {
    const bookings = await Booking.find({ userid });
    res.send(bookings);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.post("/cancelbooking", async (req, res) => {
  const { bookingid, roomid } = req.body;

  try {
    const bookingItem = await Booking.findOne({ _id: bookingid });
    bookingItem.status = 'cancelled';
    await bookingItem.save();

    const room = await Room.findOne({ _id: roomid });
    room.currentbookings = room.currentbookings.filter(booking => booking.bookingid.toString() !== bookingid);

    await room.save();
    
    res.send("Booking cancelled successfully");
  } catch (error) {
    return res.status(400).json({ error });
  }
});

router.get("/getallbookings" , async(req,res) => {

  try {
    const bookings = await Booking.find()
    res.send(bookings)
  } catch (error) {
    return res.status(400).json({error})
  }

})

module.exports = router;
