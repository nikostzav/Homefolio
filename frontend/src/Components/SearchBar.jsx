import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./styles.css";
const SearchBar = () => {
  const [type, setType] = useState("buy");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    const queryParams = new URLSearchParams({
      type,
      city: selectedCity,
      minPrice,
      maxPrice,
    }).toString();
    navigate(`/list?${queryParams}`); // Redirect to /list with query params
  };

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
    <div className="search-card">
      <div className="search-tabs">
        <button
          type="button"
          className={`search-tab ${type === "buy" ? "active" : ""}`}
          onClick={() => setType("buy")}
        >
          Buy
        </button>
        <button
          type="button"
          className={`search-tab ${type === "rent" ? "active" : ""}`}
          onClick={() => setType("rent")}
        >
          Rent
        </button>
      </div>
      <div className="search-fields">
        <select
          className="form-select"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">Choose a city</option>
          {cities.map((city, index) => (
            <option key={index} value={city.name}>
              {city.city}
            </option>
          ))}
        </select>
        <input
          type="number"
          className="form-control"
          placeholder="Min price"
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          className="form-control"
          placeholder="Max price"
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button className="search-submit" onClick={handleSubmit}>
          <i className="bi bi-search"></i> Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
