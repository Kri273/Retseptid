import { useState, useEffect } from "react";
import Card1 from "../components/card";
import "./home.css";

function Home() {
  const [recipes, setRecipes] = useState([]);
  const username = localStorage.getItem("username") || "Kasutaja";

  useEffect(() => {
    fetch("http://localhost:8081/recipes")
      .then((response) => response.json())
      .then((data) => {
        setRecipes(data);
      })
      .catch((error) => console.error("Viga retseptide laadimisel:", error));
  }, []);

  return (
    <div>
      <h1 className="tere">Tere, {username}!</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {recipes.map((recipe) => (
          <Card1
            key={recipe.ret_id}
            id={recipe.ret_id}
            name={recipe.name}
            image={recipe.image}
            koostisosad={recipe.koostisosad}
            retsept={recipe.retsept}
            initialRating={recipe.avgRating}
            kasutajanimi={recipe.kasutajanimi}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
