import { useRef, useState } from "react";
import { ControlledMenu, MenuItem } from "@szhsin/react-menu";
import { HiChevronRight } from "react-icons/hi";
import ReactLoading from "react-loading";
import { useNavigate, useLocation } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectMyProfile } from "../../store/user/myProfile-slice";

import upperFirstLetter from "../../fns/upperFirstLetter";
import useGETFetch from "../../hooks/useFetch";

const TypeFilter = ({ isAll, uid }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef();

  const myProfile = useSelector(selectMyProfile);
  const navigate = useNavigate();

  const { resData: list} = useGETFetch(`/blogs/filter/allArtTypes?for=${isAll ? "all": uid}`)
  const renderedList = list ? ["all", ...list].sort() : null;

  const handleFilter = (query) => () => {
    switch (query) {
      case "all":
        navigate(location.pathname);
        break;
      case "uncategorized":
        break;
      default:
    }

    if (query === "all") {
    } else {
      const path = location.pathname;
      navigate(`${path}?filter=${query}`);
    }
  };

  return (
    <div className="TypeFilter">
      <div
        onMouseEnter={() => {
          setIsMenuOpen(true);
        }}
        onMouseLeave={() => {
          setIsMenuOpen(false);
        }}
        ref={menuRef}
        className="FilterBtn"
        style={{
          backgroundColor: myProfile.pickedColor,
        }}
      >
        <HiChevronRight />
      </div>
      <ControlledMenu
        onMouseEnter={() => {
          setIsMenuOpen(true);
        }}
        onMouseLeave={() => {
          setIsMenuOpen(false);
        }}
        anchorRef={menuRef}
        state={isMenuOpen ? "open" : "closed"}
        className="menu"
        direction="right"
        offsetX={5}
        align="center"
      >
        {list &&
          renderedList.map((type, idx) => (
            <MenuItem onClick={handleFilter(type.toLowerCase())} key={idx}>
              {upperFirstLetter(type)}
            </MenuItem>
          ))}
        {!list && (
          <ReactLoading
            color={myProfile.pickedColor}
            className="loading"
            height={20}
            width={20}
            type="spin"
          />
        )}
      </ControlledMenu>
    </div>
  );
};

export default TypeFilter;
