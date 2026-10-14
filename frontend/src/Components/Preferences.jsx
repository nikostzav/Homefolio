import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const WEIGHT_OPTIONS = [
  { value: "low", label: "Low importance" },
  { value: "medium", label: "Medium importance" },
  { value: "high", label: "High importance" },
  { value: "very_high", label: "Very high importance" },
];

const DEFAULT_STATE = {
  price: false,
  priceWeight: "medium",
  bedroom: false,
  bedroomWeight: "medium",
  bathroom: false,
  bathroomWeight: "medium",
  city: false,
  cityWeight: "medium",
  preferredCity: "",
};

function Preferences({ initialPreferences, onSaved }) {
  const [user] = useState(localStorage.getItem("user"));
  const [state, setState] = useState(DEFAULT_STATE);
  const [cities, setCities] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = user ? JSON.parse(user).id : null;
  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${Cookies.get("accessToken")}` },
  });

  // The parent page owns fetching (and refetching after a save), so the
  // form just mirrors whatever it's handed - one GET, shared with the ranker.
  useEffect(() => {
    if (!initialPreferences) return;
    setState({
      price: !!initialPreferences.price,
      priceWeight: initialPreferences.price_weight || "medium",
      bedroom: !!initialPreferences.bedroom,
      bedroomWeight: initialPreferences.bedroom_weight || "medium",
      bathroom: !!initialPreferences.bathroom,
      bathroomWeight: initialPreferences.bathroom_weight || "medium",
      city: !!initialPreferences.city,
      cityWeight: initialPreferences.city_weight || "medium",
      preferredCity: initialPreferences.preferred_city || "",
    });
  }, [initialPreferences]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/getCities`, authHeaders())
      .then((res) => setCities(res.data))
      .catch((error) => console.error("Error fetching cities:", error));
  }, []);

  const toggle = (key) => setState((prev) => ({ ...prev, [key]: !prev[key] }));
  const setField = (key, value) => setState((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!userId) return;
    setLoading(true);
    setStatus("");
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/preferences/${userId}`,
        state,
        authHeaders()
      );
      setStatus("saved");
      onSaved?.();
    } catch (error) {
      console.error("Error saving preferences:", error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column gap-3" style={{ maxWidth: "420px" }}>
      <div className="h5">Recommendation Preferences</div>
      <p className="text-muted" style={{ fontSize: "14px" }}>
        Pick which criteria matter to you and how much - this drives the
        ranking on the Recommended and Listings pages.
      </p>

      {[
        { key: "price", label: "Consider Price" },
        { key: "bedroom", label: "Consider Number of Bedrooms" },
        { key: "bathroom", label: "Consider Number of Bathrooms" },
      ].map(({ key, label }) => (
        <div key={key} className="d-flex align-items-center gap-2">
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`pref-${key}`}
              checked={state[key]}
              onChange={() => toggle(key)}
            />
            <label className="form-check-label" htmlFor={`pref-${key}`}>
              {label}
            </label>
          </div>
          {state[key] && (
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={state[`${key}Weight`]}
              onChange={(e) => setField(`${key}Weight`, e.target.value)}
              aria-label={`${label} importance`}
            >
              {WEIGHT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}
        </div>
      ))}

      <div className="d-flex align-items-center gap-2 flex-wrap">
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id="pref-city"
            checked={state.city}
            onChange={() => toggle("city")}
          />
          <label className="form-check-label" htmlFor="pref-city">
            Consider City
          </label>
        </div>
        {state.city && (
          <>
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={state.preferredCity}
              onChange={(e) => setField("preferredCity", e.target.value)}
              aria-label="Preferred city"
            >
              <option value="">Choose a city</option>
              {cities.map((c, index) => (
                <option key={index} value={c.city}>
                  {c.city}
                </option>
              ))}
            </select>
            <select
              className="form-select form-select-sm"
              style={{ width: "auto" }}
              value={state.cityWeight}
              onChange={(e) => setField("cityWeight", e.target.value)}
              aria-label="Consider City importance"
            >
              {WEIGHT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {status === "saved" && (
        <div className="alert alert-success py-2 mb-0">Preferences saved.</div>
      )}
      {status === "error" && (
        <div className="alert alert-danger py-2 mb-0">
          Could not save preferences. Try again.
        </div>
      )}

      <button className="btn btn-success" onClick={handleSubmit} disabled={loading}>
        {loading ? "Saving..." : "Save Preferences"}
      </button>
    </div>
  );
}

export default Preferences;
