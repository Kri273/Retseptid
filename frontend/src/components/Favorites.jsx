import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ReactStars from "react-stars";
import "./card.css";
import { useNavigate } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const navigate = useNavigate();
  const goToHome = () => {
    navigate('/home');
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        return;
      }
  
      try {
        const response = await axios.get("http://localhost:8081/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        console.log("Fetched favorites:", response.data);
        setFavorites(response.data);
      } catch (error) {
        console.error("Error fetching favorites:", error.response?.data || error);
      }
    };
  
    fetchFavorites();
  }, []);
  
  
  const removeFavorite = async (recipeId) => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
  
    try {
      await axios.post(
        "http://localhost:8081/favorites/remove",
        { userId, recipeId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.ret_id !== recipeId)
      );
    } catch (error) {
      console.error("Error removing favorite:", error.response?.data || error);
    }
  };
  
  const handleShow = (recipe) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="centered-heading">Lemmikud</h1>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-500">Sul ei ole lemmikuid veel! Lisa <span onClick={goToHome} className="text-blue-500 hover:underline cursor-pointer siit">siit</span></p>
      ) : (
        <div className="grid-container">
          {favorites.map((item) => (
            <div
              key={item.ret_id}
              className="favorite-card"
            >
              <img
                src={`http://localhost:8081/uploads/${item.image}`}
                alt={item.name}
                className="favorite-image"
                onClick={() => handleShow(item)}
              />
              <div className="p-4 flex flex-col justify-between h-32">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <button
                  onClick={() => removeFavorite(item.ret_id)}
                  className="remove-button"
                >
                  Eemalda
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRecipe && (
        <Modal show={showModal} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedRecipe.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="modal-top">
              <div className="modal-image">
                <Card.Img
                  style={{ padding: "10px" }}
                  variant="top"
                  src={`http://localhost:8081/uploads/${selectedRecipe.image}`}
                  alt={selectedRecipe.name}
                />
              </div>
              <div className="modal-ingredients">
                <h5>Koostisosad:</h5>
                <ul>
                  {selectedRecipe.koostisosad.split(",").map((item, index) => (
                    <li key={index}>{item.trim()}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal-instructions">
              <h5>Retsept:</h5>
              <p>{selectedRecipe.retsept}</p>
            </div>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Sulge
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Favorites;