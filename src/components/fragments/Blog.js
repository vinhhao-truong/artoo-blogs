import React, { useEffect } from "react";
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

const Blog = ({ profile, blogTitle, blogContent, blogId }) => {
  const myBlogs = useSelector(selectMyBlogs);
  const myProfile = useSelector(selectMyProfile);
  const dispatch = useDispatch();

  const menuItems = [
    {
      name: "Delete",
      onClick: () => {
        dispatch(deleteBlog({ id: blogId, uid: myProfile.uid }));
      },
    },
  ];

  return (
    <Container>
      <Header>
        <ProfileTitle
          displayedName={profile.firstName}
          imgSrc={profile.profilePic}
        />
        <BottomMenu
          items={menuItems}
          align="end"
          menuClasses="Blog__Inner__Header__Menu"
          btnUI={<BsThreeDots />}
        />
      </Header>
      <Body>
        <Link className="pickedColor-hoverOnly" to={`/blog/detail?uid=${myProfile.id}&blogId=${blogId}`}><h2>{blogTitle}</h2></Link>        
        <p>{blogContent}</p>
      </Body>
    </Container>
  );
};

export default Blog;
