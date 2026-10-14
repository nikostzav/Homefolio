import "../styles.css";
import Navbar from "../Components/Navbar";
import ProfileNavbar from "../Components/ProfileNavbar";
import RecNavbar from "../Components/RecNavbar";
import Preferences from "../Components/Preferences";
import Map from "../Components/map/Map";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import FuzzyTOPSIS from "../Components/FuzzyTopsis";
const Recommendation = () => {
  const navigate = useNavigate();
  const [user] = useState(localStorage.getItem("user"));
  const userId = user ? JSON.parse(user).id : null;
  const [userPreferences, setUserPreferences] = useState();

  const [lat, setLat] = useState(38.5);
  const [long, setLong] = useState(21.5);
  const [posts, setPosts] = useState([]);
  const [filterPosts, setFilterPosts] = useState([]);
  const [type, setType] = useState("rent");
  const [property, setProperty] = useState("house");
  const [minPrice, setMinPrice] = useState();
  const [maxPrice, setMaxPrice] = useState();
  const [bedroom, setBedroom] = useState(1);
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    if (!userId) navigate("/login");
  }, [userId]);

  const fetchPreferences = async () => {
    if (!userId) return;
    const accessToken = Cookies.get("accessToken");
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/preferences/${userId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setUserPreferences(response.data);
    } catch (error) {
      console.error("Error fetching preferences:", error);
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, [userId]);

  function renderMap(long, lat) {
    return <Map coords={[long, lat]} data2={filterPosts} />;
  }

  useEffect(() => {
    renderMap(long, lat);
  }, [lat]);

  useEffect(() => {
    res();
  }, []);

  const res = async () => {
    const accessToken = Cookies.get("accessToken");
    await axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/getPosts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // Always filter by type (rent/buy) before ranking - otherwise fuzzy TOPSIS
  // compares rental prices against purchase prices in the same pool, which
  // lets price swamp every other criterion regardless of its weight. City is
  // also a hard filter, not just a ranking criterion: if the user picked a
  // city in the dropdown above, that wins; otherwise fall back to their
  // saved preferred city (when "Consider City" is on) so the recommended
  // list only ever contains that city's listings.
  useEffect(() => {
    const effectiveCity =
      selectedCity || (userPreferences?.city ? userPreferences.preferred_city : "");
    const filterData = posts.filter(
      (item) =>
        (!type || item.type === type) &&
        (!effectiveCity || item.city === effectiveCity)
    );
    setFilterPosts(filterData);
  }, [posts, type, selectedCity, userPreferences]);

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
            <RecNavbar
              posts={posts}
              lat={lat}
              long={long}
              setPosts={setPosts}
              type={type}
              setSelectedCity={setSelectedCity}
              setType={setType}
              property={property}
              setProperty={setProperty}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              bedroom={bedroom}
              setBedroom={setBedroom}
              city={city}
              setCity={setCity}
            />
            <div className="mt-3">
              <Preferences initialPreferences={userPreferences} onSaved={fetchPreferences} />
            </div>
            <div>
              <FuzzyTOPSIS
                setLat={setLat}
                lat ={lat}
                setLong={setLong}
                long ={long}
                posts={filterPosts}
                userPreferences={userPreferences}
              />
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

export default Recommendation;
