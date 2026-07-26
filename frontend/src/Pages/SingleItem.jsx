import { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import ProfileNavbar from "../Components/ProfileNavbar";
import SingleItemContent from "../Components/SingleItem/SinglItemContent";
import SingleListInfo from "../Components/SingleItem/SingleListInfo";
import Cookies from "js-cookie";
import axios from "axios";
import { useParams } from "react-router-dom";

const SingleItem = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [details, setDetails] = useState({});

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/posts/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => setPost(res.data))
      .catch(() => setNotFound(true));

    axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/getDetails/${id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        if (res.data) {
          setDetails(res.data);
        }
      })
      .catch(() => {});
  }, [id]);

  if (notFound) {
    return (
      <div className="container mt-5">
        <Navbar />
        <div className="mt-5 text-center h4">Listing not found.</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mt-5">
        <Navbar />
        <div className="mt-5 text-center h4">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="container bg-light">
        <div className="row">
          <div className="col-6 col-lg-7">
            <Navbar />
          </div>
          <div className="col-6 col-lg-5">
            <ProfileNavbar />
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-lg-7 border">
            <SingleItemContent
              title={post.title}
              address={post.address}
              price={post.price}
              details={details}
              images={post.images}
            />
          </div>
          <div className="col-12 col-lg-5 border bg-warning bg-opacity-25">
            <SingleListInfo
              details={details}
              bedroom={post.bedroom}
              toilet={post.bathroom}
              lat={post.latitude}
              long={post.longitude}
              postId={id}
              receiver={post.userid}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleItem;
