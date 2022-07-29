import { useState } from "react";

import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import {
  selectMyProfile,
  addBlog,
  updateBlog,
} from "../store/user/myProfile-slice";

import {
  TxtField,
  StyledAutoComplete,
} from "../styled-components/StyledTextField";
import StyledForm from "../styled-components/StyledForm";
import PopupModal from "../modals/Popup";

const AddOrUpdateForm = ({ closeModal, action, existedBlog, setIsPopupOpen, setPopupMsg }) => {
  const myProfile = useSelector(selectMyProfile);
  const dispatch = useDispatch();

  const blankBlog = {
    _id: uuidv4(),
    title: "",
    uploadTime: "", //just to prevent redux err
    owner: myProfile._id,
    content: "",
    artType: "",
    reactions: [],
    comments: [],
  };

  const initialBlog = action === "add" ? { ...blankBlog } : { ...existedBlog };

  const [newBlog, setNewBlog] = useState({ ...initialBlog });

  const categories = [
    {
      label: "Painting",
    },
    {
      label: "Music",
    },
    {
      label: "Sculpture",
    },
    {
      label: "Literature",
    },
    {
      label: "Architecture",
    },
    {
      label: "Cinema",
    },
    {
      label: "Theater",
    },
  ].sort();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submittedBlog = await {
      ...newBlog,
      title: newBlog.title.trim(),
      content: newBlog.content.trim(),
      artType: newBlog.artType.length > 0 ? newBlog.artType.toLowerCase().trim() : "uncategorized",
    };

    try {
      if (action === "add") {
        await axios.post("http://localhost:3001/blogs/", {
          newBlog: { ...submittedBlog, uploadTime: new Date().toISOString() },
        });
        dispatch(addBlog({ newBlog: submittedBlog }));
        setPopupMsg(`${submittedBlog.title} Added!`);
        setNewBlog(initialBlog);
      }
      if (action === "update") {
        await axios.patch("http://localhost:3001/blogs", {
          updatedBlog: {
            ...submittedBlog,
            uploadTime: new Date().toISOString(),
          },
        });
        dispatch(
          updateBlog({
            updatedBlog: {
              ...submittedBlog,
              uploadTime: new Date().toISOString(),
            },
          })
        );
        setPopupMsg(`${submittedBlog.title} Updated!`)
      }
      setIsPopupOpen(true);
      closeModal();
    } catch (err) {
      console.log(err);
    }
    closeModal();
  };

  const handleChange = (prop) => (e) => {
    e.preventDefault();
    setNewBlog((prevBlog) => ({ ...prevBlog, [prop]: e.target.value }));
  };

  const handleTFFocus = (e) => {
    //Always focus at the end
    e.target.setSelectionRange(e.target.value.length, e.target.value.length);
  };

  return (
    <>
      <StyledForm
        pickedColor={myProfile.pickedColor}
        onSubmit={handleSubmit}
        className="AddOrUpdateForm"
      >
        <h1 className="pickedColor">
          {action === "add" ? (
            "Create your blog here"
          ) : (
            <>
              Updating <i>{existedBlog.title}</i> ...
            </>
          )}
        </h1>
        <div className="title-categories">
          <TxtField
            size="small"
            onChange={handleChange("title")}
            value={newBlog.title}
            label="Title"
            fullWidth
            focused={action === "add" ? true : false}
            onFocus={handleTFFocus}
            required
          />
          <StyledAutoComplete
            size="small"
            freeSolo
            className="categoryTF"
            onChange={handleChange("artType")}
            value={newBlog.artType}
            options={categories}
            fullWidth
            label="Type of Art (Existed or New)"
          />
        </div>

        <TxtField
          className="contentTF"
          size="small"
          label="Content"
          multiline
          minRows={6}
          onChange={handleChange("content")}
          value={newBlog.content}
          required
          fullWidth
          focused={action === "update" ? true : false}
          onFocus={handleTFFocus}
        />
        <button className="submit-btn">
          {action === "add" ? "Create" : "Update"}
        </button>
      </StyledForm>
    </>
  );
};

export default AddOrUpdateForm;
