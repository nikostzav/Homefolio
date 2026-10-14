import { useEffect, useState } from "react";
import Map from "../Components/map/Map";
import ListCard from "./ListCard";
import { fuzzyTopsis, buildPreferenceItems } from "../utils/fuzzyTopsis";

function FuzzyTOPSIS({
  setLat,
  lat,
  long,
  posts,
  setLong,
  userPreferences,
}) {
  const [rankedData, setRankedData] = useState([]);

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

  function rankdata() {
    const ranked = fuzzyTopsis(posts, preferences);
    setRankedData(ranked);
  }

  // Depends on `preferences` too, not just `posts` - otherwise saving new
  // weights/criteria wouldn't re-rank until the post list itself changed.
  useEffect(() => {
    if (posts.length > 0) {
      rankdata();
    }
  }, [posts, preferences]);

  useEffect(() => {
    if (userPreferences) {
      const items = buildPreferenceItems(userPreferences);
      if (items.length > 0) {
        setPreferences({ items });
      }
    }
  }, [userPreferences]);

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
