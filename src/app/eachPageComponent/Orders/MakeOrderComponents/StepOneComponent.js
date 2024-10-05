import React, { useState, useEffect } from "react";

import style from "../../../Styles/MakeOrderStyle/StepOneStyle.module.scss";
import { Box } from "@mui/system";

// import redux
import { useSelector, useDispatch } from "react-redux";
import { uploadFile, requestAdminCommnet , increaseStep } from "@/app/Store/thunks";

export default function SteponeComponent({
  data,
  code,
  setStep,
  handleNextStep,
  setDisabelInput,
  disabelInput,
}) {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [serialtype, setSerialtype] = useState(false);
  // const [inputFields, setInputFields] = useState([{ title: "", price: "" }]);
  const [disablenextStep, setDisableNextStep] = useState(true);
  const [statusTraking, setStatusTraking] = useState(false);

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
  });

  const [information, setInformation] = useState({
    docInfo: "",
    paymentImage: "",
  });

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
    console.log(updatedData);

    try {
      const uploadFactor = await dispatch(
        uploadFile({
          file: information.paymentImage,
          tag: "factor",
          type: 1,
          isPublic: false,
        })
      ).unwrap();

      console.log("Upload factor:", uploadFactor);

      // Directly use the uploadFactor for the next API call, instead of waiting for the state to update
      const updatedInformation = {
        ...information,
        paymentImage: uploadFactor,
      };

      // Send updatedInformation with the second API call
      const uploadDocumentUser = await dispatch(
        requestAdminCommnet({ code, reqComment: updatedInformation })
      );

      if (uploadDocumentUser.payload.message == "Success") {
        const increaseStepOrder = await dispatch(increaseStep({code , step : 2}));

        console.log(increaseStepOrder);

        if (increaseStepOrder.payload.message == "Success") {
          setStep(2);
        }
        
      }

      

      // Optionally, you can update the state if needed later
      setInformation(updatedInformation);
    } catch (error) {
      console.error("Error uploading file:", error);
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

      {/* {!statusTraking ? (
        <h4 className="VodeoDisSizing mt-3 mb-3">
          پس از ثبت درخواست شما برسی و توسط کارشناسان ما با شما تماس حاصل میشود
        </h4>
      ) : (
        <h4 className="VodeoDisSizing mt-3 mb-3">
          درخواست شما با موفقیت ثبت شد کارشناسان ما در اولین فرصت با شما تماس میگیردند
        </h4>
      )}

      <div className="d-flex flex-row align-items-center gap-2 mt-1 mb-1">
        <span className={`${style.numberColorForcall} NormalTextSizing`}>
          ۰۲۱-۶۶۹۷۱۴۰۲-۵
        </span>
        <span>
          <svg
            width={18}
            height={18}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.4775 13.7475C16.4775 14.0175 16.4175 14.295 16.29 14.565C16.1625 14.835 15.9975 15.09 15.78 15.33C15.4125 15.735 15.0075 16.0275 14.55 16.215C14.1 16.4025 13.6125 16.5 13.0875 16.5C12.3225 16.5 11.505 16.32 10.6425 15.9525C9.78 15.585 8.9175 15.09 8.0625 14.4675C7.2 13.8375 6.3825 13.14 5.6025 12.3675C4.83 11.5875 4.1325 10.77 3.51 9.915C2.895 9.06 2.4 8.205 2.04 7.3575C1.68 6.5025 1.5 5.685 1.5 4.905C1.5 4.395 1.59 3.9075 1.77 3.4575C1.95 3 2.235 2.58 2.6325 2.205C3.1125 1.7325 3.6375 1.5 4.1925 1.5C4.4025 1.5 4.6125 1.545 4.8 1.635C4.995 1.725 5.1675 1.86 5.3025 2.055L7.0425 4.5075C7.1775 4.695 7.275 4.8675 7.3425 5.0325C7.41 5.19 7.4475 5.3475 7.4475 5.49C7.4475 5.67 7.395 5.85 7.29 6.0225C7.1925 6.195 7.05 6.375 6.87 6.555L6.3 7.1475C6.2175 7.23 6.18 7.3275 6.18 7.4475C6.18 7.5075 6.1875 7.56 6.2025 7.62C6.225 7.68 6.2475 7.725 6.2625 7.77C6.3975 8.0175 6.63 8.34 6.96 8.73C7.2975 9.12 7.6575 9.5175 8.0475 9.915C8.4525 10.3125 8.8425 10.68 9.24 11.0175C9.63 11.3475 9.9525 11.5725 10.2075 11.7075C10.245 11.7225 10.29 11.745 10.3425 11.7675C10.4025 11.79 10.4625 11.7975 10.53 11.7975C10.6575 11.7975 10.755 11.7525 10.8375 11.67L11.4075 11.1075C11.595 10.92 11.775 10.7775 11.9475 10.6875C12.12 10.5825 12.2925 10.53 12.48 10.53C12.6225 10.53 12.7725 10.56 12.9375 10.6275C13.1025 10.695 13.275 10.7925 13.4625 10.92L15.945 12.6825C16.14 12.8175 16.275 12.975 16.3575 13.1625C16.4325 13.35 16.4775 13.5375 16.4775 13.7475Z"
              stroke="#F3802C"
              strokeWidth="1.5"
              strokeMiterlimit={10}
            />
          </svg>
        </span>
      </div> */}
      {/* <button
        type="button"
        onClick={handleDisabelInput}
        // disabled={disablenextStep}
        // style={{
        //   cursor: disablenextStep ? "not-allowed" : "pointer",
        //   backgroundColor: disablenextStep && "#868686",
        // }}
        className={`${style.continueButton} mt-3 mb-2`}
      >
        استعلام
      </button> */}

      <hr />

      <div className="d-flex flex-row justify-content-between">
        {/* <div className={style.FactorStyle}>
          <div
            className={`${style.stepContent} ${style.resizingWebInResponsive}`}
          >
            <div>
              <p
                className={`${style.changingopacity} text-center VodeoDisSizing`}
              >
                ساخت پیش فاکتور
              </p>
              <div className="d-flex flex-column mt-2">
                {inputFields.map((inputField, index) => (
                  <div
                    key={index}
                    className="d-flex flex-row justify-content-between mt-2 gap-2"
                  >
                    <input
                      className={`${style.formInputNumber} form-control discription`}
                      placeholder="عنوان"
                      value={inputField.title}
                      onChange={(event) => handleInputChange(index, event)}
                    />

                    <input
                      className={`${style.formInputNumber} form-control discription`}
                      placeholder="قیمت"
                      value={inputField.price}
                      onChange={(event) => handleInputChange(index, event)}
                    />
                    <button className="bg-danger" onClick={() => handleRemoveFields(index)}>حذف</button>
                  </div>
                ))}

                <div className="d-flex flex-row justify-content-center mt-4 gap-2">
                  <button
                    className={`${style.downloadFactor}`}
                    onClick={handleAddFields}
                  >
                    اضافه کردن فیلد
                  </button>
                  <button
                    type="button"
                    className={`${style.downloadFactor} d-flex flex-row gap-2`}
                    onClick={generatePDF}
                  >
                    <svg
                      width="21"
                      height="20"
                      viewBox="0 0 21 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M14.1997 7.41797C17.1997 7.6763 18.4247 9.21797 18.4247 12.593V12.7013C18.4247 16.4263 16.9331 17.918 13.2081 17.918H7.78307C4.05807 17.918 2.56641 16.4263 2.56641 12.7013V12.593C2.56641 9.24297 3.77474 7.7013 6.72474 7.4263"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M10.5 1.66797V12.4013"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M13.2913 10.543L10.4997 13.3346L7.70801 10.543"
                        stroke="white"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    دانلود فاکتور
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="d-flex flex-column">
          <div className="d-flex flex-row gap-2 align-items-center">
            <span className="NormalTextSizing">پیش فاکتور</span>
            <span className={style.StarFixReq}>*</span>
          </div>
          <div className="mt-2">
            {logo ? (
              <div className={`${style.onlyFitContentWidth} position-relative`}>
                <Box
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

        <div className="d-flex flex-column ">
          <label htmlFor="docInfo" className="mb-1">
            مدارک مورد نیاز برای اپلود
          </label>
          <textarea
            className={`${style.formInputNumber} ${style.textAreaDocument} form-control discription`}
            cols="40"
            rows="2"
            id="docInfo"
            name="docInfo"
            onChange={handleInfomationChange}
          ></textarea>
        </div>
      </div>

      <button
        onClick={handleDisabelInput}
        className={`${style.continueButton} mt-3 mb-2`}
      >
        رد کردن مرحله
      </button>
    </>
  );
}
