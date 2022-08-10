import React, { useEffect, useState } from "react";
import { RiAddLine } from "react-icons/ri";
import { io } from "socket.io-client";

import { getBackURL } from "../../fns/getURLPath";
import useResponsive from "../../hooks/useResponsive";


const AddBlogBtn = ({ onClick, className }) => {
  const isTabletOrMobile = useResponsive("Tablet or Mobile");
  
  // const handleClick = (e) => {
  //   // e.preventDefault();
  //   console.log(getBackURL());
  //   const socket = io(`${getBackURL()}`);
  //   const msg = "hi";
  //   socket.emit("send_msg", msg);
  // };

  return (
    <button
      style={isTabletOrMobile ? { bottom: `${3.5}rem` } : {}}
      className={"AddBlogBtn pickedColorBg " + (className ? className : "")}
      onClick={onClick}
    >
      <RiAddLine />
    </button>
  );
};

export default AddBlogBtn;
