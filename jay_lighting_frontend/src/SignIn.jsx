import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "./SignIn.css";

const SignIn = ({ handleLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8082/api/users/login",
        {
          username,
          password,
        }
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Welcome!",
          text: "Successfully logged in to the Rental Management System",
          showConfirmButton: false,
          timer: 1500,
        });
        handleLogin();
        navigate("/rentalform");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Please check your credentials and try again",
      });
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <div className="signin-header">
          <h2>Welcome</h2>
          <p>Please sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="signin-form">
          <div className="form-group">
            <label>
              <i className="fas fa-user"></i>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label>
              <i className="fas fa-lock"></i>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>
        <div className="signin-footer">
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
