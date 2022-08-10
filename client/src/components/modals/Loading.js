import { useState } from "react";
import ReactModal from "react-modal";
import ReactLoading from "react-loading";
import { useDispatch, useSelector } from "react-redux";
import { selectFeatures } from "../../store/user/features-slice";

const LoadingModal = () => {
  const features = useSelector(selectFeatures);

  return (
    <ReactModal
      overlayClassName="NoneOverlay"
      className="LoadingModal"
      isOpen={features.loading}
    >
      <ReactLoading
        className="LoadingIcon"
        type="spinningBubbles"
        height="3rem"
        width="3rem"
      />
    </ReactModal>
  );
};

export default LoadingModal;
