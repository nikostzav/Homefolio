import Navbar from "../Components/Navbar";
import ProfileNavbar from "../Components/ProfileNavbar";
import "../styles.css";
import RegisterUser from "../Components/RegisterUser";
import img from "../bg2.png";
const Main = () => {
  return (
    <div className="container" style={{ overflow: "hidden" }}>
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
          <RegisterUser />
        </div>
        <div
          className="col-12 col-lg-5 border bg-warning bg-opacity-25 responsive-side-panel"
          style={{
            backgroundImage: `url(${img})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Main;
