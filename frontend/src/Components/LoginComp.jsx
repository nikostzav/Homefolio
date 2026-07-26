import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';

const LoginComp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const authRequired = location.state?.authRequired;
  const redirectTo = location.state?.from || "/";

  const handleSubmit = async () => {
    try {
      // Validation
      if (!username || !password) {
        setError("Please fill in all fields.");
        return;
      }

      // API Request
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { username, password },
        { 
          withCredentials: true,
          headers: {
            "Content-Type": "application/json", 
          },
        }
      );

      // Handle API Response
      if (response.data.message) {
        setError("Invalid username or password.");
      } else {
        Cookies.set('accessToken', response.data.token, { expires: 7, path: '/' });
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate(redirectTo);
      }
    } catch (err) {
      // Network or Server Error Handling
      if (err.response) {
        setError(err.response.data.message || "An error occurred. Please try again.");
      } else if (err.request) {
        setError("Unable to reach the server. Please check your network.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
      console.error(err);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-between" style={{ minHeight: "100vh" }}>
      <div className="container-fluid mt-5 d-flex justify-content-center flex-column gap-4 align-items-center">
        <div className="h2">Sign In</div>
        <div className="container d-flex flex-column gap-3" style={{ width: "100%", maxWidth: "420px" }}>
          {authRequired && (
            <div className="alert alert-warning text-center">
              You need to be logged in to do that. Please sign in to continue.
            </div>
          )}
          <input
            className="form-control"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="form-control"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="alert alert-danger text-center">{error}</div>}
          <button className="btn btn-success" onClick={handleSubmit}>
            Log In
          </button>
          <Link to="/register">
            <p className="text-start">
              <u>Don't have an account?</u>
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginComp;
