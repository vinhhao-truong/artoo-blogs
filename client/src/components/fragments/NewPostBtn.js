import React from "react";
import { RiAddLine } from "react-icons/ri";

const NewPostBtn = ({onOpenModal}) => {
  return <button className="NewPostBtn pickedColorBg" onClick={onOpenModal} >
    <RiAddLine />
  </button>;
};

export default NewPostBtn;
