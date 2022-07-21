import React, { useState, useContext, useEffect } from "react";
import axios from "axios";

import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectMyBlogs } from "../store/user/myBlogs-slice";
import { selectMyProfile } from "../store/user/myProfile-slice";

import NewPostBtn from "../fragments/NewPostBtn";
import NewPostModal from "../modals/NewPostModal";

import BlogList from "../fragments/BlogList";

const MyBlogs = () => {
  const myBlogs = useSelector(selectMyBlogs);
  const myProfile = useSelector(selectMyProfile);

  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  useEffect(() => {
    if(myBlogs.length > 0) {
      setIsEmpty(false);
    } else {
      setIsEmpty(true)
    }
  }, [myBlogs])


  const handleOpenModal = (e) => {
    e.preventDefault();
    setIsNewPostModalOpen(true);
  };

  return (
    <div className="NewsFeed MyBlogs">
      {
        isEmpty ? (
          <p>You haven't created any posts lately :(</p>
        ) : (
          <BlogList blogs={myBlogs} />
        )
      }      
      <NewPostBtn onOpenModal={handleOpenModal} />
      <NewPostModal
        isOpen={isNewPostModalOpen}
        onClose={() => {
          setIsNewPostModalOpen(false);
        }}
      />
    </div>
  );
};

export default MyBlogs;
