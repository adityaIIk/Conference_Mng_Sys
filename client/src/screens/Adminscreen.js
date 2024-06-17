import React, { useState, useEffect } from "react";
import { Tabs } from "antd";
import axios from "axios";
import Loader from "../components/Loader";
import Error from "../components/Error";
import Swal from 'sweetalert2';


const { TabPane } = Tabs;

function Adminscreen() {
  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("currentUser")).isAdmin) {
      window.location.href = "/home";
    }
  }, []);

  return (
    <div className="mt-3 ml-3 mr-3 bs">
      <h1>Admin Panel</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Bookings" key="1">
          <Bookings />
        </TabPane>
        <TabPane tab="Rooms" key="2">
          <Rooms />
        </TabPane>
        <TabPane tab="Add Room" key="3">
          <Addroom/>
        </TabPane>
        <TabPane tab="Users" key="4">
          <Users />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Adminscreen;

// Booking List Component

export function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await axios.get("/api/bookings/getallbookings");
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
      }
    };

    fetchBookings();

    return () => {
      // Clean up function if needed
    };
  }, []);

  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-md-10 text-center">
        <h1>Bookings</h1>
        {loading && <Loader />}
        {error && <Error />}

        <table className="table table-bordered table-dark">
          <thead className="bs thead-dark">
            <tr>
              <th>Booking Id</th>
              <th>User Id</th>
              <th>Room</th>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              !error &&
              bookings.length > 0 &&
              bookings.map((booking) => {
                return (
                  <tr>
                    <td>{booking._id}</td>
                    <td>{booking.userid}</td>
                    <td>{booking.room}</td>
                    <td>{booking.date}</td>
                    <td>{booking.starttime}</td>
                    <td>{booking.endtime}</td>
                    <td>{booking.status}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Rooms List Component

export function Rooms() {
  const [rooms, setrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data } = await axios.get("/api/rooms/getallrooms");
        setrooms(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
      }
    };

    fetchRooms();

    return () => {
      // Clean up function if needed
    };
  }, []);

  return (
    <div className="row justify-content-center align-items-center">
      <div className="col-md-10 text-center">
        <h1>Rooms</h1>
        {loading && <Loader />}
        {error && <Error />}

        <table className="table table-bordered table-dark">
          <thead className="bs thead-dark">
            <tr>
              <th>Room Id</th>
              <th>Name</th>
              <th>Type</th>
              <th>Rent Per Hour</th>
              <th>Max Count</th>
              <th>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              !error &&
              rooms.length > 0 &&
              rooms.map((rooms) => {
                return (
                  <tr>
                    <td>{rooms._id}</td>
                    <td>{rooms.name}</td>
                    <td>{rooms.type}</td>
                    <td>{rooms.rentperday}</td>
                    <td>{rooms.maxcount}</td>
                    <td>{rooms.phonenumber}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Users List Component
export function Users() {
  const [users, setusers] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get("/api/users/getallusers");
        setusers(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
    
        setLoading(false);
      }
    };

    fetchUsers();

    return () => {
      // Clean up function if needed
    };
  }, []);

  return (
    <div className="row">
      <div className="col-md-12">
        <h1> Users</h1>
        {loading && <Loader />}
        <table className="table table-dark table bordered">
          <thead>
            <tr>
              <th>User Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Is Admin</th>
            </tr>
          </thead>

          <tbody>
            {users &&
              users.map((user) => {
                return (
                  <tr>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? "Yes" : "No"}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Add Room Component

export function Addroom() {
    const [loading, setLoading] = useState(false);
   
    const [name, setname] = useState('');
    const [rentperday, setrentperday] = useState('');
    const [maxcount, setmaxcount] = useState('');
    const [description, setdescription] = useState('');
    const [phonenumber, setphonenumber] = useState('');
    const [type, settype] = useState('');
    const [imageurl1, setimageurl1] = useState('');
    const [imageurl2, setimageurl2] = useState('');
    const [imageurl3, setimageurl3] = useState('');
    
    async function addRoom() {
        const newroom = {
            name,
            rentperday,
            maxcount,
            description,
            phonenumber,
            type,
            imageurls: [imageurl1, imageurl2, imageurl3]
        };

        try {

            setLoading(true)
            const result = await (await axios.post('/api/rooms/addroom', newroom)).data
            console.log(result)
            setLoading(false)
            Swal.fire('Congratulations', 'Your Room Added Successfully', 'success').then(result=>{
                window.location.href='/admin'
            })

            
        } catch (error) {
            console.log(error)
            setLoading(false)
            Swal.fire('Oops', 'Something went wrong' , 'error')
        }

        console.log(newroom);
    }

    return (

        <div className="row justify-content-center align-items-center">
         
            <div className="col-md-5">
            {loading && (<Loader/>)}
                <input
                    type="text"
                    className="form-control"
                    placeholder="Room Name"
                    value={name}
                    onChange={(e) => setname(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Rent Per Hour"
                    value={rentperday}
                    onChange={(e) => setrentperday(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Max Count"
                    value={maxcount}
                    onChange={(e) => setmaxcount(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setdescription(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Phone Number"
                    value={phonenumber}
                    onChange={(e) => setphonenumber(e.target.value)}
                />
            </div>

            <div className="col-md-5">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Type"
                    value={type}
                    onChange={(e) => settype(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Image url 1"
                    value={imageurl1}
                    onChange={(e) => setimageurl1(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Image url2"
                    value={imageurl2}
                    onChange={(e) => setimageurl2(e.target.value)}
                />
                <input
                    type="text"
                    className="form-control"
                    placeholder="Image url 3"
                    value={imageurl3}
                    onChange={(e) => setimageurl3(e.target.value)}
                />

                <div>
                    <button className="btn btn-primary mt-2" onClick={addRoom}>Add Room</button>
                </div>
            </div>
        </div>
    );
}
