import { useState } from "react";
import ReactModal from "react-modal";
import ReactLoading from "react-loading";

const LoadingModal = ({ isLoading, type }) => {

  return (
    <ReactModal
      overlayClassName="NoneOverlay"
      className="LoadingModal"
      isOpen={isLoading}
    >
      <ReactLoading
        className="LoadingIcon"
        type={type ? type : "spinningBubbles"}
        height="3rem"
        width="3rem"
      />
    </ReactModal>
  );
};

export default LoadingModal;
