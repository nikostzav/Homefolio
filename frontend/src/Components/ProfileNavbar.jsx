import { useEffect, useState } from "react";
import "../styles.css";
import { Link } from "react-router-dom";
import { Header } from "./Header";
import Cookies from "js-cookie";
import { cloudinaryResize } from "../lib/cloudinary";

import img from "../no_avatar.png";
const ProfileNavbar = (props) => {
  const [user, setUser] = useState(null);

  const accessToken = Cookies.get("accessToken");
  // await axios
  //   .get(`${process.env.REACT_APP_API_URL}/api/auth/posts/${id}`, )

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Get user ID (or token) from localStorage — just the ID, not the full user object
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser || !storedUser.id) return;

        // Fetch user from database via backend API
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/users/${storedUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );
        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };

    fetchUser();
  }, []); // run only once on mount

  return (
    <div
      className="d-flex flex-row-reverse flex-wrap gap-1 align-items-center bg-light rounded"
      style={{ minHeight: "50px" }}
    >
      {user && !props.loginPage ? (
        <>
          <Link to="/profile">
            <div className="btn btn-outline-warning mx-1 mx-md-3 text-dark">
              Profile
            </div>
          </Link>
          <div className="fs-4 d-none d-md-block">{user.username}</div>
          <div
            className="mx-1 mx-md-3 relative"
            style={{
              backgroundImage: `url(${cloudinaryResize(user.avatar, { width: 100, height: 100 }) || img})`,
              width: "35px",
              height: "35px",
              backgroundSize: "100% 100%",
              borderRadius: "50%",
              border: "1px solid black",
              flexShrink: 0,
            }}
          >
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          <div className="d-none d-md-block">
            <Header />
          </div>
        </>
      ) : (
        <>
          <Link to="/login">
            <div className="btn btn-warning mx-1 mx-md-3 px-2 px-md-3">Sign in</div>
          </Link>
          <Link to="/register">
            <div className="mx-1 mx-md-3 btn btn-outline-warning text-dark px-2 px-md-3">
              Sign up
            </div>
          </Link>
        </>
      )}
    </div>
  );
};

export default ProfileNavbar;
