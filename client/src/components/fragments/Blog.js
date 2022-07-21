import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { selectMyBlogs, deleteBlog } from "../store/user/myBlogs-slice";
import { selectMyProfile } from "../store/user/myProfile-slice";
import { Link } from "react-router-dom";

import { BsThreeDots } from "react-icons/bs";
import "@szhsin/react-menu/dist/index.css";

import ProfileTitle from "./ProfileTitle";
import BottomMenu from "../modals/BlogMenu";

const Container = (props) => {
  return (
    <div className="Blog">
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

  const myBlogs = useSelector(selectMyBlogs);
  const dispatch = useDispatch();

  const callUserData = async () => {
    try {
      const res = await axios.get(`http://localhost:3001/users/${blog.owner}`);
      const data = await res.data.data;
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    callUserData();
  }, []);

  const menuItems = [
    {
      name: "Delete",
      onClick: () => {
        dispatch(deleteBlog({ id: blog._id, uid: blog.owner }));
      },
    },
  ];

  return (
    <Container>
      <Header>
        <ProfileTitle
          displayedName={user.firstName}
          imgSrc={
            user.profilePic
              ? user.profilePic
              : "https://images.pexels.com/photos/8652888/pexels-photo-8652888.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
          }
        />
        <BottomMenu
          items={menuItems}
          align="end"
          menuClasses="Blog__Inner__Header__Menu"
          btnUI={<BsThreeDots />}
        />
      </Header>
      <Body>
        <Link
          className="pickedColor-hoverOnly"
          to={`/blog/detail?uid=${user._id}&blogId=${blog._id}`}
        >
          <h2>{blog.title}</h2>
        </Link>
        <p>{blog.content}</p>
      </Body>
    </Container>
  );
};

export default Blog;
