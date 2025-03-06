import React from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./NavBar.css";

const NavBar = ({ isAuthenticated, handleLogout }) => {
  return (
    <Navbar expand="lg" className="custom-navbar">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-logo">
          <i className="fas fa-lightbulb"></i>
          Jayawardana Lighting & Sounds
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            {isAuthenticated && (
              <>
                <Nav.Link as={Link} to="/rentalform" className="nav-item">
                  <i className="fas fa-file-alt"></i> Rental Form
                </Nav.Link>
                <Nav.Link as={Link} to="/rentaldetails" className="nav-item">
                  <i className="fas fa-list"></i> Rental Details
                </Nav.Link>
                <Nav.Link as={Link} to="/stockdetails" className="nav-item">
                  <i className="fas fa-boxes"></i> Stock Details
                </Nav.Link>
                <Nav.Link as={Link} to="/employeedetails" className="nav-item">
                  <i className="fas fa-users"></i> Employee Details
                </Nav.Link>
              </>
            )}
          </Nav>
          <Form className="d-flex gap-2">
            {!isAuthenticated && (
              <>
  
                <Button
                  variant="outline-light"
                  as={Link}
                  to="/login"
                  className="auth-btn login"
                >
                  <i className="fas fa-sign-in-alt"></i> Log In
                </Button>
                <Button
                  variant="outline-light"
                  as={Link}
                  to="/signup"
                  className="auth-btn signup"
                >
                  <i className="fas fa-user-plus"></i> Sign Up
                </Button>
              </>
            )}
            {isAuthenticated && (
              <>
                <Button
                  variant="outline-light"
                  as={Link}
                  to="/change-password"
                  className="auth-btn change-pass"
                >
                  <i className="fas fa-key"></i> Change Password
                </Button>
                <Button
                  as={Link}
                  to="/"
                  variant="outline-light"
                  onClick={handleLogout}
                  className="auth-btn logout"
                >
                  <i className="fas fa-sign-out-alt"></i> Logout
                </Button>
              </>
            )}
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
