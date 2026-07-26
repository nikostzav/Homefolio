import Slider from "./Slider";
import Parser from "html-react-parser";
import { cloudinaryResize } from "../../lib/cloudinary";
const SingleItemContent = (props) => {
  return (
    <div className="container">
      <Slider images={props.images} />
      <div className="d-flex flex-column flex-md-row mx-2 mx-md-5 gap-3">
        <div className="container d-flex flex-column gap-4">
          <div className="h1">{props.title}</div>
          <div className="d-flex p-2 gap-2">
            <i className="bi bi-geo-alt"></i>
            {props.address}
          </div>
          <div className="d-flex bg-warning justify-content-center rounded h6 align-items-center p-2" style={{ width: "fit-content", paddingLeft: "1rem", paddingRight: "1rem" }}>
            {props.price} $
          </div>
        </div>
        <div className="bg-warning bg-opacity-25 d-flex rounded justify-content-center px-4 py-3 mt-2 mx-0 mx-md-5 flex-column gap-2">
          <div>
            <img
              src={cloudinaryResize(props.details.avatar, { width: 300, height: 200 })}
              alt={props.details.username}
              loading="lazy"
              style={{
                width: "150px",
                height: "100px",
                maxWidth: "100%",
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid black",
                display: "block",
                margin: "0 auto"
              }}
            />
          </div>
          <div className="text-center h5 mt-2">{props.details.username}</div>
        </div>
      </div>
      <div className="m-5">{Parser(String(props.details.description))}</div>
    </div>
  );
};

export default SingleItemContent;
