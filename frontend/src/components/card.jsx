import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ReactStars from "react-stars";
import Heart from "react-heart";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import "./card.css";

function Card1({
  id,
  name,
  image,
  koostisosad,
  retsept,
  initialRating,
  kasutajanimi,
}) {
  const [rating, setRating] = useState(initialRating || 0);
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://localhost:8081/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const favorites = res.data;
        setIsFavorite(favorites.some((fav) => fav.ret_id === id));
      })
      .catch((err) => console.error("Error fetching favorites:", err));
  }, [id, token]);

  const toggleFavorite = async () => {
    if (!token) {
      alert("Please log in to save favorites!");
      return;
    }

    try {
      if (isFavorite) {
        await axios.post(
          "http://localhost:8081/favorites/remove",
          { recipeId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          "http://localhost:8081/favorites/add",
          { recipeId: id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error updating favorites:", error);
    }
  };

  const handleRatingChange = async (newRating) => {
    setRating(newRating);
    try {
      await axios.post(
        "http://localhost:8081/rate-recipe",
        { ret_id: id, rating: newRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error saving rating:", err);
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const handleCardClick = () => {
    handleShow();
  };

  return (
    <>
      <Card
        style={{
          width: "18rem",
          margin: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          border: "none",
        }}
        className="favorite-card"
      >
        <Card.Img
          onClick={handleCardClick}
          style={{
            cursor: "pointer",
            maxWidth: "16rem",
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
        <Card.Body
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
            flexGrow: 1,
            width: "100%",
          }}
        >
          <Card.Title style={{ textAlign: "center" }}>{name}</Card.Title>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginTop: "auto",
              paddingBottom: "10px",
            }}
          >
            <Button variant="primary" onClick={handleShow}>
              Vaata retsepti
            </Button>
            <Heart
              isActive={isFavorite}
              onClick={toggleFavorite}
              inactiveColor="#fff"
              activeColor="red"
              animationScale={1.25}
              style={{ height: "2.5rem", width: "2.5rem" }}
            />
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Lisaja: {kasutajanimi}</p>
          <div className="modal-top">
            <div className="modal-image">
              <Card.Img
                style={{ padding: "5px" }}
                variant="top"
                src={
                  image
                    ? `http://localhost:8081/uploads/${image}`
                    : "https://via.placeholder.com/150"
                }
                alt={name}
              />
            </div>
            <div className="modal-ingredients">
              <h5>Koostisosad:</h5>
              <ul>
                {koostisosad.split(",").map((item, index) => (
                  <li key={index}>{item.trim()}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="modal-instructions">
            <h5>Retsept:</h5>
            <p>{retsept}</p>
          </div>

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
