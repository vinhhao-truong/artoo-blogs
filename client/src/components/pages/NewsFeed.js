import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectMyProfile } from "../store/user/myProfile-slice";

import AddOrUpdateModal from "../modals/AddOrUpdateModal";

import AddBlogBtn from "../styled-components/AddBlogBtn";
import FetchBlogList from "../fragments/FetchedBlogList";

const NewsFeed = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const myProfile = useSelector(selectMyProfile);

  return (
    <div className="NewsFeed">
      <FetchBlogList
        url="http://localhost:3001/blogs/"
        emptyMsg="No blogs to show!"
        state={myProfile.myBlogs}
      />
      <AddBlogBtn
        onClick={() => {
          setIsAddModalOpen(true);
        }}
      />
      <AddOrUpdateModal
        setIsOpen={setIsAddModalOpen}
        isOpen={isAddModalOpen}
        action="add"
      />
    </div>
  );
};

export default NewsFeed;
