import React from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./form.css";
import { useState } from "react";
import axios from 'axios'
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  

const handleSubmit = async (event) => {
  event.preventDefault();
  try {
      const response = await axios.post("http://localhost:8081/login", {
        email,
        password,
      });

      console.log("Serveri vastus:", response.data); 


      if (response.data.token && response.data.username) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("userId", response.data.userId);
        setMessage("Login successful! Token saved.");
        navigate("/home");
        window.location.reload();
  
      } else {
        setMessage(response.data || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("An error occurred during login.");
    }
  };


  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Sisestage emaili aadress:</Form.Label>
        <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
            required/>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Sisestage parool:</Form.Label>
        <Form.Control type="password" placeholder="Parool" value={password} onChange={(e) => setPassword(e.target.value)}
            required/>
      </Form.Group>
      <Button variant="primary" type="submit">
        Logi sisse
      </Button>
        <p>Pole kontot? <a href="/sign-up">Loo konto</a></p>
    </Form>
  );
};

export default Login;
