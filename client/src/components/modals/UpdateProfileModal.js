import { useState } from "react";
import ReactModal from "react-modal";

import UpdateProfileForm from "../forms/UpdateProfileForm";

const UpdateProfileModal = ({ isOpen, setIsOpen }) => {

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
        />
      </ReactModal>
    </>
  );
};

export default UpdateProfileModal;
