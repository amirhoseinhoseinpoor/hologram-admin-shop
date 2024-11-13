import React, { useState, useEffect } from "react";
import style from "../../../Styles/MakeOrderStyle/StepOneStyle.module.scss";
import { Box } from "@mui/system";
// import modals
import ZoomModal from "@/app/BaseComponent/ZoomModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
// import redux
import { useDispatch } from "react-redux";
import {
  uploadFile,
  requestAdminCommnet,
  increaseStep,
  fetchPrivateImage,
} from "@/app/Store/thunks";

export default function SteponeComponent({
  data,
  code,
  step,
  setStep,
  handleNextStep,
  reqComment,
  setDisabelInput,
  disabelInput,
}) {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [serialtype, setSerialtype] = useState(false);
  // modals state
  const [zoomModal, setZoomModal] = useState(false);

  const handleCloseZoomModal = () => setZoomModal(false);

  // const [inputFields, setInputFields] = useState([{ title: "", price: "" }]);
  // const [disablenextStep, setDisableNextStep] = useState(true);
  const [statusTraking, setStatusTraking] = useState(false);
  const [moveForward, setMoveForward] = useState(false);

  const [logo, setLogo] = useState(null);

  const [formData, setFormData] = useState({
    feature: "",
    color: "",
    stick: "",
    howItWork: "",
    chosenEffect: "",
    selectedSize: "",
    selectedShape: "",
    serialtype: false,
    useCase: "",
    serial: "",
    information: "",
    prodName: "",
    prodCode: "",
  });

  useEffect(() => {
    if (step > 1) {
      setMoveForward(true);
    }
  }, [step]);

  useEffect(() => {
    const gettingImageFactor = async () => {
      if (reqComment?.paymentImage) {
        const returnFactor = await dispatch(
          fetchPrivateImage({ filename: reqComment?.paymentImage })
        ).unwrap();
        setLogo({ imageUrl: returnFactor || null });
      } else {
        setLogo(null);
      }
    };
    gettingImageFactor();
  }, [reqComment, dispatch]);

  // modal state
  const [openModal3, setOpenModal3] = useState(false);
  // Close modal
  const closeModal3 = () => setOpenModal3(false);

  const [information, setInformation] = useState({
    docInfo: "",
    paymentImage: "",
  });

  console.log(information);

  useEffect(() => {
    if (data) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...data,
      }));
      setSelectedSize(data.selectedSize || "");
      setSelectedShape(data.selectedShape || "");
      setSerialtype(data.serialtype || false);
      // setDisabelInput(true);
      setStatusTraking(true);
    }
  }, [data]);

  useEffect(() => {
    if (reqComment) {
      setInformation({
        ...information,
        docInfo: reqComment.docInfo || "",
      });
    }
  }, [reqComment]);

  const handleDisabelInput = () => {
    // setDisabelInput(true);

    handleSubmit();
    // handleNextStep();
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setFormData({ ...formData, selectedSize: size });
    // checkAllFieldsFilled();
  };

  const handleShapeChange = (shape) => {
    setSelectedShape(shape);
    setFormData({ ...formData, selectedShape: shape });
    // checkAllFieldsFilled();
  };

  const handleRadioChange = (event) => {
    setSerialtype(event.target.value === "true");
    setFormData({ ...formData, serialtype: event.target.value === "true" });
    // checkAllFieldsFilled();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    // checkAllFieldsFilled();
  };

  const handleInfomationChange = (event) => {
    const { name, value } = event.target;
    setInformation({ ...information, [name]: value });
    // checkAllFieldsFilled();
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setLogo({
      imageUrl,
    });
    setInformation({ ...information, paymentImage: file });
  };

  const handleDeleteLogo = () => {
    setLogo(null);
  };

  // const checkAllFieldsFilled = () => {
  //   const isFilled =
  //   formData.selectedSize !== "" &&
  //   formData.feature !== "" &&
  //   formData.color !== "" &&
  //   formData.stick !== "" &&
  //   formData.howItWork !== "" &&
  //   formData.chosenEffect !== "" &&
  //   formData.selectedShape !== "";

  //   setDisableNextStep(!isFilled);
  // };

  const handleSubmit = async () => {
    const updatedData = { request: { ...formData } };

    try {
      let uploadFactor ;
      let updatedInformation ;

      if (information?.paymentImage) {
        uploadFactor = await dispatch(
          uploadFile({
            file: information?.paymentImage,
            tag: "factor",
            type: 1,
            isPublic: false,
          })
        ).unwrap();

        updatedInformation = {
          ...information,
          paymentImage: uploadFactor,
        };
      } else {
        updatedInformation = {
          ...information,
          paymentImage: reqComment?.paymentImage,
        };
      }

      console.log(updatedInformation);
      

      // Send updatedInformation with the second API call
      const uploadDocumentUser = await dispatch(
        requestAdminCommnet({ code, reqComment: updatedInformation })
      );

      if (uploadDocumentUser.payload.message == "Success") {
        const increaseStepOrder = await dispatch(
          increaseStep({ code, step: 2 })
        );

        if (increaseStepOrder.payload.message == "Success") {
          setStep(2);
        }
      }

      // Optionally, you can update the state if needed later
      setInformation(updatedInformation);
    } catch (error) {
      console.error("Error uploading file:", error);
      setOpenModal3(true);
    }
  };

  return (
    <>
      <div className={`${style.adjustPhoneSize} d-flex flex-row gap-4`}>
        <div className={`${style.adjustWidthRight} d-flex flex-column `}>
          <div className="d-flex flex-column">
            <div className="d-flex flex-column">
              <label htmlFor="feature" className="mt-1 mb-1 discription">
                تعداد یا تیراژ
              </label>
              <input
                type="text"
                className={`${style.formInputNumber} form-control discription`}
                // style={{ border: hasError ? "1.2px solid #FF4F3F" : "" }}
                id="feature"
                name="feature"
                value={formData.feature}
                // ref={passwordRef}
                // onChange={(e) => setPassword(e.target.value)}
                placeholder="حداقل 2000"
                onChange={handleInputChange}
                disabled={disabelInput}
                required
              />
            </div>
            <h3 className="mb-3 mt-3 discription">سایز</h3>
            <div style={{ display: "flex", gap: "4px" }}>
              <div
                className={style.SizezInput}
                style={{
                  border: selectedSize === "2:4" ? "1.5px solid #404756" : "",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={
                  disabelInput ? undefined : () => handleSizeChange("2:4")
                }
              >
                2:4
              </div>
              <div
                className={style.SizezInput}
                style={{
                  border: selectedSize === "2:5" ? "1.5px solid #404756" : "",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={
                  disabelInput ? undefined : () => handleSizeChange("2:5")
                }
              >
                2:5
              </div>
              <div
                className={style.SizezInput}
                style={{
                  border: selectedSize === "3:5" ? "1.5px solid #404756" : "",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={
                  disabelInput ? undefined : () => handleSizeChange("3:5")
                }
              >
                3:5
              </div>
              <div
                className={style.SizezInput}
                style={{
                  border: selectedSize === "3:11" ? "1.5px solid #404756" : "",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
                onClick={
                  disabelInput ? undefined : () => handleSizeChange("3:11")
                }
              >
                3:11
              </div>
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="color" className="mt-3 mb-1 discription">
                رنگ
              </label>
              <input
                type="text"
                className={`${style.formInputNumber} form-control discription`}
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                disabled={disabelInput}
                required
              />
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="stick" className="mt-2 mb-2 discription">
                قالب برچسب
              </label>
              <input
                type="text"
                className={`${style.formInputNumber} form-control discription`}
                id="stick"
                name="stick"
                value={formData.stick}
                onChange={handleInputChange}
                disabled={disabelInput}
              />
            </div>
            <div className="d-flex flex-column">
              <label htmlFor="howItWork" className="mt-2 mb-2 discription">
                نوع اثرگذاری
              </label>
              <input
                type="text"
                className={`${style.formInputNumber} form-control discription`}
                id="howItWork"
                name="howItWork"
                value={formData.howItWork}
                onChange={handleInputChange}
                disabled={disabelInput}
              />
            </div>
          </div>
        </div>
        <div className={`${style.adjustWithLeft} d-flex flex-column`}>
          <div className="d-flex flex-column">
            <label htmlFor="chosenEffect" className="mt-1 mb-1 discription">
              افکت مورد نظر
            </label>
            <input
              type="text"
              className={`${style.formInputNumber} form-control discription`}
              id="chosenEffect"
              name="chosenEffect"
              value={formData.chosenEffect}
              disabled={disabelInput}
              onChange={handleInputChange}
            />
          </div>

          <h3 className="mb-3 mt-3 discription">شکل هولوگرام</h3>
          <div className="d-flex flex-row gap-1">
            <div
              className={style.SizezInputFirst}
              style={{
                border: selectedShape === "مربع" ? "1.5px solid #404756" : "",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={
                disabelInput ? undefined : () => handleShapeChange("مربع")
              }
              // onClick={() => setSelectedShape("مربع")}
            >
              مربع
            </div>
            <div
              className={style.SizezInputSecond}
              style={{
                border: selectedShape === "دایره" ? "1.5px solid #404756" : "",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={
                disabelInput ? undefined : () => handleShapeChange("دایره")
              }
            >
              دایره
            </div>
            <div
              className={style.SizezInputThird}
              style={{
                border: selectedShape === "مستطیل" ? "1.5px solid #404756" : "",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={
                disabelInput ? undefined : () => handleShapeChange("مستطیل")
              }
            >
              مستطیل
            </div>
            <div
              className={style.SizezInputForth}
              style={{
                border: selectedShape === "بیضی" ? "1.5px solid #404756" : "",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={
                disabelInput ? undefined : () => handleShapeChange("بیضی")
              }
            >
              بیضی
            </div>
          </div>

          <div className="d-flex flex-column">
            <label htmlFor="useCase" className="mt-3 mb-1 discription">
              موارد مصرف
            </label>
            <input
              type="text"
              className={`${style.formInputNumber} form-control discription`}
              id="useCase"
              name="useCase"
              value={formData.useCase}
              disabled={disabelInput}
              onChange={handleInputChange}
            />
            <p className={`${style.discriptionStyle} discription`}>
              سطحی که قرار است روی ان چسبیده شود (پلاستیک . کاغذ)
            </p>
          </div>
          <div className="d-flex flex-row gap-1  mt-2 mb-2">
            <input
              name="serial"
              id="withOutSerial"
              type="radio"
              onChange={handleRadioChange}
              value="false"
              checked={serialtype === false}
              disabled={disabelInput}
            />
            <label htmlFor="withOutSerial" className="ms-2">
              بدون سریال
            </label>
            <input
              name="serial"
              id="withSerial"
              type="radio"
              onChange={handleRadioChange}
              value="true"
              checked={serialtype === true}
              disabled={disabelInput}
            />
            <label htmlFor="withSerial">باسریال</label>
          </div>
          <div className="mt-1 mb-1">
            {serialtype && (
              <div className="d-flex flex-column">
                <label htmlFor="serial" className=" mb-1 discription">
                  نوع سریال
                </label>
                <input
                  type="text"
                  className={`${style.formInputNumber} form-control discription`}
                  id="serial"
                  name="serial"
                  value={formData.serial}
                  onChange={handleInputChange}
                  disabled={disabelInput}
                />
              </div>
            )}
          </div>
          <div className="d-flex flex-column">
            <label htmlFor="information" className=" mb-1 discription">
              توضیحات
            </label>
            <textarea
              className={`${style.formInputNumber} form-control discription`}
              id="information"
              name="information"
              value={formData.information}
              style={{ maxHeight: "200px" }}
              onChange={handleInputChange}
              disabled={disabelInput}
            />
          </div>
        </div>
      </div>

      <hr />

      <div className="d-flex flex-row justify-content-between">
        <div className={`d-flex flex-column`}>
          <div className="d-flex flex-row gap-2 align-items-center">
            <span className="NormalTextSizing">پیش فاکتور</span>
            <span className={style.StarFixReq}>*</span>
          </div>
          <div className="mt-2">
            {logo ? (
              <div className={`${style.onlyFitContentWidth} position-relative`}>
                <Box
                  onClick={() => setZoomModal(true)}
                  component="img"
                  src={logo.imageUrl}
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
                  htmlFor="paymentImage"
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
                    <p className={`${style.colorTheInputFile} discription`}>
                      بارگذاری فایل .png یا .jpg
                    </p>
                    <p className={`${style.colorTheInputFile} discription`}>
                      حداکثر تا 5 مگابایت
                    </p>
                  </div>
                </label>
                <input
                  className={style.displayNoneTheInput}
                  id="paymentImage"
                  type="file"
                  name="paymentImage"
                  onChange={handleLogoChange}
                />
              </>
            )}
          </div>
        </div>

        <div className={`d-flex flex-column ${style.SecondSectionStyle}`}>
          <label htmlFor="docInfo" className="mb-1">
            مدارک مورد نیاز برای اپلود
          </label>
          <textarea
            className={`${style.formInputNumber} ${style.textAreaDocument} form-control discription`}
            cols="40"
            value={information.docInfo}
            rows="2"
            id="docInfo"
            name="docInfo"
            onChange={handleInfomationChange}
          ></textarea>
        </div>
      </div>
      <div className="d-flex flex-row gap-3 align-items-center">
        <button
          type="button"
          onClick={handleDisabelInput}
          // disabled={disablenextStep}
          className={`${style.continueButton} mt-3 mb-2`}
        >
          تایید
        </button>
        {moveForward && (
          <button
            type="button"
            onClick={handleNextStep}
            className={`${style.continueButton} mt-3 mb-2`}
          >
            رد کردن
          </button>
        )}
      </div>

      {/* modals */}
      <ErrorModal
        open={openModal3}
        onClose={closeModal3}
        text={"مشکلی به وجود آمده است، لطفا بعدا تلاش کنید."}
      />
      {logo && (
        <ZoomModal
          open={zoomModal}
          onClose={handleCloseZoomModal}
          src={logo.imageUrl}
          alt={`uploaded image`}
        />
      )}
    </>
  );
}
