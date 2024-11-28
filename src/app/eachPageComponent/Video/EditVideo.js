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

const LABELIMAGEUPLOAD = styled.label`
  border: 1px solid #c0c0c0;
  border-radius: 4px;
  padding: 10px;
  width: 100%;
  height: 77%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
`;

const BUTTONSSTYLE = styled.div`
  .cancelButtonStyle {
    color: #48abf7;
    background-color: rgba(72, 171, 247, 0.1);
  }

  .deleteButtonStyle {
    color: #ff4f3f !important;
    background-color: transparent;
  }
  .confirmButtonStyle {
    color: white;
    background-color: #1572e8;
  }
`;

const BOX = styled(Box)`
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
`;

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
    <div className="mt-3 container">
      <form onSubmit={areYouShureFunction}>
        <BorderInputBox className="mt-3">
          <label>فیلم ها:</label>
          {media.map((item, index) => (
            <div className="mt-2" key={index}>
              <div className="d-flex flex-row align-items-center flex-wrap gap-2">
                <input
                  style={{ width: "40%" }}
                  type="text"
                  placeholder="عنوان"
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
                  placeholder="توضیحات"
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
                <span className="NormalTextSizing">فیلم :</span>
                {item?.src === "" ? (
                  <>
                    <LABELIMAGEUPLOAD htmlFor="MediaVideo">
                      <div className="d-flex flex-column text-center p-1">
                        <div>
                          <svg
                            width={21}
                            height={21}
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.25 11.25C2.25 13.3713 2.25 14.432 2.90901 15.091C3.56802 15.75 4.62868 15.75 6.75 15.75H11.25C13.3713 15.75 14.432 15.75 15.091 15.091C15.75 14.432 15.75 13.3713 15.75 11.25"
                              stroke="#404040"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M9 12V2.25M9 2.25L12 5.53125M9 2.25L6 5.53125"
                              stroke="#404040"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>

                        <p className={`colorTheInputFile discription`}>
                          فیلم mp4
                        </p>
                      </div>
                    </LABELIMAGEUPLOAD>
                    <input
                      className="d-none"
                      id="MediaVideo"
                      accept={`${process.env.NEXT_PUBLIC_INPUT_VIDEO_FORMAT}`}
                      type="file"
                      onChange={(e) =>
                        handleFileChange(e, index, setMedia, media)
                      }
                      required
                    />
                  </>
                ) : (
                  <>
                    <div
                      className="d-flex flex-column"
                      style={{ width: "fit-content" }}
                    >
                      {objectUrls[index] && (
                        <BOX
                          // onClick={() => handleOpen(logo)}
                          component="video"
                          src={objectUrls[index]}
                          controls
                        />
                      )}
                      {item.src && !objectUrls[index] && (
                        <BOX
                          // onClick={() => handleOpen(logo)}
                          component="video"
                          src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${item.src}`}
                          controls
                        />
                      )}
                    </div>
                  </>
                )}

                {/* <div className="d-flex flex-row flex-wrap align-items-center gap-2">
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
                </div> */}
              </div>

              <div className="d-flex flex-column">
                <span className="mt-2 NormalTextSizing">پوستر فیلم :</span>
                {item.poster ? (
                  <>
                    <div
                      className="d-flex flex-column"
                      style={{ width: "fit-content" }}
                    >
                      {posterObjectUrls[index] && (
                        <BOX
                          // onClick={() => handleOpen(logo)}
                          component="img"
                          src={posterObjectUrls[index] || ""}
                          alt="BlogProductImage"
                        />
                      )}
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
                    </div>
                  </>
                ) : (
                  <>
                    <LABELIMAGEUPLOAD
                      className="VodeoDisSizing mb-1"
                      htmlFor="ProductImage"
                    >
                      <div className="d-flex flex-column text-center p-1">
                        <div>
                          <svg
                            width={21}
                            height={21}
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M2.25 11.25C2.25 13.3713 2.25 14.432 2.90901 15.091C3.56802 15.75 4.62868 15.75 6.75 15.75H11.25C13.3713 15.75 14.432 15.75 15.091 15.091C15.75 14.432 15.75 13.3713 15.75 11.25"
                              stroke="#404040"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M9 12V2.25M9 2.25L12 5.53125M9 2.25L6 5.53125"
                              stroke="#404040"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                        <p className={`colorTheInputFile discription`}>
                          بارگذاری فایل .png یا .jpg
                        </p>
                      </div>
                    </LABELIMAGEUPLOAD>
                    <input
                      className="d-none"
                      type="file"
                      id="ProductImage"
                      onChange={(e) =>
                        handleFileChangePoster(e, index, setMedia, media)
                      }
                    />
                  </>
                )}
                {/* <div className="d-flex flex-row flex-wrap align-items-center gap-2">
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
                </div> */}
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
        <BUTTONSSTYLE className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-row mt-3 mb-3 gap-3">
            <button type="submit" className="confirmButtonStyle">
              ویرایش ویدیو
            </button>
            <button className="cancelButtonStyle" onClick={handleCancelEdit}>
              انصراف
            </button>
          </div>
          <div>
            <button
              className="mt-2 mb-2 deleteButtonStyle"
              type="button"
              onClick={areYouShureFunction2}
            >
              حذف ویدیو
            </button>
          </div>
        </BUTTONSSTYLE>

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
