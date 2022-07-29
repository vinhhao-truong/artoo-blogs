import { useState } from "react";
import { selectMyProfile } from "../store/user/myProfile-slice";
import { useSelector } from "react-redux";
import useConfirmAuth from "./useConfirmAuth";

const useAuthColor = () => {
  const [pickedColor, setPickedColor] = useState("#3aafa9");
  const myProfile = useSelector(selectMyProfile);

  useConfirmAuth(
    () => {
      setPickedColor(myProfile.pickedColor);
    },
    () => {
      setPickedColor("#3aafa9");
    }
  );
  return pickedColor;
};

export default useAuthColor;
