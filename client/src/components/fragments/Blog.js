import React, { useState, useEffect } from "react";
import { selectMyProfile } from "../store/user/myProfile-slice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import "@szhsin/react-menu/dist/index.css";

import ProfileTitle from "./ProfileTitle";
import MenuThreeDots from "../styled-components/MenuThreeDots";
import AddOrUpdateModal from "../modals/AddOrUpdateModal";
import useGETFetch from "../hooks/useFetch";

import { timeDiffFromNow } from "../funcs/formatTime";

const Container = (props) => {
  return (
    <div style={props.style} className="Blog">
      <div className="Blog__Inner">{props.children}</div>
    </div>
  );
};

const Header = (props) => {
  return <div className="Blog__Inner__Header">{props.children}</div>;
};

const Body = (props) => {
  return <div className="Blog__Inner__Body">{props.children}</div>;
};

const Blog = ({ blog }) => {
  const [owner, setOwner] = useState({});
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const myProfile = useSelector(selectMyProfile);
  const { resData: fetchedOwner } = useGETFetch(
    `http://localhost:3001/users/${blog.owner}/`
  );

  useEffect(() => {
    if (fetchedOwner) {
      setOwner(fetchedOwner);
    }
  }, [fetchedOwner]);

  return (
    <Container>
      <div
        style={{ backgroundColor: `${owner.pickedColor}` }}
        className="head-bar"
      ></div>
      <Header>
        <ProfileTitle
          displayedName={owner.nickname ? owner.nickname : owner.firstName}
          imgSrc={
            owner.profilePic
              ? owner.profilePic
              : "https://images.pexels.com/photos/8652888/pexels-photo-8652888.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
          }
          color={owner.pickedColor}
          uid={owner._id}
        />
        <div className="header-right">
          <p className="upload-time">{timeDiffFromNow(blog.uploadTime)}</p>
          <MenuThreeDots
            blog={blog}
            isOwned={myProfile._id === owner._id}
            menuClasses="menu"
          />
        </div>
      </Header>
      <Body>
        <div className="body-header">
          <Link
            style={{
              color: owner.pickedColor,
            }}
            to={`/blog/detail?blogId=${blog._id}&owner=${blog.owner}`}
          >
            <h2>{blog.title}</h2>
          </Link>
          <p>@_uncategorized</p>
        </div>
        <p className="body-content">{blog.content}</p>
        <form className="body-footer"></form>
      </Body>
      <AddOrUpdateModal
        isOpen={isUpdateModalOpen}
        setIsOpen={setIsUpdateModalOpen}
        action="update"
        existedBlog={blog}
      />
    </Container>
  );
};

export default Blog;
