import React, { useState, useRef, forwardRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout, selectAuth } from "../../store/user/auth-slice";
import { selectMyProfile } from "../../store/user/myProfile-slice";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

import { Link, NavLink, useLocation, useMatch, useNavigate } from "react-router-dom";
import { TiArrowSortedDown } from "react-icons/ti";
import { BiNews, BiHomeSmile, BiLogIn } from "react-icons/bi";
import { MdOutlineAssignmentInd } from "react-icons/md";

import useResponsive from "../../hooks/useResponsive";
import { ControlledMenu, MenuItem } from "@szhsin/react-menu";

import { BiSearchAlt2 } from "react-icons/bi";
import { AutoComplete, Input } from "antd";
import { startLoading, stopLoading } from "../../store/user/features-slice";

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
        {item.icon}
        {item.name}
      </NavLink>
    </li>
  );
};

const SideProfile = forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      className="SideProfile pickedColor-hover"
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {props.children}
    </div>
  );
});

//auth
const PrivateNav = ({ isMobileOrTablet }) => {
  const sideProfileRef = useRef();

  const [sideProfileIsOpened, setSideProfileIsOpened] = useState(false);
  const [searchContent, setSearchContent] = useState("");
  const [searchList, setSearchList] = useState(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const myProfile = useSelector(selectMyProfile);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleSearchChange = async (value) => {
    setSearchContent(value);
    if (value) {
      try {
        setIsSearchLoading(true);
        const searchListRes = await axios.get(`/users/search?name=${value}`);
        const searchListData = searchListRes.data.data;
        // console.log(res.data);
        setSearchList(
          searchListData.map((item) => ({
            value: `${item.nickname ? item.nickname : item.name}`,
            label: (
              <div style={{ alignContent: "center" }}>
                {item.nickname ? (
                  <>
                    <span style={{ color: item.color }}>{item.name}</span> @{" "}
                    <span style={{ color: item.color }}>
                      {item.nickname.split(" ").join("_")}
                    </span>
                  </>
                ) : (
                  item.name
                )}
              </div>
            ),
            uid: item.uid,
          }))
        );
        setIsSearchLoading(false);
      } catch (err) {
        console.log(err);
      }
    } else {
      setSearchList(null);
    }
  };

  const handleSearchSelect = (value, options) => {
    navigate(`/profile/${options.uid}`);
    value = "";
  };

  const mainNavItems = [
    {
      icon: <BiNews />,
      name: "News Feed",
      path: "/",
    },
    {
      icon: <BiHomeSmile />,
      name: "My Blogs",
      path: "/my-blogs",
    },
  ];

  const sideProfileItems = [
    {
      name: "My Profile",
      onClick: () => {
        navigate(`/profile/${myProfile._id}`);
      },
    },
    {
      name: "Account Settings",
      onClick: () => {
        navigate("/account");
      },
    },
    {
      name: "Logout",
      onClick: () => {
        dispatch(startLoading());

        dispatch(logout());
        navigate("/");

        dispatch(stopLoading());
      },
    },
  ];

  return (
    <>
      {!isMobileOrTablet && (
        <NavMain className="PrivateNav">
          {mainNavItems.map((item, idx) => (
            <NavMainItem key={idx} item={item} />
          ))}
        </NavMain>
      )}
      <div
        className={`right-nav ${isMobileOrTablet ? "right-nav-mobile" : ""}`}
      >
        <AutoComplete
          className={`search-bar ${
            isMobileOrTablet ? "search-bar-mobile" : ""
          }`}
          dropdownMatchSelectWidth={230}
          style={{
            width: 300,
            height: "80%",
          }}
          options={searchList}
          onChange={handleSearchChange}
          onSelect={handleSearchSelect}
          notFoundContent={
            !searchList ? "Please input an artist name!" : "No artist found!"
          }
        >
          <Input
            size="medium"
            placeholder="Search @artists"
            suffix={<BiSearchAlt2 />}
          />
        </AutoComplete>
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
            <img src={myProfile.profileImg} alt="" />
            <TiArrowSortedDown />
          </div>
        </SideProfile>
      </div>
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
const PublicNav = () => {
  const mainItems = [
    {
      icon: <BiLogIn />,
      name: "Log In",
      path: "/login",
    },
    {
      icon: <MdOutlineAssignmentInd />,
      name: "Sign Up",
      path: "/signup",
    },
  ];

  return (
    <NavMain className={`PublicNav`}>
      {mainItems.map((item, idx) => (
        <NavMainItem key={idx} item={item} />
      ))}
    </NavMain>
  );
};

const Navigation = ({ isLoggedIn, setIsRefreshed }) => {
  const isTabletOrMobile = useResponsive("Tablet or Mobile");
  const location = useLocation();
  const auth = useSelector(selectAuth);

  const matchHome = useMatch("/");
  const matchNotFound = useMatch("/not-found");

  const isRender = auth.isAuth || !matchHome;
  console.log(location);
  return (
    <>
      {
        //No nav on landing page
        isRender && !matchNotFound && (
          <div className="Navigation">
            <Logo>
              <Link
                to="/"
                onClick={() => {
                  if (location.pathname === "/" && !location.search) {
                    setIsRefreshed(true);
                  }
                }}
              >
                <span className="pickedColor-hover">Artoo</span> Blogs
              </Link>
            </Logo>
            {isLoggedIn ? (
              <PrivateNav isMobileOrTablet={isTabletOrMobile} />
            ) : (
              <PublicNav />
            )}
          </div>
        )
      }
    </>
  );
};

export default Navigation;
