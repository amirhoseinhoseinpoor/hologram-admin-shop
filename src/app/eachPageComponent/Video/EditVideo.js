import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { uploadFile } from "@/app/Store/thunks";
import { videoEdit } from "@/app/Store/thunks";
import { HomePageVideoDeleted } from "@/app/Store/thunks";
// import modals
import ConfirmModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";

const BorderInputBox = styled.div`
  border: 2px solid #28a745;
  padding: 5px;
`;

export default function EditHonors({
  editedHonor,
  handleCancelEdit,
  setEditedHonor,
}) {
  const dispatch = useDispatch();

  const [media, setMedia] = useState([
    { title: "", description: "", src: "", poster: "" },
  ]);

  const [objectUrls, setObjectUrls] = useState({});
  const [posterObjectUrls, setPosterObjectUrls] = useState({});

  // modal state
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [openModal4, setOpenModal4] = useState(false);
  // Close modal
  const closeModal = () => setOpenModal(false);
  const closeModal2 = () => setOpenModal2(false);
  const closeModal3 = () => setOpenModal3(false);
  const closeModal4 = () => setOpenModal4(false);

  useEffect(() => {
    if (editedHonor) {
      // Set the media based on the edited honor
      setMedia([editedHonor.media]); // Wrap editedHonor in an array
    }
  }, [editedHonor]);

  const handleFileChange = (e, index, setFunction, state) => {
    const file = e.target.files[0];
    const objectUrl = URL.createObjectURL(file);

    const updatedState = state.map((item, i) =>
      i === index ? { ...item, src: file } : item
    );
    setFunction(updatedState);
    setObjectUrls((prev) => ({
      ...prev,
      [index]: objectUrl,
    }));
  };

  const handleFileChangePoster = (e, index, setFunction, state) => {
    const file = e.target.files[0];
    const objectUrl = URL.createObjectURL(file);

    const updatedState = state.map((item, i) =>
      i === index ? { ...item, poster: file } : item
    );
    setFunction(updatedState);
    setPosterObjectUrls((prev) => ({
      ...prev,
      [index]: objectUrl,
    }));
  };

  const handleAddMedia = () => {
    setMedia([...media, { title: "", description: "", src: "", poster: "" }]);
  };

  const handleRemoveMedia = (index) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setOpenModal4(false);
    try {
      const deleteVideo = await dispatch(
        HomePageVideoDeleted({ code: editedHonor.code })
      );
      if (deleteVideo.payload.message === "Success") {
        setOpenModal2(true);
        closeModalOnTimeout();
      } else {
        setOpenModal3(true);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const areYouShureFunction = (e) => {
    e.preventDefault();
    setOpenModal(true);
  };

  const areYouShureFunction2 = (e) => {
    e.preventDefault();
    setOpenModal4(true);
  };

  function closeModalOnTimeout() {
    setTimeout(() => {
      setOpenModal2(false);
    }, 3000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenModal(false);
    try {
      await Promise.all(
        media.map(async (item) => {
          let updatedItem = { ...item };

          // Upload src (video) if it's a file object
          if (item.src && typeof item.src === "object") {
            const tag = "homePageVideo";
            const type = 2;
            const isPublic = true;
            const fileIdSrc = await dispatch(
              uploadFile({ file: item.src, tag, type, isPublic })
            ).unwrap();
            updatedItem.src = fileIdSrc; // Update src with the file ID
          }

          // Upload poster if it's a file object
          if (item.poster && typeof item.poster === "object") {
            const tag = "homePageVideoPoster";
            const type = 1;
            const isPublic = true;
            const fileIdPoster = await dispatch(
              uploadFile({ file: item.poster, tag, type, isPublic })
            ).unwrap();
            updatedItem.poster = fileIdPoster; // Update poster with the file ID
          }

          const finalMedia = {
            media: updatedItem,
          };

          await dispatch(
            videoEdit({
              media: finalMedia,
              code: editedHonor.code,
            })
          );
        })
      );
      setOpenModal2(true);
      closeModalOnTimeout();
    } catch (error) {
      setOpenModal3(true);
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="mt-3">
      <h2>ادیت ویدیو</h2>
      <form onSubmit={areYouShureFunction}>
        <BorderInputBox className="mt-3">
          <label>فیلم ها:</label>
          {media.map((item, index) => (
            <div className="mt-2" key={index}>
              <div className="d-flex flex-row align-items-center flex-wrap gap-2">
                <input
                  style={{ width: "40%" }}
                  type="text"
                  placeholder="Title"
                  value={item.title} // Use item.title instead of media.title
                  onChange={(e) =>
                    setMedia(
                      media.map((m, i) =>
                        i === index ? { ...m, title: e.target.value } : m
                      )
                    )
                  }
                  required
                />

                <input
                  style={{ width: "40%" }}
                  type="text"
                  placeholder="Description"
                  value={item.description} // Use item.description instead of media.description
                  onChange={(e) =>
                    setMedia(
                      media.map((m, i) =>
                        i === index ? { ...m, description: e.target.value } : m
                      )
                    )
                  }
                  required
                />
              </div>

              <div className="d-flex flex-column">
                <span>فیلم :</span>
                <div className="d-flex flex-row flex-wrap align-items-center gap-2">
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileChange(e, index, setMedia, media)
                    }
                  />
                  {item.src && !objectUrls[index] && (
                    <Box
                      component="video"
                      src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${item.src}`}
                      sx={{
                        width: "140px",
                        maxHeight: "100%",
                        borderRadius: "2px",
                      }}
                      controls
                    />
                  )}

                  {objectUrls[index] && (
                    <Box
                      component="video"
                      src={objectUrls[index]}
                      sx={{
                        width: "140px",
                        maxHeight: "100%",
                        borderRadius: "2px",
                      }}
                      controls
                    />
                  )}
                </div>
              </div>

              <div className="d-flex flex-column">
                <span>پوستر فیلم :</span>
                <div className="d-flex flex-row flex-wrap align-items-center gap-2">
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileChangePoster(e, index, setMedia, media)
                    }
                  />
                  {item.poster && !posterObjectUrls[index] && (
                    <Box
                      component="img"
                      src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${item.poster}`}
                      sx={{
                        width: "140px",
                        maxHeight: "100%",
                        borderRadius: "2px",
                      }}
                    />
                  )}

                  {posterObjectUrls[index] && (
                    <Box
                      component="img"
                      src={posterObjectUrls[index]}
                      sx={{
                        width: "140px",
                        maxHeight: "100%",
                        borderRadius: "2px",
                      }}
                    />
                  )}
                </div>
              </div>

              <button
                className="bg-danger mt-1"
                type="button"
                onClick={() => handleRemoveMedia(index)}
              >
                حذف
              </button>
            </div>
          ))}
          <button
            className="mt-2 bg-success"
            type="button"
            onClick={handleAddMedia}
          >
            اضافه کردن ویدیو
          </button>
        </BorderInputBox>
        <button type="submit" className="mt-3 bg-success">
          ویرایش محصول
        </button>
        <button
          onClick={areYouShureFunction2}
          className="bg-danger mt-2 mb-2"
          type="button"
        >
          حذف محصول
        </button>
        <button className="bg-warning" onClick={handleCancelEdit}>
          انصراف
        </button>
        {/* modal  */}
        <AreYouShureModal
          open={openModal}
          onClose={closeModal}
          text={"ایا از ویرایش ویدیو مطمعن هستید"}
          func={handleSubmit}
        />
        <AreYouShureModal
          open={openModal4}
          onClose={closeModal4}
          text={"ایا از حذف ویدیو مطمعن هستید"}
          func={handleDelete}
        />
        <ConfirmModal
          open={openModal2}
          onClose={closeModal2}
          text={"عملیات با موفقیت انجام شد"}
        />
        <ErrorModal
          open={openModal3}
          onClose={closeModal3}
          text={"خطا از لاگین بودن خود اطمینان حاصل فرمایید"}
        />
      </form>
    </div>
  );
}
