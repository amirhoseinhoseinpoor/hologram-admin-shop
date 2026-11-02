import { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { TextField, Checkbox, FormControlLabel, Box } from "@mui/material";
import styled from "styled-components";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import ConfirmModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import toast from "react-hot-toast";

const DELETEUPLODEDIMAGE = styled.button`
  position: absolute;
  bottom: 0;
  left: -5%;
  transform: translate(50%, -50%);
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  min-height: 32px;
  padding: 0;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(16, 24, 40, 0.18);
  cursor: pointer;
`;

const BOX = styled(Box)`
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
`;

const TEXTFIELD = styled(TextField)`
  .MuiInputBase-input {
    padding: 10px;
  }
  .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root {
    transform: translate(50%, 50%);
  }
  .css-md26zr-MuiInputBase-root-MuiOutlinedInput-root {
    font-family: unset !important;
  }
  .css-1jy569b-MuiFormLabel-root-MuiInputLabel-root {
    font-family: unset !important;
  }
  .css-14s5rfu-MuiFormLabel-root-MuiInputLabel-root {
    font-family: unset !important;
  }
  .css-1jy569b-MuiFormLabel-root-MuiInputLabel-root {
    left: 3px;
  }
`;

const LABELIMAGEUPLOAD = styled.label`
  border: 1.5px dashed var(--c-border-strong);
  border-radius: var(--r-md);
  background-color: #fafbfc;
  color: var(--c-muted);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background-color 0.15s ease;
  &:hover {
    border-color: var(--c-primary);
    background-color: var(--c-primary-50);
  }
  padding: 10px;
  width: 100%;
  height: 77%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
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

const GridBorderDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: flex-start;
  gap: 2.5rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const BorderDiv = styled.div`
  padding: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  background: #ffffff;
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.06);
  /* align-items: center; */
  @media (max-width: 768px) {
    .inputMainDiv {
      width: 100% !important;
    }
  }
`;

const FORMCONTROLLABEL = styled(FormControlLabel)`
  .css-ahj2mt-MuiTypography-root {
    font-family: unset;
  }
`;

// import redux
import { useDispatch } from "react-redux";
import { uploadFile, blogspot, prodNameAndNav } from "@/app/Store/thunks";
const RedStar = styled.span`
  color: var(--c-danger);
  padding-left: 2px;
  padding-right: 2px;
`;

const SelectWidth = styled.select`
  flex: 1;
  border: 1px solid #c4c4c4;
  border-radius: 4px;
  padding: 8px 10px;
  font-family: unset;
  font-size: 14px;
  background: #fff;
  &:focus {
    outline: none;
    border-color: var(--c-primary);
  }
`;

const LinkModeToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;

  button {
    padding: 5px 14px;
    border-radius: 20px;
    border: 1px solid #c4c4c4;
    font-family: unset;
    font-size: 13px;
    cursor: pointer;
    transition: 140ms ease;
    background: #f5f5f5;
    color: #555;

    &.active {
      background: var(--c-primary);
      color: #fff;
      border-color: var(--c-primary);
    }
  }
`;

