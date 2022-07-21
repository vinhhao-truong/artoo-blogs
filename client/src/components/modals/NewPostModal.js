import React, { useState } from "react";
import ReactModal from "react-modal";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import axios from 'axios';

import { useDispatch, useSelector } from "react-redux";
import { selectMyBlogs, addNewBlog } from "../store/user/myBlogs-slice";
import { selectMyProfile } from "../store/user/myProfile-slice";
import { useLocation, useRoutes } from "react-router-dom";

import { TxtField } from "../fragments/StyledTextField";

const Form = styled.form`
  h1 {
    color: ${(props) => (props.pickedcolor ? props.pickedcolor : "#3aafa9")};
  }
  button {
    background-color: ${(props) =>
      props.pickedcolor ? props.pickedcolor : "#3aafa9"};
    color: #f8f9fa;
  }
`;

const NewPostForm = ({ closeModal }) => {
  const myBlogs = useSelector(selectMyBlogs);
  const myProfile = useSelector(selectMyProfile);
  const dispatch = useDispatch();

  const blankBlog = {
    _id: uuidv4(),
    title: "",
    owner: myProfile._id,
    content: "",
    category: "",
    reactions: [],
    comments: [],
  };

  const [newBlog, setNewBlog] = useState({ ...blankBlog });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/blogs/", {newBlog: newBlog})
      dispatch(addNewBlog({ newBlog: newBlog, uid: myProfile._id }));
      setNewBlog(blankBlog);
      closeModal();
    } catch(err) {
      console.log(err);
    }
    
  };

  const handleChange = (prop) => (e) => {
    e.preventDefault();
    setNewBlog((prevBlog) => ({ ...prevBlog, [prop]: e.target.value }));
  };

  return (
    <Form
      pickedColor={myProfile.pickedColor}
      onSubmit={handleSubmit}
      action=""
      className="NewPostForm"
    >
      <h1 className="pickedColor">Create your masterpiece here</h1>
      <TxtField
        size="small"
        onChange={handleChange("title")}
        value={newBlog.title}
        label="Title"
        fullWidth
      />
      <TxtField
        size="small"
        label="Masterpiece"
        multiline
        rows={8}
        onChange={handleChange("content")}
        value={newBlog.content}
        required
        fullWidth
      />
      <button>Create</button>
    </Form>
  );
};

const NewPostModal = ({ isOpen, onClose }) => {
  return (
    <ReactModal
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={true}
      overlayClassName="BlurredOverlay"
      className="NewPostModal"
      isOpen={isOpen}
    >
      <NewPostForm closeModal={onClose} />
    </ReactModal>
  );
};

export default NewPostModal;
