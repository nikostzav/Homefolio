import React, { useState } from "react";
import img from "../no_avatar.png";
import UploadWidget from "./uploadWidget/UploadWidget";

function ChangeProfile() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [avatar, setAvatar] = useState(user.avatar || "");
  const changeAvatar = (url) => {
    setAvatar(url);
    user.avatar = url;

    localStorage.setItem("user", JSON.stringify(user));
  };
  return (
    <div
      className="container d-flex flex-column justify-content-center align-items-center gap-4"
      style={{ height: "90vh" }}
    >
      <div
        className=""
        style={{
          height: "200px",
          width: "200px",
          // backgroundImage: `url(${avatar || img})`,
          // backgroundRepeat: "no-repeat",
          // backgroundSize: "contain",
        }}
      >
        <img
          src={avatar || img}
          style={{ height: "100%", width: "100%", objectFit: "contain" }}
        />
      </div>
      <div>
        <UploadWidget
          uwConfig={{
            cloudName: "drcgbkm5u",
            uploadPreset: "estate",
            multiple: false,
            maxImageFileSize: 5000000,
            folder: "avatars",
          }}
          setAvatar={changeAvatar}
        />
      </div>
    </div>
  );
}

export default ChangeProfile;
