import { useState } from "react";
import ReactModal from "react-modal";

import UpdateProfileForm from "../forms/UpdateProfileForm";
import PopupModal from "./Popup";

const UpdateProfileModal = ({ isOpen, setIsOpen }) => {
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
        className="UpdateProfileModal"
        isOpen={isOpen}
      >
        <UpdateProfileForm
          closeModal={() => {
            setIsOpen(false);
          }}
          setIsPopupOpen={setIsPopupOpen}
          setPopupMsg={setPopupMsg}
        />
      </ReactModal>
      {isOpen && (
        <PopupModal
          action="update profile"
          msg={popupMsg}
          isOpen={isPopupOpen}
          setIsOpen={setIsPopupOpen}
        />
      )}
    </>
  );
}

export default UpdateProfileModal;