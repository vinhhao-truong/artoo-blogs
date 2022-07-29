import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectMyProfile } from "../store/user/myProfile-slice";

import AddBlogBtn from "../styled-components/AddBlogBtn";
import AddOrUpdateModal from "../modals/AddOrUpdateBlogModal";

import FetchedBlogList from "../fragments/FetchedBlogList";

const MyBlogs = ({ uid }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const myProfile = useSelector(selectMyProfile);

  return (
    <div className="NewsFeed">
      <FetchedBlogList
        url={`http://localhost:3001/users/${uid}?q=myBlogs`}
        emptyMsg="You don't have any blogs!"
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

export default MyBlogs;
