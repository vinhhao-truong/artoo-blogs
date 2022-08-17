import React, { useState, useEffect } from "react";
import axios from "axios";

import { useDispatch } from "react-redux";

import EmptyList from "./EmptyList";
import Blog from "./Blog";
import { setLoadingBar } from "../../store/user/features-slice";

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
  const [blogList, setBlogList] = useState(null);

  const dispatch = useDispatch();

  const callFetchedList = async () => {
    if (url) {
      try {
        // setTimeout(() => {
        //   dispatch(setLoadingBar(1));
        // }, 1000);
        dispatch(setLoadingBar(33));
        const res = await axios.get(url);
        dispatch(setLoadingBar(66));
        const data = await res.data.data;
        if (data.length > 0) {
          setBlogList(
            data.sort((a, b) => (b.uploadTime > a.uploadTime ? 1 : -1))
          );
          setIsNoBlog(false);
        } else {
          setBlogList(null);
          setIsNoBlog(true);
        }
      } catch (err) {
        console.log(err);
      }
      dispatch(setLoadingBar(100));
    }
  };

  useEffect(() => {
    callFetchedList();

    // console.log(blogList)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, state]);

  return (
    <>
      {isNoBlog && !blogList && <EmptyList msg={emptyMsg} />}
      {!isNoBlog && blogList && (
        <BlogList className={className ? className : ""} blogs={blogList} />
      )}
    </>
  );
};

export default FetchedBlogList;
