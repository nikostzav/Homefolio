import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Change() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      console.error("No user found in localStorage");
      return;
    }

    setLoading(true);
    setUsernameError(false);

    try {
      // Collect fields to update
      const updates = { id: user.id };

      if (username) updates.username = username;
      if (email) updates.email = email;
      if (password) updates.password = password;
      if (user.avatar) updates.avatar = user.avatar;

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/updateProfile`,
        updates,
        { withCredentials: true }
      );

      if (res.data.message === "ok") {
        // Update localStorage user data
        const updatedUser = { ...user, ...updates };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        navigate("/profile");
      } else if (res.data.message === "username_exists") {
        setUsernameError(true);
      } else {
        console.error("Unexpected response:", res.data);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      if (error.response?.data?.message === "username_exists") {
        setUsernameError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container align-items-center d-flex flex-column justify-content-center gap-3"
      style={{ height: "90vh" }}
    >
      <div className="h3">
        <b>Update Profile</b>
      </div>

      <div>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          className="form-control"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter new username"
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter new email"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
        />
      </div>

      {usernameError && (
        <div className="alert alert-danger mt-2">
          Username already exists, choose another one
        </div>
      )}

      <button
        className="btn btn-warning mt-3"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </div>
  );
}

export default Change;
