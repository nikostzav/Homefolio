// ChatApp.js
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "./Card";
import { Input } from "./Input";
import { Button } from "./Button";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { io } from "socket.io-client";
import { formatDistanceToNow, format } from "date-fns";

const socket = io.connect(process.env.REACT_APP_API_URL);

const ChatApp = ({ userId, receiver, currentRoom, chatRooms, setChat }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [creator, setCreator] = useState({});
  const { id } = useParams();
  const [activeRoom, setActiveRoom] = useState(currentRoom);
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [onlineUsers, setOnlineUsers] = useState([]);
  const handleClose = () =>{
    setChat(false)
  }
  useEffect(() => {
    if (userId) {
      socket.emit("userLogin", userId);
    }
  }, [userId]);

  // Listen for online users updates
  useEffect(() => {
    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("onlineUsers");
    };
  }, []);

  const res = async () => {
    const accessToken = Cookies.get("accessToken");
    await axios
      .get(`${process.env.REACT_APP_API_URL}/api/auth/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      .then((response) => {
        setCreator(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    res();
  }, []);
  // If the owner has switched to a different buyer's conversation via the
  // sidebar, that conversation's other participant takes priority over the
  // `receiver` prop (which only reflects the listing's default contact).
  const activeRoomDetails = chatRooms.find((room) => room.chat_id === activeRoom);
  const activeRoomOtherUserId = activeRoomDetails
    ? activeRoomDetails.user1 === userId
      ? activeRoomDetails.user2
      : activeRoomDetails.user1
    : null;
  const effectiveReceiver = activeRoomOtherUserId || receiver;
  const otherUserDetails = activeRoomDetails
    ? activeRoomDetails.user1 === userId
      ? activeRoomDetails.user2_details
      : activeRoomDetails.user1_details
    : null;

  useEffect(() => {
    socket.emit("fetchChats", { room: id, userId });
    socket.on("messageReceived", (newMessage) => {
      // Only show messages that belong to this conversation (this listing,
      // between me and the person I'm chatting with here) - the personal
      // room also receives messages from a user's other conversations.
      const belongsHere =
        (newMessage.userid === userId && newMessage.receiver === effectiveReceiver) ||
        (newMessage.userid === effectiveReceiver && newMessage.receiver === userId);
      if (belongsHere) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });
    return () => {
      socket.off("messageReceived");
    };
  }, [id, userId, effectiveReceiver]);
  useEffect(() => {
    if (!id) return;
    socket.emit("fetchMessage", {
      room: id,
      userId: userId,
      receiver: effectiveReceiver,
    });
    socket.on("messagesFetched", (data) => {
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.error("Invalid data format received:", data);
      }
    });

    return () => {
      socket.off("messagesFetched");
    };
  }, [id, userId, effectiveReceiver]);
  const handleSend = () => {
    if (inputValue.trim()) {
      const userMessage = {
        text: inputValue,
        room: id,
        sender: user.username,
        userid: userId,
        receiver: effectiveReceiver,
      };

      socket.emit("receiveMessage", userMessage);
      setInputValue("");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="h-auto w-full sm:w-fit fixed inset-0 sm:inset-auto sm:right-5 sm:bottom-10 sm:top-5 shadow-lg sm:rounded-lg flex flex-col sm:flex-row z-50">
      {creator.userid === user.id && (
        <div className="w-full sm:w-1/4 max-h-40 sm:max-h-none bg-gray-300 overflow-y-auto">
          {chatRooms.length > 0 ? (
            chatRooms.map((room) => {
              const userDetails =
                room.user1 === userId ? room.user2_details : room.user1_details;
              const isOnline = onlineUsers.includes(userDetails.id);
              const hasAvatar = userDetails.avatar;

              return (
                <div
                  key={room.chat_id}
                  className={`p-2 py-8 cursor-pointer  flex ${
                    activeRoom === room.chat_id
                      ? "bg-gray-400 text-white"
                      : "bg-gray-300"
                  }`}
                  onClick={() => setActiveRoom(room.chat_id)}
                >
                  {hasAvatar ? (
                    <img
                      src={userDetails.avatar}
                      alt={userDetails.name}
                      className="w-6 h-6 mr-2 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-6 h-6 mr-2 flex items-center justify-center rounded-full text-white text-sm font-bold"
                      style={{
                        backgroundColor: "#6B7280"
                      }}
                    >
                      {userDetails.name.charAt(0).toUpperCase()}
                      {userDetails.name
                        .charAt(userDetails.name.length - 1)
                        .toUpperCase()}
                    </div>
                  )}
                  <div
                    className="w-2 h-2 rounded-full mt-2 mr-1"
                    style={{ backgroundColor: isOnline ? "green" : "gray" }}
                  />
                  <div>{userDetails.name}</div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-center">No chats available</p>
          )}
  
        </div>
      )}
      <Card className="flex-grow z-100">
        <span className="absolute right-5 text-2xl cursor-pointer top-2 text-gray-800" onClick={()=>handleClose()}>x</span>

        <CardContent>
          <div className="w-full h-[65vh] flex flex-col bg-gray-50 overflow-x-hidden p-3">
            { messages.map((message, index) => {
              const isCurrentUser = message.userid === userId;
              const formattedTime =
                Date.now() - new Date(message.created_at) < 86400000
                  ? formatDistanceToNow(new Date(message.created_at), {
                      addSuffix: true
                    }) 
                  : format(new Date(message.created_at), "dd/MM/yyyy");

              const senderDetails = isCurrentUser 
                ? { name: user.name, avatar: user.avatar || null } 
                : otherUserDetails || { name: message.username || 'Unknown', avatar: null };
              const senderName = message.username || senderDetails.name || 'Unknown';
              const senderAvatar = senderDetails.avatar;

              return (
                <div
                  key={index}
                  style={{
                    alignSelf: isCurrentUser ? "flex-end" : "flex-start"
                  }}
                  className={`mb-2 w-fit  p-3 rounded-lg relative shadow-md flex items-center gap-2 ${
                    isCurrentUser
                      ? "bg-blue-500 text-white ml-10"
                      : "bg-gray-200 text-black mr-10"
                  }`}
                >
                  <div>
                    <div className="flex">
                      {senderAvatar ? (
                        <img
                          src={senderAvatar}
                          alt={senderName}
                          className="w-6 h-6 mr-2 rounded-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-6 h-6 mr-2 flex items-center justify-center rounded-full text-white text-sm font-bold"
                          style={{
                            backgroundColor: isCurrentUser ? "#2563EB" : "#6B7280"
                          }}
                        >
                          {senderName.charAt(0).toUpperCase()}
                          {senderName.charAt(senderName.length - 1).toUpperCase()}
                        </div>
                      )}
                      <div className="text-sm font-semibold">
                        {senderName}
                      </div>
                    </div>
                    <div>{message.text}</div>
                    <div className="text-xs mt-1 opacity-75">
                      {formattedTime}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        <CardContent className="flex gap-2 p-3">
          <Input
            className="flex-grow rounded-lg border border-gray-300 p-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Type a message..."
          />
          <Button 
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handleSend}
          >
            Send
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatApp;