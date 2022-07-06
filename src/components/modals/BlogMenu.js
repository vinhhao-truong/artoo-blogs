import React from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import { BsThreeDots } from "react-icons/bs";

const BottomMenu = ({ items, menuClasses, btnUI, align }) => {
  return (
    <div className={`Menu ${menuClasses}`}>
      <Menu align={align} menuButton={<MenuButton>{btnUI}</MenuButton>}>
        {items.map((item, idx) => (
          <MenuItem onClick={item.onClick} key={idx}>
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default BottomMenu;
