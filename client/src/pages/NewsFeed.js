import React, { useState, useEffect } from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { selectMyProfile } from "../store/user/myProfile-slice";

import AddOrUpdateModal from "../components/modals/AddOrUpdateBlogModal";

import AddBlogBtn from "../components/styled-components/AddBlogBtn";
import FetchBlogList from "../components/fragments/FetchedBlogList";
import TypeFilter from "../components/fragments/TypeFilter";

import useGETFetch from "../hooks/useFetch";

import { getBackURL } from "../fns/getURLPath";

const NewsFeed = ({ isHomeRefreshed }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [blogListApiUrl, setBlogListApiUrl] = useState(getBackURL("/blogs"));
  const [fetchState, setFetchState] = useState(false);
  const [typeList, setTypeList] = useState(null);
  const myProfile = useSelector(selectMyProfile);

  const location = useLocation();

  const { resData: typeFetched } = useGETFetch(
    getBackURL("/blogs/filter/allArtTypes")
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filterParam = searchParams.get("filter");
    if (isHomeRefreshed) {
      setFetchState(!fetchState);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (filterParam) {
      setBlogListApiUrl(
        getBackURL(`/blogs/filter/blogList?artType=${filterParam}`)
      );
    } else {
      setBlogListApiUrl(getBackURL("/blogs"));
    }
  }, [location, isHomeRefreshed, fetchState, myProfile]);

  useEffect(() => {
    setTypeList(typeFetched);
  }, [typeFetched]);

  return (
    <>
      <div className="NewsFeed">
        <TypeFilter typeList={typeList} />
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
