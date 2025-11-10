import React, { useState } from "react";
// import redux
import { useDispatch } from "react-redux";
import { videopot } from "@/app/Store/thunks";
import { uploadFile } from "@/app/Store/thunks";
// import modals
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import ConfirmModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import styled from "styled-components";
import { Box } from "@mui/material";

const BorderInputBox = styled.div`
  padding: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  gap: 1rem;
`;

const BOX = styled(Box)`
  width: 100%;
  /* width: 180px; */
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
`;

const BUTTONSSTYLE = styled.div`
  display: flex;
  width: 100%;

  .confirmButtonStyle,
  .cancelButtonStyle {
    font-size: 14px;
    padding: 10px 32px;
    border-radius: 10px;
    font-weight: 500;
    transition: 160ms ease;
  }

  .confirmButtonStyle {
    background: #43a047;
    color: #fff;
    border: none;

    &:hover {
      background: #3a8c3e;
      transform: translateY(-1px);
    }
  }

  .cancelButtonStyle {
    background: #fafafa;
    border: 1px solid #d0d0d0;
    color: #444;

    &:hover {
      background: #f0f0f0;
      border-color: #bdbdbd;
      transform: translateY(-1px);
    }
  }
`;

const DivAdjustColorDivs = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns || "1fr"};
  grid-gap: 10px;
  /* width: fit-content; */
  .labelInsteadOfInput {
    /* border: 1px solid #c0c0c0;
    border-radius: 4px;
    padding: 10px;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center; */
    border: 1px dashed #c8c8c8;
    border-radius: 10px;
    padding: 16px;
    width: 100%;
    min-height: 120px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 150ms ease;

    &:hover {
      border-color: #9a9a9a;
      background: #fafafa;
    }
  }
  .colorTheInputFile {
    color: #404040;
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const ResponsiveDivInputs = styled.div`
  width: 100%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const HeaderSection = styled.div`
  border-bottom: 2px solid #c0c0c0;
  background-color: rgb(225, 223, 223);
  border-radius: 4px;
  padding: 10px;
  border-bottom: 1px solid #e4e4e4;
  background-color: #f7f7f7;
  padding: 12px 16px;
  border-radius: 10px 10px 0 0;

  button {
    background: #43a047;
    border: none;
    color: #fff;
    padding: 6px 18px;
    font-size: 14px;
    border-radius: 8px;
    transition: 160ms ease;

    &:hover {
      background: #3b8b3f;
      transform: translateY(-1px);
    }
  }
`;

export default function AddHonors({ setActiveKey , setUpdateData }) {
  const dispatch = useDispatch();

  // modal state
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  // Close modal
  const closeModal = () => setOpenModal(false);
  const closeModal2 = () => setOpenModal2(false);
  const closeModal3 = () => setOpenModal3(false);

  const [media, setMedia] = useState([
    { title: "", description: "", src: "", poster: "" },
  ]);

  console.log(media);

  const handleFileChange = (e, index, setFunction, state) => {
    const file = e.target.files[0];
    const updatedState = state.map((item, i) =>
      i === index ? { ...item, src: file } : item
    );
    setFunction(updatedState);
  };

  const handleFileChangePoster = (e, index, setFunction, state) => {
    const file = e.target.files[0];
    const updatedState = state.map((item, i) =>
      i === index ? { ...item, poster: file } : item
    );
    setFunction(updatedState);
  };

  const handleAddMedia = () => {
    setMedia([...media, { title: "", description: "", src: "", poster: "" }]);
  };

  const handleRemoveMedia = (index) => {
    if (media.length > 1) {
      setMedia(media.filter((_, i) => i !== index));
    }
  };

  const areYouShureFunction = (e) => {
    e.preventDefault();
    setOpenModal(true);
  };

  function closeModalOnTimeout() {
    setTimeout(() => {
      setOpenModal2(false);
      setActiveKey("editUserPage");
    }, 3000);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenModal(false);
    try {
      // Use Promise.all to upload both `src` and `poster` for each media item individually
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

          await dispatch(
            videopot({
              media: updatedItem,
            })
          );
        })
      );
      setOpenModal2(true);
      closeModalOnTimeout();
    } catch (error) {
      setOpenModal3(true);
      console.error("Error creating product:", error);
    }finally{
      setUpdateData(true);
    }
  };

  return (
    <>
      <form onSubmit={areYouShureFunction} className="container">
        <BorderInputBox className="mt-3">
          <HeaderSection>
            <div className="d-flex justify-content-end">
              <button
                style={{ backgroundColor: "#43A047" }}
                type="button"
                onClick={handleAddMedia}
              >
                اضافه کردن
              </button>
            </div>
          </HeaderSection>

          <div className="container">
            {media.map((item, index) => (
              <div className="mt-2" key={index}>
                <div className="d-flex flex-row gap-3 align-items-center">
                  <div className="w-50">
                    <div className="d-flex flex-column mt-2">
                      <span className="mb-1 NormalTextSizing">فیلم :</span>
                      <div style={{ height: "fit-content" }}>
                        <DivAdjustColorDivs columns="repeat(1, 1fr)">
                          {item?.src === "" ? (
                            <>
                              <label
                                className="labelInsteadOfInput"
                                htmlFor="MediaVideo"
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

                                  <p
                                    className={`colorTheInputFile discription`}
                                  >
                                    فیلم mp4
                                  </p>
                                </div>
                              </label>
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
                                <BOX
                                  // onClick={() => handleOpen(logo)}
                                  component="video"
                                  src={URL.createObjectURL(item?.src) || ""}
                                  controls
                                />
                              </div>
                            </>
                          )}
                        </DivAdjustColorDivs>
                      </div>

                      {/* <input
                  type="file"
                  onChange={(e) => handleFileChange(e, index, setMedia, media)}
                  required
                /> */}
                    </div>

                    <div className="d-flex flex-column mt-2 mb-1">
                      <span className="NormalTextSizing">پوستر فیلم :</span>
                      <DivAdjustColorDivs columns="repeat(1, 1fr)">
                        {item?.poster === "" ? (
                          <>
                            <label
                              className="labelInsteadOfInput"
                              htmlFor="posterFilm"
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
                                <p className={`colorTheInputFile discription`}>
                                  حداکثر تا 5 مگابایت
                                </p>
                              </div>
                            </label>
                            <input
                              accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
                              className="d-none"
                              id="posterFilm"
                              type="file"
                              onChange={(e) =>
                                handleFileChangePoster(
                                  e,
                                  index,
                                  setMedia,
                                  media
                                )
                              }
                            />
                          </>
                        ) : (
                          <>
                            <div
                              className="d-flex flex-column"
                              style={{ width: "fit-content" }}
                            >
                              <BOX
                                // onClick={() => handleOpen(logo)}
                                component="img"
                                src={URL.createObjectURL(item?.poster) || ""}
                                alt="UserColorImage"
                              />
                            </div>
                          </>
                        )}
                      </DivAdjustColorDivs>
                    </div>
                  </div>
                  <div className="w-50">
                    <ResponsiveDivInputs className="d-flex flex-column mt-2">
                      <label
                        className="NormalTextSizing"
                        htmlFor="TypeVideo"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        عنوان :
                      </label>
                      <input
                        id="TypeVideo"
                        className="w-100"
                        type="text"
                        placeholder="عنوان"
                        value={item.title}
                        onChange={(e) =>
                          setMedia(
                            media.map((m, i) =>
                              i === index ? { ...m, title: e.target.value } : m
                            )
                          )
                        }
                        required
                      />
                    </ResponsiveDivInputs>

                    <ResponsiveDivInputs className="d-flex flex-column mt-2">
                      <label
                        className="NormalTextSizing"
                        htmlFor="DisVideo"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        توضیحات :
                      </label>
                      <input
                        id="DisVideo"
                        type="text"
                        placeholder="توضیحات"
                        value={item.description}
                        onChange={(e) =>
                          setMedia(
                            media.map((m, i) =>
                              i === index
                                ? { ...m, description: e.target.value }
                                : m
                            )
                          )
                        }
                        required
                      />
                    </ResponsiveDivInputs>
                    <BUTTONSSTYLE>
                      <button
                        className="mt-2 cancelButtonStyle"
                        type="button"
                        onClick={() => handleRemoveMedia(index)}
                      >
                        حذف
                      </button>
                    </BUTTONSSTYLE>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </BorderInputBox>

        <BUTTONSSTYLE className="d-flex flex-row">
          <div className="d-flex flex-row mt-3 mb-3 gap-3 justify-content-around w-100">
            <button className="confirmButtonStyle" type="submit">
              اضافه کردن ویدیو
            </button>
            <button
              className="cancelButtonStyle"
              type="button"
              onClick={() => setActiveKey("editUserPage")}
            >
              انصراف
            </button>
          </div>
        </BUTTONSSTYLE>

        {/* modals */}
        <AreYouShureModal
          open={openModal}
          onClose={closeModal}
          text={"ایا از اضافه کردن ویدیو مطمعن هستید"}
          func={handleSubmit}
        />
        <ConfirmModal
          open={openModal2}
          onClose={closeModal2}
          text={"ویدیو با موفقیت اضافه شد"}
        />
        <ErrorModal
          open={openModal3}
          onClose={closeModal3}
          text={"خطا از لاگین بودن خود اطمینان حاصل فرمایید"}
        />
      </form>
    </>
  );
}
