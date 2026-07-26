import { saveChat, fetchChats } from "../utils/chat.js";
import { fetchMessages } from "../utils/message.js";
export const handleSocketConnection = (io) => {
  // Store online users
  const onlineUsers = new Map();
  io.on("connection", (socket) => {
    socket.on("joinRoom", ({ room, userId, activeRoom }) => {
      if (activeRoom) socket.join(activeRoom);
    });

    // Listen for user login
    socket.on("userLogin", (userId) => {
      // Each socket joins a room named after its own user id, so messages
      // can be delivered directly to a user regardless of which page/chat
      // widget they currently have open, or whether the conversation existed
      // before this message.
      socket.join(userId);
      onlineUsers.set(userId, socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("userOnline", (userId) => {
      onlineUsers[userId] = socket.id;
      io.emit("updateOnlineUsers", Object.keys(onlineUsers));
    });

    // Listen for user logout
    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId); // Remove user from online list
          io.emit("onlineUsers", Array.from(onlineUsers.keys())); // Broadcast updated list
          break;
        }
      }
    });

    // Listen for new messages from clients
    socket.on("receiveMessage", async (message) => {
      try {
        const { chatId } = await saveChat(
          message.text,
          message.userid,
          message.receiver,
          message.room,
          message.sender
        );

        const newMessage = {
          text: message.text,
          userid: message.userid,
          receiver: message.receiver,
          room: message.room,
          chatid: chatId,
          username: message.sender,
          created_at: new Date(),
        };

        // Deliver directly to both participants' personal rooms, so it
        // arrives whether the recipient has this specific conversation
        // open or not, and even if this is a brand-new conversation that
        // didn't have a chat id before this message.
        io.to(message.userid).to(message.receiver).emit("messageReceived", newMessage);
      } catch (error) {
        console.error("Error handling receiveMessage:", error);
        socket.emit("sendMessageError", { error: "Failed to send message" });
      }
    });

    socket.on("fetchMessage", async (data, callback) => {
      try {
        const result = await fetchMessages(data.room, data.userId, data.receiver);

        // Send the fetched messages back to the client
        socket.emit("messagesFetched", result);

        // If using a callback function from the frontend
        if (callback) callback({ success: true, data: result });
      } catch (error) {
        // console.error("Error fetching messages:-", error);

        // Send an error response back to the client
        socket.emit("fetchError", { error: "Failed to fetch messages" });

        if (callback)
          callback({ success: false, error: "Failed to fetch messages" });
      }
    });

    socket.on("fetchChats", async (data, callback) => {
      try {
        const result = await fetchChats(
          data.userId,
          data.room
        );
        // Send the fetched messages back to the client
        socket.emit("chatsFetched", result);

        // If using a callback function from the frontend
        if (callback) callback({ success: true, data: result });
      } catch (error) {
        // console.error("Error fetching messages:", error);

        // Send an error response back to the client
        socket.emit("fetchError", { error: "Failed to fetch messages" });

        if (callback)
          callback({ success: false, error: "Failed to fetch messages" });
      }
    });
  });
};