import React, { useState } from "react";
import { Modal, Button, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

function Room({ room, date, timeRange }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="row bs">
      <div className="col-md-4">
        <img src={room.imageurls[0]} className="smallimg" alt="room" />
      </div>
      <div className="col-md-7">
        <h1 style={{ fontWeight: "bold" }}>{room.name}</h1>
        <div style={{ textAlign: "left", fontWeight: "bold" }}>
          <p>Max Count: {room.maxcount}</p>
          <p>Phone Number: {room.phonenumber}</p>
          <p>Type: {room.type}</p>
        </div>

        <div style={{ float: "right" }}>
          {date && timeRange.length === 2 && (
            <Link to={`/book/${room._id}/${date}/${timeRange[0]}/${timeRange[1]}`}>
              <Button className="btn btn-primary m-2">Book Now</Button>
            </Link>
          )}

          <button className="btn btn-primary" onClick={handleShow}>
            View Details
          </button>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header>
          <Modal.Title>{room.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Carousel prevLabel=" " nextLabel=" ">
            {room.imageurls.map((url, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100 bigimg"
                  src={url}
                  alt={`Slide ${index}`}
                />
              </Carousel.Item>
            ))}
          </Carousel>
          <p
            style={{
              textAlign: "center",
              fontWeight: "bold",
              paddingTop: "10px",
            }}
          >
            {room.description}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Room;
