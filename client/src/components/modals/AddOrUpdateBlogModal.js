import { useState } from "react";
import ReactModal from "react-modal";

import AddOrUpdateBlogForm from "../forms/AddOrUpdateBlogForm";
import PopupModal from "./Popup";

const AddOrUpdateBlogModal = ({ isOpen, setIsOpen, action, existedBlog }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupMsg, setPopupMsg] = useState("");

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
          setIsPopupOpen={setIsPopupOpen}
          setPopupMsg={setPopupMsg}
        />
      </ReactModal>
      {action && (
        <PopupModal
          action={action}
          msg={popupMsg}
          isOpen={isPopupOpen}
          setIsOpen={setIsPopupOpen}
        />
      )}
    </>
  );
};

export default AddOrUpdateBlogModal;
