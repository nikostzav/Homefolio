import React, { useEffect, useState } from "react";
import ProfileNavbar from "../Components/ProfileNavbar";
import { useNavigate } from "react-router-dom";
import Change from "../Components/Change";
import Navbar from "../Components/Navbar";
import ChangeProfile from "../Components/ChangeProfile";

function ProfileChange() {
  const navigate = useNavigate();
  const [user] = useState(localStorage.getItem("user"));

  useEffect(() => {
    if (user == null) navigate("/login");
  }, [user]);

  return (
    <div>
      <div className="container">
        <div className="container">
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
              <Change />
            </div>
            <div className="col-12 col-lg-5 border bg-warning bg-opacity-25">
              <ChangeProfile />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileChange;
