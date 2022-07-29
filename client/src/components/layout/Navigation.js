import React, { useState, useRef, forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/user/auth-slice";
import { selectMyProfile } from "../store/user/myProfile-slice";

import { Link, NavLink, useNavigate } from "react-router-dom";
import { TiArrowSortedDown } from "react-icons/ti";

import useResponsive from "../hooks/useResponsive";
import { ControlledMenu, MenuItem } from "@szhsin/react-menu";

const Logo = (props) => {
  return <div className="Navigation__Logo">{props.children}</div>;
};

const NavMain = (props) => {
  return (
    <ul className={`Navigation__NavMain ${props.className}`}>
      {props.children}
    </ul>
  );
};

const NavMainItem = ({ idx, item }) => {
  return (
    <li key={idx}>
      <NavLink className="pickedColor-hover" to={item.path}>
        {item.title}
      </NavLink>
    </li>
  );
};

const SideProfile = forwardRef((props, ref) => {
  const myProfile = useSelector(selectMyProfile)
  const navigate = useNavigate();

  const handleSideProfileClick = (e) => {
    navigate(`/profile/${myProfile._id}`)
  }

  return (
    <div
      ref={ref}
      className="Navigation__SideProfile pickedColor-hover"
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onClick={handleSideProfileClick}
    >
      {props.children}
    </div>
  );
});

//auth
const PrivateNav = ({ isMobileOrTablet }) => {
  const sideProfileRef = useRef();
  const [sideProfileIsOpened, setSideProfileIsOpened] = useState(false);

  const myProfile = useSelector(selectMyProfile);
  const dispatch = useDispatch();

  const mainItems = [
    {
      title: "News Feed",
      path: "/",
    },
    {
      title: "My Blogs",
      path: "/my-blogs",
    },
  ];

  const sideProfileItems = [
    {
      name: "Logout",
      onClick: () => {
        dispatch(logout());
      },
    },
  ];

  return (
    <>
      {!isMobileOrTablet && (
        <NavMain className="PrivateNav">
          {mainItems.map((item, idx) => (
            <NavMainItem key={idx} item={item} />
          ))}
        </NavMain>
      )}
      <SideProfile
        ref={sideProfileRef}
        onMouseEnter={() => {
          setSideProfileIsOpened(true);
        }}
        onMouseLeave={() => setSideProfileIsOpened(false)}
      >
        {!isMobileOrTablet && (
          <p>
            Welcome,{" "}
            {myProfile.nickname ? myProfile.nickname : myProfile.firstName}
          </p>
        )}
        <div className="image">
          <img
            src="https://images.pexels.com/photos/8652888/pexels-photo-8652888.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=750&w=1260"
            alt=""
          />
          <TiArrowSortedDown />
        </div>
      </SideProfile>
      <ControlledMenu
        state={sideProfileIsOpened ? "open" : "closed"}
        anchorRef={sideProfileRef}
        onMouseEnter={() => {
          setSideProfileIsOpened(true);
        }}
        onMouseLeave={() => setSideProfileIsOpened(false)}
        onClose={() => setSideProfileIsOpened(false)}
        align="end"
      >
        {sideProfileItems.map((item, idx) => (
          <MenuItem onClick={item.onClick} key={idx}>
            {item.name}
          </MenuItem>
        ))}
      </ControlledMenu>
    </>
  );
};

//not auth
const PublicNav = ({ isMobileOrTablet }) => {
  const mainItems = [
    {
      title: "Log In",
      path: "/login",
    },
    {
      title: "Sign Up",
      path: "/signup",
    },
  ];

  return (
    <NavMain className={`PublicNav ${isMobileOrTablet ? "mobile" : ""}`}>
      {mainItems.map((item, idx) => (
        <NavMainItem key={idx} item={item} />
      ))}
    </NavMain>
  );
};

const Navigation = ({ isLoggedIn }) => {
  const isTabletOrMobile = useResponsive("Tablet or Mobile");

  return (
    <div className="Navigation">
      <Logo>
        <Link to="/">
          <span className="pickedColor-hover">Artoo</span> Blogs
        </Link>
      </Logo>
      {isLoggedIn ? (
        <PrivateNav isMobileOrTablet={isTabletOrMobile} />
      ) : (
        <PublicNav isMobileOrTablet={isTabletOrMobile} />
      )}
    </div>
  );
};

export default Navigation;
