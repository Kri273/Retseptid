import { useState, useEffect } from "react";

function Recipes() {
    const [recipes, setRecipes] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8081/recipes")
            .then(response => response.json())
            .then(data => setRecipes(data))
            .catch(error => console.error("Viga retseptide laadimisel:", error));
    }, []);

    return (
        <div>
            <h2>Retseptid</h2>
            <ul>
                {recipes.map(recipe => (
                    <li key={recipe.ret_id}>
                        <h3>{recipe.name}</h3>
                        <img src={`http://localhost:8081/uploads/${recipe.image}`} alt={recipe.name} width="200" />
                        <p><b>Koostisosad:</b> {recipe.koostisosad}</p>
                        <p><b>Retsept:</b> {recipe.retsept}</p>
                        <p><i>Lisatud: {recipe.kasutajanimi}</i></p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Recipes;
