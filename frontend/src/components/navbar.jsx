import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import './navbar.css'

const Navibar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    window.location.href = '/login';
  };
  
  return (
    <Navbar expand="lg" bg="myColor" id='nav' >
      <Container>
        <Navbar.Brand href="home"> Kodused retseptid</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          </Nav>
          <Nav>
          <Nav.Link href="home">Avaleht</Nav.Link>
          <Nav.Link href="favorites">Lemmikud</Nav.Link>
          {isLoggedIn && (
              <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="tooltip-add-recipe">Lisa retsept</Tooltip>}
            >
              <Button variant="outline-primary" href="add-recipe" className="me-2">
                +
              </Button>
            </OverlayTrigger>
               )}
            {!isLoggedIn ? (
                <Button variant="outline-primary" href="login" className="me-2">Logi sisse</Button>
            ) : (
              <Button variant="danger" onClick={handleLogout}>Logi välja</Button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navibar;