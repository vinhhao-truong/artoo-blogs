import { useState, useEffect } from "react";
import {
  initiateProfile,
  selectMyProfile,
  updateProfile,
} from "../../store/user/myProfile-slice";
import { selectAuth } from "../../store/user/auth-slice";
import { useSelector, useDispatch } from "react-redux";
import validateDate from "validate-date";
import { CirclePicker as ColorPicker } from "react-color";

import StyledForm from "../styled-components/StyledForm";
import { TxtField, DateField } from "../styled-components/StyledTextField";
import axios from "axios";
import { getBackURL } from "../../fns/getURLPath";

import colorCollection from "../../preset/themeColorCollections";
import {
  startLoading,
  stopLoading,
  triggerPopup,
} from "../../store/user/features-slice";

import { firebaseStorage } from "../../store/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { ImCross } from "react-icons/im";

const UpdateProfileForm = ({ closeModal }) => {
  const err = (state, message) => ({ isErr: state, msg: message });

  const myProfile = useSelector(selectMyProfile);
  const auth = useSelector(selectAuth);

  const [dobErr, setDobErr] = useState(err(false, ""));
  const [newProfile, setNewProfile] = useState({ ...myProfile });

  const [selectedImg, setSelectedImg] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [isImgHovered, setIsImgHovered] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!selectedImg) {
      setImgPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedImg);
    setImgPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedImg]);

  const handleSelectImg = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    //Using the first image instead of multiple
    setSelectedImg(e.target.files[0]);
  };

  const handleTxtChange = (prop) => (e) => {
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

  const handleColorChangeComplete = (color, e) => {
    setNewProfile((prev) => ({
      ...prev,
      pickedColor: color.hex,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(startLoading());
    try {
      if (selectedImg) {
        const imageRef = ref(
          firebaseStorage,
          `images/users/profileImg_${myProfile._id}`
        );
        // await deleteObject(imageRef)
        const uploadedImg = await uploadBytes(imageRef, selectedImg);
        const uploadedImgRef = uploadedImg.ref;
        const uploadedImgUrl = (await getDownloadURL(uploadedImgRef)).slice();
        dispatch(
          updateProfile({
            newProfile: {
              ...newProfile,
              profileImg: uploadedImgUrl,
            },
          })
        );
        await axios.patch(`${getBackURL("/users?action=updateProfile")}`, {
          newProfile: {
            ...newProfile,
            idToken: auth.idToken,
            profileImg: uploadedImgUrl,
          },
        });
      } else {
        await axios.patch(`${getBackURL("/users?action=updateProfile")}`, {
          newProfile: {
            ...newProfile,
            idToken: auth.idToken,
          },
        });
        dispatch(
          updateProfile({
            newProfile: {
              ...newProfile,
            },
          })
        );
      }
      // console.log(newProfile);

      dispatch(
        triggerPopup({
          msg: "Profile updated!",
          action: "update profile",
        })
      );
    } catch (err) {
      console.log(err);
    }
    closeModal();
    dispatch(stopLoading());
  };

  return (
    <StyledForm
      pickedColor={myProfile.pickedColor}
      onSubmit={handleSubmit}
      className="UpdateProfileForm"
    >
      <h1 className="pickedColor">Updating Profile...</h1>
      <ImCross className="closeBtn" onClick={() => closeModal()} />

      <div className="top">
        <div
          className="img-upload"
          onMouseOver={() => {
            setIsImgHovered(true);
          }}
          onMouseOut={() => {
            setIsImgHovered(false);
          }}
        >
          <input
            className="upload-input"
            type="file"
            onChange={handleSelectImg}
            accept=".jpg, .jpeg, .png"
          />

          {selectedImg && (
            <img src={imgPreview} className="profile-img" alt="profile-img" />
          )}
          {!selectedImg && (
            <img
              src={myProfile.profileImg}
              className="profile-img"
              alt="profile-img"
            />
          )}
          {isImgHovered && <div className="upload-hover">Upload</div>}
        </div>
        <div className="name">
          <div className="real-name">
            <TxtField
              size="small"
              onChange={handleTxtChange("firstName")}
              value={newProfile.firstName}
              label="First Name"
              fullWidth
              required
            />
            <TxtField
              size="small"
              onChange={handleTxtChange("lastName")}
              value={newProfile.lastName}
              label="Last Name"
              fullWidth
              required
            />
          </div>
          <TxtField
            size="small"
            onChange={handleTxtChange("nickname")}
            value={newProfile.nickname}
            label="Nickname"
            fullWidth
          />
        </div>
      </div>

      <DateField
        className="dob"
        disableFuture
        label="Date of Birth *"
        value={newProfile.dob}
        onChange={handleDobChange}
        error={dobErr}
        required
        size="small"
      />
      <div className="color-field">
        <p>Set your profile color: </p>
        <ColorPicker
          className="color-picker"
          width={225}
          circleSize={20}
          circleSpacing={8}
          onChangeComplete={handleColorChangeComplete}
          colors={colorCollection}
        />
      </div>
      <TxtField
        className="bioTF"
        size="small"
        label="Bio Description"
        multiline
        minRows={4}
        onChange={handleTxtChange("bio")}
        value={newProfile.bio}
        fullWidth
        maxRows={6}
      />
      <button className="submit-btn">Update</button>
    </StyledForm>
  );
};

export default UpdateProfileForm;
