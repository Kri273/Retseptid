import React, { useEffect, useState } from "react";
import axios from "axios";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

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
  

  return (
    <div>
      <h1>Your Favorites</h1>
      <ul>
        {favorites.map((item) => (
          <li key={item.ret_id}>
            {item.name}
            <button onClick={() => removeFavorite(item.ret_id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favorites;