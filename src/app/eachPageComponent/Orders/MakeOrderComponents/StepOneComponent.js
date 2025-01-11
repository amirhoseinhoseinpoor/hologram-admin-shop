import React, { useState, useEffect, useRef } from "react";
import style from "../../../Styles/MakeOrderStyle/StepOneStyle.module.scss";
import { Box } from "@mui/system";
// import basecomponent
import ZoomModal from "@/app/BaseComponent/ZoomModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import LoadingCss from "@/app/BaseComponent/LoadingCss";
// import redux
import { useDispatch } from "react-redux";
import {
  uploadFile,
  requestAdminCommnet,
  increaseStep,
  fetchPrivateImage,
  paymentStepData,
} from "@/app/Store/thunks";

export default function SteponeComponent({
  data,
  code,
  step,
  setStep,
  handleNextStep,
  reqComment,
  payment,
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

  console.log(data);

  // const [inputFields, setInputFields] = useState([{ title: "", price: "" }]);
  const [disablenextStep, setDisableNextStep] = useState(true);
  const [statusTraking, setStatusTraking] = useState(false);
  const [moveForward, setMoveForward] = useState(false);
  const [factorType, setFactorType] = useState("");
  const [paymentType, setPatmentType] = useState("");
  const [logo, setLogo] = useState(null);
  const [disableremoveproduct, setDisableremoveproduct] = useState(false);
  const [finalFactor, setFinalFactor] = useState(null);
  const [bothFactor, setBothFactor] = useState(null);
  const [loading, setLoading] = useState(false);

  console.log(paymentType);

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

  // Initialize dynamicForm as an object where each key is the product code
  const [dynamicForm, setDynamicForm] = useState({});
  const [prodFiled, setProdFiled] = useState([]);
  const [hasDynamicFields, setHasDynamicFields] = useState(false);

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
      if (payment?.finalPayment) {
        const returnFactor = await dispatch(
          fetchPrivateImage({ filename: payment?.finalPayment })
        ).unwrap();
        setFinalFactor({ imageUrl: returnFactor || null });
        setBothFactor({ imageUrl: returnFactor || null });
      } else {
        setFinalFactor(null);
      }
    };
    gettingImageFactor();
  }, [reqComment, dispatch, payment]);

  // modal state
  const [openModal3, setOpenModal3] = useState(false);
  const closeModal3 = () => setOpenModal3(false);

  const [information, setInformation] = useState({
    docInfo: "",
    paymentImage: "",
    finalPayment: "",
  });

  useEffect(() => {
    if (Array.isArray(data) && data) {
      setDisableremoveproduct(true);

      setProdFiled(
        data.map((prod) => ({
          code: prod.code,
          name: prod.name,
          filedOrder: prod.filedOrder.map((field) => ({
            name: field.name,
            type: field.type,
            dropDownOP:
              field.type === "dropDown" ? field.dropDownOP : undefined,
          })),
        }))
      );

      const initialDynamicForm = {};
      data.forEach((prod) => {
        initialDynamicForm[prod.code] = {};
        prod.filedOrder.forEach((field) => {
          initialDynamicForm[prod.code][field.name] = field.value || "";
        });
      });
      setDynamicForm(initialDynamicForm);
      setHasDynamicFields(true);
      setStatusTraking(true);
    } else if (typeof data === "object" && data !== null) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...data,
      }));
      setSelectedSize(data.selectedSize || "");
      setSelectedShape(data.selectedShape || "");
      setDisableremoveproduct(true);
      setSerialtype(data.serialtype || false);
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

  const handleInputDynamicChange = (code, event) => {
    const { name, value } = event.target;
    setDynamicForm((prev) => ({
      ...prev,
      [code]: {
        ...prev[code],
        [name]: value,
      },
    }));
  };

  const handleDisabelInput = () => {
    setDisabelInput(true);
    handleSubmit();
  };

  const handleImageTypeChange = (event) => {
    setFactorType(event.target.value);
  };

  const handlePaymentTypeChange = (event) => {
    setPatmentType(event.target.value);
  };

  const handleSizeChange = (size) => {
    setSelectedSize(size);
    setFormData({ ...formData, selectedSize: size });
  };

  const handleShapeChange = (shape) => {
    setSelectedShape(shape);
    setFormData({ ...formData, selectedShape: shape });
  };

  const handleRadioChange = (event) => {
    const value = event.target.value === "true";
    setSerialtype(value);
    setFormData({ ...formData, serialtype: value });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleInfomationChange = (event) => {
    const { name, value } = event.target;
    setInformation({ ...information, [name]: value });
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setLogo({
      imageUrl,
    });
    setInformation({ ...information, paymentImage: file });
  };

  const handleFinalFactorChange = (event) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setFinalFactor({
      imageUrl,
    });
    setInformation({ ...information, finalPayment: file });
  };

  const handleBothFactorChange = (event) => {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    setBothFactor({
      imageUrl,
    });
    setInformation({ ...information, paymentImage: file, finalPayment: file });
  };

  const handleDeleteLogo = () => {
    setLogo(null);
    setInformation({ ...information, paymentImage: "" });
  };

  const handleDeleteFinalFactor = () => {
    setFinalFactor(null);
    setInformation({ ...information, finalPayment: "" });
  };
  const handleDeleteBothFactor = () => {
    setBothFactor(null);
    setInformation({ ...information, paymentImage: "", finalPayment: "" });
  };

  const checkAllFieldsFilled = () => {
    if (prodFiled.length > 0) {
      const dynamicFilled = prodFiled.every((prod) =>
        prod.filedOrder.every(
          (field) =>
            dynamicForm[prod.code] &&
            dynamicForm[prod.code][field.name]?.trim() !== ""
        )
      );
      setDisableNextStep(!dynamicFilled);
    } else {
      const isFilled =
        formData.selectedSize.trim() !== "" &&
        formData.feature.trim() !== "" &&
        formData.color.trim() !== "" &&
        formData.stick.trim() !== "" &&
        formData.howItWork.trim() !== "" &&
        formData.chosenEffect.trim() !== "" &&
        formData.selectedShape.trim() !== "";

      setDisableNextStep(!isFilled);
    }
  };

  useEffect(() => {
    checkAllFieldsFilled();
  }, [formData, dynamicForm, hasDynamicFields, prodFiled]);

  const handleRemoveProduct = (index, code) => {
    if (disableremoveproduct) return; // Prevent removal if disabled

    const getCodeProduct = sessionStorage.getItem("PRODCODE");
    const PGetCodeProduct = getCodeProduct ? getCodeProduct.split(",") : [];
    if (PGetCodeProduct.length > 0) {
      const updatedCodes = PGetCodeProduct.filter((item) => item !== code);
      sessionStorage.setItem("PRODCODE", updatedCodes.join(","));
    }

    setProdFiled(prodFiled.filter((_, i) => i !== index));

    setDynamicForm((prev) => {
      const updated = { ...prev };
      delete updated[code];
      return updated;
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      let uploadFactor;
      let updatedInformation;
      let uploadFinalFactor;
      let updatedFinalFactor;

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
          paymentImage: uploadFactor,
          docInfo: information.docInfo,
        };
      } else {
        updatedInformation = {
          paymentImage: reqComment?.paymentImage,
          docInfo: information.docInfo,
        };
      }
      if (information?.finalPayment) {
        uploadFinalFactor = await dispatch(
          uploadFile({
            file: information?.finalPayment,
            tag: "finalFactor",
            type: 1,
            isPublic: false,
          })
        ).unwrap();

        updatedFinalFactor = {
          finalPayment: uploadFinalFactor,
        };
      } else {
        updatedFinalFactor = {
          finalPayment: payment?.finalPayment,
        };
      }

      // Send updatedInformation with the second API call
      const uploadDocumentUser = await dispatch(
        requestAdminCommnet({ code, reqComment: updatedInformation })
      );

      const uploadPaymentLastStep = await dispatch(
        paymentStepData({ code, payment: updatedFinalFactor })
      );

      if (
        uploadDocumentUser.payload.message == "Success" &&
        uploadPaymentLastStep.payload.message == "Success"
      ) {
        const increaseStepOrder = await dispatch(
          increaseStep({ code, step: 2 })
        );

        if (increaseStepOrder.payload.message == "Success") {
          setStep(2);
        }
      }

      setLoading(false);
      // setInformation(updatedInformation);
    } catch (error) {
      console.error("Error uploading file:", error);
      setOpenModal3(true);
      setLoading(false);
    }
  };

  return (
    <>
      {prodFiled.length > 0 ? (
        <div>
          {prodFiled.map((inProd, index) => (
            <div key={inProd.code}>
              {/* Product Header */}
              <div className="d-flex flex-row align-items-center justify-content-between">
                <p className="VodeoDisSizing mb-2 mt-2 ">{inProd.name}</p>
                <button
                  type="button"
                  disabled={disableremoveproduct}
                  onClick={() => handleRemoveProduct(index, inProd.code)}
                  className={`${style.ButtonRemoveProduct}`}
                >
                  حذف
                </button>
              </div>

              {/* Dynamic Fields */}
              <div className={`${style.stepOneDynamicInput}`}>
                {inProd.filedOrder.map((item, idx) => (
                  <div key={idx}>
                    {item.type === "text" && (
                      <div className="d-flex flex-column mt-1 mb-1">
                        <label
                          htmlFor={`text-${inProd.code}-${idx}`}
                          className="mt-1 mb-1 description d-flex flex-row gap-2 align-items-center"
                        >
                          <span className="NormalTextSizing">{item.name}</span>
                          <span
                            className={`${style.redStarStyle} NormalTextSizing`}
                          >
                            *
                          </span>
                        </label>
                        <input
                          type="text"
                          className={`${style.formInputNumber} form-control description`}
                          id={`text-${inProd.code}-${idx}`}
                          name={item.name}
                          value={dynamicForm[inProd.code]?.[item.name] || ""}
                          onChange={(e) =>
                            handleInputDynamicChange(inProd.code, e)
                          }
                          disabled={disabelInput}
                          required
                        />
                      </div>
                    )}
                    {item.type === "dropDown" && (
                      <div className="d-flex flex-column mt-1 mb-1">
                        <label
                          htmlFor={`dropDown-${inProd.code}-${idx}`}
                          className="mt-1 mb-1 description d-flex flex-row gap-2 align-items-center"
                        >
                          <span className="NormalTextSizing">{item.name}</span>
                          <span
                            className={`${style.redStarStyle} NormalTextSizing`}
                          >
                            *
                          </span>
                        </label>
                        <select
                          id={`dropDown-${inProd.code}-${idx}`}
                          name={item.name}
                          value={dynamicForm[inProd.code]?.[item.name] || ""}
                          onChange={(e) =>
                            handleInputDynamicChange(inProd.code, e)
                          }
                          disabled={disabelInput}
                          required
                          className={`${style.formInputNumber} form-control description`}
                        >
                          <option value="" disabled>
                            انتخاب کنید
                          </option>
                          {item?.dropDownOP?.map((POP, popIdx) => (
                            <option key={popIdx} value={POP}>
                              {POP}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Static Fields Rendering */}
          <div className={`${style.adjustPhoneSize} d-flex flex-row gap-4`}>
            <div className={`${style.adjustWidthRight} d-flex flex-column `}>
              <div className="d-flex flex-column">
                <div className="d-flex flex-column">
                  <label
                    htmlFor="feature"
                    className="mt-1 mb-1 description d-flex flex-row gap-2 align-items-center"
                  >
                    <span>تعداد یا تیراژ</span>
                    <span className={style.redStarStyle}>*</span>
                  </label>
                  <input
                    type="text"
                    className={`${style.formInputNumber} form-control description`}
                    id="feature"
                    name="feature"
                    value={formData.feature}
                    placeholder="حداقل 2000"
                    onChange={handleInputChange}
                    disabled={disabelInput}
                    required
                  />
                </div>
                <h3 className="mb-3 mt-3 description d-flex flex-row gap-2 align-items-center">
                  <span>سایز</span>
                  <span className={style.redStarStyle}>*</span>
                </h3>
                <div style={{ display: "flex", gap: "4px" }}>
                  {["2:4", "2:5", "3:5", "3:11"].map((size) => (
                    <div
                      key={size}
                      className={style.SizezInput}
                      style={{
                        border:
                          selectedSize === size ? "1.5px solid #404756" : "",
                        borderRadius: "5px",
                        cursor: "pointer",
                      }}
                      onClick={
                        disabelInput ? undefined : () => handleSizeChange(size)
                      }
                    >
                      {size}
                    </div>
                  ))}
                </div>
                <div className="d-flex flex-column">
                  <label
                    htmlFor="color"
                    className="mt-3 mb-1 description d-flex flex-row gap-2 align-items-center"
                  >
                    <span>رنگ</span>
                    <span className={style.redStarStyle}>*</span>
                  </label>
                  <input
                    type="text"
                    className={`${style.formInputNumber} form-control description`}
                    id="color"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    disabled={disabelInput}
                    required
                  />
                </div>
                <div className="d-flex flex-column">
                  <label
                    htmlFor="stick"
                    className="mt-2 mb-2 description d-flex flex-row gap-2 align-items-center"
                  >
                    <span>قالب برچسب</span>
                    <span className={style.redStarStyle}>*</span>
                  </label>
                  <input
                    type="text"
                    className={`${style.formInputNumber} form-control description`}
                    id="stick"
                    name="stick"
                    value={formData.stick}
                    onChange={handleInputChange}
                    disabled={disabelInput}
                    required
                  />
                </div>
                <div className="d-flex flex-column">
                  <label
                    htmlFor="howItWork"
                    className="mt-2 mb-2 description d-flex flex-row gap-2 align-items-center"
                  >
                    <span>نوع اثرگذاری</span>
                    <span className={style.redStarStyle}>*</span>
                  </label>
                  <input
                    type="text"
                    className={`${style.formInputNumber} form-control description`}
                    id="howItWork"
                    name="howItWork"
                    value={formData.howItWork}
                    onChange={handleInputChange}
                    disabled={disabelInput}
                    required
                  />
                </div>
              </div>
            </div>
            <div className={`${style.adjustWithLeft} d-flex flex-column`}>
              <div className="d-flex flex-column">
                <label
                  htmlFor="chosenEffect"
                  className="mt-1 mb-1 description d-flex flex-row gap-2 align-items-center"
                >
                  <span>افکت مورد نظر</span>
                  <span className={style.redStarStyle}>*</span>
                </label>
                <input
                  type="text"
                  className={`${style.formInputNumber} form-control description`}
                  id="chosenEffect"
                  name="chosenEffect"
                  value={formData.chosenEffect}
                  disabled={disabelInput}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <h3 className="mb-3 mt-3 description d-flex flex-row gap-2 align-items-center">
                <span>شکل هولوگرام</span>
                <span className={style.redStarStyle}>*</span>
              </h3>
              <div className="d-flex flex-row gap-1">
                {[
                  {
                    label: "مربع",
                    value: "مربع",
                    className: style.SizezInputFirst,
                  },
                  {
                    label: "دایره",
                    value: "دایره",
                    className: style.SizezInputSecond,
                  },
                  {
                    label: "مستطیل",
                    value: "مستطیل",
                    className: style.SizezInputThird,
                  },
                  {
                    label: "بیضی",
                    value: "بیضی",
                    className: style.SizezInputForth,
                  },
                ].map((shape) => (
                  <div
                    key={shape.value}
                    className={shape.className}
                    style={{
                      border:
                        selectedShape === shape.value
                          ? "1.5px solid #404756"
                          : "",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                    onClick={
                      disabelInput
                        ? undefined
                        : () => handleShapeChange(shape.value)
                    }
                  >
                    {shape.label}
                  </div>
                ))}
              </div>

              <div className="d-flex flex-column">
                <label
                  htmlFor="useCase"
                  className="mt-3 mb-1 description d-flex flex-row gap-2 align-items-center"
                >
                  <span>موارد مصرف</span>
                  <span className={style.redStarStyle}>*</span>
                </label>
                <input
                  type="text"
                  className={`${style.formInputNumber} form-control description`}
                  id="useCase"
                  name="useCase"
                  value={formData.useCase}
                  disabled={disabelInput}
                  onChange={handleInputChange}
                  required
                />
                <p className={`${style.discriptionStyle} description`}>
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
                    <label htmlFor="serial" className=" mb-1 description">
                      نوع سریال
                    </label>
                    <input
                      type="text"
                      className={`${style.formInputNumber} form-control description`}
                      id="serial"
                      name="serial"
                      value={formData.serial}
                      onChange={handleInputChange}
                      disabled={disabelInput}
                      required
                    />
                  </div>
                )}
              </div>
              <div className="d-flex flex-column">
                <label htmlFor="information" className=" mb-1 description">
                  توضیحات
                </label>
                <textarea
                  className={`${style.formInputNumber} form-control description`}
                  id="information"
                  name="information"
                  value={formData.information}
                  style={{ maxHeight: "200px" }}
                  onChange={handleInputChange}
                  disabled={disabelInput}
                  required
                />
              </div>
            </div>
          </div>
        </>
      )}
      <hr />

      <div
        className={`${style.responsiveBottomMainDiv} d-flex flex-row gap-3 justify-content-between`}
      >
        

        <div
          className={`d-flex flex-row gap-2 align-items-center mt-2 mb-2 ${style.responsiveSelectWidth}`}
        >
          <p
            style={{ whiteSpace: "nowrap" }}
            className="NormalTextSizing mb-1 me-1"
          >
            نوع پرداخت :
          </p>
          <select
            value={paymentType}
            onChange={handlePaymentTypeChange}
            className={`form-select mb-2 `}
            style={{ boxShadow: "unset" }}
          >
            <option disabled value="">
              انتخاب کنید
            </option>
            <option value="dargah">درگاه پرداخت</option>
            <option value="fish">اپلود فیش</option>
            <option value="check">چک</option>
          </select>
        </div>
      </div>

      <div
        className={`${style.responsiveBottomMainDiv} d-flex flex-row justify-content-between `}
      >
        <div className="d-flex flex-row gap-2 align-items-center mb-2">
          <p
            style={{ whiteSpace: "nowrap" }}
            className="NormalTextSizing mb-1 me-1"
          >
            نوع فاکتور:
          </p>
          <select
            id="factorType"
            value={factorType}
            onChange={handleImageTypeChange}
            className="form-select mb-2"
            style={{ boxShadow: "unset" }}
          >
            <option disabled value="">
              انتخاب کنید
            </option>
            <option value="firstOption">پیش فاکتور و فاکتور نهایی</option>
            <option value="secondOption">یک فاکتور برای جفتش</option>
          </select>
        </div>

        <div className={`d-flex flex-column mb-1 ${style.SecondSectionStyle}`}>
          <label htmlFor="docInfo" className="mb-1 NormalTextSizing">
            مدارک مورد نیاز برای اپلود
          </label>
          <textarea
            className={`${style.formInputNumber} ${style.textAreaDocument} form-control description`}
            cols="40"
            value={information.docInfo}
            rows="2"
            id="docInfo"
            name="docInfo"
            onChange={handleInfomationChange}
          ></textarea>
        </div>
      </div>
      {factorType === "firstOption" && (
        <div className={`${style.fixReponsiveFactor} d-flex flex-row gap-2`}>
          <div className={style.widthFactorsImage}>
            <div className="d-flex flex-row mb-2 gap-2 align-items-center">
              <span className="NormalTextSizing">پیش فاکتور</span>
              <span className={style.StarFixReq}>*</span>
            </div>

            {logo ? (
              <div className={`d-flex position-relative`}>
                <Box
                  onClick={() => setZoomModal(logo.imageUrl)}
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
                <div>
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
                      <p className={`${style.colorTheInputFile} description`}>
                        بارگذاری فایل .png یا .jpg
                      </p>
                      <p className={`${style.colorTheInputFile} description`}>
                        حداکثر تا 5 مگابایت
                      </p>
                    </div>
                  </label>
                  <input
                    className={style.displayNoneTheInput}
                    id="paymentImage"
                    type="file"
                    name="paymentImage"
                    accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
                    onChange={handleLogoChange}
                  />
                </div>
              </>
            )}
          </div>

          <div className={style.widthFactorsImage}>
            <div className="d-flex flex-row gap-2 mb-2 align-items-center">
              <span className="NormalTextSizing">فاکتور نهایی</span>
              <span className={style.StarFixReq}>*</span>
            </div>
            {finalFactor ? (
              <>
                <div className={`d-flex position-relative`}>
                  <Box
                    onClick={() => setZoomModal(finalFactor.imageUrl)}
                    component="img"
                    src={finalFactor.imageUrl}
                    alt="UserLogo"
                    className={style.LogoReplaceStyle}
                  />
                  <button
                    onClick={handleDeleteFinalFactor}
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
              </>
            ) : (
              <>
                {/* second input */}
                <div>
                  <label
                    className={style.labelInsteadOfInput}
                    htmlFor="paymentImageFFactor"
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
                      <p className={`${style.colorTheInputFile} description`}>
                        بارگذاری فایل .png یا .jpg
                      </p>
                      <p className={`${style.colorTheInputFile} description`}>
                        حداکثر تا 5 مگابایت
                      </p>
                    </div>
                  </label>
                  <input
                    className={style.displayNoneTheInput}
                    id="paymentImageFFactor"
                    type="file"
                    name="finalPayment"
                    accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
                    onChange={handleFinalFactorChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {factorType === "secondOption" && (
        <div className={style.widthFactorsImage}>
          <div className="d-flex flex-row gap-2 align-items-center">
            <span className="NormalTextSizing">پیش فاکتور و فاکتور نهایی</span>
            <span className={style.StarFixReq}>*</span>
          </div>
          {bothFactor ? (
            <>
              <div className={`d-flex position-relative`}>
                <Box
                  onClick={() => setZoomModal(bothFactor.imageUrl)}
                  component="img"
                  src={bothFactor.imageUrl}
                  alt="UserLogo"
                  className={style.LogoReplaceStyle}
                />
                <button
                  onClick={handleDeleteBothFactor}
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
            </>
          ) : (
            <div>
              <label
                className={style.labelInsteadOfInput}
                htmlFor="paymentImageSecondOption"
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
                  <p className={`${style.colorTheInputFile} description`}>
                    بارگذاری فایل .png یا .jpg
                  </p>
                  <p className={`${style.colorTheInputFile} description`}>
                    حداکثر تا 5 مگابایت
                  </p>
                </div>
              </label>
              <input
                className={style.displayNoneTheInput}
                id="paymentImageSecondOption"
                type="file"
                name="paymentImage"
                accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
                onChange={handleBothFactorChange}
              />
            </div>
          )}
        </div>
      )}
      <div className="d-flex flex-row gap-3 align-items-center">
        <button
          type="button"
          onClick={handleDisabelInput}
          disabled={loading || disablenextStep}
          style={{
            cursor: loading || disablenextStep ? "not-allowed" : "pointer",
            backgroundColor: loading || disablenextStep ? "#868686" : undefined,
          }}
          className={`${style.continueButton} mt-3 mb-2 ${
            loading ? style.disabledButtonLoading : ""
          }`}
        >
          {loading ? <LoadingCss /> : <>تایید</>}
        </button>
        {moveForward && (
          <button
            type="button"
            onClick={handleNextStep}
            className={`${style.continueButton} mt-3 mb-2`}
          >
            مرحله بعدی
          </button>
        )}
      </div>

      {/* modals */}
      <ErrorModal
        open={openModal3}
        onClose={closeModal3}
        text={"مشکلی به وجود آمده است، لطفا بعدا تلاش کنید."}
      />
      <ZoomModal
        open={zoomModal}
        onClose={handleCloseZoomModal}
        src={zoomModal}
        alt={`uploaded image`}
      />
    </>
  );
}
