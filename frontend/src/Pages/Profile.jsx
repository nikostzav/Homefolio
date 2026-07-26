import Navbar from "../Components/Navbar";
import ProfileNavbar from "../Components/ProfileNavbar";
import "../styles.css";
import ProfilePreview from "../Components/ProfilePreview";
import MessagesProfile from "../Components/MessagesProfile";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const [user] = useState(localStorage.getItem("user"));
  useEffect(() => {
    if (user == null) navigate("/login");
  }, [user]);

  return (
    <div className="container">
      <div className="conatiner">
        <div className="row">
          <div className="col-6 col-lg-7">
            <Navbar />
          </div>
          <div className="col-6 col-lg-5">
            <ProfileNavbar />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-7 ">
            <ProfilePreview />
          </div>
          <div className="col-12 col-lg-5 border bg-warning bg-opacity-25">
            <MessagesProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
