import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const ChangePassword = ({ handleLogout }) => {
  const [username, setUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to change your password?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#A5D56E",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, change it!",
    });
    if (result.isConfirmed) {
      try {
        const response = await axios.post(
          "http://localhost:8082/api/users/change-password",
          null,
          {
            params: { username, newPassword },
          }
        );
        if (response.status === 200) {
          // alert("Password changed successfully!");
          Swal.fire("Password changed successfully!");
          handleLogout();
          navigate("/login");
          
        }
      } catch (error) {
        // alert("Failed to change password");
        Swal.fire("Failed to change password");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label>New Password</label>
          <input
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;
