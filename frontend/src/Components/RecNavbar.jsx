import React, { useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation

const RecNavbar = ({
  type,
  setType,
  setMinPrice,
  setMaxPrice,
  lat,
  long,
}) => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setType(params.get("type") || "rent");
    setMinPrice(params.get("minPrice") || "");
    setMaxPrice(params.get("maxPrice") || "");
  }, [location]);

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
        </div>
      </div>
    </div>
  );
};

export default RecNavbar;
