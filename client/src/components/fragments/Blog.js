import React, { useState, useEffect } from "react";
import { selectMyProfile } from "../../store/user/myProfile-slice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import "@szhsin/react-menu/dist/index.css";

import ProfileTitle from "./ProfileTitle";
import MenuThreeDots from "./MenuThreeDots";
import AddOrUpdateModal from "../modals/AddOrUpdateBlogModal";
import useGETFetch from "../../hooks/useFetch";

import { timeDiffFromNow } from "../../fns/formatTime";

import { getBackURL } from "../../fns/getURLPath";

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
    `${getBackURL(`/users/${blog.owner}/`)}`
  );
  const [limitedContent, setLimitedContent] = useState("");

  useEffect(() => {
    if (blog.owner === myProfile._id) {
      setOwner(myProfile);
    } else {
      setOwner(fetchedOwner);
    }
  }, [fetchedOwner, myProfile, blog]);

  useEffect(() => {
    const limit = 750;
    if (blog.content.length > limit) {
      setLimitedContent(blog.content.substring(0, limit));
    } else {
      setLimitedContent(blog.content);
    }
  }, [blog]);

  return (
    <>
      {owner && (
        <Container>
          <div
            style={{ backgroundColor: `${owner.pickedColor}` }}
            className="head-bar"
          ></div>
          <Header>
            <ProfileTitle
              displayedName={owner.nickname ? owner.nickname : owner.firstName}
              imgSrc={owner.profileImg}
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
                  color: `${owner.pickedColor} !important`,
                }}
                to={`/blog/detail?blogId=${blog._id}&owner=${blog.owner}`}
              >
                <h2>{blog.title}</h2>
              </Link>
              <p>
                @_{blog.artType ? blog.artType.toLowerCase() : "uncategorized"}
              </p>
            </div>
            <p className="body-content">
              {limitedContent}
              {blog.content.length > 750 && (
                <>
                  ...
                  <Link
                    style={{ color: owner.pickedColor }}
                    to={`/blog/detail?blogId=${blog._id}&owner=${blog.owner}`}
                    target="_blank"
                  >
                    See More
                  </Link>
                </>
              )}
            </p>
          </Body>
          <div className="images">
            {typeof blog.images === "object" &&
              blog.images.map((img, idx) => (
                <img src={img} alt="" key={`${blog._id}_${idx}`} />
              ))}
          </div>
          {isUpdateModalOpen && (
            <AddOrUpdateModal
              isOpen={isUpdateModalOpen}
              setIsOpen={setIsUpdateModalOpen}
              action="update"
              existedBlog={blog}
            />
          )}
        </Container>
      )}
    </>
  );
};

export default Blog;
