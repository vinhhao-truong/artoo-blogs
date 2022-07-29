import React, {useEffect} from "react";
import { RiAddLine } from "react-icons/ri";
import useResponsive from "../hooks/useResponsive";
import {io} from "socket.io-client";

const socket = io("http://localhost:3001");

const AddBlogBtn = ({ onClick, className }) => {
  const isTabletOrMobile = useResponsive("Tablet or Mobile");


  
  // const handleClick = (e) => {
  //   e.preventDefault();
  //   console.log("click")

  //   socket.io.on("send_msg", () => {
  //     socket.io.emit("msg", "blah")
  //   })

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
