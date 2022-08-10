import hexToRgba from "hex-to-rgba";
import { useDispatch, useSelector } from "react-redux";

import ReactModal from "react-modal";
import { FaCopy } from "react-icons/fa";
import { RiFileAddFill, RiFileEditFill,RiDeleteBin5Fill } from "react-icons/ri";
import {CgProfile} from "react-icons/cg"
import {MdOutlineMarkEmailRead} from "react-icons/md"

import { selectMyProfile } from "../../store/user/myProfile-slice";
import { selectFeatures, triggerPopup } from "../../store/user/features-slice";

const PopupModal = () => {
  const myProfile = useSelector(selectMyProfile);
  const features = useSelector(selectFeatures);
  const dispatch = useDispatch();

  const handleAfterOpen = () => {
    setTimeout(() => {
      dispatch(triggerPopup({
        msg: "",
        action: ""
      }))
    }, 2000);
  };
  return (
    <>
      {features.popup.isOpen && (
        <ReactModal
          className="PopupModal"
          onAfterOpen={handleAfterOpen}
          overlayClassName="PopupOverlay"
          isOpen={features.popup.isOpen}
        >
          <div
            style={{
              background: `${hexToRgba(myProfile.pickedColor, 0.7)}`,
            }}
            className="PopupContent"
          >
            {features.popup.action === "copy" && <FaCopy />}
            {features.popup.action === "add" && <RiFileAddFill />}
            {features.popup.action === "update" && <RiFileEditFill />}
            {features.popup.action === "update profile" && <CgProfile />}
            {features.popup.action === "delete" && <RiDeleteBin5Fill />}
            {features.popup.action === "email sent" && <MdOutlineMarkEmailRead />}

            <p>{features.popup.msg}</p>
          </div>
        </ReactModal>
      )}
    </>
  );
};

export default PopupModal;
