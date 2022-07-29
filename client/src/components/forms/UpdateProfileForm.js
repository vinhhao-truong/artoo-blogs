import { useState } from "react";
import { selectMyProfile, updateProfile } from "../store/user/myProfile-slice";
import { useSelector, useDispatch } from "react-redux";
import validateDate from "validate-date";

import StyledForm from "../styled-components/StyledForm";
import { TxtField, DateField } from "../styled-components/StyledTextField";
import axios from "axios";
import { getBackURL } from "../fns/getURLPath";

const UpdateProfileForm = ({ closeModal, setIsPopupOpen, setPopupMsg }) => {
  const err = (state, message) => ({ isErr: state, msg: message });

  const myProfile = useSelector(selectMyProfile);
  const [dobErr, setDobErr] = useState(err(false, ""));
  const [newProfile, setNewProfile] = useState({ ...myProfile });

  const dispatch = useDispatch();

  const handleChange = (prop) => (e) => {
    e.preventDefault();
    setNewProfile((prevProfile) => ({
      ...prevProfile,
      [prop]: e.target.value,
    }));
  };

  const handleDobChange = (value) => {
    const now = new Date();

    setNewProfile((prev) => ({
      ...prev,
      dob: value,
    }));
    if (value) {
      //throw error for future date
      if (value >= now) {
        setDobErr(err(true, "Date of birth must be in the past!"));
      } else {
        setDobErr(err(false, ""));
      }
      //validate date input
      if (
        !validateDate(value.toLocaleString("en-GB"), "boolean", "dd/mm/yyyy")
      ) {
        setDobErr(err(true, "Please enter valid date!"));
      }
    } else {
      setDobErr(err(false, ""));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = {
        ...newProfile,
        dob: newProfile.dob,
      };
      await axios.patch(`${getBackURL("/users")}`, {
        newProfile: {
          ...newProfile,
        },
      });
      console.log(newProfile)
      dispatch(updateProfile({ newProfile: { ...updatedProfile } }));
      setPopupMsg("Profile Updated!");
      setIsPopupOpen(true);
    } catch (err) {
      console.log(err);
    }
    closeModal();
  };

  return (
    <StyledForm
      pickedColor={myProfile.pickedColor}
      onSubmit={handleSubmit}
      className="UpdateProfileForm"
    >
      <h1 className="pickedColor">Updating Profile...</h1>
      <div className="real-name">
        <TxtField
          size="small"
          onChange={handleChange("firstName")}
          value={newProfile.firstName}
          label="First Name"
          fullWidth
          required
        />
        <TxtField
          size="small"
          onChange={handleChange("lastName")}
          value={newProfile.lastName}
          label="Last Name"
          fullWidth
          required
        />
      </div>
      <TxtField
        size="small"
        onChange={handleChange("nickname")}
        value={newProfile.nickname}
        label="Nickname"
        fullWidth
      />
      <DateField
        className="dob"
        disableFuture
        label="Date of Birth *"
        value={newProfile.dob}
        onChange={handleDobChange}
        error={dobErr}
        required
      />
      <TxtField
        className="bioTF"
        size="small"
        label="Bio Description"
        multiline
        minRows={6}
        onChange={handleChange("bio")}
        value={newProfile.bio}
        fullWidth
      />
      <button className="submit-btn">Update</button>
    </StyledForm>
  );
};

export default UpdateProfileForm;
