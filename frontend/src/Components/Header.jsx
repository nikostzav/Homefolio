import { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";

export function Header() {
  // const [unreadNotifications, setUnreadNotifications] = useState(3);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const user = JSON.parse(localStorage.getItem("user"));
    // State to track loading status
    const [loading, setLoading] = useState(true);
    // State to handle errors
    const [error, setError] = useState(null);
  
    // Function to fetch unseen chat count
    const fetchUnseenChatCount = async (userId) => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/unseen-count`, {
          params: { userId }, // Pass userId as a query parameter
        });
        return response.data.count; // Return the count from the API response
      } catch (error) {
        console.error("Error fetching unseen chat count:", error);
        throw error; // Re-throw the error for handling in the component
      }
    };
  
    // useEffect to fetch data when the component mounts or userId changes
    useEffect(() => {
      const getUnseenChatCount = async () => {
        try {
          const count = await fetchUnseenChatCount(user.id); // Call the API
          setUnreadMessages(count); // Update state with the count
        } catch (error) {
          setError("Failed to fetch unseen chat count."); // Handle errors
        } finally {
          setLoading(false); // Set loading to false
        }
      };
  
      getUnseenChatCount(); // Trigger the API call
    }, [user.userId]); 

  return (
    <div className="flex items-center mt-1 mx-10 justify-end gap-4">
      {/* Notification Icon with Count */}
      {/* <div className="relative mt-3">
        <FaBell className="text-gray-500 text-2xl cursor-pointer" />
        {unreadNotifications > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
            {unreadNotifications}
          </span>
        )}
      </div> */}

      {/* Message Icon with Count */}
      <Link to="/messages">
        <div className="relative flex mt-1 items-center justify-center">
          <FaEnvelope className="text-gray-500 text-2xl cursor-pointer" />
          {unreadMessages > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {unreadMessages}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}
