import React, { useState, useEffect } from "react";
import { deleteBlog, selectMyProfile } from "../store/user/myProfile-slice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import dateTime from "date-and-time";

import { BsThreeDots } from "react-icons/bs";
import "@szhsin/react-menu/dist/index.css";

import ProfileTitle from "./ProfileTitle";
import BottomMenu from "../modals/BlogMenu";
import AddOrUpdateModal from "../modals/AddOrUpdateModal";
import useGETFetch from "../hooks/useFetch";
import axios from "axios";

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
  const [user, setUser] = useState({});
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const dispatch = useDispatch();
  const myProfile = useSelector(selectMyProfile);
  const { resData: fetchedUser } = useGETFetch(
    `http://localhost:3001/users/${blog.owner}/`
  );

  useEffect(() => {
    if (fetchedUser) {
      setUser(fetchedUser);
    }
  }, [fetchedUser]);

  const uploadTime = () => {
    const now = new Date();
    const uploadTime = new Date(blog.uploadTime);
    const dateFormat = (moment) => dateTime.format(moment, "DD-MM-YYYY");
    const timeFormat = (moment) => dateTime.format(moment, "HH:mm");
    const timeDiff = dateTime.subtract(now, uploadTime).toDays();
    const upLoadTimeFormatted = timeFormat(uploadTime);
    if (timeDiff > 6) {
      return `${dateFormat(uploadTime)}, ${timeFormat(uploadTime)}`;
    }

    for (let i = 6; i >= 2; i--) {
      if (timeDiff > 6) {
        break;
      }
      if (timeDiff >= i) {
        return `${i} days ago, ${upLoadTimeFormatted}`;
      }
    }
    if (timeDiff >= 1) {
      return `Yesterday, ${upLoadTimeFormatted}`;
    }
    if (timeDiff >= 0) {
      return `Today, ${upLoadTimeFormatted}`;
    }
  };

  const deleteThisBlog = async () => {
    await axios.delete(`http://localhost:3001/blogs`,{
      data: {
        _id: blog._id
      }
    })
    dispatch(deleteBlog({ blogId: blog._id }));
  };

  const selfMenuItems = [
    {
      name: "Delete",
      onClick: deleteThisBlog,
    },
    {
      name: "Update",
      onClick: () => {
        setIsUpdateModalOpen(!isUpdateModalOpen);
      },
    },
  ];

  const otherMenuItems = [
    {
      name: "Save",
      onClick: () => {},
    },
  ];

  return (
    <Container>
      <div
        style={{ backgroundColor: `${user.pickedColor}` }}
        className="head-bar"
      ></div>
      <Header>
        <ProfileTitle
          displayedName={user.nickname ? user.nickname : user.firstName}
          imgSrc={
            user.profilePic
              ? user.profilePic
              : "https://images.pexels.com/photos/8652888/pexels-photo-8652888.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
          }
          color={user.pickedColor}
          uid={user._id}
        />
        <div className="header-right">
          <p className="upload-time">{uploadTime()}</p>
          <BottomMenu
            items={
              myProfile._id === blog.owner ? selfMenuItems : otherMenuItems
            }
            align="end"
            menuClasses="menu"
            btnUI={<BsThreeDots />}
          />
        </div>
      </Header>
      <Body>
        <div className="body-header">
          <Link
            style={{
              color: user.pickedColor,
            }}
            to={`/blog/detail?blogId=${blog._id}`}
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
