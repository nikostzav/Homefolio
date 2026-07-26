import img from "../no_avatar.png";
import Image from "react-bootstrap/Image";
import "./styles.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import ChatMessages from "./ChatMProfile";
import { cloudinaryResize } from "../lib/cloudinary";

const Messages = () => {
  const [chat, setChat] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const { id } = useParams();
  const [chatid, setChatid] = useState();
  const [chatroomid, setChatroomid] = useState();
  const [creator, setCreator] = useState({});
  const [currentRoom, setCurrentRoom] = useState("");
  const [chatRooms, setChatRooms] = useState([]);
  const [currentUsername, setCurrentUsername] = useState("");
  const accessToken = Cookies.get("accessToken");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/auth/userchats/${userId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );
        setChatRooms(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [id, accessToken]);

  const handleClick = async (chatRoom) => {
    setChat(!chat);
    setChatid(chatRoom.chat_id);
    setChatroomid(chatRoom.roomid);
    setCurrentRoom(chatRoom.chat_id);
    setCurrentUsername(
      chatRoom.user1 === userId
        ? chatRoom.user2_details.name
        : chatRoom.user1_details.name
    );
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/mark-as-seen`,
        {
          userId: userId,
          roomId: chatRoom.chat_id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  };
  return (
    <div className="rounded">
      {/* Chat List */}
      <div>
        <div className="w-full p-4 border-r mx-2">
          <h1 className="text-lg  font-semibold text-gray-600">All Messages</h1>
          <div>
            <div className="overflow-y-auto  w-full max-h-[25rem] mx-2">
              {chatRooms.length > 0 ? (
                chatRooms.map((chatRoom) => (
                  <div
                    key={chatRoom.chat_id}
                    className={`flex items-center gap-4 w-fit border rounded-lg p-3 my-2 mx-2 cursor-pointer transition
          ${
            currentRoom === chatRoom.chat_id
              ? "bg-blue-200 border-blue-400"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
                    style={{ width: "90%", overflowX: "hidden" }}
                    onClick={() => handleClick(chatRoom)}
                  >
                    <Image
                      src={chatRoom.img || img}
                      roundedCircle
                      className="border"
                      style={{
                        height: "50px",
                        width: "50px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="flex flex-col">
                      <b className="text-gray-800">
                        {(chatRoom.user1 === userId
                          ? chatRoom.user2_details.name
                          : chatRoom.user1_details.name) || "Unknown"}
                      </b>
                      <span className="text-gray-500 text-sm">
                        {chatRoom.lastmessage || "No messages yet"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center mt-4">
                  No chats available
                </p>
              )}
            </div>
          </div>
        </div>
        {currentRoom && (
          <div className="w-full absolute inset-0 flex flex-col md:flex-row items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
            {/* Chat Details */}

            <div className="w-full md:w-1/3 gap-3 mx-2 mx-3 bg-gray-100 p-3 rounded-xl border-l bg-white-200">
              <h1 className="text-lg font-semibold text-gray-600">Details</h1>

              {currentRoom ? (
                <div className="mt-4 flex items-center  bg-gray-100 border p-3">
                  {creator &&
                    typeof creator === "object" &&
                    Object.keys(creator).length > 0 && (
                      <div>
                        <Image
                          src={cloudinaryResize(creator.images[0], { width: 700, height: 500 })}
                          loading="lazy"
                          className="border"
                          style={{
                            height: "250px",
                            width: "100%",
                            maxWidth: "350px",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <Link
                            to={{ pathname: `/singleItem/${creator.id}` }}
                            state={{
                              title: creator.title,
                              price: creator.price,
                              address: creator.address,
                              images: creator.images,
                              beds: creator.bedroom,
                              toilet: creator.bathroom,
                              lat: creator.latitude,
                              long: creator.longitude,
                              postId: creator.id,
                              receiver: creator.userid,
                            }}
                          >
                            {creator.title}
                          </Link>

                          <p className="text-gray-500 text-sm">
                            Address: {creator.address}
                          </p>
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <p className="text-gray-500 text-center mt-4">
                  Select a chat to see details
                </p>
              )}
            </div>
            {/* Chat Messages Component */}
            <div className="w-full md:w-2/3 gap-4 p-4">
              <ChatMessages
                creator={creator}
                userId={userId}
                setCreator={setCreator}
                chatid={chatid}
                chatroomid={chatroomid}
                currentRoom={currentRoom}
                chatRooms={chatRooms}
                currentUsername={currentUsername}
                closed={() => setCurrentRoom(null)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
