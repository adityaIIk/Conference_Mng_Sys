import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from 'sweetalert2';
import { Tag,Divider } from "antd";

const { TabPane } = Tabs;

function Profilescreen() {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        if (!user) {
            window.location.href = '/login';
        }
    }, [user]);

    return (
        <div className='ml-3 mt-3'>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Profile" key="1">
                    <h1>My Profile</h1>
                    <br />
                    <h1>Name: {user.name}</h1>
                    <h1>Email: {user.email}</h1>
                    <h1>isAdmin: {user.isAdmin ? 'Yes' : 'No'}</h1>
                </TabPane>
                <TabPane tab="Bookings" key="2">
                    <MyBookings />
                </TabPane>
            </Tabs>
        </div>
    );
}

export default Profilescreen;

export function MyBookings() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        async function fetchBookings() {
            try {
                setLoading(true);
                const response = await axios.post('/api/bookings/getbookingsbyuserid', { userid: user._id });
                console.log(response.data);
                setBookings(response.data);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
                setError(error);
            }
        }

        fetchBookings();
    }, [user._id]);

    async function cancelBooking(bookingid, roomid) {
        try {
            setLoading(true);
            const result = await axios.post("/api/bookings/cancelbooking", { bookingid, roomid });
            console.log(result.data);

            // Update bookings state after cancelling a booking
            setBookings(prevBookings => prevBookings.map(booking => 
                booking._id === bookingid ? { ...booking, status: 'cancelled' } : booking
            ));

            setLoading(false);
            Swal.fire('Congratulations', 'Your booking has been cancelled' , 'success').then(result=>{
                window.location.reload()
            });

        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(error);
        }
    }

    return (
        <div className="row">
            <div className="col-md-6 offset-md-3">
                {loading && (<Loader />)}
                {error && (<Error message={error.message} />)}
                {bookings && bookings.map(booking => {
                    return (
                        <div className='bs' key={booking._id} style={{ marginBottom: '20px' }}>
                            <h1>{booking.room}</h1>
                            <p><b>Booking Id:</b> {booking._id}</p>
                            <p><b>CheckIn Date: </b>{booking.date}</p>
                            <p><b>CheckIn Time:</b> {booking.starttime}</p>
                            <p><b>CheckOut Time: </b>{booking.endtime}</p>
                            <p><b>Amount:</b> ${booking.totalamount}</p>
                            <p><b>Status: </b>{booking.status == 'cancelled' ? (<Tag color='red' >CANCELLED</Tag>) : (<Tag color='green'>CONFIRMED</Tag>) }</p>
                            {booking.status === 'booked' && (
                                <div>
                                    <button className='btn btn-primary' onClick={() => cancelBooking(booking._id, booking.roomid)}>CANCEL BOOKING</button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
