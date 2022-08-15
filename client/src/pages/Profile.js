import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectMyProfile } from "../store/user/myProfile-slice";

import FetchedBlogList from "../components/fragments/FetchedBlogList";
import useGETFetch from "../hooks/useFetch";
import dateTime from "date-and-time";
import { useState } from "react";
import { useEffect } from "react";
import AddBlogBtn from "../components/styled-components/AddBlogBtn";
import AddOrUpdateModal from "../components/modals/AddOrUpdateBlogModal";
import MenuThreeDots from "../components/fragments/MenuThreeDots";

import { getBackURL } from "../fns/getURLPath";
import { setImgPreview } from "../store/user/features-slice";
import { ChildHelmet } from "../components/fragments/Helmet";
import TypeFilter from "../components/fragments/TypeFilter";

const ProfileDetail = ({ profile }) => {
  const dispatch = useDispatch();

  const displayName = profile.nickname ? profile.nickname : profile.firstName;

  const handlePreview = () => {
    dispatch(
      setImgPreview({
        isOpen: true,
        title: `${displayName}'s photo`,
        imgUrl: profile.profileImg,
      })
    );
  };

  return (
    <div className="Profile__profile__detail">
      <MenuThreeDots menuClasses="menu" profile={profile} />

      <div className="top">
        <img
          className="img"
          src={profile.profileImg}
          alt="profileImg"
          onClick={handlePreview}
        />

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
        <p>
          <span className="title"> @full_name: </span>
          <span className="content">
            {profile.firstName} {profile.lastName}
          </span>
        </p>

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
    </div>
  );
};

const Profile = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const currentUid = pathname.substring(pathname.lastIndexOf("/") + 1);

  const [profile, setProfile] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [emptyBlogMsg, setEmptyBlogMsg] = useState("");
  const [blogListApiUrl, setBlogListApiUrl] = useState(getBackURL(`/users/${currentUid}?q=myBlogs`));

  const { resData } = useGETFetch(getBackURL(`/users/${currentUid}`));
  const myProfile = useSelector(selectMyProfile);

  useEffect(() => {
    if (currentUid === myProfile._id) {
      setProfile(myProfile);
    } else {
      setProfile(resData);
    }
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
  }, [resData, myProfile, currentUid]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filterParam = searchParams.get("filter");
    if (filterParam) {
      setBlogListApiUrl(
        getBackURL(`/users/${profile._id}?q=myBlogs&artType=${filterParam}`)
      );
    } else {
      setBlogListApiUrl(getBackURL(`/users/${currentUid}?q=myBlogs`));
    }
  }, [location, profile]);

  return (
    <>
      <div className="Profile">
        {profile && (
          <>
            <ChildHelmet
              title={profile.nickname ? profile.nickname : profile.firstName}
            />
            <TypeFilter uid={currentUid} />
            <FetchedBlogList
              className="Profile__blogList"
              url={blogListApiUrl}
              emptyMsg={emptyBlogMsg}
              state={profile}
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
