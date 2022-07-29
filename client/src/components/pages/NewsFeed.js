import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useSelector } from "react-redux";
import { selectMyProfile } from "../store/user/myProfile-slice";

import AddOrUpdateModal from "../modals/AddOrUpdateBlogModal";

import AddBlogBtn from "../styled-components/AddBlogBtn";
import FetchBlogList from "../fragments/FetchedBlogList";
import TypeFilter from "../fragments/TypeFilter";

import useGETFetch from "../hooks/useFetch";

import { getBackURL } from "../fns/getURLPath";

const NewsFeed = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [blogListApiUrl, setBlogListApiUrl] = useState(
    getBackURL("/blogs")
  );
  const [typeList, setTypeList] = useState(null);
  const myProfile = useSelector(selectMyProfile);

  const location = useLocation();

  const { resData: typeFetched } = useGETFetch(
    getBackURL("/blogs/filter/allArtTypes")
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filterParam = searchParams.get("filter");
    if (filterParam) {
      setBlogListApiUrl(
        getBackURL(`/blogs/filter/blogList?artType=${filterParam}`)
      );
    } else {
      setBlogListApiUrl(getBackURL("/blogs"));
    }
  }, [location]);

  useEffect(() => {
    setTypeList(typeFetched);
  }, [typeFetched]);

  return (
    <>
      <TypeFilter typeList={typeList} />
      <div className="NewsFeed">
        <FetchBlogList
          url={blogListApiUrl}
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
    </>
  );
};

export default NewsFeed;
