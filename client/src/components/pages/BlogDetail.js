import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectMyProfile } from "../store/user/myProfile-slice";

import MenuThreeDots from "../styled-components/MenuThreeDots";
import "@szhsin/react-menu/dist/index.css";
import { BsThreeDots } from "react-icons/bs";

import useGETFetch from "../hooks/useFetch";
import LoadingBar from "react-top-loading-bar";
import { timeDiffFromNow } from "../fns/formatTime";
import upperFirstLetter from "../fns/upperFirstLetter";

const ThisBlog = ({ owner, blog }) => {
  return (
    <div className="BlogDetail__blog">
      <MenuThreeDots blog={blog} menuClasses="menu" />
      <div
        style={{
          backgroundColor: `${owner.pickedColor}`,
        }}
        className="color-bar"
      ></div>

      <Link to={`/profile/${owner._id}`} className="img"></Link>
      <div className="header">
        <Link
          style={{
            color: `${owner.pickedColor}`,
          }}
          to={`/profile/${owner._id}`}
        >
          {owner.nickname ? owner.nickname : owner.firstName}
        </Link>
        <div className="header-right">
          <p className="upload-time">{timeDiffFromNow(blog.uploadTime)}</p>
          <p className="art-type">@_{blog.artType}</p>
        </div>
      </div>
      <div className="detail">
        <h2>{blog.title}</h2>
        <p>{blog.content}</p>
      </div>
    </div>
  );
};

const BlogDetail = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [thisBlog, setThisBlog] = useState(null);
  const [thisProfile, setThisProfile] = useState(null);

  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const paramBlogId = params.get("blogId");
  const paramOwnerId = params.get("owner");
  const { resData: fetchedBlog } = useGETFetch(
    `http://localhost:3001/blogs/${paramBlogId}`
  );
  const { resData: fetchedOwner } = useGETFetch(
    `http://localhost:3001/users/${paramOwnerId}`
  );

  const myProfile = useSelector(selectMyProfile);

  useEffect(() => {
    setLoadingProgress(33);
    setThisBlog(fetchedBlog);
    setLoadingProgress(66);
    setThisProfile(fetchedOwner);
    setLoadingProgress(100);
  }, [fetchedBlog, fetchedOwner]);

  return (
    <div className="BlogDetail">
      {thisBlog && thisProfile ? (
        <>
          <ThisBlog blog={thisBlog} owner={thisProfile} />
        </>
      ) : (
        <p>No blog found!</p>
      )}
      <LoadingBar
        onLoaderFinished={() => setLoadingProgress(0)}
        color={myProfile.pickedColor}
        progress={loadingProgress}
      />
    </div>
  );
};

export default BlogDetail;
