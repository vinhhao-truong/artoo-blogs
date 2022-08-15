import React, { useState, useEffect } from "react";
import { selectMyProfile } from "../../store/user/myProfile-slice";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Image } from "antd";
import { Col, Row } from "antd";

import "@szhsin/react-menu/dist/index.css";

import ProfileTitle from "./ProfileTitle";
import MenuThreeDots from "./MenuThreeDots";
import AddOrUpdateModal from "../modals/AddOrUpdateBlogModal";
import useGETFetch from "../../hooks/useFetch";

import { timeDiffFromNow } from "../../fns/formatTime";
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
    `/users/${blog.owner}/`
  );
  const [limitedContent, setLimitedContent] = useState("");
  const [previewImgList, setPreviewImgList] = useState([]);
  const [previewImgClasses, setPreviewImgClasses] = useState("");

  useEffect(() => {
    if (blog.owner === myProfile._id) {
      setOwner(myProfile);
    } else {
      setOwner(fetchedOwner);
    }
  }, [fetchedOwner, myProfile, blog]);

  useEffect(() => {
    const charLimit = 750;
    if (blog.content.length > charLimit) {
      setLimitedContent(blog.content.substring(0, charLimit));
    } else {
      setLimitedContent(blog.content);
    }

    const imgLimit = 5;
    if (blog.images.length >= imgLimit) {
      setPreviewImgList(blog.images.slice(0, imgLimit));
      setPreviewImgClasses(`images-${imgLimit}`);
    } else {
      setPreviewImgList([...blog.images]);
      setPreviewImgClasses(`images-${blog.images.length}`);
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
          <div className={`images ${previewImgClasses}`}>
            {blog.images.length >= 5 && (
              <>
                <Row gutter={[1, 1]} wrap>
                  {blog.images.slice(0, 2).map((img, idx) => (
                    <Col span={12} key={blog._id + `_first_${idx}`}>
                      <Image src={img} alt={blog._id + "-preview"} />
                    </Col>
                  ))}
                  {blog.images.slice(2, 4).map((img, idx) => (
                    <Col span={8} key={blog._id + `_second_${idx}`}>
                      <Image src={img} alt={blog._id + "-preview"} />
                    </Col>
                  ))}
                  <Col span={8} key={blog._id + "third"}>
                    <Image src={blog.images[4]} alt={blog._id + "-preview"} />
                    {blog.images.length > 5 && (
                      <Link
                        to={`/blog/detail?blogId=${blog._id}&owner=${blog.owner}`}
                        className="extended-mask"
                      >
                        <p>+{blog.images.length - 5}</p>
                      </Link>
                    )}
                  </Col>
                </Row>
              </>
            )}
            {blog.images.length < 5 && blog.images.length !== 1 && (
              <Row gutter={[1, 1]} wrap>
                {blog.images.map((img, idx) => (
                  <Col
                    span={blog.images.length !== 3 ? 12 : 8}
                    key={blog._id + `_first_${idx}`}
                  >
                    <Image src={img} alt={blog._id + "-preview"} />
                  </Col>
                ))}
              </Row>
            )}
            {blog.images.length === 1 && (
              <Image src={blog.images[0]} alt={blog._id + "-preview"} />
            )}
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
