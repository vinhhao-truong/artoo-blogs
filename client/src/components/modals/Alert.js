import ReactModal from "react-modal";
import { TiTick } from "react-icons/ti";
import { ImCross } from "react-icons/im";
import { RiDeleteBin5Fill } from "react-icons/ri";

import { useDispatch, useSelector } from "react-redux";
import { selectFeatures } from "../../store/user/features-slice";
import styled from "styled-components";
import { selectMyProfile } from "../../store/user/myProfile-slice";

import presetColor from "../../preset/presetColor";

const Head = styled.div`
  .head-left {
    .icon {
      border: ${(props) => props.pickedColor} solid 1px;
      color: ${(props) => props.pickedColor};
    }
  }
`;

const BtnGroup = styled.div`
  .noBtn {
    border: ${(props) => props.pickedColor} solid 2px;
    background-color: #f8f9fa;
  }
  .yesBtn {
    border: none;
    background-color: ${(props) => props.pickedColor};
    color: #f8f9fa;
    margin-left: 1rem;
  }
`;

const AlertModal = ({
  isTwoWays,
  isOpen,
  setIsOpen,
  type,
  color,
  customIcon,
  title,
  content,
  onYes,
  onNo,
  yesBtn,
  noBtn,
  disableClose
}) => {
  const pickedColor = useSelector(selectMyProfile).pickedColor;

  const themeColor = () => {
    if (type === "custom" && color) {
      return pickedColor;
    } else {
      switch (type) {
        case "success":
          return presetColor.green;
        case "failure": 
          return presetColor.red;
        default:
          return presetColor.grey;
      }
    }
  };

  const Icon = () => {
    if(!customIcon && type !== "custom") {
      switch (type) {
        case "success":
          return <TiTick />
        case "failure": 
          return <ImCross />
        default:
      }
    }
  }

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="BlurredOverlay"
      className="AlertModal"
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
    >
      <div className="AlertContent">
        <Head pickedColor={themeColor()} className="head">
          <div className="head-left">
            <div className="icon">
              {
                customIcon ? customIcon : <Icon />
              }
            </div>
            <div className="title">{title}</div>
          </div>
          {!disableClose && <ImCross onClick={() => {setIsOpen(false)}} className="head-right" />}
        </Head>
        <p className="content">{content}</p>

        <BtnGroup pickedColor={themeColor()} className="foot">
          {isTwoWays && (
            <button onClick={onNo} className="noBtn">
              {noBtn ? noBtn : "No"}
            </button>
          )}
          <button onClick={onYes} className="yesBtn">
            {yesBtn ? yesBtn : "Yes"}
          </button>
        </BtnGroup>
      </div>
    </ReactModal>
  );
};

export default AlertModal;