export default function AddHonors({ setActiveKey, setUpdateData, dataCome }) {
  const dispatch = useDispatch();

  const [content, setContent] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");
  const [blogTime, setBlogTime] = useState("");
  const [blogType, setBlogType] = useState("");

  const [bannerTags, setBannerTags] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [notify, setNotify] = useState(false);
  const [posetives, setposetives] = useState("");
  const [negetive, setnegetive] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [textnotify, setTextnotify] = useState(null);
  // product
  const [productTitle, setproductTitle] = useState("");
  const [productSrc, setproductSrc] = useState("");
  const [productLink, setproductLink] = useState("");
  // product link mode: "select" | "manual"
  const [linkMode, setLinkMode] = useState("select");
  const [productsList, setProductsList] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  // modal state
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  // Close modal
  const closeModal = () => setOpenModal(false);
  const closeModal2 = () => setOpenModal2(false);
  const closeModal3 = () => setOpenModal3(false);

  const validatePriority = (items) => {
    const trueItems = items.filter((item) => item?.content?.priority === true);

    if (trueItems.length >= 3) {
      return {
        valid: false,
        list: trueItems,
        message:
          "حداقل ۳ آیتم دارای اولویت فعال هستند. لطفا آن‌ها را غیرفعال کنید.",
      };
    }

    return { valid: true };
  };

  useEffect(() => {
    const result = validatePriority(dataCome);

    if (!result.valid) {
      // Build readable list for user
      const msgLines = result.list
        .map((i) => `\n ${i?.content?.title} (کد: ${i.code})`)
        .join("\n");

      setTextnotify(
        `برای اضافه کردن مقاله به مقالات مهم ابتدا یکی از مقالات زیر را از اولویت در بیاورید:\n${msgLines}`,
      );

      setDisableButton(true);
      return;
    }

    setDisableButton(false);
  }, [dataCome]);

  useEffect(() => {
    dispatch(prodNameAndNav())
      .unwrap()
      .then((data) => setProductsList(data || []))
      .catch(() => {});
  }, [dispatch]);

  const validateForm = () => {
    // Main fields
    if (!bannerTitle.trim())
      return { valid: false, message: "لطفا عنوان را وارد کنید" };
    if (!blogTime.trim())
      return { valid: false, message: "لطفا زمان مطالعه را وارد کنید" };
    if (!blogType.trim())
      return { valid: false, message: "لطفا فیلد نوع را وارد کنید" };
    if (!bannerTags.trim())
      return { valid: false, message: "لطفا فیلد تگ ها را وارد کنید" };
    if (!bannerImage)
      return {
        valid: false,
        message: "لطفا یک عکس اصلی برای مقاله انتخاب کنید",
      };
    if (!posetives.trim())
      return { valid: false, message: "لطفا فیلد نکات مثبت را وارد کنید" };
    if (!negetive.trim())
      return { valid: false, message: "لطفا فیلد نکات منفی را وارد کنید" };
    if (!productTitle.trim())
      return { valid: false, message: "لطفا فیلد تایتل محصول را وارد کنید" };
    if (!productSrc)
      return {
        valid: false,
        message: "لطفا یک عکس برای محصول تبلیغاتی انتخاب کنید",
      };
    if (!productLink.trim())
      return {
        valid: false,
        message: "لطفا فیلد لینک محصول تبلیغاتی را وارد کنید",
      };

    return { valid: true };
  };

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  const handleTitleChange = (event) => {
    setBannerTitle(event.target.value);
  };

  const handleTimeChange = (event) => {
    setBlogTime(event.target.value);
  };

  const handleTypeChange = (event) => {
    setBlogType(event.target.value);
  };

  const handleTagsChange = (event) => {
    setBannerTags(event.target.value);
  };

  const handlePosetivesChange = (event) => {
    setposetives(event.target.value);
  };

  const handleNegetivesChange = (event) => {
    setnegetive(event.target.value);
  };

  const handleProductTitleChange = (event) => {
    setproductTitle(event.target.value);
  };

  const handleProductLinkChange = (event) => {
    setproductLink(event.target.value);
  };

  const handleNotifyChange = (event) => {
    setNotify(event.target.checked); // Update the notify state
  };

  const handleImageUpload = async (blobInfo, success, failure) => {
    const file = blobInfo.blob(); // Get the image blob from TinyMCE
    const tag = "blogMainSrc";
    const type = 1; // Adjust based on your backend logic
    const isPublic = true;

    try {
      // Upload the file using your thunk
      const fileId = await dispatch(
        uploadFile({ file, tag, type, isPublic }),
      ).unwrap();

      // Construct the valid image URL based on your backend API response
      const imageUrl = `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${fileId}`;

      // Ensure the image URL is valid and log it for debugging purposes
      const editor = tinymce.activeEditor; // Get the active editor instance
      editor.insertContent(`<img src="${imageUrl}" alt="Image" />`);
    } catch (error) {
      console.error("Error uploading image:", error);
      failure("Image upload failed"); // Return an error to TinyMCE if the upload fails
    }
  };

  // Handle file input change
  const handleBannerImageUpload = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    const tag = "blogMainSrc";
    const type = 1; // Adjust based on your backend logic
    const isPublic = true;

    try {
      // Dispatch the uploadFile thunk
      const fileId = await dispatch(
        uploadFile({ file, tag, type, isPublic }),
      ).unwrap();

      // Get the URL of the uploaded image
      // const imageUrl = `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${fileId}`;
      setBannerImage(fileId); // Store the URL of the uploaded image
    } catch (error) {
      console.error("Error uploading banner image:", error);
    }
  };

  const handleProductSrcChange = async (event) => {
    const file = event.target.files[0]; // Get the selected file
    const tag = "blogMainSrc";
    const type = 1; // Adjust based on your backend logic
    const isPublic = true;

    try {
      // Dispatch the uploadFile thunk
      const fileId = await dispatch(
        uploadFile({ file, tag, type, isPublic }),
      ).unwrap();

      // Get the URL of the uploaded image
      // const imageUrl = `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${fileId}`;
      setproductSrc(fileId);
    } catch (error) {
      console.error("Error uploading banner image:", error);
    }
  };

  const areYouShureFunction = (e) => {
    e.preventDefault();
    const result = validateForm();

    if (!result.valid) {
      toast.error(result.message);
      return;
    }
    setOpenModal(true);
  };

  function closeModalOnTimeout() {
    setTimeout(() => {
      setOpenModal2(false);
      setActiveKey("editUserPage");
    }, 3000);
  }

  // Form submit logic
  const handleSubmit = async (event) => {
    event.preventDefault();
    setOpenModal(false);

    const formData = {
      type: blogType,
      title: bannerTitle,
      time: blogTime,
      priority: notify,
      imageSrc: bannerImage,
      tags: bannerTags,
      content: content,
      posetives: posetives,
      negetive: negetive,
      product: {
        title: productTitle,
        src: productSrc,
        link: productLink,
      },
    };

    const finalData = {
      content: formData,
    };

    try {
      const fetchData = await dispatch(blogspot(finalData)).unwrap();
      if (fetchData) {
        setOpenModal2(true);
        closeModalOnTimeout();
      }
    } catch (error) {
      setOpenModal3(true);
      console.error("Error submitting data:", error);
    } finally {
      setUpdateData(true);
    }
  };

  return (
    <>
      <form onSubmit={areYouShureFunction} className="p-3">
        <BorderDiv>
          <p className="QASize text-center mb-4 mt-0">مقاله</p>
          <GridBorderDiv>
            <div className="d-flex flex-row align-items-center gap-2">
              <label
                style={{ whiteSpace: "nowrap" }}
                className="mt-2 seeOrderFont"
                htmlFor="bannerTitle"
              >
                عنوان<RedStar> *</RedStar> :
              </label>
              <TEXTFIELD
                fullWidth
                label="عنوان"
                value={bannerTitle}
                id="bannerTitle"
                onChange={handleTitleChange}
              />
            </div>
            <div className="d-flex flex-row align-items-center gap-2 ">
              <label
                style={{ whiteSpace: "nowrap" }}
                className="mt-2 seeOrderFont"
                htmlFor="readTime"
              >
                زمان مطالعه<RedStar> *</RedStar> :
              </label>
              <TEXTFIELD
                fullWidth
                id="readTime"
                label="زمان مطالعه"
                value={blogTime}
                onChange={handleTimeChange}
              />
            </div>
            <div className="d-flex flex-row align-items-center gap-2 ">
              <label
                style={{ whiteSpace: "nowrap" }}
                className="mt-2 seeOrderFont"
                htmlFor="typeBlog"
              >
                نوع<RedStar> *</RedStar> :
              </label>
              <TEXTFIELD
                fullWidth
                id="typeBlog"
                label="نوع"
                value={blogType}
                onChange={handleTypeChange}
              />
            </div>

            <div className="d-flex flex-row align-items-center gap-2 ">
              <label
                style={{ whiteSpace: "nowrap" }}
                className="mt-2 seeOrderFont"
                htmlFor="positiveSides"
              >
                نکات مثبت<RedStar> *</RedStar> :
              </label>
              <TEXTFIELD
                fullWidth
                id="positiveSides"
                label="نکات مثبت"
                value={posetives}
                onChange={handlePosetivesChange}
              />
            </div>
            <div className="d-flex flex-row align-items-center gap-2 ">
              <label
                style={{ whiteSpace: "nowrap" }}
                className="mt-2 seeOrderFont"
                htmlFor="negetiveSides"
              >
                نکات منفی<RedStar> *</RedStar> :
              </label>
              <TEXTFIELD
                fullWidth
                id="negetiveSides"
                label="نکات منفی"
                value={negetive}
                onChange={handleNegetivesChange}
              />
            </div>

            <div className="d-flex flex-row align-items-center gap-2 ">
              <label
                style={{ whiteSpace: "nowrap" }}
                className="mt-2 seeOrderFont"
                htmlFor="Tags"
              >
                تگ ها<RedStar> *</RedStar> :
              </label>

              <TEXTFIELD
                fullWidth
                id="Tags"
                label="تگ"
                value={bannerTags}
                onChange={handleTagsChange}
              />
            </div>

            <div className="d-flex flex-column">
              <div>
                <p className="VodeoDisSizing mb-1 me-1">
                  عکس اصلی مقاله<RedStar> *</RedStar>
                </p>
                {bannerImage ? (
                  <>
                    <div
                      className="d-flex flex-column position-relative"
                      style={{ width: "fit-content" }}
                    >
                      <BOX
                        component="img"
                        src={
                          `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${bannerImage}` ||
                          ""
                        }
                        alt="UserColorImage"
                      />

                      <DELETEUPLODEDIMAGE onClick={() => setBannerImage(null)}>
                        <svg
                          width={17}
                          height={17}
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.5 2.98828C8.835 2.82328 7.16 2.73828 5.49 2.73828C4.5 2.73828 3.51 2.78828 2.52 2.88828L1.5 2.98828"
                            stroke="#dc2626"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4.25 2.485L4.36 1.83C4.44 1.355 4.5 1 5.345 1H6.655C7.5 1 7.565 1.375 7.64 1.835L7.75 2.485"
                            stroke="#dc2626"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9.4252 4.57031L9.1002 9.60531C9.0452 10.3903 9.0002 11.0003 7.6052 11.0003H4.3952C3.0002 11.0003 2.9552 10.3903 2.9002 9.60531L2.5752 4.57031"
                            stroke="#dc2626"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5.16504 8.25H6.83004"
                            stroke="#dc2626"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4.75 6.25H7.25"
                            stroke="#dc2626"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </DELETEUPLODEDIMAGE>
                    </div>
                  </>
                ) : (
                  <>
                    <LABELIMAGEUPLOAD htmlFor="blogImage">
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
                      accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
                      id="blogImage"
                      onChange={handleBannerImageUpload}
                    />
                  </>
                )}
              </div>
              <div className="mt-2">
                <pre style={{ whiteSpace: "pre-wrap", direction: "rtl" }}>
                  {textnotify}
                </pre>
              </div>
              <FORMCONTROLLABEL
                disabled={disableButton}
                className="mt-2 p-0 m-0"
                sx={{ fontFamily: "unset" }}
                control={
                  <Checkbox checked={notify} onChange={handleNotifyChange} />
                }
                label="ایا مقاله مهم و در صفحه اصلی است"
              />
            </div>
          </GridBorderDiv>
        </BorderDiv>

        <BorderDiv className="mt-4">
          <p className="QASize text-center mb-4 mt-0">محصول داخل مقاله</p>
          <GridBorderDiv>
            <div className="d-flex flex-column  gap-2 ">
              <label
                style={{ whiteSpace: "nowrap" }}
                className="mt-2 seeOrderFont"
                htmlFor="bannerTitle"
              >
                تایتل محصول<RedStar> *</RedStar> :
              </label>
              <TEXTFIELD
                fullWidth
                label="تایتل محصول"
                value={productTitle}
                onChange={handleProductTitleChange}
              />
            </div>

            <div className="d-flex flex-column gap-1">
              <div className="d-flex flex-row gap-2 ">
                <label
                  style={{ whiteSpace: "nowrap" }}
                  className="seeOrderFont mt-1"
                >
                  لینک محصول<RedStar> *</RedStar> :
                </label>
                <LinkModeToggle>
                  <button
                    type="button"
                    className={linkMode === "select" ? "active" : ""}
                    onClick={() => {
                      setLinkMode("select");
                      setproductLink("");
                      setSelectedProductId("");
                    }}
                  >
                    انتخاب از محصولات
                  </button>
                  <button
                    type="button"
                    className={linkMode === "manual" ? "active" : ""}
                    onClick={() => {
                      setLinkMode("manual");
                      setSelectedProductId("");
                      setproductLink("");
                    }}
                  >
                    وارد کردن لینک
                  </button>
                </LinkModeToggle>
              </div>
              {linkMode === "select" ? (
                <SelectWidth
                  value={selectedProductId}
                  onChange={(e) => {
                    const selected = productsList.find(
                      (p) => p.navId === e.target.value,
                    );
                    setSelectedProductId(e.target.value);
                    if (selected) {
                      // name format: "محصولات - Category - ProductName"
                      // URL format:  "/Category/ProductName"
                      const urlPath = selected.name
                        .replace(/^محصولات\s*-\s*/, "")
                        .split(" - ")
                        .join("/");
                      setproductLink(`/${urlPath}`);
                    } else {
                      setproductLink("");
                    }
                  }}
                >
                  <option value="" disabled>
                    انتخاب محصول
                  </option>
                  {productsList.map((p, i) => (
                    <option key={i} value={p.navId}>
                      {p.name}
                    </option>
                  ))}
                </SelectWidth>
              ) : (
                <TEXTFIELD
                  fullWidth
                  id="prductLink"
                  label="لینک محصول"
                  value={productLink}
                  onChange={handleProductLinkChange}
                />
              )}
              {productLink && (
                <span style={{ fontSize: 12, color: "#666", direction: "ltr" }}>
                  {productLink}
                </span>
              )}
            </div>

            <div>
              <p className="VodeoDisSizing mb-1">
                عکس محصول تبلیغاتی<RedStar> *</RedStar>
              </p>
              {productSrc ? (
                <>
                  <div
                    className="d-flex flex-column position-relative"
                    style={{ width: "fit-content" }}
                  >
                    <BOX
                      component="img"
                      src={
                        `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${productSrc}` ||
                        ""
                      }
                      alt="BlogProductImage"
                    />

                    <DELETEUPLODEDIMAGE onClick={() => setproductSrc("")}>
                      <svg
                        width={17}
                        height={17}
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M10.5 2.98828C8.835 2.82328 7.16 2.73828 5.49 2.73828C4.5 2.73828 3.51 2.78828 2.52 2.88828L1.5 2.98828"
                          stroke="#dc2626"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.25 2.485L4.36 1.83C4.44 1.355 4.5 1 5.345 1H6.655C7.5 1 7.565 1.375 7.64 1.835L7.75 2.485"
                          stroke="#dc2626"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.4252 4.57031L9.1002 9.60531C9.0452 10.3903 9.0002 11.0003 7.6052 11.0003H4.3952C3.0002 11.0003 2.9552 10.3903 2.9002 9.60531L2.5752 4.57031"
                          stroke="#dc2626"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M5.16504 8.25H6.83004"
                          stroke="#dc2626"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M4.75 6.25H7.25"
                          stroke="#dc2626"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </DELETEUPLODEDIMAGE>
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
                    accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
                    onChange={handleProductSrcChange}
                  />
                </>
              )}
            </div>
          </GridBorderDiv>
        </BorderDiv>

        <div className="w-100 mt-4">
          <Editor
            apiKey="3akk9p7jow7ksa3txzom0c8qr4e59rtg6xy1fzvux8vysqs0" // Replace with your TinyMCE API key
            value={content}
            onEditorChange={handleEditorChange}
            init={{
              height: 500,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
              ],

              toolbar:
                "undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | \
                bullist numlist outdent indent | removeformat | image |  h1 h2 h3 h4 h5 h6",
              style_formats: [
                { title: "Header 1", block: "h1" },
                { title: "Header 2", block: "h2" },
                { title: "Header 3", block: "h3" },
                { title: "Header 4", block: "h4" },
                { title: "Header 5", block: "h5" },
                { title: "Header 6", block: "h6" },
              ],
              images_upload_handler: handleImageUpload,
            }}
          />
        </div>

        <BUTTONSSTYLE className="d-flex justify-content-around">
          <button
            type="submit"
            variant="contained"
            className="mt-3 confirmButtonStyle"
          >
            ذخیره
          </button>
          <button
            className="cancelButtonStyle mt-3"
            type="button"
            onClick={() => setActiveKey("editUserPage")}
          >
            انصراف
          </button>
        </BUTTONSSTYLE>

        {/* modals */}
        <AreYouShureModal
          open={openModal}
          onClose={closeModal}
          text={"آیا از اضافه کردن مقاله مطمئن هستید؟"}
          func={handleSubmit}
        />
        <ConfirmModal
          open={openModal2}
          onClose={closeModal2}
          text={"مقاله با موفقیت اضافه شد"}
        />
        <ErrorModal
          open={openModal3}
          onClose={closeModal3}
          text={"خطا در انجام عملیات، لطفاً دوباره تلاش کنید"}
        />
      </form>
    </>
  );
}
