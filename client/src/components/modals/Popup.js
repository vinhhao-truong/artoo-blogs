import hexToRgba from "hex-to-rgba";
import { useSelector } from "react-redux";
import ReactModal from "react-modal";
import { FaCopy } from "react-icons/fa";
import { RiFileAddFill, RiFileEditFill } from "react-icons/ri";

import { selectMyProfile } from "../store/user/myProfile-slice";

const PopupModal = ({ msg, action, isOpen, setIsOpen }) => {
  const myProfile = useSelector(selectMyProfile);

  const handleAfterOpen = () => {
    setTimeout(() => {
      setIsOpen(false);
    }, 1200);
  };
  return (
    <>
      {isOpen && (
        <ReactModal
          className="PopupModal"
          onAfterOpen={handleAfterOpen}
          overlayClassName="PopupOverlay"
          isOpen={isOpen}
        >
          <div
            style={{
              background: `${hexToRgba(myProfile.pickedColor, 0.7)}`,
            }}
            className="PopupContent"
          >
            {action === "copy" && <FaCopy />}
            {action === "add" && <RiFileAddFill />}
            {action === "update" && <RiFileEditFill />}
            {action === "update profile"}
            <p>{msg}</p>
          </div>
        </ReactModal>
      )}
    </>
  );
};

export default PopupModal;
