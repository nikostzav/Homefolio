import ListCard from "./ListCard";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { cloudinaryResize } from "../lib/cloudinary";

const ProfilePreview = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const handleLogout = async () => {
    await axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/auth/logout`,
        { withCredentials: true }
      )
      .then(() => {
        localStorage.clear();
        navigate("/login");
      });
  };

  const [user] = useState(localStorage.getItem("user"));
  const [savedPosts, setSavedPostsId] = useState([]);

  const getPosts = async () => {
    const id = JSON.parse(user).id;
    const accessToken = Cookies.get("accessToken");
    await axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/getUserPost/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        setPosts(response.data);
      })
      .catch((err) => console.error(err));
  };

  const getSavedPosts = async () => {
    const id = JSON.parse(user).id;
    const accessToken = Cookies.get("accessToken");
    await axios
      .post(`${process.env.REACT_APP_API_URL}/api/auth/getSavedPosts`, 
        {id: id},
        {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      },
      )
      .then((res) => {
        setSavedPostsId(res.data);

      });
  };

  useEffect(() => {
    getPosts();
    getSavedPosts();
  }, []);

  return (
    <div style={{ overflowY: "scroll", maxHeight: "100vh" }}>
      <div className="d-flex justify-content-between align-items-center">
        <div className="mt-3 mx-5 fs-2">User Information</div>
        <Link to="/profileChange">
          <div className="btn mx-3 mt-3 btn-warning">Update Profile</div>
        </Link>
      </div>
      <div className="mt-5 d-flex flex-column gap-3 text-start mx-5 ">
        <div className="d-flex gap-3 align-items-center ">
          <div>Avatar :</div>

          {JSON.parse(user).avatar ? (
            <div
              className="border border-black "
              style={{
                borderRadius: "50%",
                height: "60px",
                width: "60px",
                backgroundImage: `url(${cloudinaryResize(JSON.parse(user).avatar, { width: 200, height: 200 })})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
              }}
            ></div>
          ) : (
            <i className="bi bi-bootstrap mx-2"></i>
          )}
        </div>
        <div className="d-flex gap-1 align-items-center">
          Username :{" "}
          <h6 className="font-italic mx-3 mt-2 ">
            {user ? JSON.parse(user).username : null}
          </h6>
        </div>
        <div className="d-flex gap-1 align-items-center">
          Email :{" "}
          <h6 className="font-italic mx-3  mt-2 ">
            {user ? JSON.parse(user).email : null}
          </h6>
        </div>

        <div>
          <div className="btn btn-secondary px-4" onClick={handleLogout}>
            Logout
          </div>
        </div>
        <div className="mt-4">
          <div className="d-flex justify-content-between">
            <div className="fs-1">My List</div>
            <Link to="/add">
              <div className="btn btn-warning fs-5 p-3">Create New</div>
            </Link>
          </div>
        </div>
        <div>
          {posts.map((d, index) => {
            return (
              <ListCard
                key={index}
                img={d.images[0]}
                title={d.title}
                price={d.price}
                bedrooms={d.bedroom}
                bathrooms={d.bathroom}
                address={d.address}
                images={d.images}
                lat={d.latitude}
                long={d.longitude}
                redirect={true}
                id={d.id}
                receiver={d.userid}
              />
            );
          })}
        </div>
        <div className="fs-1">Saved Posts</div>
        {savedPosts.map((post, index) => {
          return (
            <ListCard
              key={index}
              img={post.images[0]}
              title={post.title}
              price={post.price}
              bedrooms={post.bedroom}
              bathrooms={post.bathroom}
              address={post.address}
              images={post.images}
              lat={post.latitude}
              long={post.longitude}
              redirect={true}
              id={post.id}
              receiver={post.userid}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProfilePreview;
