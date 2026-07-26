import "../styles.css";
import Navbar from "../Components/Navbar";
import ProfileNavbar from "../Components/ProfileNavbar";
import ListNavbar from "../Components/ListNavbar";
import Map from "../Components/map/Map";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import ListCard from "../Components/ListCard";
import axios from "axios";
import { useLocation } from "react-router-dom";

const List = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  // Read params from URL
  const initialType = queryParams.get("type") || "";
  const initialCity = queryParams.get("city") || "";
  const initialMin = queryParams.get("minPrice") || "";
  const initialMax = queryParams.get("maxPrice") || "";

  const [lat, setLat] = useState(38.5);
  const [long, setLong] = useState(21.5);
  const [data2, setData2] = useState([]); // all data
  const [filteredDataArr, setFilteredDataArr] = useState([]); // filtered data
  const [rankedData, setRankedData] = useState([]); // ranked data
  const [user] = useState(localStorage.getItem("user"));

  // filters (initialized with query params)
  const [type, setType] = useState(initialType);
  const [property, setProperty] = useState("");
  const [minPrice, setMinPrice] = useState(initialMin);
  const [maxPrice, setMaxPrice] = useState(initialMax);
  const [bedroom, setBedroom] = useState("");
  const [selectedCity, setSelectedCity] = useState(initialCity);

  const [userPreferences, setUserPreferences] = useState();
  const [preferences, setPreferences] = useState({
    items: [
      { key: "price", behavior: "min" }, // Minimize price
      { key: "bedroom", behavior: "max" }, // Maximize bedroom
      { key: "bathroom", behavior: "max" }, // Maximize bathroom
    ],
  });

  const id = user ? JSON.parse(user).id : null;

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = Cookies.get("accessToken");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/getPosts`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setData2(response.data);
        setFilteredDataArr(response.data); // show all first
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!id) return;
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
  }, [id]);

  const handleFilter = () => {
    if (!data2 || data2.length === 0) return;

    const filtered = data2.filter((item) => {
      return (
        (!selectedCity || item.city?.toLowerCase() === selectedCity.toLowerCase()) &&
        (!property || item.property === property) &&
        (!bedroom || Number(item.bedroom) >= Number(bedroom)) &&
        (!minPrice || Number(item.price) >= Number(minPrice)) &&
        (!maxPrice || Number(item.price) <= Number(maxPrice)) &&
        (!type || item.type === type)
      );
    });

    setFilteredDataArr(filtered);
  };

  // Refilter automatically when filters change
  useEffect(() => {
    handleFilter();
  }, [selectedCity, bedroom, minPrice, maxPrice, type, property, data2]);

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

  // Apply ranking after filtering and preferences are ready
  useEffect(() => {
    if (filteredDataArr.length > 0 && preferences.items.length > 0) {
      const ranked = fuzzyTopsis(filteredDataArr, preferences);
      setRankedData(ranked);
    } else {
      setRankedData([]);
    }
  }, [filteredDataArr, preferences]);

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
  }, [userPreferences, filteredDataArr]);

  // Determine what to display: ranked if preferences available, otherwise filtered
  const displayData = preferences.items.length > 0 ? rankedData : filteredDataArr;
   function renderMap(long, lat) {
    return <Map coords={[long, lat]} data2={rankedData} />;
  }

  return (
    <div className="container" style={{ minHeight: "100vh" }}>
      <div className="row">
        <div className="col-6 col-lg-7">
          <Navbar />
        </div>
        <div className="col-6 col-lg-5">
          <ProfileNavbar />
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-7">
          <div
            className="text-start mx-3"
            style={{ overflowY: "auto", maxHeight: "100vh" }}
          >
            <ListNavbar
              data2={data2}
              lat={lat}
              long={long}
              handleFilter={handleFilter}
              type={type}
              setType={setType}
              property={property}
              setProperty={setProperty}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              bedroom={bedroom}
              setBedroom={setBedroom}
              selectedCity={selectedCity}
              setSelectedCity={setSelectedCity}
            />

            <div className="mt-4">
              {displayData.length > 0 ? (
                displayData.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => {
                      setLat(d.latitude);
                      setLong(d.longitude);
                    }}
                  >
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
                      redirect={true}
                      id={d.id}
                      receiver={d.userid}
                    />
                  </div>
                ))
              ) : (
                <div className="text-muted mx-3 mt-3">No results found</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-5 border bg-warning bg-opacity-25">
          {renderMap(lat, long)}
        </div>
      </div>
    </div>
  );
};

export default List;