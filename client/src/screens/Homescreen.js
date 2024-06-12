import React, { useState, useEffect } from "react";
import axios from "axios";
import Room from "../components/Room";
import Loader from "../components/Loader";
import Error from "../components/Error";
import { DatePicker, Space, TimePicker } from "antd";
import moment from "moment";

function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [date, setDate] = useState();
  const [timeRange, setTimeRange] = useState([]);
  const [duplicaterooms, setduplicaterooms] = useState([]);
  const [searchkey, setsearchkey] = useState('');
  const [type, settype] = useState('all');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/rooms/getallrooms");
        setRooms(response.data);
        setduplicaterooms(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError(true);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  function filterByDate(date) {
    if (date) {
      const formattedDate = date.format("DD-MM-YYYY");
      setDate(formattedDate);
      filterRooms(searchkey, type, formattedDate, timeRange);
    } else {
      setDate(null);
      filterRooms(searchkey, type);
    }
  }

  function filterByTime(time) {
    if (time) {
      const startTime = time[0].format("HH:mm");
      const endTime = time[1].format("HH:mm");
      setTimeRange([startTime, endTime]);
      filterRooms(searchkey, type, date, [startTime, endTime]);
    } else {
      setTimeRange([]);
      filterRooms(searchkey, type);
    }
  }

  function filterBySearch() {
    filterRooms(searchkey, type, date, timeRange);
  }

  function filterByType(e) {
    settype(e);
    filterRooms(searchkey, e, date, timeRange);
  }

  function filterRooms(searchKey, roomType, selectedDate, selectedTimeRange) {
    let tempRooms = duplicaterooms;

    // Add filtering logic based on date and time range
    if (selectedDate && selectedTimeRange.length === 2) {
      const [startTime, endTime] = selectedTimeRange;
      tempRooms = tempRooms.filter(room => {
        let availability = true;
        if (room.currentbookings.length > 0) {
          for (const booking of room.currentbookings) {
            if (
              booking.date === selectedDate &&
              (
                (startTime >= booking.starttime && startTime < booking.endtime) ||
                (endTime > booking.starttime && endTime <= booking.endtime) ||
                (startTime <= booking.starttime && endTime >= booking.endtime)
              )
            ) {
              availability = false;
              break;
            }
          }
        }
        return availability;
      });
    }

    if (searchKey) {
      tempRooms = tempRooms.filter(room =>
        room.name.toLowerCase().includes(searchKey.toLowerCase())
      );
    }

    if (roomType !== 'all') {
      tempRooms = tempRooms.filter(room =>
        room.type.toLowerCase() === roomType.toLowerCase()
      );
    }

    setRooms(tempRooms);
  }

  return (
    <div className="container">
      <div className="row mt-5 bs">
        <div className="col-md-3">
          <DatePicker format="DD-MM-YYYY" onChange={(date) => filterByDate(date)} />
        </div>
        <div className="col-md-3">
          <TimePicker.RangePicker format="HH:mm" onChange={(time) => filterByTime(time)} />
        </div>
        <div className="col-md-3">
          <input 
            type="text" 
            className="form-control" 
            placeholder="search room"
            value={searchkey}
            onChange={(e) => setsearchkey(e.target.value)}
            onKeyUp={filterBySearch}
          />
        </div>
        <div className="col-md-3">
          <select 
            value={type} 
            onChange={(e) => filterByType(e.target.value)}
            className="form-control" 
          >
            <option value="all">All</option>
            <option value="delux">Delux</option>
            <option value="non-delux">Non-Delux</option>
          </select>
        </div>
      </div>
      
      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : error ? (
          <Error />
        ) : (
          rooms.map(room => (
            <div className="col-md-9 mt-2" key={room._id}>
              <Room room={room} date={date} timeRange={timeRange} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Homescreen;
