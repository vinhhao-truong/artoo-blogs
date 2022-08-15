import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectMyProfile } from "../store/user/myProfile-slice";

import AddBlogBtn from "../components/styled-components/AddBlogBtn";
import AddOrUpdateModal from "../components/modals/AddOrUpdateBlogModal";

import FetchedBlogList from "../components/fragments/FetchedBlogList";
import { ChildHelmet } from "../components/fragments/Helmet";
import TypeFilter from "../components/fragments/TypeFilter";
import useGETFetch from "../hooks/useFetch"
import { getBackURL } from "../fns/getURLPath";
import { useLocation } from "react-router-dom";

const MyBlogs = ({ uid }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [blogListApiUrl, setBlogListApiUrl] = useState(getBackURL(`/users/${uid}?q=myBlogs`));

  const location = useLocation();
  const myProfile = useSelector(selectMyProfile);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filterParam = searchParams.get("filter");
    if (filterParam) {
      setBlogListApiUrl(
        getBackURL(`/users/${uid}?q=myBlogs&artType=${filterParam}`)
      );
    } else {
      setBlogListApiUrl(getBackURL(`/users/${uid}?q=myBlogs`));
    }
  }, [location, myProfile]);

  return (
    <div className="NewsFeed">
      <ChildHelmet title="My Blogs" />
      <TypeFilter uid={uid} />
      <FetchedBlogList
        url={blogListApiUrl}
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
