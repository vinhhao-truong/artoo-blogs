import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectMyBlogs, addNewBlog } from "../store/user/myBlogs-slice";
import { selectMyProfile } from "../store/user/myProfile-slice";
import { useLocation, useRoutes } from "react-router-dom";

import { TxtField } from "../fragments/StyledTextField";

import ReactModal from "react-modal";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";

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
  const blankBlog = {
    blogId: uuidv4(),
    blogTitle: "",
    blogContent: "",
    reactions: [],
    comments: [],
  };

  const [newBlog, setNewBlog] = useState({ ...blankBlog });

  const myBlogs = useSelector(selectMyBlogs);
  const myProfile = useSelector(selectMyProfile);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addNewBlog({ newBlog: newBlog, uid: myProfile.uid }));
    setNewBlog(blankBlog);
    closeModal();
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
        onChange={handleChange("blogTitle")}
        value={newBlog.blogTitle}
        label="Title"
        fullWidth
      />
      <TxtField
        size="small"
        label="Masterpiece"
        multiline
        rows={8}
        onChange={handleChange("blogContent")}
        value={newBlog.blogContent}
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
