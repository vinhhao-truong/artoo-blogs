import { useState } from "react";
import { Menu, MenuButton, MenuItem } from "@szhsin/react-menu";
import "@szhsin/react-menu/dist/index.css";
import axios from "axios";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";

import { useDispatch, useSelector } from "react-redux";
import { deleteBlog, selectMyProfile } from "../../store/user/myProfile-slice";
import AddOrUpdateModal from "../modals/AddOrUpdateBlogModal";
import { getFrontURL } from "../../fns/getURLPath";
import { getBackURL } from "../../fns/getURLPath";
import UpdateProfileModal from "../modals/UpdateProfileModal";
import AlertModal from "../modals/Alert";
import { startLoading, stopLoading, triggerPopup } from "../../store/user/features-slice";

import { firebaseStorage } from "../../store/firebase";
import { deleteObject, ref } from "firebase/storage";

const ProfileMenu = ({ profile }) => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const myProfile = useSelector(selectMyProfile);
  const dispatch = useDispatch();

  const copiedURL = profile ? getFrontURL(`/profile/${profile._id}`) : "";

  const myProfileItems = [
    {
      name: "Copy Profile URL",
      onClick: () => {
        navigator.clipboard.writeText(copiedURL);
        dispatch(
          triggerPopup({
            msg: `${
              profile.nickname ? profile.nickname : profile.firstName
            } URL copied!`,
            action: "copy",
          })
        );
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
        dispatch(
          triggerPopup({
            msg: `${
              profile.nickname ? profile.nickname : profile.firstName
            } URL copied!`,
            action: "copy",
          })
        );
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
      <UpdateProfileModal
        isOpen={isUpdateModalOpen}
        // isOpen={true}
        setIsOpen={setIsUpdateModalOpen}
      />
    </>
  );
};

const BlogMenu = ({ blog }) => {
  const myProfile = useSelector(selectMyProfile);
  const dispatch = useDispatch();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const copiedURL = getFrontURL(
    `/blog/detail?blogId=${blog._id}&owner=${blog.owner}`
  );

  const isOwned = myProfile._id === blog.owner;

  const handleDeleteBlog = async () => {
    dispatch(startLoading())
    try {
      await axios.delete(getBackURL(`/blogs`), {
        data: {
          _id: blog._id,
        },
      });
      if (blog.images.length > 0) {
        console.log("images")
        for (let i = 1; i <= blog.images.length; i++) {
          const blogImagesStorageRef = ref(
            firebaseStorage,
            `images/blogs/${blog._id}_${i}`
          );
          await deleteObject(blogImagesStorageRef);
        }
      }
      setIsDeleteModalOpen(false);
      dispatch(deleteBlog({ blogId: blog._id }));
      dispatch(
        triggerPopup({
          action: "delete",
          msg: `${blog.title} deleted!`,
        })
      );
    } catch (err) {
      console.log(err);
    }
    dispatch(stopLoading())
  };

  const unownedItems = [
    {
      name: "Copy Blog URL",
      onClick: () => {
        navigator.clipboard.writeText(copiedURL);
        dispatch(
          triggerPopup({
            action: "copy",
            msg: `${blog.title} URL copied!`,
          })
        );
      },
    },
  ];
  const ownedItems = [
    {
      name: "Copy Blog URL",
      onClick: () => {
        navigator.clipboard.writeText(copiedURL);
        dispatch(
          triggerPopup({
            action: "copy",
            msg: `${blog.title} URL copied!`,
          })
        );
      },
    },
    {
      name: "Delete",
      onClick: () => {
        setIsDeleteModalOpen(true);
      },
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
      {isDeleteModalOpen && (
        <AlertModal
          isTwoWays={true}
          isOpen={isDeleteModalOpen}
          setIsOpen={setIsDeleteModalOpen}
          type="failure"
          customIcon={<RiDeleteBin6Line />}
          title={`Delete ${blog.title}?`}
          content="This blog will not be able to be recovered!"
          onYes={handleDeleteBlog}
          onNo={() => {
            setIsDeleteModalOpen(false);
          }}
          yesBtn="Delete"
          noBtn="Cancel"
        />
      )}
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
