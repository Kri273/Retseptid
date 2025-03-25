import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ReactStars from "react-stars";
import Heart from "react-heart";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import "./card.css";

function Card1({ id, name, image, koostisosad, retsept, initialRating }) {
  const [rating, setRating] = useState(initialRating || 0);
  const [showModal, setShowModal] = useState(false); // Staatiline muutuja modaalide haldamiseks

  const handleRatingChange = async (newRating) => {
    setRating(newRating);

    try {
      await axios.post("http://localhost:8081/rate-recipe", {
        recipeId: id,
        rating: newRating,
      });
    } catch (err) {
      console.error("Viga hinnangu salvestamisel:", err);
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);
  const [active, setActive] = useState(false);

  return (
    <>
      <Card style={{ width: "18rem", margin: "10px" }}>
        <Card.Img
          style={{
            maxWidth: "14rem",
            margin: "10px",
            height: "14rem",
            alignSelf: "center",
            objectFit: "cover",
          }}
          variant="top"
          src={
            image
              ? `http://localhost:8081/uploads/${image}`
              : "https://via.placeholder.com/150"
          }
          alt={name}
        />
        <Card.Body>
          <Card.Title>{name}</Card.Title>

          <div style={{ display: "flex", alignItems: "center" }}>
            <Button variant="primary" onClick={handleShow}>
              Vaata retsepti
            </Button>
            <Heart
              isActive={active}
              onClick={() => setActive(!active)}
              animationScale={1.25}
              style={{ height: "2rem", width: "2rem", marginLeft: "14px" }}
            />
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card.Img
            style={{ padding: "10px" }}
            variant="top"
            src={
              image
                ? `http://localhost:8081/uploads/${image}`
                : "https://via.placeholder.com/150"
            }
            alt={name}
          />
          <h5>Koostisosad:</h5>
          <ul>
            {koostisosad.split(",").map((item, index) => (
              <li key={index}>{item.trim()}</li>
            ))}
          </ul>
          <h5>Retsept:</h5>
          <p>{retsept}</p>
          <ReactStars
            count={5}
            value={rating}
            onChange={handleRatingChange}
            size={24}
            activeColor="#FF9529"
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Sulge
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Card1;
