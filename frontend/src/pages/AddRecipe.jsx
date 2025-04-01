import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "./form.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddRecipe = ({ onSubmit }) => {
  const [recipe, setRecipe] = useState({
    name: "",
    koostisosad: "",
    retsept: "",
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe({ ...recipe, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setImage(file); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", recipe.name);
    formData.append("image", image);
    formData.append("koostisosad", recipe.koostisosad);
    formData.append("retsept", recipe.retsept);

    const token = localStorage.getItem("token");
    console.log("Token:", token);

    try {
      const res = await axios.post(
        "http://localhost:8081/add-recipe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/home");
    } catch (err) {
      console.log("Error uploading recipe:", err);
      alert("Te ei ole sisse logitud")
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Toidu Nimi</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={recipe.name}
          onChange={handleChange}
          required
          placeholder="Sisesta toidu nimi"
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Pilt toidust</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="mt-2" width="150" />
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Koostisosad</Form.Label>
        <Form.Control
          type="text"
          name="koostisosad"
          value={recipe.koostisosad}
          onChange={handleChange}
          placeholder="Nt. 120g jahu, 1l piima, 100g juustu..."
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Retsept</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          name="retsept"
          value={recipe.retsept}
          onChange={handleChange}
          required
          placeholder="Kirjuta siia retsept.."
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        Lisa Retsept
      </Button>
    </Form>
  );
};

export default AddRecipe;
