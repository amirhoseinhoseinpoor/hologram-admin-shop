"use client";

import React, { useState, useEffect } from "react";
// improt redux
import { useDispatch } from "react-redux";
import { fetchPrivateImage } from "@/app/Store/thunks";
import { increaseStep } from "@/app/Store/thunks";

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Box } from "@mui/material";
import Modal from "@mui/material/Modal";
import Alert from '@mui/material/Alert';

const ModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "1.5px solid #000",
  boxShadow: 24,
  p: 0,
};


import style from "../../../Styles/MakeOrderStyle/StepTwoStyle.module.scss";

export default function StepTwoComponent({
  dataDocument,
  handleNextStep,
  handlePreviousStep,
  setDisabelInputStep2,
  disabelInputStep2,
  step,
  setStep,
  code,
}) {
  console.log(dataDocument);

  const hasData = Object.keys(dataDocument).length > 0;

  const dispatch = useDispatch();
  const [value, setValue] = useState("خصوصی");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [logo, setLogo] = useState(null);
  // const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  // Fetch image URLs for uploaded files only once on dataDocument change
  useEffect(() => {
    const fetchFileUrls = async () => {
      const updatedFiles = await Promise.all(
        dataDocument.preparedData.map(async (item) => {
          let updatedItem = { ...item };
          try {
            const result = await dispatch(
              fetchPrivateImage({ filename: item.file })
            ).unwrap();
            updatedItem.file = result; // Update file URL
          } catch (error) {
            console.error("Error fetching image:", error);
          }
          return updatedItem;
        })
      );
      setUploadedFiles(updatedFiles); // Update state only once
    };

    if (dataDocument.preparedData && dataDocument.preparedData.length > 0) {
      fetchFileUrls();
    }
  }, [dispatch, dataDocument.preparedData]);

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
        title: "", // Initialize empty title
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
    // handleNextStep();
  };

  const handleSubmit = async () => {
    const increseingStep = await dispatch(increaseStep({ code, step: 3 }));

    if (increseingStep.payload.message == "Success") {
      setStep(3);
    }
  };

  return (
    <>
      <div className={`${style.resizeNewresponsive} d-flex flex-row gap-3`}>
        <div className={`${style.fixNewSizes} d-flex flex-column`}>
          {!hasData ? (
            <>
              <Alert style={{fontFamily: "unset", gap: "8px"}} severity="warning">کاربر هنوز دیتایی وارد نکرده</Alert>
            </>
          ) : (
            <>
              <div className={style.stepContent}>
                <div
                  className={`${style.makeTheFormResponsive} d-flex flex-row gap-5 mt-3`}
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
                          <button
                            onClick={handleDeleteLogo}
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
                    {/* <div>
                  <label
                    className={style.labelInsteadOfInput}
                    htmlFor="fileUpload"
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
                      <p className={`${style.colorTheInputFile} discription`}>
                        حداکثر تا 5 مگابایت
                      </p>
                    </div>
                  </label>
                  <input
                    className={style.displayNoneTheInput}
                    id="fileUpload"
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    disabled={disabelInputStep2}
                  />
                </div> */}
                    {uploadedFiles.map((fileObj, index) => (
                      <div
                        key={index}
                        className={`${style.imagesContainerForDoucument}`}
                      >
                        <div className="position-relative">
                          <Box
                            onClick={handleOpen}
                            component="img"
                            src={fileObj.file}
                            alt={`uploaded ${index}`}
                            className={style.uploadedImage}
                          />
                          <button
                            onClick={() => handleDeleteImage(index)}
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
                        </div>
                        {/* modal */}
                        <Modal
                          open={open}
                          onClose={handleClose}
                          aria-labelledby="modal-modal-title"
                          aria-describedby="modal-modal-description"
                        >
                          <Box
                            component="img"
                            src={fileObj.file}
                            alt={`uploaded ${index}`}
                            className={style.modalStyleclass}
                            sx={ModalStyle}
                          ></Box>
                        </Modal>

                        <input
                          type="text"
                          placeholder="عنوان مدرک را بنویسید"
                          value={fileObj.title}
                          onChange={(e) => handleTitleChange(index, e)}
                          className={`${style.imageTitleInputForDocument} discription`}
                          disabled={disabelInputStep2}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="d-flex flex-row justify-content-between">
                  <div className="d-flex flex-row gap-1  mt-3">
                    <button
                      onClick={handleDisabelInput}
                      className={`${style.continueButton}`}
                    >
                      تایید مدارک
                    </button>
                    <button
                      className={style.SeeLastStepButton}
                      onClick={handlePreviousStep}
                    >
                      مشاهده مراحل قبلی
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
