import SingleItemMap from "../map/SingleItemMap.jsx";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import ChatBox from "../ChatBox.jsx";

const SingleListInfo = (props) => {
  function renderMap(long, lat) {
    return (
      <SingleItemMap
        coords={[long, lat]}
        data2={[]}
        lat={props.lat}
        long={props.long}
      />
    );
  }
  const navigate = useNavigate();
  const location = useLocation();
  const [chat, setChat] = useState(false);
  const storedUser = localStorage.getItem("user");
  const userId = storedUser ? JSON.parse(storedUser).id : null;
  const [saved, setSaved] = useState(null);
  const [chatid, setChatid] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [chatRooms, setChatRooms] = useState([]);

  const requireLogin = () => {
    navigate("/login", {
      state: {
        authRequired: true,
        from: location.pathname,
      },
    });
  };

  const savePost = async (action) => {
    try {
      const accessToken = Cookies.get("accessToken");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/savePost`,
        {
          postId: props.postId,
          action: action,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        setSaved(action === "save" ? true : false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const checkIfIsSaved = async () => {
    try {
      const accessToken = Cookies.get("accessToken");
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/checkIfSaved`,
        {
          postId: props.postId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.message === "saved") {
        setSaved(true);
      } else {
        setSaved(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) {
      checkIfIsSaved();
    }
  }, []);

  const toggleSave = () => {
    if (!userId) {
      requireLogin();
      return;
    }
    if (saved === true) {
      savePost("remove");
    } else {
      savePost("save");
    }
  };

  const messageClicked = async () => {
    if (!userId) {
      requireLogin();
      return;
    }
    if (!chat) {
      // Opening chat: find or prepare room for this receiver
      const chatRoom = chatRooms.find(chat =>
  (String(chat.user1) === String(userId) && String(chat.user2) === String(props.receiver)) ||
  (String(chat.user1) === String(props.receiver) && String(chat.user2) === String(userId))
);
      if (chatRoom) {
        setCurrentRoom(chatRoom.chat_id);
        setChatid(chatRoom.chat_id);
      } else {
        setCurrentRoom(null);
        setChatid(null);
      }
    }
    // Always toggle chat visibility
    setChat(!chat);
  };

  const res = async () => {
    const accessToken = Cookies.get("accessToken")
    await axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/userchats/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {

        setChatRooms(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (userId) {
      res();
    }
  }, []);

  return (
    <div className="container">
      <h4 className="mt-5">General</h4>
      <div className="container d-flex flex-column bg-light rounded border mt-4">
        <div className="d-flex gap-3 mt-2">
          <div className="d-flex flex-column justify-content-center">
            <i className="bi bi-tools h4"></i>
          </div>
          <div className="d-flex flex-column">
            <div>
              <b>Utilities</b>
            </div>
            <div>{props.details.utilities}</div>
          </div>
        </div>
        <div className="d-flex gap-3 mt-4">
          <div className="d-flex flex-column justify-content-center">
            <i className="bi bi-tencent-qq h4"></i>
          </div>
          <div className="d-flex flex-column">
            <div>
              <b>Pet Policy</b>
            </div>
            <div>{props.details.pet}</div>
          </div>
        </div>
        <div className="d-flex gap-3 mt-4 mb-4">
          <div className="d-flex flex-column justify-content-center">
            <i className="bi bi-house-gear-fill h4"></i>
          </div>
          <div className="d-flex flex-column">
            <div>
              <b>Property Fees</b>
            </div>
            <div className="fs-6">{props.details.income}</div>
          </div>
        </div>
      </div>
      <div className="h4 mt-3">Room sizes</div>
      <div className="container d-flex flex-wrap justify-content-between gap-4 mt-4">
        <div className="d-flex gap-2 align-items-center bg-light rounded border justify-content-center p-1">
          <div>
            <i className="bi bi-code-square h3"></i>
          </div>
          <div className="fs-5">{props.details.size}</div>
        </div>
        <div className="bg-light rounded border fs-5 d-flex justify-content-center align-items-center gap-2 p-1">
          <i className="bi bi-truck-flatbed h4"></i>
          {props.bedroom} Bedrooms
        </div>
        <div className="bg-light rounded border fs-5 d-flex align-items-center gap-2 justify-content-center p-1">
          <i className="bi bi-bezier h4"></i>
          {props.toilet} Toilets
        </div>
      </div>
      <div className="h4 mt-4">Nearby Places</div>
      <div className="container bg-light rounded border d-flex flex-wrap justify-content-between p-3 mt-4">
        <div className="m-2 d-flex gap-2 align-items-center">
          <i className="bi bi-building h4"></i>
          <div className="d-flex flex-column gap-0">
            <div className="h5 mb-0">School</div>
            <div className="">{props.details.school}m away</div>
          </div>
        </div>
        <div className="m-2 d-flex gap-2 align-items-center">
          <i className="bi bi-bus-front-fill h4"></i>
          <div className="d-flex flex-column gap-0">
            <div className="h5 mb-0">Bus Stop</div>
            <div className="">{props.details.bus}m away</div>
          </div>
        </div>
        <div className="m-2 d-flex gap-2 align-items-center">
          <i className="bi bi-egg-fried h4"></i>
          <div className="d-flex flex-column gap-0">
            <div className="h5 mb-0">Restaurant</div>
            <div className="">{props.details.restaurant}m away</div>
          </div>
        </div>
      </div>
      <div className="h4 mt-4">Location</div>
      <div className="mx-1 mt-3" style={{ height: "300px" }}>
        {renderMap(props.lat, props.long)}
        {props.lat} {props.long}
      </div>
      <div className="container d-flex flex-wrap gap-3 justify-content-between my-5 ">
        <div
          className={`btn ${
            saved ? "btn-dark " : "btn-outline-dark "
          }p-4 d-flex gap-2 align-items-center flex-fill justify-content-center`}
          style={{
            minWidth: "160px",
            height: "70px",
          }}
          onClick={toggleSave}
        >
          <i className="bi bi-floppy h3"></i>
          <div className="h5">{saved ? "Place saved!" : "Save place"}</div>
        </div>
        <div
          className="btn btn-outline-dark align-items-center p-3 d-flex gap-2 justify-content-center flex-fill"
          style={{
            minWidth: "160px",
            height: "70px",
          }}
          onClick={messageClicked}
        >
          <i className="bi bi-chat-left h3 "></i>
          <div className="h5">Message</div>
        </div>
        {chat && (
          <div
            style={{
              position: "fixed",
              top: "0",
              bottom: "0",
              left: "55%",
              zIndex: "100000",
              width: "1rem",
            }}
          >
            <ChatBox
              firstMessage={true}
              setChat ={setChat}
              userId={userId}
              receiver={props.receiver}
              chatid={chatid}
              currentRoom={currentRoom}  
              chatRooms={chatRooms}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleListInfo;