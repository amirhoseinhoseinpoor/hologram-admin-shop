"use client";

import React, { useState, useEffect } from "react";
// improt redux
import { useDispatch } from "react-redux";
import { fetchPrivateImage } from "@/app/Store/thunks";
import { increaseStep, sendingSecondStep } from "@/app/Store/thunks";
// import base component
import ZoomModal from "@/app/BaseComponent/ZoomModal";
import LoadingCss from "@/app/BaseComponent/LoadingCss";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Box } from "@mui/material";
import Alert from "@mui/material/Alert";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import FolderZipIcon from "@mui/icons-material/FolderZip";
import DoneIcon from "@mui/icons-material/Done";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import style from "../../../Styles/MakeOrderStyle/StepTwoStyle.module.scss";

import { downloadImage } from "@/app/utils/downloadImage";

export default function StepTwoComponent({
  dataDocument,
  handleNextStep,
  handlePreviousStep,
  setDisabelInputStep2,
  disabelInputStep2,
  step,
  setStep,
  code,
  setNavStep,
  setUpdateData,
}) {
  const hasData = Object.keys(dataDocument).length > 0;

  const dispatch = useDispatch();
  const [value, setValue] = useState("خصوصی");
  const [uploadedFiles, setUploadedFiles] = useState(
    dataDocument.preparedData || []
  );


  const [logo, setLogo] = useState(null);
  const [moveForward, setMoveForward] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingDocConfirm, setLoadingDocConfirm] = useState([]);

  const [loadingDocReject, setLoadingDocReject] = useState([]);
  const [imageUrls, setImageUrls] = useState({});

  const handleCloseZoomModal = () => {
    setIsZoomModalOpen(false);
    setSelectedImage(null);
  };

  useEffect(() => {
    if (dataDocument?.preparedData?.length > 0) {
      setUploadedFiles(dataDocument.preparedData);
    }
  }, [dataDocument.preparedData]);

  const handleImageClick = async (index, filename) => {
    try {
      const result = await dispatch(fetchPrivateImage({ filename })).unwrap();
      setImageUrls((prev) => ({ ...prev, [index]: result }));
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handleZoomModal = (index) => {
    setSelectedImage(imageUrls[index]);
    setIsZoomModalOpen(true);
  };

  // Fetch logo on component mount
  useEffect(() => {
    const fetchLogo = async () => {
      const result = await dispatch(
        fetchPrivateImage({ filename: dataDocument.uploadLogo })
      );
      setLogo(result.payload);
    };

    fetchLogo();
  }, [dispatch, dataDocument.uploadLogo]);

  useEffect(() => {
    if (step > 2) {
      setMoveForward(true);
    }
  }, [step]);

  useEffect(() => {
    setValue(dataDocument.value || "");
  }, [dataDocument.value]);

  // Handle form data and file uploads
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const validImageTypes = ["image/png", "image/jpeg"];

    const newFiles = files
      .filter((file) => validImageTypes.includes(file.type))
      .map((file) => ({
        imageUrl: URL.createObjectURL(file),
        file: file,
        title: "",
        status: 1,
        type: file?.name.split(".").pop(),
        isFixed: false,
      }));

    setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0]; // Only get the first file
    const imageUrl = URL.createObjectURL(file); // Create a URL for the image preview
    setLogo({
      imageUrl,
      file,
    });
  };

  const handleDeleteLogo = () => {
    setLogo(null);
  };

  const handleDeleteImage = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleTitleChange = (index, event) => {
    const newTitle = event.target.value;
    setUploadedFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      updatedFiles[index].title = newTitle;
      return updatedFiles;
    });
  };

  const handleDisabelInput = () => {
    setDisabelInputStep2(true);
    handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const increseingStep = await dispatch(increaseStep({ code, step: 3 }));
      if (increseingStep.payload.message == "Success") {
        setStep(3);
        setNavStep(3);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const confirmDocument = async (index, NewStatus) => {
    try {
      if (NewStatus === 2) {
        setLoadingDocConfirm((prev) => {
          const newLoadingState = [...prev];
          newLoadingState[index] = true;
          return newLoadingState;
        });
      } else if (NewStatus === 3) {
        setLoadingDocReject((prev) => {
          const newLoadingState = [...prev];
          newLoadingState[index] = true;
          return newLoadingState;
        });
      }

      dataDocument.preparedData[index].status = NewStatus;

      // Dispatch the updated dataDocument
      const finalDataDispatch = await dispatch(
        sendingSecondStep({ code, sendingFinalData: dataDocument })
      ).unwrap();

      if (finalDataDispatch.statusCode === 200) {
        // Handle success
      }
    } catch (error) {
      console.error("Error confirming document:", error);
    } finally {
      if (NewStatus === 2) {
        setLoadingDocConfirm((prev) => {
          const newLoadingState = [...prev];
          newLoadingState[index] = false;
          return newLoadingState;
        });
      } else if (NewStatus === 3) {
        setLoadingDocReject((prev) => {
          const newLoadingState = [...prev];
          newLoadingState[index] = false;
          return newLoadingState;
        });
      }
      setUpdateData(true);
    }
  };

  const getDocStatus = (status) => {
    switch (status) {
      case 1:
        return "درحال برسی";
      case 2:
        return "تایید شده";
      case 3:
        return "رد شده";
      default:
        return "Unknown Status";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 1:
        return style.pendingStatusStyle;
      case 2:
        return style.confirmStatusStyle;
      case 3:
        return style.rejectStatusStyle;
      default:
        return style.rejectStatusStyle;
    }
  };

  return (
    <>
      <div className={`${style.resizeNewresponsive} d-flex flex-row gap-3`}>
        <div className={`${style.fixNewSizes} d-flex flex-column`}>
          {!hasData ? (
            <div className="container">
              <Alert
                style={{ fontFamily: "unset", gap: "8px" }}
                severity="warning"
              >
                کاربر هنوز دیتایی وارد نکرده
              </Alert>
              <button
                className={`${style.SeeLastStepButton} mt-3`}
                onClick={handlePreviousStep}
              >
                مشاهده مراحل قبلی
              </button>
            </div>
          ) : (
            <>
              <div className={style.stepContent}>
                <div className="d-flex flex-row gap-4">
                  <div
                    className={`${style.makeTheFormResponsive} d-flex flex-column gap-5 mt-3`}
                  >
                    <div className="d-flex flex-column">
                      <div className="d-flex flex-row gap-2 align-items-center">
                        <span className="NormalTextSizing">لوگو شرکت</span>
                        <span className={style.StarFixReq}>*</span>
                      </div>
                      <div className="mt-2">
                        {logo || dataDocument.uploadLogo ? (
                          <div
                            className={`${style.onlyFitContentWidth} position-relative`}
                          >
                            <Box
                              component="img"
                              src={logo}
                              alt="UserLogo"
                              className={style.LogoReplaceStyle}
                            />
                          </div>
                        ) : (
                          <>
                            <label
                              className={style.labelInsteadOfInput}
                              htmlFor="logoUpload"
                            >
                              <div className="d-flex flex-column text-center">
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
                                  className={`${style.colorTheInputFile} NormalTextSizing`}
                                >
                                  بارگذاری فایل .png یا .jpg
                                </p>
                                <p
                                  className={`${style.colorTheInputFile} discription`}
                                >
                                  حداکثر تا 5 مگابایت
                                </p>
                              </div>
                            </label>
                            <input
                              className={style.displayNoneTheInput}
                              id="logoUpload"
                              type="file"
                              accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
                              onChange={handleLogoChange}
                              disabled={disabelInputStep2}
                            />
                          </>
                        )}
                      </div>
                    </div>

                    <div className="d-flex flex-column">
                      <div>
                        <label
                          htmlFor="CompanyName"
                          className="d-flex flex-row gap-2 align-items-center"
                        >
                          <span className="NormalTextSizing">اسم شرکت</span>
                          <span className={style.StarFixReq}>*</span>
                        </label>
                      </div>
                      <div className="mt-2">
                        <input
                          type="text"
                          id="CompanyName"
                          placeholder="اسم شرکت را بنویسید"
                          value={dataDocument.companyName || ""}
                          className={`${style.inputTextCompanyName} discription`}
                          onChange={(e) => {
                            // If you want to allow changes, add an onChange handler
                          }}
                          disabled={disabelInputStep2}
                        />
                      </div>

                      <FormControl disabled={disabelInputStep2}>
                        <FormLabel
                          className={style.resetfontLabel}
                          id="demo-controlled-radio-buttons-group"
                        >
                          <div className="d-flex flex-row gap-2 align-items-center mt-2">
                            <span className="NormalTextSizing">نوع شرکت</span>
                            <span className={style.StarFixReq}>*</span>
                          </div>
                        </FormLabel>
                        <RadioGroup
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                        >
                          <FormControlLabel
                            className={`${style.resetfontLabel} m-0`}
                            value="دولتی"
                            control={<Radio />}
                            label="دولتی"
                          />
                          <FormControlLabel
                            className={style.resetfontLabel}
                            value="خصوصی"
                            control={<Radio />}
                            label="خصوصی"
                          />
                        </RadioGroup>
                      </FormControl>
                    </div>
                  </div>
                  <div className="d-flex flex-column">
                    <div className="d-flex flex-row gap-2 align-items-center">
                      <span className="NormalTextSizing">آپلود مدارک</span>
                      <span className={style.StarFixReq}>*</span>
                    </div>

                    <div className={`mt-2 ${style.gridOfDocument}`}>
                      {uploadedFiles.map((fileObj, index) => (
                        <div
                          key={index}
                          className={`${style.imagesContainerForDoucument}`}
                        >
                          <div className="position-relative">
                            {fileObj.type === "zip" ||
                            fileObj.type === "rar" ? (
                              <>
                                <div
                                  className={style.emptyBoxDonlowadDocument}
                                  onClick={() => {
                                    if (imageUrls[index]) {
                                      const date = new Date();
                                      downloadImage(
                                        imageUrls[index],
                                        `${date.toISOString()}.${fileObj.type}`
                                      );
                                    } else {
                                      handleImageClick(index, fileObj.file);
                                    }
                                  }}
                                >
                                  {imageUrls[index] ? (
                                    <>
                                      <DoneIcon />
                                      {fileObj?.status !== 2 && (
                                        <button
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            handleDeleteImage(index);
                                          }}
                                          className={style.deleteButton}
                                        >
                                          <svg
                                            width={17}
                                            height={17}
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M10.5 2.98828C8.835 2.82328 7.16 2.73828 5.49 2.73828C4.5 2.73828 3.51 2.78828 2.52 2.88828L1.5 2.98828"
                                              stroke="#FF4F3F"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                            <path
                                              d="M4.25 2.485L4.36 1.83C4.44 1.355 4.5 1 5.345 1H6.655C7.5 1 7.565 1.375 7.64 1.835L7.75 2.485"
                                              stroke="#FF4F3F"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                            <path
                                              d="M9.4252 4.57031L9.1002 9.60531C9.0452 10.3903 9.0002 11.0003 7.6052 11.0003H4.3952C3.0002 11.0003 2.9552 10.3903 2.9002 9.60531L2.5752 4.57031"
                                              stroke="#FF4F3F"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                            <path
                                              d="M5.16504 8.25H6.83004"
                                              stroke="#FF4F3F"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                            <path
                                              d="M4.75 6.25H7.25"
                                              stroke="#FF4F3F"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                        </button>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <FolderZipIcon />
                                    </>
                                  )}
                                </div>
                              </>
                            ) : fileObj?.type === "pdf" ? (
                              <>
                                <div
                                  className={style.emptyBoxDonlowadDocument}
                                  onClick={() => {
                                    if (imageUrls[index]) {
                                      const date = new Date();
                                      downloadImage(
                                        imageUrls[index],
                                        `${date.toISOString()}.${fileObj.type}`
                                      );
                                    } else {
                                      handleImageClick(index, fileObj.file);
                                    }
                                  }}
                                >
                                  {imageUrls[index] ? (
                                    <>
                                      <DoneIcon />
                                      {fileObj?.status !== 2 && (
                                        <button
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            handleDeleteImage(index);
                                          }}
                                          className={style.deleteButton}
                                        >
                                          <svg
                                            width={17}
                                            height={17}
                                            viewBox="0 0 12 12"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M10.5 2.98828C8.835 2.82328 7.16 2.73828 5.49 2.73828C4.5 2.73828 3.51 2.78828 2.52 2.88828L1.5 2.98828"
                                              stroke="#FF4F3F"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                            <path
                                              d="M4.25 2.485L4.36 1.83C4.44 1.355 4.5 1 5.345 1H6.655C7.5 1 7.565 1.375 7.64 1.835L7.75 2.485"
                                              stroke="#FF4F3F"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                            <path
                                              d="M9.4252 4.57031L9.1002 9.60531C9.0452 10.3903 9.0002 11.0003 7.6052 11.0003H4.3952C3.0002 11.0003 2.9552 10.3903 2.9002 9.60531L2.5752 4.57031"
                                              stroke="#FF4F3F"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                            <path
                                              d="M5.16504 8.25H6.83004"
                                              stroke="#FF4F3F"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                            <path
                                              d="M4.75 6.25H7.25"
                                              stroke="#FF4F3F"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                        </button>
                                      )}
                                    </>
                                  ) : (
                                    <>
                                      <PictureAsPdfIcon />
                                    </>
                                  )}
                                </div>
                              </>
                            ) : (
                              <>
                                {imageUrls[index] ? (
                                  <>
                                    <Box
                                      onClick={() => handleZoomModal(index)}
                                      component="img"
                                      src={imageUrls[index]}
                                      alt={`uploaded ${index}`}
                                      className={style.uploadedImage}
                                    />
                                    <button
                                      className={`${style.downloadButton}`}
                                      onClick={() => {
                                        const date = new Date();
                                        downloadImage(
                                          imageUrls[index],
                                          `${date.toISOString()}.png`
                                        );
                                      }}
                                    >
                                      <ArrowDownwardIcon
                                        style={{ color: "#282e3f" }}
                                      />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <div
                                      onClick={() =>
                                        handleImageClick(index, fileObj.file)
                                      }
                                      className={style.emptyBoxDonlowadDocument}
                                    >
                                      <ArrowDownwardIcon />
                                    </div>
                                  </>
                                )}
                              </>
                            )}

                            <div
                              className={`${getStatusClass(fileObj?.status)}`}
                            >
                              <p className="NormalTextSizing">
                                {getDocStatus(fileObj?.status)}
                              </p>
                            </div>
                          </div>

                          <input
                            type="text"
                            placeholder="عنوان مدرک را بنویسید"
                            value={fileObj.title}
                            onChange={(e) => handleTitleChange(index, e)}
                            className={`${style.imageTitleInputForDocument} discription`}
                            disabled={disabelInputStep2}
                          />
                          <div className="mt-2 d-flex flex-row justify-content-between">
                            <div>
                              {fileObj?.status !== 2 && (
                                <>
                                  <button
                                    type="button"
                                    className={style.confirmButtonDoc}
                                    onClick={() => confirmDocument(index, 2)}
                                  >
                                    {loadingDocConfirm[index] ? (
                                      <LoadingCss />
                                    ) : (
                                      "تایید مدرک"
                                    )}
                                  </button>
                                </>
                              )}
                            </div>

                            <button
                              type="button"
                              className={style.rejectButtonDoc}
                              onClick={() => confirmDocument(index, 3)}
                            >
                              {loadingDocReject[index] ? (
                                <LoadingCss />
                              ) : (
                                "رد مدرک"
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="d-flex flex-row justify-content-between">
                  <div className="d-flex flex-row gap-2  mt-3">
                    <button
                      onClick={handleDisabelInput}
                      disabled={loading}
                      className={`${style.continueButton}  ${
                        loading ? style.disabledButtonLoading : ""
                      }`}
                    >
                      {loading ? <LoadingCss /> : <>تایید مدارک</>}
                    </button>
                    <button
                      className={style.SeeLastStepButton}
                      onClick={handlePreviousStep}
                    >
                      مراحله قبلی
                    </button>
                  </div>
                  {moveForward && (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className={`${style.continueButton} mt-3`}
                    >
                      مرحله بعد
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {selectedImage && (
        <ZoomModal
          open={isZoomModalOpen}
          onClose={handleCloseZoomModal}
          src={selectedImage}
          alt={`zoomModalImage`}
        />
      )}
    </>
  );
}
