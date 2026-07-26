import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import "./styles.css";
const SearchBar = () => {
  const [buttons, setButtons] = useState(true);
  const [type, setType] = useState("buy");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate();

  function layout1() {
    return (
      <div className="container d-flex flex-start mt-4 ">
        <div
          className="border rounded p-3 px-5 border-black bg-dark text-white"
          style={{ cursor: "pointer", marginRight:"10px" }}
          onClick={(e) => {
            setButtons(false);
            setType("buy");
          }}
        >
          <b>Buy</b>
        </div>
        <div
          className="border rounded p-3 px-5 border-black "
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            setButtons(false);
            setType("rent");
          }}
        >
          <b>rent</b>
        </div>
      </div>
    );
  }

  function layout2() {
    return (
      <div className="container d-flex flex-start mt-4 ">
        <div
          className="border rounded p-3 px-5 border-black "
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            setButtons(true);
            setType("buy");
          }}
        >
          <b>Buy</b>
        </div>
        <div
          className="border rounded p-3 px-5 border-black bg-dark text-white"
          style={{ cursor: "pointer" }}
        >
          <b>rent</b>
        </div>
      </div>
    );
  }

  function checkLayouts() {
    if (buttons) {
      return layout1();
    } else {
      return layout2();
    }
  }

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
  let menuRef = useRef();
  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center text-center"
      style={{ minHeight: "calc(100vh - 52px)" }}
    >
      <div className="h1 text-start display-4">
        <b>Find Real Estate And get your Dream place</b>
      </div>
      {checkLayouts()}
      <div
        ref={menuRef}
        className="container d-flex flex-wrap justify-content-center gap-2"
      >
        <select
          className="form-control mt-1 flex-fill"
          placeholder="Select City"
          style={{
            fontSize: "16px",
            padding: "10px",
            minWidth: "150px",
            maxWidth: "220px",
            height: "55px",
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
        <input
          type="number"
          className="form-control mt-1 flex-fill"
          style={{
            fontSize: "16px",
            padding: "10px",
            minWidth: "120px",
            maxWidth: "220px",
            height: "55px",
          }}
          placeholder="Min Price"
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          className="form-control mt-1 flex-fill"
          style={{
            fontSize: "16px",
            padding: "10px",
            minWidth: "120px",
            maxWidth: "220px",
            height: "55px",
          }}
          placeholder="Max Price"
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button
          className="btn btn-success d-flex align-items-center justify-content-center p-3 mt-1"
          style={{
            fontSize: "16px",
            padding: "10px",
            height: "55px",
          }}
          onClick={handleSubmit}
        >
          <i className="bi bi-search h3"></i>
        </button>
      </div>
      {/* test */}
      <div className="container d-flex flex-wrap justify-content-between mt-5 gap-3">
        <div className="d-flex flex-column text-start">
          <div className="h2">
            <b>16+</b>
          </div>
          <div>
            <em>Years of Experince</em>
          </div>
        </div>
        <div className="d-flex flex-column text-start">
          <div className="h2">
            <b>200</b>
          </div>
          <div>
            <em>Award Gained</em>
          </div>
        </div>
        <div className="d-flex flex-column text-start">
          <div className="h2">
            <b>2000+</b>
          </div>
          <div>
            <em>Property Ready</em>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
