import "../styles.css";
import Navbar from "../Components/Navbar";
import ProfileNavbar from "../Components/ProfileNavbar";
import RecNavbar from "../Components/RecNavbar";
import Map from "../Components/map/Map";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import axios from "axios";
import FuzzyTOPSIS from "../Components/FuzzyTopsis";
const Recommendation = () => {
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

  function renderMap(long, lat) {
    return <Map coords={[long, lat]} data2={filterPosts.length > 0 ? filterPosts : posts} />;
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
  useEffect(() => {
    if (selectedCity) {
      const handleFilter = () => {
        const filterData = posts.filter((item) => item.city === selectedCity);
        setFilterPosts(filterData);
      };
      handleFilter();
    }
  }, [selectedCity]);

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
            <div>
              <FuzzyTOPSIS
                setLat={setLat}
                lat ={lat}
                setLong={setLong}
                long ={long}
                posts={filterPosts.length > 0 ? filterPosts : posts}
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
