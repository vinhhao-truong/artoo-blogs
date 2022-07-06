import React, { useState, useRef, forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth, login, logout } from "../store/user/auth-slice";

import { Link, NavLink } from "react-router-dom";
import { TiArrowSortedDown } from "react-icons/ti";

import useResponsive from "../hooks/useResponsive";
import { ControlledMenu, Menu, MenuButton, MenuItem } from "@szhsin/react-menu";

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
  return (
    <div
      ref={ref}
      className="Navigation__SideProfile pickedColor-hoverOnly"
      onMouseEnter={props.onMouseEnter}
    >
      {props.children}
    </div>
  );
});

//auth
const PrivateNav = ({ isMobileOrTablet }) => {
  const sideProfileRef = useRef();
  const [sideProfileIsOpened, setSideProfileIsOpened] = useState(false);

  const auth = useSelector(selectAuth);
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
      >
        {!isMobileOrTablet && <p>Welcome</p>}
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
        onMouseLeave={() => setSideProfileIsOpened(false)}
        onClose={() => setSideProfileIsOpened(false)}
        align="end"
      >
        {
          sideProfileItems.map((item, idx) => (
            <MenuItem onClick={item.onClick} key={idx}>{item.name}</MenuItem>
          ))
        }
      </ControlledMenu>
    </>
  );
};

//not auth
const PublicNav = ({ isMobileOrTablet }) => {
  const auth = useSelector(selectAuth);
  const dispatch = useDispatch();

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

  if (!isMobileOrTablet) {
    return (
      <NavMain className="PublicNav">
        {mainItems.map((item, idx) => (
          <NavMainItem key={idx} item={item} />
        ))}
      </NavMain>
    );
  }
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
