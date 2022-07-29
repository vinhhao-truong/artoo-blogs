import ReactModal from "react-modal";
import tick from "../img/tick.png"
import cross from "../img/cross.png"

const AlertModal = ({
  msg,
  isOpen,
  onOKClick,
  onCancelClick,
  type,
  colorCode,
  okContent,
  cancelContent,
}) => {
  const pickedColor = (code) => {
    switch (code) {
      case "right":
        return "#3aafa9";
      case "wrong":
        return "#ff052f";
      default:
        return "#0077b6";
    }
  };

  const PresetIcon = () => {
    switch (type) {
      case "right":
        return <img src={tick} alt="tick" style={{filter: "brightness(155%)"}} />;
      case "wrong":
        return <img src={cross} alt="cross" />;
      case "neutral":
        return <img src={tick} alt="tick" />;
      default:
    }
  };

  return (
    <ReactModal
      isOpen={isOpen}
      overlayClassName="BlurredOverlay"
      className="AlertModal"
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
    >
      <div className="AlertContent">
        <PresetIcon />
        <p style={{ fontSize: !!PresetIcon() ? "inherit" : "25px" }}>{msg}</p>
        <div className="btn-group">
          <button
            style={{
              backgroundColor: colorCode ? pickedColor(colorCode) : pickedColor(type),
            }}
            className="pickedColor"
            onClick={onOKClick}
          >
            {okContent ? okContent : "OK"}
          </button>
          {cancelContent && <button onClick={onCancelClick} style={{
              color: "#000000",
            }}>{cancelContent}</button>}
        </div>
      </div>
    </ReactModal>
  );
};

export default AlertModal;
