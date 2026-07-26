import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const RegisterUser = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [criteria, setCriteria] = useState({
    bedroom: false,
    bathroom: false,
    price: false,
  });
  const handleCriteriaChange = (key) => {
    setCriteria((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Preferences
 ;

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!username || !email || !password) {
      setError("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        username,
        password,
        email,
        criteria
      });

      if (!res.data.message) {
        navigate("/login");
      } else {
        setError(res.data.message || "Registration failed. Try again.");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred while registering. Please try again.");
    } finally {
      setLoading(false);
    }

    
  };

  return (
    <div
      className="container d-flex flex-column justify-content-between"
      style={{ minHeight: "100vh" }}
    >
      <div className="container-fluid mt-5 d-flex justify-content-center flex-column gap-4 align-items-center">
          <div className="container d-flex flex-column gap-3" style={{ width: "100%", maxWidth: "420px" }}>
          <div className="h2">Create an Account</div>
          
            <input
              className="form-control"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="form-control"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="form-control"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="form-control"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {error && (
              <div className="alert alert-danger text-center">{error}</div>
            )}
            
          </div>
      <div className="container d-flex flex-column gap-3" style={{ width: "100%", maxWidth: "420px" }}>
          <div className="h5">Set Your Preferences</div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="bedroom"
              checked={criteria.bedroom}
              onChange={() => handleCriteriaChange("bedroom")}
            />
            <label className="form-check-label" htmlFor="bedroom">
              Consider Number of Bedrooms
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="bathroom"
              checked={criteria.bathroom}
              onChange={() => handleCriteriaChange("bathroom")}
            />
            <label className="form-check-label" htmlFor="bathroom">
              Consider Number of Bathrooms
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="price"
              checked={criteria.price}
              onChange={() => handleCriteriaChange("price")}
            />
            <label className="form-check-label" htmlFor="price">
              Consider Price
            </label>
          </div>
          <button
              className="btn btn-success"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <Link to="/login">
              <p className="text-start">
                <u>Already have an account?</u>
              </p>
            </Link>
        </div>
    </div>
    </div>
  );
};

export default RegisterUser;
