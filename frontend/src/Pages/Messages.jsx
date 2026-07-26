import React from "react";
import Navbar from "../Components/Navbar";
import Messages from "../Components/Messages";
import ProfileNavbar from "../Components/ProfileNavbar";

const App = () => {
  return (
    <div className="flex flex-col h-screen w-full border border-gray-300 bg-gray-50">
      <div className="flex flex-col sm:flex-row w-full">
       <div className="w-full sm:w-1/2"> <Navbar /></div>
        <div className="w-full sm:w-1/2"> <ProfileNavbar /></div>
      </div>
        <Messages />
    </div>
  );
};

export default App;
