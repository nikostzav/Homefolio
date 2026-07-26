import { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddPost = ({ images }) => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  useEffect(() => {
    checkForError();
  }, [images]);
  const checkForError = () => {
    if (images.length > 0) {
      setError(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length > 0) {
      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user.id;
      const postData = {
        title: title,
        price: price,
        images: images, // Array of image URLs
        address: address,
        city: city,
        bedroom: bed,
        bathroom: bath,
        latitude: lat,
        longitude: long,
        type: type, // 'buy' or 'rent'
        property: prop, // 'apartment', 'house', etc.
        userId: userId, // Replace with actual user ID from authentication
      };

      const postDetailData = {
        desc: value, // Description from ReactQuill
        utilities: util,
        pet: pet,
        income: income,
        size: size,
        school: school,
        postId: null, // We'll fill this after inserting Post
      };
      try {
        // Insert into Post table first
        const postResponse = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/addPost`,
          postData
        );

        // Get the Post ID from the response
        const postId = postResponse.data.id;

        // Now insert into PostDetail using the Post ID
        postDetailData.postId = postId;
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/auth/addPostDetails`,
          postDetailData
        );

        navigate(`/singleItem/${postId}`);
      } catch (error) {
        console.error("Error inserting Post or Post Details:", error);
        setSubmitError(true);
      }
    } else {
      setError(true);
    }
  };

  const [error, setError] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const [title, setTitle] = useState("");
  const [price, setPrice] = useState();
  const [address, setAddress] = useState("");

  const [city, setCity] = useState("");
  const [bath, setBath] = useState();
  const [bed, setBed] = useState();

  const [lat, setLat] = useState();
  const [long, setLong] = useState();
  const [type, setType] = useState("");

  const [prop, setProp] = useState("");
  const [util, setUtil] = useState("");
  const [pet, setPet] = useState("");

  const [income, setIncome] = useState("");
  const [size, setSize] = useState();
  const [school, setSchool] = useState();

  return (
    <div className="container">
      <div className="container">
        <h2 className="text-start mt-4">Add New Post</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="d-flex flex-wrap justify-content-between gap-2 my-4">
              <div className="flex-fill" style={{ minWidth: "160px" }}>
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  className="form-control"
                  id="title"
                  onChange={(e) => setTitle(e.target.value)}
                  required={true}
                ></input>
              </div>
              <div className="flex-fill" style={{ minWidth: "160px" }}>
                <label htmlFor="price">Price</label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  onChange={(e) => setPrice(e.target.value)}
                  required={true}
                ></input>
              </div>
              <div className="flex-fill" style={{ minWidth: "160px" }}>
                <label htmlFor="address">Address</label>
                <input
                  type="text"
                  className="form-control"
                  id="address"
                  onChange={(e) => setAddress(e.target.value)}
                  required={true}
                ></input>
              </div>
            </div>
            <div className=" mt-4" style={{ height: "300px" }}>
              Description
              <ReactQuill
                theme="snow"
                style={{ height: "200px" }}
                onChange={setValue}
                value={value}
                required={true}
              />
            </div>
            <div className="d-flex flex-wrap justify-content-between gap-2 my-3">
              <div className="flex-fill" style={{ minWidth: "160px" }}>
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  className="form-control"
                  onChange={(e) => setCity(e.target.value)}
                  required={true}
                ></input>
              </div>
              <div className="flex-fill" style={{ minWidth: "160px" }}>
                <label htmlFor="bathroom">Bathroom</label>
                <input
                  type="number"
                  id="bathroom"
                  className="form-control"
                  onChange={(e) => setBath(e.target.value)}
                  required={true}
                ></input>
              </div>
              <div className="flex-fill" style={{ minWidth: "160px" }}>
                <label htmlFor="bedroom">Bedroom</label>
                <input
                  type="number"
                  id="bedroom"
                  className="form-control"
                  onChange={(e) => setBed(e.target.value)}
                  required={true}
                ></input>
              </div>
            </div>
            <div className="d-flex flex-wrap justify-content-between gap-2 my-3">
              <div className="flex-fill" style={{ minWidth: "160px" }}>
                <label htmlFor="latidute">Latidute</label>
                <input
                  type="number"
                  step="any"
                  id="latidute"
                  className="form-control"
                  onChange={(e) => setLat(e.target.value)}
                  required={true}
                ></input>
              </div>
              <div className="flex-fill" style={{ minWidth: "160px" }}>
                <label htmlFor="longitude">Longitude</label>
                <input
                  type="number"
                  step="any"
                  id="longitude"
                  className="form-control"
                  onChange={(e) => setLong(e.target.value)}
                  required={true}
                ></input>
              </div>
              <div className="flex-fill" style={{ minWidth: "160px" }}>
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  className="form-control"
                  defaultValue=""
                  onChange={(e) => setType(e.target.value)}
                  required={true}
                >
                  <option value="" disabled></option>
                  <option value="rent">Rent</option>
                  <option value="buy">Buy</option>
                </select>
              </div>
            </div>
            <div className="d-flex flex-wrap justify-content-between gap-2 my-3">
              <div className="flex-fill" style={{ minWidth: "160px" }}>
                <label htmlFor="property">Property</label>
                <select
                  id="property"
                  className="form-control"
                  defaultValue=""
                  onChange={(e) => setProp(e.target.value)}
                  required={true}
                >
                  <option value="" disabled></option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                </select>
              </div>
              <div className="flex-fill" style={{ minWidth: "160px" }}>
                <label htmlFor="utilities">Utilities</label>
                <input
                  type="text"
                  id="utilities"
                  className="form-control"
                  onChange={(e) => setUtil(e.target.value)}
                  required={true}
                ></input>
              </div>
              <div className="flex-fill" style={{ minWidth: "160px" }}>
                <label htmlFor="pet">Pet Policy</label>
                <input
                  type="text"
                  id="pet"
                  className="form-control"
                  onChange={(e) => setPet(e.target.value)}
                  required={true}
                ></input>
              </div>
            </div>
            <div className="d-flex flex-wrap justify-content-between gap-2 my-3">
              <div className="flex-fill" style={{ minWidth: "160px" }}>
                <label htmlFor="policy">Income Policy</label>
                <input
                  type="text"
                  id="policy"
                  className="form-control"
                  onChange={(e) => setIncome(e.target.value)}
                  required={true}
                ></input>
              </div>
              <div className="flex-fill" style={{ minWidth: "160px" }}>
                <label htmlFor="size">Total size(sqft)</label>
                <input
                  type="number"
                  id="size"
                  className="form-control"
                  onChange={(e) => setSize(e.target.value)}
                  required={true}
                ></input>
              </div>
              <div className="flex-fill" style={{ minWidth: "160px" }}>
                <label htmlFor="school">School</label>
                <input
                  type="number"
                  id="school"
                  className="form-control"
                  onChange={(e) => setSchool(e.target.value)}
                  required={true}
                ></input>
              </div>
            </div>
            {error ? (
              <div className="alert alert-danger">Images are required.</div>
            ) : null}
            {submitError ? (
              <div className="alert alert-danger">
                Something went wrong while creating the post. Please try again.
              </div>
            ) : null}
            <div className="d-flex justify-content-center my-4">
              <button type="submit" className="btn btn-warning my-4 p-3 px-5">
                Add Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPost;
