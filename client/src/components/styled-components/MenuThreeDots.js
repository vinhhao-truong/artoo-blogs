import { useState } from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import axios from "axios";
import { BsThreeDots } from "react-icons/bs";

import { useDispatch, useSelector } from "react-redux";
import { deleteBlog, selectMyProfile } from "../store/user/myProfile-slice";
import AddOrUpdateModal from "../modals/AddOrUpdateBlogModal";
import { getFrontURL } from "../fns/getURLPath";
import PopupModal from "../modals/Popup";
import UpdateProfileModal from "../modals/UpdateProfileModal";

const ProfileMenu = ({ profile }) => {
  const [isCopiedModalOpen, setIsCopiedModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const myProfile = useSelector(selectMyProfile);

  const copiedURL = profile ? getFrontURL(`/profile/${profile._id}`) : "";

  const myProfileItems = [
    {
      name: "Copy Profile URL",
      onClick: () => {
        navigator.clipboard.writeText(copiedURL);
        setIsCopiedModalOpen(true);
      },
    },
    {
      name: "Edit",
      onClick: () => {
        setIsUpdateModalOpen(true);
      },
    },
  ];
  const otherProfileItems = [
    {
      name: "Copy Profile URL",
      onClick: () => {
        navigator.clipboard.writeText(copiedURL);
        setIsCopiedModalOpen(true);
      },
    },
  ];
  const menuItems =
    profile._id === myProfile._id
      ? [...myProfileItems]
      : [...otherProfileItems];
  return (
    <>
      <Menu
        align="start"
        menuButton={
          <MenuButton>
            <BsThreeDots />
          </MenuButton>
        }
      >
        {menuItems.map((item) => (
          <MenuItem onClick={item.onClick} key={`${profile._id}_${item.name}`}>
            {item.name}
          </MenuItem>
        ))}
      </Menu>
      {isCopiedModalOpen && (
        <PopupModal
          isOpen={isCopiedModalOpen}
          setIsOpen={setIsCopiedModalOpen}
          msg="The Profile URL Copied!"
          action="copy"
        />
      )}
      {isUpdateModalOpen && (
        <UpdateProfileModal
          isOpen={isUpdateModalOpen}
          setIsOpen={setIsUpdateModalOpen}
        />
      )}
    </>
  );
};

const BlogMenu = ({ blog }) => {
  const myProfile = useSelector(selectMyProfile);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCopiedModalOpen, setIsCopiedModalOpen] = useState(false);

  const copiedURL = getFrontURL(
    `/blog/detail?blogId=${blog._id}&owner=${blog.owner}`
  );

  const isOwned = myProfile._id === blog.owner;

  const handleDeleteBlog = async () => {
    await axios.delete(`http://localhost:3001/blogs`, {
      data: {
        _id: blog._id,
      },
    });
    dispatch(deleteBlog({ blogId: blog._id }));
  };

  const unownedItems = [
    {
      name: "Copy Blog URL",
      onClick: () => {
        navigator.clipboard.writeText(copiedURL);
        setIsCopiedModalOpen(true);
      },
    },
  ];
  const ownedItems = [
    {
      name: "Copy Blog URL",
      onClick: () => {
        navigator.clipboard.writeText(copiedURL);
        setIsCopiedModalOpen(true);
      },
    },
    {
      name: "Delete",
      onClick: handleDeleteBlog,
    },
    {
      name: "Update",
      onClick: () => {
        setIsUpdateModalOpen(!isUpdateModalOpen);
      },
    },
  ];
  const menuItems = isOwned ? [...ownedItems] : [...unownedItems];

  return (
    <>
      <Menu
        align="end"
        menuButton={
          <MenuButton>
            <BsThreeDots />
          </MenuButton>
        }
      >
        {menuItems.map((item) => (
          <MenuItem onClick={item.onClick} key={`${blog._id}_${item.name}`}>
            {item.name}
          </MenuItem>
        ))}
      </Menu>
      <AddOrUpdateModal
        isOpen={isUpdateModalOpen}
        setIsOpen={setIsUpdateModalOpen}
        action="update"
        existedBlog={blog}
      />
      <PopupModal
        isOpen={isCopiedModalOpen}
        setIsOpen={setIsCopiedModalOpen}
        msg="The Blog URL Copied!"
        action="copy"
      />
    </>
  );
};

const MenuThreeDots = ({ menuClasses, blog, profile }) => {
  const classes = menuClasses ? menuClasses : "";

  return (
    <div className={`MenuThreeDots ${classes}`}>
      {blog && <BlogMenu blog={blog} />}
      {profile && <ProfileMenu profile={profile} />}
    </div>
  );
};

export default MenuThreeDots;
