import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom"; // Import useLocation

const RecNavbar = ({
  type,
  setType,
  setMinPrice,
  setMaxPrice,
  setSelectedCity,
  city,
  lat,
  long,
  setCity,
}) => {
  const location = useLocation();
  const [cities, setCities] = useState([]);
 

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setType(params.get("type") || "rent");
    setCity(params.get("city") || "");
    setMinPrice(params.get("minPrice") || "");
    setMaxPrice(params.get("maxPrice") || "");
  }, [location]);

  const getCities = async () => {
    const accessToken = Cookies.get("accessToken");
    await axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/getCities`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setCities(response.data);
      });
  };

  useEffect(() => {
    getCities();
  }, []);

  return (
    <div>
      <div className="container-fluid mt-5">
        <div className="display-6" style={{
              fontSize: "30px"}}>
          Recommendation regarding to your <b>Preference</b>
        </div>
        <div>
          Test lat and long lat : {lat} long : {long}{" "}
        </div>
        <div className="mt-3 d-flex">
          <div className="btn-group mt-1 me-2" role="group" aria-label="Listing type" style={{ height: "55px" }}>
            <button
              type="button"
              className={`btn ${type === "rent" ? "btn-warning" : "btn-outline-warning"}`}
              onClick={() => setType("rent")}
            >
              Rent
            </button>
            <button
              type="button"
              className={`btn ${type === "buy" ? "btn-warning" : "btn-outline-warning"}`}
              onClick={() => setType("buy")}
            >
              Buy
            </button>
          </div>
          <select
            className="form-control mt-1"
            placeholder={city}
            style={{
              fontSize: "16px",
              padding: "10px",
              minWidth: "150px",
              marginRight: "10px",
              height: "55px",
              cursor: "pointer"
            }}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">Choose a City</option>
            {cities.map((city, index) => (
              <option key={index} value={city.name}>
                {city.city}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default RecNavbar;
