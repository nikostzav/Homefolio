import ProfileNavbar from "../Components/ProfileNavbar";
import Navbar from "../Components/Navbar";
import SearchBar from "../Components/SearchBar";
import img from "../bg2.png";

const Index = () => {
  return (
    <div className="container">
      <div className="container">
        <div className="row">
          <div className="col-6 col-lg-7">
            <Navbar />
          </div>
          <div className="col-6 col-lg-5">
            <ProfileNavbar className="" />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-7">
            <SearchBar />
          </div>
          <div
            className="col-12 col-lg-5 border responsive-side-panel"
            style={{
              backgroundImage: `url(${img})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Index;
