import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./form.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password1, setPassword1] = useState("");
  const [kasutajanimi, setKasutajanimi] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setKasutajanimi(newEmail ? newEmail.split("@")[0] : "");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== password1) {
      alert("Paroolid ei ühti!");
      return;
    }

    try {
      const signUpResponse = await axios.post("http://localhost:8081/sign-up", {
        kasutajanimi,
        email,
        password,
      });
      console.log("Sign-up successful:", signUpResponse.data);
      alert("Kasutaja loodud! Kasutajanimi: " + kasutajanimi);

      const loginResponse = await axios.post("http://localhost:8081/login", {
        email,
        password,
      });

      console.log("Login response:", loginResponse.data);

      if (loginResponse.data.token && loginResponse.data.username) {
        localStorage.setItem("token", loginResponse.data.token);
        localStorage.setItem("username", loginResponse.data.username);

        navigate("/home");
      } else {
        alert("Login failed after sign-up.");
      }
    } catch (err) {
      console.error("Registreerimisel tekkis viga", err);
      alert("Kasutaja loomisel tekkis viga.");
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Emaili aadress</Form.Label>
        <Form.Control
          type="email"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <Form.Text className="text-muted">
          Me ei jaga su emaili aadressi!
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Parool</Form.Label>
        <Form.Control
          type="password"
          placeholder="Parool"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
        <Form.Label>Sisesta sama parool uuesti</Form.Label>
        <Form.Control
          type="password"
          placeholder="Parool uuesti"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicText">
        <Form.Label>Kasutajanimi</Form.Label>
        <Form.Control
          type="text"
          className="kasutajanimi"
          placeholder="Kasutajanimi"
          value={kasutajanimi}
          onChange={(e) => setKasutajanimi(e.target.value)}
        />
      </Form.Group>

      <p>
        Kasutajanimi: <b>{kasutajanimi}</b>
      </p>

      <Button variant="primary" type="submit">
        Loo konto
      </Button>
      <p>Konto juba olemas? <a href="/login">Logi sisse</a></p>
    </Form>
  );
};

export default SignUp;
