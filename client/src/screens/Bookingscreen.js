import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Error from "../components/Error";
import moment from "moment";
import StripeCheckout from "react-stripe-checkout";
import Swal from 'sweetalert2';

function Bookingscreen() {
  const { roomid, date, starttime, endtime } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState(null);
  const [totalamount, setTotalAmount] = useState();
  const [hours, setHours] = useState(0);

  useEffect(() => {
    if (!localStorage.getItem('currentUser')) {
      window.location.href = '/login';
    }

    const checkBooking = async () => {
      try {
        const response = await axios.post('/api/bookings/checkbooking', { roomid, date, starttime, endtime });
        if (response.data.exists) {
          Swal.fire('Error', 'This booking already exists. Redirecting to your homepage.', 'error').then(() => {
            navigate('/home');
          });
        } else {
          fetchRoomData();
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    const fetchRoomData = async () => {
      try {
        const { data } = await axios.post("/api/rooms/getroombyid", { roomid });

        const start = moment(`${date} ${starttime}`, "DD-MM-YYYY HH:mm");
        const end = moment(`${date} ${endtime}`, "DD-MM-YYYY HH:mm");
        const hoursDiff = moment.duration(end.diff(start)).asHours();
        const calculatedAmount = hoursDiff * 100;

        setHours(hoursDiff);
        setTotalAmount(calculatedAmount);
        setRoom(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    };

    checkBooking();

    const handlePopState = () => {
      navigate('/home');
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [roomid, date, starttime, endtime, navigate]);

  if (loading) return <Loader />;
  if (error) return <div className="mt-5"><Error /></div>;
  if (!room) return null;

  async function onToken(token) {
    const bookingDetails = {
      room,
      roomid: room._id,
      userid: JSON.parse(localStorage.getItem("currentUser"))._id,
      date,
      starttime,
      endtime,
      totalamount: totalamount,
      token
    };

    try {
      setLoading(true);
      const result = await axios.post("/api/bookings/bookroom", bookingDetails);
      setLoading(false);
      Swal.fire('Congratulations!', 'Your Room Booked Successfully', 'success').then(() => {
        navigate('/profile');
        console.log(result)
      });
    } catch (error) {
      setLoading(false);
      Swal.fire('Oops!', 'Something went wrong', 'error');
    }
  }

  return (
    <div className="m-5">
      <div className="row justify-content-center mt-5 bs">
        <div className="col-md-6">
          <h1>{room.name}</h1>
          <img src={room.imageurls[0]} className="img-fluid bigimg" alt={room.name} /> {/* Added img-fluid class for responsive images */}
        </div>
        <div className="col-md-6">
          <div style={{ textAlign: "right" }}>
            <h1>Booking Details</h1>
            <hr />
            <b>
              <p>Name: {JSON.parse(localStorage.getItem("currentUser")).name}</p>
              <p>Date: {date}</p>
              <p>Start Time: {starttime}</p>
              <p>End Time: {endtime}</p>
              <p>Max Count: {room.maxcount}</p>
            </b>
          </div>
          <div style={{ textAlign: "right" }}>
            <b>
              <h1>Amount</h1>
              <hr />
              <p>Total hours: {hours}</p>
              <p>Rent per hour: $100</p>
              <p>Total Amount: ${totalamount}</p>
            </b>
          </div>
          <div style={{ float: "right" }}>
            <StripeCheckout
              amount={totalamount * 100}
              token={onToken}
              stripeKey="pk_test_51PQ8yAIaNCLAzxAAcHXLgPJMyVh5gmufsy4nb4VdHP1QipDIUvVWtlm0UM3qKfbjgKinJfQWWC9Jw8cAT6XfjRNa00rtofsR1M"
            >
              <button className="btn btn-primary">Pay Now</button>
            </StripeCheckout>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bookingscreen;
