import { useState, useEffect } from "react";

import { v4 as uuidv4 } from "uuid";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import {
  selectMyProfile,
  addBlog,
  updateBlog,
} from "../../store/user/myProfile-slice";

import {
  TxtField,
  StyledAutoComplete,
} from "../styled-components/StyledTextField";
import StyledForm from "../styled-components/StyledForm";
import {
  startLoading,
  stopLoading,
  triggerPopup,
} from "../../store/user/features-slice";

import { getBackURL } from "../../fns/getURLPath";

import { BiImageAdd } from "react-icons/bi";

import { firebaseStorage } from "../../store/firebase";
import { uploadBytes, ref, getDownloadURL, listAll } from "firebase/storage";

const AddOrUpdateBlogForm = ({ closeModal, action, existedBlog }) => {
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
    images: [],
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

  const [imgList, setImgList] = useState([]);
  const [imgPreviewList, setImgPreviewList] = useState([]);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    if (!selectedImg) {
      return;
    } else {
      setImgList((prev) => [...prev, selectedImg]);
    }

    if (imgList.length <= 4) {
      const objectUrl = URL.createObjectURL(selectedImg);
      setImgPreviewList((prev) => [...prev, objectUrl]);

      // free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [selectedImg]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submittedBlog = await {
      ...newBlog,
      title: newBlog.title.trim(),
      content: newBlog.content.trim(),
      artType:
        newBlog.artType.length > 0
          ? newBlog.artType.toLowerCase().trim()
          : "uncategorized",
    };

    dispatch(startLoading());
    try {
      if (action === "add") {
        const uploadedImgUrl = [];
        for (let i = 1; i <= imgList.length; i++) {
          const imgRef = ref(
            firebaseStorage,
            `images/blogs/${newBlog._id}/${i}`
          );
          const uploadedImg = await uploadBytes(imgRef, imgList[i - 1]);
          const uploadedUrl = (await getDownloadURL(uploadedImg.ref)).slice();
          uploadedImgUrl.push(uploadedUrl);
        }
        // const imgFolderRef = ref(firebaseStorage, `images/blogs/${newBlog._id}`);
        // const uploadedImgList = await listAll(imgFolderRef);
        // uploadedImgList.items.forEach(img => {
        //   uploadedImgUrl.push(getDownloadURL(img));
        // })

        await axios.post(`${getBackURL("/blogs")}`, {
          newBlog: {
            ...submittedBlog,
            uploadTime: new Date().toISOString(),
            images: [...uploadedImgUrl],
          },
        });
        dispatch(
          addBlog({
            newBlog: {
              ...submittedBlog,
              uploadTime: new Date().toISOString(),
              images: [...uploadedImgUrl],
            },
          })
        );
        dispatch(
          triggerPopup({
            action: "add",
            msg: `${newBlog.title} posted!`,
          })
        );
        setNewBlog(initialBlog);
      }
      if (action === "update") {
        await axios.patch(`${getBackURL("/blogs")}`, {
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
        dispatch(
          triggerPopup({
            action: "update",
            msg: `${newBlog.title} updated!`,
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
    dispatch(stopLoading());
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

  const handleSelectedImg = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    //Using the first image instead of multiple
    setSelectedImg(e.target.files[0]);
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
          minRows={4}
          onChange={handleChange("content")}
          value={newBlog.content}
          required
          fullWidth
          focused={action === "update" ? true : false}
          onFocus={handleTFFocus}
          maxRows={8}
        />
        <div className="images">
          {imgPreviewList.map((imgUrl, idx) => (
            <img
              className="img-preview"
              key={idx}
              src={imgUrl}
              alt={`preview-${idx}`}
            />
          ))}
          {imgList.length > 4 && <div className="more">...</div>}
          <div style={{ color: myProfile.pickedColor }} className="uploadBtn">
            <BiImageAdd />
            <p>Upload Image</p>
            <input
              onChange={handleSelectedImg}
              type="file"
              name="add-img"
              id="add-img"
            />
          </div>
        </div>
        <button className="submit-btn">
          {action === "add" ? "Create" : "Update"}
        </button>
      </StyledForm>
    </>
  );
};

export default AddOrUpdateBlogForm;
