// ChatApp.js
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "./CardMessage";
import { Input } from "./Input";
import { Button } from "./Button";
import Cookies from "js-cookie";
import axios from "axios";
import { io } from "socket.io-client";
import { formatDistanceToNow, format } from "date-fns";

const socket = io.connect(process.env.REACT_APP_API_URL);

const ChatApp = ({
  userId,
  closed,
  currentUsername,
  chatroomid,
  currentRoom,
  setCreator,
  creator,
  chatid,
  chatRooms = []
}) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const [onlineUsers, setOnlineUsers] = useState([]);

  // `creator` is the listing's owner (fetched from the post), which is only
  // the right "other participant" if I'm the buyer - if I'm the owner
  // reviewing an incoming message, the other participant is whoever the
  // selected conversation's other user id is.
  const activeRoomDetails = chatRooms.find((room) => room.chat_id === chatid);
  const otherUserId = activeRoomDetails
    ? activeRoomDetails.user1 === userId
      ? activeRoomDetails.user2
      : activeRoomDetails.user1
    : creator?.userid;
  const otherUserDetails = activeRoomDetails
    ? activeRoomDetails.user1 === userId
      ? activeRoomDetails.user2_details
      : activeRoomDetails.user1_details
    : null;

  useEffect(() => {
    socket.emit("fetchChats", { room: currentRoom, userId });
    socket.on("messageReceived", (newMessage) => {
      const belongsHere =
        (newMessage.userid === userId && newMessage.receiver === otherUserId) ||
        (newMessage.userid === otherUserId && newMessage.receiver === userId);
      if (belongsHere) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });
    return () => {
      socket.off("messageReceived");
    };
  }, [userId, otherUserId]);

  // Notify server when user logs in
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
      .get(`${process.env.REACT_APP_API_URL}/api/auth/posts/${chatroomid}`, {
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
  }, [chatroomid]);

  useEffect(() => {
    if (!currentRoom || !otherUserId) return;
    socket.emit("fetchMessage", {
      room: chatroomid,
      userId: userId,
      receiver: otherUserId,
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
  }, [currentRoom, otherUserId]);

  const handleSend = () => {
    if (inputValue.trim()) {
      const userMessage = {
        text: inputValue,
        room: chatroomid,
        sender: user?.username || user?.name || 'You',
        userid: userId,
        receiver: otherUserId,
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
    <div className="h-auto top-5 sm:top-5 fixed inset-x-0 sm:inset-x-auto w-full sm:w-1/3 bg-gray-200 sm:right-5 rounded-lg z-50">
      <h3  className="w-full text-center">{currentUsername}</h3>
      <button
        className="absolute top-0 right-0 text-2xl text-gray-600 px-3 hover:text-gray-500"
        onClick={closed}
      >
        x
      </button>

      <Card className="flex-grow w-full z-100 mt-10">
        <CardContent>
          <div className="w-full h-[55vh] flex flex-col bg-gray-50 overflow-x-hidden p-3">
            {messages.map((message, index) => {
              const isCurrentUser = message.userid === userId;
              const formattedTime =
                Date.now() - new Date(message.created_at) < 86400000
                  ? formatDistanceToNow(new Date(message.created_at), {
                      addSuffix: true
                    })
                  : format(new Date(message.created_at), "dd/MM/yyyy");
              const senderName = message?.username || (isCurrentUser ? (user?.name || user?.username || 'You') : (otherUserDetails?.name || 'Unknown'));
              const senderAvatar = isCurrentUser ? (user?.avatar || null) : (otherUserDetails?.avatar || null);

              return (
                <div
                  key={index}
                  style={{
                    alignSelf: isCurrentUser ? "flex-end" : "flex-start"
                  }}
                  className={`mb-2 w-fit rounded-2xl p-3 relative flex items-center gap-2 ${
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
                      </div>{" "}
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