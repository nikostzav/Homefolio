import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";

const ListNavbar = ({
  type,
  setType,
  property,
  setProperty,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  bedroom,
  setBedroom,
  selectedCity,
  setSelectedCity,
}) => {
  const [cities, setCities] = useState([]);
  const [hasPreferences, setHasPreferences] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const id = user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!id) return;
      const accessToken = Cookies.get("accessToken");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/preferences/${id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setHasPreferences(!Object.values(response.data).every((v) => v === false));
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };
    fetchPreferences();
  }, [id]);

  const getCities = async () => {
    const accessToken = Cookies.get("accessToken");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/getCities`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    getCities();
  }, []);

  return (
    <div>
      <div className="container-fluid mt-4">
        <div className="fs-5 fw-semibold mb-2">
          Search Results for <b>{selectedCity || "All Cities"}</b>
        </div>

        {hasPreferences && (
          <button
            className="btn btn-success btn-sm d-flex align-items-center px-3 py-2 mb-3"
            onClick={() => navigate("/recommended")}
          >
            Go To Recommended
          </button>
        )}

        {/* Filters Row */}
        <div
          className="d-flex align-items-center flex-wrap gap-2 bg-light p-2 rounded"
          style={{ fontSize: "14px" }}
        >
          {/* City */}
          <select
            className="form-select"
            style={{
              width: "130px",
              fontSize: "13px",
              height: "38px",
            }}
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">All</option>
            {cities.map((city, index) => (
              <option key={index} value={city.city}>
                {city.city}
              </option>
            ))}
          </select>

          {/* Type */}
          <DropdownButton
            variant="light"
            size="sm"
            title={type || "Type"}
            id="dropdown-type"
            className="small-dropdown"
          >
            <Dropdown.Item onClick={() => setType("rent")}>Rent</Dropdown.Item>
            <Dropdown.Item onClick={() => setType("buy")}>Buy</Dropdown.Item>
          </DropdownButton>

          {/* Property */}
          <DropdownButton
            variant="light"
            size="sm"
            title={property || "Property"}
            id="dropdown-property"
          >
            <Dropdown.Item onClick={() => setProperty("apartment")}>
              Apartment
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setProperty("house")}>
              House
            </Dropdown.Item>
          </DropdownButton>

          {/* Min Price */}
          <input
            className="form-control"
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{
              width: "100px",
              fontSize: "13px",
              height: "38px",
            }}
          />

          {/* Max Price */}
          <input
            className="form-control"
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{
              width: "100px",
              fontSize: "13px",
              height: "38px",
            }}
          />

          {/* Bedrooms */}
          <input
            className="form-control"
            type="number"
            placeholder="Bedrooms"
            value={bedroom}
            onChange={(e) => setBedroom(e.target.value)}
            style={{
              width: "100px",
              fontSize: "13px",
              height: "38px",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ListNavbar;
