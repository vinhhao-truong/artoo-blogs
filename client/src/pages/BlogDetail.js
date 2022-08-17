import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectMyProfile } from "../store/user/myProfile-slice";

import MenuThreeDots from "../components/fragments/MenuThreeDots";
import "@szhsin/react-menu/dist/index.css";
import { BsThreeDots } from "react-icons/bs";

import useGETFetch from "../hooks/useFetch";


import LoadingBar from "react-top-loading-bar";
import { timeDiffFromNow } from "../fns/formatTime";
import upperFirstLetter from "../fns/upperFirstLetter";
import { setLoadingBar, startLoading, stopLoading } from "../store/user/features-slice";

import { Image, Row, Col } from "antd";
import {ChildHelmet} from "../components/fragments/Helmet";

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

      <Link to={`/profile/${owner._id}`} className="img">
        <img src={owner.profileImg} alt="profile-img" />
      </Link>
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
        <p className="count">
          Images Count:{" "}
          <span style={{ color: owner.pickedColor }}>{blog.images.length}</span>
        </p>
        <div className="images">
          <Image.PreviewGroup>
            {blog.images.length === 1 && (
              <Image src={blog.images[0]} alt={blog._id + "-preview"} />
            )}
            {blog.images.length > 1 && (
              <Row wrap>
                {/* Even Nums */}
                {blog.images.length % 2 === 0 &&
                  blog.images.map((img, idx) => (
                    <Col span={12}>
                      <Image src={img} alt={blog._id + "-preview"} key={idx} />
                    </Col>
                  ))}
                {/* Odd Nums */}
                {blog.images.length % 2 !== 0 && (
                  <>
                    <Col span={12}>
                      <Image src={blog.images[0]} alt={blog._id + "-preview"} />
                    </Col>
                    <Col span={12}>
                      {blog.images.slice(1, 3).map((img, idx) => (
                        <Row key={idx + 1}>
                          <Image src={img} alt={blog._id + "-preview"} />
                        </Row>
                      ))}
                    </Col>
                    {blog.images.slice(3).map((img, idx) => (
                      <Col span={12} key={idx + 1}>
                        <Image src={img} alt={blog._id + "-preview"} />
                      </Col>
                    ))}
                  </>
                )}
              </Row>
            )}
          </Image.PreviewGroup>
        </div>
      </div>
    </div>
  );
};

const BlogDetail = () => {
  const [thisBlog, setThisBlog] = useState(null);
  const [thisProfile, setThisProfile] = useState(null);

  const { search } = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(search);
  const paramBlogId = params.get("blogId");
  const paramOwnerId = params.get("owner");
  const { resData: fetchedBlog } = useGETFetch(
    `/blogs/${paramBlogId}`
  );
  const { resData: fetchedOwner } = useGETFetch(
    `/users/${paramOwnerId}`
  );

  const myProfile = useSelector(selectMyProfile);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoadingBar(33));
    dispatch(startLoading());
    if(!paramBlogId || !paramOwnerId) {
      navigate("/not-found")
      return;
    }
    if (paramOwnerId === myProfile._id) {
      setThisBlog(myProfile.myBlogs.find((blog) => blog._id === paramBlogId));
      dispatch(setLoadingBar(66));
      setThisProfile(myProfile);
    } else {
      setThisBlog(fetchedBlog);
      dispatch(setLoadingBar(66));
      setThisProfile(fetchedOwner);
    }
    dispatch(stopLoading());
    dispatch(setLoadingBar(100));
  }, [
    fetchedBlog,
    fetchedOwner,
    myProfile,
    paramOwnerId,
    paramBlogId,
  ]);

  return (
    <div className="BlogDetail">
      {thisBlog && thisProfile && (
        <>
          <ChildHelmet
            title={`${
              thisBlog.title.length >= 15
                ? thisBlog.title.slice(0, 15) + "..."
                : thisBlog.title
            }`}
          />
          <ThisBlog blog={thisBlog} owner={thisProfile} />
        </>
      )}
    </div>
  );
};

export default BlogDetail;
