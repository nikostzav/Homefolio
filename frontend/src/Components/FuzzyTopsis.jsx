import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Map from "../Components/map/Map";
import ListCard from "./ListCard";
import { fuzzyTopsis, buildPreferenceItems } from "../utils/fuzzyTopsis";

function FuzzyTOPSIS({
  setLat,
  lat,
  long,
  posts,
  setLong
}) {
  const [rankedData, setRankedData] = useState([]);
  const [user, setUser] = useState(localStorage.getItem("user"));

  const [userPreferences, setUserPreferences] = useState();
  const [preferences, setPreferences] = useState({
    items: [
      { key: "price", behavior: "min" }, // Minimize price
      { key: "bedroom", behavior: "max" }, // Maximize bedroom
      { key: "bathroom", behavior: "max" }, // Maximize bathroom
    ],
  });
  function renderMap(long, lat) {
    return <Map coords={[long, lat]} data2={rankedData} />;
  }

  const id = JSON.parse(user).id;
  useEffect(() => {
    const fetchPreferences = async () => {
      const accessToken = Cookies.get("accessToken");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/preferences/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUserPreferences(response.data); // Set state with fetched preferences
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };

    fetchPreferences();
  }, [id, posts]);

  function rankdata() {
    const ranked = fuzzyTopsis(posts, preferences);
    setRankedData(ranked);
  }

  useEffect(() => {
    if (posts.length > 0) {
      rankdata();
    }
  }, [posts]);

  useEffect(() => {
    if (userPreferences) {
      const items = buildPreferenceItems(userPreferences);
      if (items.length > 0) {
        setPreferences({ items });
      }
    }
  }, [userPreferences, posts]);

  return (
    <div style={{ margin: "20px", fontFamily: "Arial, sans-serif" }}>
      <div
        className="mt-4"
      >
        {rankedData.map((d, index) => (
          <div key={index}
          onClick={() => {
            setLat(d.latitude);
            setLong(d.longitude);
          }}>
            <ListCard
              img={d.images[0]}
              title={d.title}
              price={d.price}
              bedrooms={d.bedroom}
              bathrooms={d.bathroom}
              address={d.address}
              lat={d.latitude}
              long={d.longitude}
              images={d.images}
            />
          </div>
        ))}
      </div>
      {renderMap(lat, long)}
    </div>
  );
}

export default FuzzyTOPSIS;
