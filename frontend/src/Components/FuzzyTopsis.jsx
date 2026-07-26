import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Map from "../Components/map/Map";
import ListCard from "./ListCard";

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

  // console.log("userpreferences:-", userPreferences)
  // Normalize the data by dividing each value by the maximum value of the attribute
  const normalize = (arr) => {
    const max = Math.max(...arr);
    return arr.map((value) => value / max);
  }

  function fuzzyTopsis(data, preferences) {
    // Normalize the data for each attribute
    const normalizedData = preferences.items.reduce((acc, item) => {
      acc[item.key] = normalize(data.map((d) => d[item.key]));
      
      return acc;
    }, {});
    
    // Ideal Best and Worst Values based on user preferences
    const idealBest = preferences.items.reduce((acc, item) => {
      acc[item.key] =
        item.behavior === "min"
          ? Math.min(...normalizedData[item.key])
          : Math.max(...normalizedData[item.key]);
      return acc;
    }, {});

    const idealWorst = preferences.items.reduce((acc, item) => {
      acc[item.key] =
        item.behavior === "min"
          ? Math.max(...normalizedData[item.key])
          : Math.min(...normalizedData[item.key]);
      return acc;
    }, {});

    // Calculate distances to Ideal Best and Ideal Worst
    const calculateDistance = (item, ideal) => {
      return Math.sqrt(
        preferences.items.reduce((sum, pref) => {
          return sum + Math.pow(item[pref.key] - ideal[pref.key], 2);
        }, 0)
      );
    };

    const distances = data.map((item, index) => {
      const normalizedItem = preferences.items.reduce((acc, pref) => {
        acc[pref.key] = normalizedData[pref.key][index];
        return acc;
      }, {});

      return {
        ...item,
        distanceToBest: calculateDistance(normalizedItem, idealBest),
        distanceToWorst: calculateDistance(normalizedItem, idealWorst),
      };
    });


    // Calculate Closeness and Rank the Properties
    const calculateCloseness = (best, worst) => {
      return worst / (best + worst);
    };

    return distances
      .map((item) => ({
        ...item,
        closeness: calculateCloseness(
          item.distanceToBest,
          item.distanceToWorst
        ),
      }))
      .sort((a, b) => b.closeness - a.closeness); // Sort by descending closeness
  }

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
      const filterItems = () => {
        const filteredItems = preferences.items.filter((item) => {
          return userPreferences[item.key];
        });
        if(filteredItems.length > 0){
        setPreferences({
        
          items: filteredItems,
        });}
      };
      filterItems();
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
