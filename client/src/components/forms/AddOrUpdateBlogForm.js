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

import { BiImageAdd } from "react-icons/bi";

import { firebaseStorage } from "../../store/firebase";
import {
  uploadBytes,
  ref,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { ImCross } from "react-icons/im";
import { TbInboxOff } from "react-icons/tb";

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

  const initialPreviewList = action === "update" ? [...existedBlog.images] : [];

  const [imgList, setImgList] = useState([]);
  const [imgPreviewList, setImgPreviewList] = useState([...initialPreviewList]);
  const [selectedImages, setSelectedImages] = useState(null);

  const [isImgListCleared, setIsImgListCleared] = useState(false);
  // console.log(existedBlog)

  useEffect(() => {
    if (!selectedImages) {
      return;
    }
    if (selectedImages.length === 1) {
      const objectUrl = URL.createObjectURL(selectedImages[0]);
      setImgPreviewList((prev) => [...prev, objectUrl]);
      // free memory when ever this component is unmounted
      return () => {
        // imgSelectRef.current.value = null;
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      for (let i = 0; i < selectedImages.length; i++) {
        const objectUrl = URL.createObjectURL(selectedImages[i]);
        setImgPreviewList((prev) => [...prev, objectUrl]);
        // free memory when ever this component is unmounted
        if (i === selectedImages.length - 1) {
          return () => {
            // imgSelectRef.current.value = null;
            URL.revokeObjectURL(objectUrl);
          };
        }
      }
    }
  }, [selectedImages]);

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
        for (let i = 1; i <= imgPreviewList.length; i++) {
          const imgRef = ref(
            firebaseStorage,
            `images/blogs/${newBlog._id}_${i}`
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
        // console.log(imgList);
        await axios.post("/blogs", {
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
        const uploadedImgUrl = isImgListCleared ? [] : [...existedBlog.images];
        const existedLength = existedBlog.images.length;
        const currentLength = imgList.length;

        //no clear
        if (!isImgListCleared) {
          for (let i = 1; i <= currentLength; i++) {
            const imgUploadRef = ref(
              firebaseStorage,
              `images/blogs/${existedBlog._id}_${existedLength + i}`
            );
            const uploadRes = await uploadBytes(imgUploadRef, imgList[i - 1]);
            const urlRes = (await getDownloadURL(uploadRes.ref)).slice();
            uploadedImgUrl.push(urlRes);
          }
        }

        //clear
        if (isImgListCleared) {
          const lengthDiff = Math.abs(existedLength - currentLength);
          for (let i = 1; i <= Math.max(currentLength, lengthDiff); i++) {
            //Only upload within the current length
            if (i <= currentLength) {
              const imgUploadRef = ref(
                firebaseStorage,
                `images/blogs/${existedBlog._id}_${i}`
              );
              const uploadRes = await uploadBytes(imgUploadRef, imgList[i - 1]);
              const urlRes = (await getDownloadURL(uploadRes.ref)).slice();
              uploadedImgUrl.push(urlRes);
            }
            //Only delete the diff if and when existed more than current
            if (existedLength > currentLength && i <= lengthDiff) {
              const delRef = ref(
                firebaseStorage,
                `images/blogs/${existedBlog._id}_${currentLength + i}`
              );
              await deleteObject(delRef);
            }
          }
        }

        await axios.patch("/blogs", {
          updatedBlog: {
            ...submittedBlog,
            uploadTime: new Date().toISOString(),
            images: [...uploadedImgUrl],
          },
        });
        dispatch(
          updateBlog({
            updatedBlog: {
              ...submittedBlog,
              uploadTime: new Date().toISOString(),
              images: [...uploadedImgUrl],
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
    setSelectedImages([...e.target.files])
    setImgList((prev) => [...prev, ...e.target.files]);
    e.target.value = null;
  };

  const handleClearImg = (e) => {
    e.preventDefault();
    setIsImgListCleared(true);
    setImgList([]);
    setImgPreviewList([]);
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
        <ImCross className="closeBtn" onClick={() => closeModal()} />
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
          {imgPreviewList.slice(0, 4).map((imgUrl, idx) => (
            <div key={idx} className="image">
              <img
                className="img-preview"
                src={imgUrl}
                alt={`preview-${idx}`}
              />
            </div>
          ))}

          {imgPreviewList.length > 4 && (
            <div className="more">
              <img
                className="img-preview"
                src={imgPreviewList[4]}
                alt="preview-4"
              />
              {imgPreviewList.length > 5 && (
                <div className="more-mask">+{imgPreviewList.length - 5}</div>
              )}
            </div>
          )}
          <div style={{ color: myProfile.pickedColor }} className="uploadBtn">
            <BiImageAdd />
            <p>Upload Image</p>
            <input
              onChange={handleSelectedImg}
              onClick={() => {
              }}
              type="file"
              name="add-img"
              id="add-img"
              accept=".jpg, .jpeg, .png"
              multiple
            />
          </div>
          {imgPreviewList.length > 0 && (
            <button
              style={{
                backgroundColor: myProfile.pickedColor,
              }}
              className="clearBtn"
              onClick={handleClearImg}
            >
              <TbInboxOff /> Delete Selected Images?
            </button>
          )}
        </div>
        <button className="submit-btn">
          {action === "add" ? "Create" : "Update"}
        </button>
      </StyledForm>
    </>
  );
};

export default AddOrUpdateBlogForm;
