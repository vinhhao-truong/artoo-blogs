import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { selectMyProfile } from "../store/user/myProfile-slice";

import AddOrUpdateModal from "../components/modals/AddOrUpdateBlogModal";

import AddBlogBtn from "../components/styled-components/AddBlogBtn";
import FetchBlogList from "../components/fragments/FetchedBlogList";
import TypeFilter from "../components/fragments/TypeFilter";

import { MainHelmet } from "../components/fragments/Helmet";

const NewsFeed = ({ isHomeRefreshed }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [blogListApiUrl, setBlogListApiUrl] = useState("/blogs");
  const [fetchState, setFetchState] = useState(false);
  const myProfile = useSelector(selectMyProfile);

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filterParam = searchParams.get("filter");
    if (isHomeRefreshed) {
      setFetchState(!fetchState);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (filterParam) {
      setBlogListApiUrl(
        `/blogs/filter/blogList?artType=${filterParam}`
      );
    } else {
      setBlogListApiUrl("/blogs");
    }
  }, [location, isHomeRefreshed, fetchState, myProfile]);

  return (
    <>
      <div className="NewsFeed">
        <MainHelmet />
        <TypeFilter isAll />
        <FetchBlogList
          url={blogListApiUrl}
          emptyMsg="No blogs to show!"
          state={fetchState || myProfile}
        />
        <AddBlogBtn
          onClick={() => {
            setIsAddModalOpen(true);
          }}
        />
        <AddOrUpdateModal
          setIsOpen={setIsAddModalOpen}
          isOpen={isAddModalOpen}
          // isOpen={true}
          action="add"
        />
      </div>
    </>
  );
};

export default NewsFeed;
