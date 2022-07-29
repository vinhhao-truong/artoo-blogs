import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectMyProfile } from "../store/user/myProfile-slice";

import FetchedBlogList from "../fragments/FetchedBlogList";
import useGETFetch from "../hooks/useFetch";
import dateTime from "date-and-time";
import { useState } from "react";
import { useEffect } from "react";
import AddBlogBtn from "../styled-components/AddBlogBtn";
import AddOrUpdateModal from "../modals/AddOrUpdateBlogModal";
import MenuThreeDots from "../styled-components/MenuThreeDots";

const ProfileDetail = ({ profile }) => {
  return (
    <div className="Profile__profile__detail">
      <MenuThreeDots menuClasses="menu" profile={profile} />

      <div
        className="theme-color-top"
        style={{
          backgroundColor: `${profile.pickedColor}`,
        }}
      ></div>
      <div
        className="theme-color-bot"
        style={{
          backgroundColor: `${profile.pickedColor}`,
        }}
      ></div>
      <div
        className="theme-color-left"
        style={{
          backgroundColor: `${profile.pickedColor}`,
        }}
      ></div>
      <div
        className="theme-color-right"
        style={{
          backgroundColor: `${profile.pickedColor}`,
        }}
      ></div>
      <div className="top">
        <div className="img"></div>
        <h2
          className="displayName"
          style={{
            color: `${profile.pickedColor}`,
          }}
        >
          {profile.nickname ? profile.nickname : profile.firstName}
        </h2>
      </div>
      <div className="main">
        {profile.nickname && (
          <p>
            <span className="title"> @real_name: </span>
            <span className="content">
              {profile.firstName} {profile.lastName}
            </span>
          </p>
        )}
        <p>
          <span className="title">@birth_date: </span>
          <span className="content">
            {dateTime.format(new Date(profile.dob), "DD-MM-YYYY")}
          </span>
        </p>
        {profile.bio && (
          <p>
            <span className="title">@bio: </span>
            <span className="content bio">{profile.bio}</span>
          </p>
        )}
      </div>
    </div>
  );
};

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [emptyBlogMsg, setEmptyBlogMsg] = useState("");

  const location = useLocation();
  const pathname = location.pathname;
  const currentUid = pathname.substring(pathname.lastIndexOf("/") + 1);

  const { resData } = useGETFetch(`http://localhost:3001/users/${currentUid}`);
  const myProfile = useSelector(selectMyProfile);

  useEffect(() => {
    setProfile(resData);
    if (resData) {
      if (myProfile._id === resData._id) {
        setEmptyBlogMsg("You have no blog!");
      } else {
        const displayedName = resData.nickname
          ? resData.nickname
          : resData.firstName;
        setEmptyBlogMsg(`${displayedName} has no blog!`);
      }
    }
  }, [resData, myProfile]);

  return (
    <>
      <div className="Profile">
        {profile && (
          <>
            <FetchedBlogList
              className="Profile_blogList"
              url={`http://localhost:3001/users/${resData._id}?q=myBlogs`}
              emptyMsg={emptyBlogMsg}
              state={myProfile}
            />
            <div className="Profile__profile">
              <ProfileDetail profile={profile} />
            </div>
            {profile._id === myProfile._id && (
              <>
                <AddBlogBtn
                  className="Profile__addBtn"
                  onClick={() => {
                    setIsAddModalOpen(true);
                  }}
                />
                <AddOrUpdateModal
                  setIsOpen={setIsAddModalOpen}
                  isOpen={isAddModalOpen}
                  action="add"
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
