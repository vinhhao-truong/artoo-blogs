import React from "react";
import useResponsive from "../../hooks/useResponsive";
import { NavLink } from "react-router-dom";
import { BiNews, BiHomeSmile } from "react-icons/bi";
import { selectMyProfile } from "../../store/user/myProfile-slice";
import { useSelector } from "react-redux";

const NavMain = (props) => {
  return (
    <ul className={`MobileSubNav__NavMain ${props.className}`}>
      {props.children}
    </ul>
  );
};

const NavMainItem = (props) => {
  const myProfile = useSelector(selectMyProfile);
  const Logo = props.inner;
  return (
    <li key={props.idx}>
      <NavLink style={{ color: myProfile.pickedColor }} to={props.item.path}>
        <Logo />
        <span>{props.item.title}</span>
      </NavLink>
    </li>
  );
};

const MobileSubNav = ({ isLoggedIn }) => {
  const isTabletOrMobile = useResponsive("Tablet or Mobile");

  const mainItems = [
    {
      logo: BiNews,
      title: "News Feed",
      path: "/",
    },
    {
      logo: BiHomeSmile,
      title: "My Blogs",
      path: "/my-blogs",
    },
  ];

  if (isTabletOrMobile && isLoggedIn) {
    return (
      <div className="MobileSubNav">
        <NavMain>
          {mainItems.map((item, idx) => (
            <NavMainItem key={idx} item={item} inner={item.logo} />
          ))}
        </NavMain>
      </div>
    );
  }
};

export default MobileSubNav;
