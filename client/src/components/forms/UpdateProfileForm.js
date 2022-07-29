import { selectMyProfile } from "../store/user/myProfile-slice";
import { useSelector } from "react-redux";

import StyledForm from "../styled-components/StyledForm";

const UpdateProfileForm = () => {
  const myProfile = useSelector(selectMyProfile);
      
  const handleSubmit = e => {

  }

  return (
    <StyledForm
      pickedColor={myProfile.pickedColor}
      onSubmit={handleSubmit}
      className="UpdateProfileForm"
    ></StyledForm>
  );
};

export default UpdateProfileForm;
