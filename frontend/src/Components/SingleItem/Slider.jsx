import { useEffect, useState } from "react";
import { cloudinaryResize } from "../../lib/cloudinary";
import "./slider.css";
const Slider = ({ images }) => {
  const [imageIndex, setImageIndex] = useState(null);

  // function changeSlide(direction) {
  //   if (direction === "left") {
  //     if (imageIndex === 0) {
  //       setImageIndex(images.length - 1);
  //     } else {
  //       setImageIndex(imageIndex - 1);
  //     }
  //   } else {
  //     if (imageIndex === images.length) {
  //       setImageIndex(0);
  //     } else {
  //       setImageIndex(imageIndex + 1);
  //     }
  //   }
  // }

  const rightArrowClicked = () => {
    if (imageIndex < images.length - 1) {
      setImageIndex(imageIndex + 1);
    } else {
      setImageIndex(0);
    }
  };

  const leftArrowClicked = () => {
    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1);
    } else {
      setImageIndex(images.length - 1);
    }
  };
  useEffect(() => {
    if (imageIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [imageIndex]);

  return (
    <div className="slider my-5">
      {imageIndex !== null && (
        <div className="fullSlider">
          <div className="arrow" onClick={leftArrowClicked}>
            <i className="bi bi-caret-left-fill"></i>
          </div>
          <div className="imgContainer">
            <img src={cloudinaryResize(images[imageIndex], { width: 1600 })} alt=""></img>
          </div>
          <div className="arrow" onClick={rightArrowClicked}>
            <i className="bi bi-caret-right-fill"></i>
          </div>
          <div className="close" onClick={() => setImageIndex(null)}>
            X
          </div>
        </div>
      )}
      <div className="bigImage">
        {images && (
          <img
            src={cloudinaryResize(images[0], { width: 800, height: 450 })}
            alt=""
            onClick={() => setImageIndex(0)}
          ></img>
        )}
      </div>
      <div className="smallImages">
        {images.slice(1).map((image, index) => {
          return (
            <img
              src={cloudinaryResize(image, { width: 300, height: 140 })}
              key={index}
              alt=""
              loading="lazy"
              onClick={() => setImageIndex(index + 1)}
            ></img>
          );
        })}
      </div>
    </div>
  );
};

export default Slider;
