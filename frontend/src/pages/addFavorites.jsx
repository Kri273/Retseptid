import React, { useEffect, useState } from "react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in first.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:8081/favorites", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setFavorites(data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div>
      <h1>Your Favorites</h1>
      <ul>
        {favorites.map((item) => (
          <li key={item.id}>{item.name}</li> 
        ))}
      </ul>
    </div>
  );
};

export default Favorites;
