import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import LoadingBar from "react-top-loading-bar";

import { useSelector } from "react-redux";
import { selectMyProfile } from "../store/user/myProfile-slice";

import EmptyList from "./EmptyList";
import Blog from "./Blog";

const BlogList = ({ blogs, className }) => {
  return (
    <div className={`BlogList ${className ? className : ""}`}>
      {blogs.map((blog) => (
        <Blog key={blog._id} blog={blog} />
      ))}
    </div>
  );
};

const FetchedBlogList = ({ url, emptyMsg, state, className }) => {
  const [isNoBlog, setIsNoBlog] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [blogList, setBlogList] = useState(null);
  const myProfile = useSelector(selectMyProfile);

  const callFetchedList = async () => {
    setLoadingProgress(33);
    try {
      const res = await axios.get(url);
      setLoadingProgress(66);
      const data = await res.data.data;
      if (data.length > 0) {
        setBlogList(data.sort((a, b) => (b.uploadTime > a.uploadTime) ? 1 : -1));
        setIsNoBlog(false);
      } else {
        setBlogList(null);
        setIsNoBlog(true);
      }
      
    } catch (err) {
      console.log(err);
    }
    setLoadingProgress(100);
  };

  useEffect(() => {
    callFetchedList();
    // console.log(blogList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, state]);

  return (
    <>
      {isNoBlog && !blogList && <EmptyList msg={emptyMsg} />}
      {!isNoBlog && blogList && <BlogList className={className ? className : ""} blogs={blogList} />}
      {/* <LoadingModal isLoading={isLoading} type="bubbles" /> */}
      <LoadingBar onLoaderFinished={() => setLoadingProgress(0)} color={myProfile.pickedColor} progress={loadingProgress} />
    </>
  );
};

export default FetchedBlogList;
