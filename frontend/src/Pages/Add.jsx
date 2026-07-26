import { useNavigate } from "react-router-dom";
import AddPost from "../Components/AddPost";
import Navbar from "../Components/Navbar";
import ProfileNavbar from "../Components/ProfileNavbar";
import { useEffect, useState } from "react";
import UploadWidgetMultiple from "../Components/uploadWidget/UploadWidgetMultiple.jsx";

const Add = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  function checkUser() {
    if (localStorage.getItem("user") == null) {
      navigate("/login");
    } else {
      const user = JSON.parse(localStorage.getItem("user"));
      setUsername(user.username);
    }
  }

  const [images, setImages] = useState([]);

  useEffect(() => {
    checkUser();
  }, []);
  return (
    <div>
      <div className="container" style={{ overflowY: "hidden" }}>
        <div className="row">
          <div className="col-6 col-lg-7">
            <Navbar />
          </div>
          <div className="col-6 col-lg-5">
            <ProfileNavbar />
          </div>
        </div>
        <div className="row">
          <div
            className="col-12 col-lg-7"
            style={{ maxHeight: "100vh", overflowY: "auto" }}
          >
            <AddPost images={images} />
          </div>
          <div className="col-12 col-lg-5 border bg-warning bg-opacity-25">
            <div
              className="container border-black d-flex flex-column align-items-center justify-content-center gap-3"
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt=""
                  style={{
                    height: "170px",
                    width: "250px",
                    maxWidth: "100%",
                    borderRadius: "15px",
                  }}
                ></img>
              ))}
              <UploadWidgetMultiple
                uwConfig={{
                  cloudName: "drcgbkm5u",
                  uploadPreset: "estate",
                  multiple: true,
                  maxImageFileSize: 2000000,
                  folder: { username },
                }}
                setState={setImages}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Add;
