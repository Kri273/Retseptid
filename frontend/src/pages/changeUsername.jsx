import React, { useState } from "react";
import axios from "axios";

const ChangeUsername = ({ userId }) => {
  const [newUsername, setNewUsername] = useState("");

  const handleChangeUsername = async () => {
    try {
      const res = await axios.post("http://localhost:8081/update-username", {
        userId,
        newUsername,
      });
      alert("Kasutajanimi uuendatud! Uus nimi: " + res.data.username);
    } catch (err) {
      console.error("Viga kasutajanime muutmisel", err);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Uus kasutajanimi"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <button onClick={handleChangeUsername}>Muuda kasutajanime</button>
    </div>
  );
};

export default ChangeUsername;
