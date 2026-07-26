import { useEffect } from "react";
import LoginComp from "../Components/LoginComp";
import Navbar from "../Components/Navbar";
import ProfileNavbar from "../Components/ProfileNavbar";
import img from "../bg2.png";
import axios from "axios";

const Login = () => {
  const logout = async () => {
    localStorage.clear();
    await axios.post(
      `${process.env.REACT_APP_API_URL}/api/auth/logout`,
      {},
      { withCredentials: true }
    );
  };
  useEffect(() => {
    logout();
  }, [logout]);
  return (
    <div className="container">
      <div className="row">
        <div className="col-6 col-lg-7">
          <Navbar />
        </div>
        <div className="col-6 col-lg-5">
          <ProfileNavbar loginPage={true} />
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-7">
          <LoginComp />
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

export default Login;
