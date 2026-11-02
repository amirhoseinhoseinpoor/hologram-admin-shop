import { useState, useEffect, useRef } from "react";
import { Box } from "@mui/material";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { uploadFile, videoEdit } from "@/app/Store/thunks";
import ConfirmModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import toast from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";

const BorderInputBox = styled.div`
  padding: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
`;

const BOX = styled(Box)`
  width: 100%;
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
    background: var(--c-primary);
    color: #fff;
    border: none;
    &:hover {
      background: var(--c-primary-600);
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

const RedStar = styled.span`
  color: var(--c-danger);
  padding-left: 2px;
  padding-right: 2px;
`;

const UploadZone = styled.label`
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
`;

const PreviewWrapper = styled.div`
  position: relative;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
`;

const RemoveBtn = styled.button`
  position: absolute;
  top: 6px;
  left: 6px;
  background: rgba(220, 53, 69, 0.85);
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: 150ms ease;
  padding: 0;
  &:hover {
    background: rgba(176, 0, 32, 0.95);
    transform: scale(1.1);
  }
  svg {
    font-size: 16px;
    color: #fff;
  }
`;

const UploadIcon = () => (
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
);

export default function EditVideo({
  setUpdateData,
  editedHonor,
  handleCancelEdit,
}) {
  const dispatch = useDispatch();

  // text fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // video: either a server filename string, a new File object, or null (cleared)
  const [videoSrc, setVideoSrc] = useState(null); // string (server) | File | null
  const [videoPreview, setVideoPreview] = useState(null); // object URL for new file

  // poster: same pattern
  const [posterSrc, setPosterSrc] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);

  const videoInputRef = useRef(null);
  const posterInputRef = useRef(null);

  const [openModal, setOpenModal] = useState(false); // confirm save
  const [openModal2, setOpenModal2] = useState(false); // success
  const [openModal3, setOpenModal3] = useState(false); // error

  useEffect(() => {
    if (editedHonor?.media) {
      setTitle(editedHonor.media.title || "");
      setDescription(editedHonor.media.description || "");
      setVideoSrc(editedHonor.media.src || null);
      setPosterSrc(editedHonor.media.poster || null);
      setVideoPreview(null);
      setPosterPreview(null);
    }
  }, [editedHonor]);

  /* ── video handlers ── */
  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoSrc(file);
    setVideoPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRemoveVideo = () => {
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setVideoSrc(null);
    setVideoPreview(null);
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  /* ── poster handlers ── */
  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (posterPreview) URL.revokeObjectURL(posterPreview);
    setPosterSrc(file);
    setPosterPreview(URL.createObjectURL(file));
    e.target.value = "";
  };

  const handleRemovePoster = () => {
    if (posterPreview) URL.revokeObjectURL(posterPreview);
    setPosterSrc(null);
    setPosterPreview(null);
    if (posterInputRef.current) posterInputRef.current.value = "";
  };

  /* ── validation ── */
  const validateForm = () => {
    if (!title.trim()) return { valid: false, message: "عنوان را وارد کنید" };
    if (!description.trim())
      return { valid: false, message: "توضیحات را وارد کنید" };
    if (!videoSrc)
      return { valid: false, message: "فایل ویدیو را انتخاب کنید" };
    if (!posterSrc)
      return { valid: false, message: "پوستر ویدیو را انتخاب کنید" };
    return { valid: true };
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    const result = validateForm();
    if (!result.valid) {
      toast.error(result.message);
      return;
    }
    setOpenModal(true);
  };

  /* ── save ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenModal(false);
    try {
      let finalSrc = videoSrc;
      let finalPoster = posterSrc;

      // upload new video if file object
      if (videoSrc instanceof File) {
        finalSrc = await dispatch(
          uploadFile({
            file: videoSrc,
            tag: "homePageVideo",
            type: 2,
            isPublic: true,
          }),
        ).unwrap();
      }

      // upload new poster if file object
      if (posterSrc instanceof File) {
        finalPoster = await dispatch(
          uploadFile({
            file: posterSrc,
            tag: "homePageVideoPoster",
            type: 1,
            isPublic: true,
          }),
        ).unwrap();
      }

      await dispatch(
        videoEdit({
          media: {
            media: { title, description, src: finalSrc, poster: finalPoster },
          },
          code: editedHonor.code,
        }),
      );

      setUpdateData(true);
      setOpenModal2(true);
      setTimeout(() => {
        setOpenModal2(false);
        handleCancelEdit();
      }, 3000);
    } catch (error) {
      setOpenModal3(true);
      console.error("Error editing video:", error);
    }
  };

  /* ── render helpers ── */
  const renderVideoSlot = () => {
    // new file selected
    if (videoPreview) {
      return (
        <PreviewWrapper>
          <BOX component="video" src={videoPreview} controls />
          <RemoveBtn type="button" onClick={handleRemoveVideo}>
            <DeleteIcon />
          </RemoveBtn>
        </PreviewWrapper>
      );
    }
    // existing server file (string)
    if (videoSrc && typeof videoSrc === "string") {
      return (
        <PreviewWrapper>
          <BOX
            component="video"
            src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${videoSrc}`}
            controls
          />
          <RemoveBtn type="button" onClick={handleRemoveVideo}>
            <DeleteIcon />
          </RemoveBtn>
        </PreviewWrapper>
      );
    }
    // empty — show upload zone
    return (
      <>
        <UploadZone htmlFor="editVideoSrc">
          <div className="d-flex flex-column align-items-center text-center p-1">
            <UploadIcon />
            <p className="colorTheInputFile discription mt-1">فیلم mp4</p>
          </div>
        </UploadZone>
        <input
          ref={videoInputRef}
          className="d-none"
          id="editVideoSrc"
          type="file"
          accept={`${process.env.NEXT_PUBLIC_INPUT_VIDEO_FORMAT}`}
          onChange={handleVideoChange}
        />
      </>
    );
  };

  const renderPosterSlot = () => {
    if (posterPreview) {
      return (
        <PreviewWrapper>
          <BOX component="img" src={posterPreview} alt="poster" />
          <RemoveBtn type="button" onClick={handleRemovePoster}>
            <DeleteIcon />
          </RemoveBtn>
        </PreviewWrapper>
      );
    }
    if (posterSrc && typeof posterSrc === "string") {
      return (
        <PreviewWrapper>
          <BOX
            component="img"
            src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${posterSrc}`}
            alt="poster"
          />
          <RemoveBtn type="button" onClick={handleRemovePoster}>
            <DeleteIcon />
          </RemoveBtn>
        </PreviewWrapper>
      );
    }
    return (
      <>
        <UploadZone htmlFor="editVideoPoster">
          <div className="d-flex flex-column align-items-center text-center p-1">
            <UploadIcon />
            <p className="colorTheInputFile discription mt-1">
              بارگذاری فایل .png یا .jpg
            </p>
            <p className="colorTheInputFile discription">حداکثر تا 5 مگابایت</p>
          </div>
        </UploadZone>
        <input
          ref={posterInputRef}
          className="d-none"
          id="editVideoPoster"
          type="file"
          accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
          onChange={handlePosterChange}
        />
      </>
    );
  };

  return (
    <div className="mt-3 container">
      <form onSubmit={handleSubmitClick}>
        <BorderInputBox>
          <div className="d-flex flex-row gap-3 align-items-start">
            {/* Left: video + poster */}
            <div className="w-50">
              <div className="d-flex flex-column mb-3">
                <span className="mb-1 NormalTextSizing">
                  فیلم <RedStar>*</RedStar>:
                </span>
                {renderVideoSlot()}
              </div>

              <div className="d-flex flex-column">
                <span className="mb-1 NormalTextSizing">
                  پوستر فیلم <RedStar>*</RedStar>:
                </span>
                {renderPosterSlot()}
              </div>
            </div>

            {/* Right: title + description */}
            <div className="w-50 d-flex flex-column gap-3 mt-2">
              <div className="d-flex flex-column">
                <label
                  className="NormalTextSizing mb-1"
                  htmlFor="editVideoTitle"
                >
                  عنوان <RedStar>*</RedStar>:
                </label>
                <input
                  id="editVideoTitle"
                  className="w-100"
                  type="text"
                  placeholder="عنوان"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="d-flex flex-column">
                <label
                  className="NormalTextSizing mb-1"
                  htmlFor="editVideoDesc"
                >
                  توضیحات <RedStar>*</RedStar>:
                </label>
                <input
                  id="editVideoDesc"
                  className="w-100"
                  type="text"
                  placeholder="توضیحات"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        </BorderInputBox>

        <BUTTONSSTYLE>
          <div className="d-flex flex-row mt-3 mb-3 gap-3 justify-content-around w-100">
            <button type="submit" className="confirmButtonStyle">
              ذخیره
            </button>
            <button
              type="button"
              className="cancelButtonStyle"
              onClick={handleCancelEdit}
            >
              انصراف
            </button>
          </div>
        </BUTTONSSTYLE>

        <AreYouShureModal
          open={openModal}
          onClose={() => setOpenModal(false)}
          text={"آیا از ویرایش ویدیو مطمئن هستید؟"}
          func={handleSubmit}
        />
        <ConfirmModal
          open={openModal2}
          onClose={() => setOpenModal2(false)}
          text={"عملیات با موفقیت انجام شد"}
        />
        <ErrorModal
          open={openModal3}
          onClose={() => setOpenModal3(false)}
          text={"خطا در انجام عملیات، لطفاً دوباره تلاش کنید"}
        />
      </form>
    </div>
  );
}
