import { useState } from "react";
import ReactModal from "react-modal";

import AddOrUpdateBlogForm from "../forms/AddOrUpdateBlogForm";
import PopupModal from "./Popup";

const AddOrUpdateBlogModal = ({ isOpen, setIsOpen, action, existedBlog }) => {

  return (
    <>
      <ReactModal
        onRequestClose={() => {
          setIsOpen(!isOpen);
        }}
        shouldCloseOnEsc
        shouldCloseOnOverlayClick
        overlayClassName="BlurredOverlay"
        className="AddOrUpdateBlogModal"
        isOpen={isOpen}
      >
        <AddOrUpdateBlogForm
          action={action}
          closeModal={() => {
            setIsOpen(false);
          }}
          existedBlog={existedBlog}
        />
      </ReactModal>
    </>
  );
};

export default AddOrUpdateBlogModal;
