import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./NavBar";
// import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import RentalForm from "./RentalForm";
import Employee from "./Employee";
import RentalDetails from "./RentalDetails";
import StockDetails from "./StockDetails";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import ChangePassword from "./ChangePassword";
import Swal from "sweetalert2";
import Home from './Home';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    if (authStatus) {
      setIsAuthenticated(JSON.parse(authStatus));
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", true);
  };

  const handleLogout = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        setIsAuthenticated(false);
        localStorage.removeItem("isAuthenticated");
        Swal.fire("Logged Out!", "You have been logged out.", "success");
      }
    });

  };
  return (
    <Router>
      <NavBar isAuthenticated={isAuthenticated} handleLogout={handleLogout} />
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/login" element={<SignIn handleLogin={handleLogin} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/change-password"
          element={<ChangePassword handleLogout={handleLogout} />}
        />

        {/* <Route path="/rentalform" element={<RentalForm />}/>
        <Route path="/rentaldetails" element={<RentalDetails />} />
        <Route path="/stockdetails" element={<StockDetails />} />
        <Route path="/employeedetails" element={<Employee />} /> */}

        {isAuthenticated && (
          <>
            <Route path="/rentalform" element={<RentalForm />} />
            <Route path="/rentaldetails" element={<RentalDetails />} />
            <Route path="/stockdetails" element={<StockDetails />} />
            <Route path="/employeedetails" element={<Employee />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
