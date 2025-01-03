import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { deleted, uploadFile, productEdit, HeaderList, prodNameAndNav } from "@/app/Store/thunks";
import { Box } from "@mui/material";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import ConfirmModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";

// Styled Components
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

const DivAdjustColorDivs = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns || "1fr"};
  grid-gap: 20px;
  width: fit-content;
  .labelInsteadOfInput {
    border: 1px solid #c0c0c0;
    border-radius: 4px;
    padding: 10px;
    width: 100%;
    height: 77%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .colorTheInputFile {
    color: #404040;
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
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

  // State Variables
  const [selectedNavId, setSelectedNavId] = useState("");
  const [availableItems, setAvailableItems] = useState([]);
  const [usedNavIds, setUsedNavIds] = useState([]);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [subtitleCompelete, setSubtitleCompelete] = useState("");
  const [colors, setColors] = useState([{ name: "", src: "" }]);
  const [sizes, setSizes] = useState([""]);
  const [imgData, setImgData] = useState([{ src: "", type: "1", poster: "" }]);
  const [media, setMedia] = useState([
    { title: "", description: "", src: "", poster: "" },
  ]);

  // Modal States
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [openModal4, setOpenModal4] = useState(false);
  // Close modal functions
  const closeModal = () => setOpenModal(false);
  const closeModal2 = () => setOpenModal2(false);
  const closeModal3 = () => setOpenModal3(false);
  const closeModal4 = () => setOpenModal4(false);

  const [objectUrls, setObjectUrls] = useState({});
  const [posterObjectUrls, setPosterObjectUrls] = useState({});

  // Define top-level navigation titles to exclude
  const excludedTopLevelTitles = ["خانه", "محصولات", "مقالات", "تماس با ما", "درباره‌ی ما"];

  // Fetch Header and Product Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataComeAPI = await dispatch(HeaderList()).unwrap();
        const prodComeApi = await dispatch(prodNameAndNav()).unwrap();

        const content = dataComeAPI?.content || [];
        setHeaderCome(content);

        const usedIds = prodComeApi.map((prod) => prod.navId);
        setUsedNavIds(usedIds);
      } catch (error) {
        console.error("Error fetching header data:", error);
        // Optionally handle error modal here
      }
    };

    fetchData();
  }, [dispatch]);

  const [headerCome, setHeaderCome] = useState([]);

  // Flatten Header Items Excluding Specified Top-Level Titles
  useEffect(() => {
    // Function to recursively flatten header items, excluding specified top-level titles
    const flattenHeader = (items, isTopLevel = true) => {
      let flatList = [];
      items.forEach((item) => {
        if (isTopLevel && excludedTopLevelTitles.includes(item.title)) {
          // Skip adding this top-level item but process its subItems
          if (item.subItems && item.subItems.length > 0) {
            flatList = flatList.concat(flattenHeader(item.subItems, false));
          }
        } else {
          // Add the current item
          flatList.push({ id: item.id, title: item.title });
          // Process subItems if any
          if (item.subItems && item.subItems.length > 0) {
            flatList = flatList.concat(flattenHeader(item.subItems, false));
          }
        }
      });
      return flatList;
    };

    const allHeaderItems = flattenHeader(headerCome);
    const filteredItems = allHeaderItems.filter(
      (item) => !usedNavIds.includes(item.id.toString()) || item.id.toString() === editedHonor.navId.toString()
    );
    setAvailableItems(filteredItems);
    setSelectedNavId(editedHonor.navId.toString());
  }, [headerCome, usedNavIds, editedHonor.navId]);

  // Initialize form fields with editedHonor data
  useEffect(() => {
    if (editedHonor) {
      setName(editedHonor.name || "");
      setTitle(editedHonor.info.title || "");
      setSubtitle(editedHonor.info.subtitle || "");
      setSubtitleCompelete(editedHonor.info.subtitleCompelete || "");
      setColors(editedHonor.info.color || [{ name: "", src: "" }]);
      setSizes(editedHonor.info.sizes || [""]);
      setImgData(
        editedHonor.info.imgData || [{ src: "", type: "1", poster: "" }]
      );
      setMedia(
        editedHonor.media || [
          { title: "", description: "", src: "", poster: "" },
        ]
      );
    }
  }, [editedHonor]);

  // Handle File Changes for Images/Videos
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

  // Handlers to Add/Remove Colors, Sizes, Images, Media
  const handleAddColor = () => {
    setColors([...colors, { name: "", src: "" }]);
  };

  const handleRemoveColor = (index) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const handleAddSize = () => {
    setSizes([...sizes, ""]);
  };

  const handleRemoveSize = (index) => {
    if (sizes.length > 1) {
      setSizes(sizes.filter((_, i) => i !== index));
    }
  };

  const handleAddImgData = () => {
    setImgData([...imgData, { src: "", type: "", poster: "" }]);
  };

  const handleRemoveImgData = (index) => {
    if (imgData.length > 1) {
      setImgData(imgData.filter((_, i) => i !== index));
      // Optionally remove object URLs if necessary
    }
  };

  const handleAddMedia = () => {
    setMedia([...media, { title: "", description: "", src: "", poster: "" }]);
  };

  const handleRemoveMedia = (index) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  // Handle Delete Product
  const handleDelete = async (e) => {
    e.preventDefault();
    setOpenModal4(false);
    try {
      const deleteProduct = await dispatch(
        deleted({ code: editedHonor.code, name: editedHonor.name })
      );

      if (deleteProduct.payload.message === "Success") {
        setOpenModal2(true);
        closeModalOnTimeout();
      } else {
        setOpenModal3(true);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      setOpenModal3(true);
    }
  };

  // Handle Form Submission with Confirmation Modal
  const areYouShureFunction = (e) => {
    e.preventDefault();
    setOpenModal(true);
  };

  // Handle Delete Confirmation
  const areYouShureFunction2 = (e) => {
    e.preventDefault();
    setOpenModal4(true);
  };

  // Close Confirm Modal After Timeout
  function closeModalOnTimeout() {
    setTimeout(() => {
      setOpenModal2(false);
    }, 3000);
  }

  // Handle Final Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpenModal(false);
    try {
      const uploadedImgData = await Promise.all(
        imgData.map(async (item) => {
          let updatedItem = { ...item };

          if (typeof item.src === "object" && item.src) {
            const tag = name;
            const type = item.type;
            const isPublic = true;
            const file = item.src;

            const fileId = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();

            updatedItem.src = fileId;
          }

          if (typeof item.poster === "object" && item.poster) {
            const tag = name;
            const type = 1;
            const isPublic = true;
            const file = item.poster;

            const fileId = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();

            updatedItem.poster = fileId;
          }
          return updatedItem;
        })
      );

      const uploadedColors = await Promise.all(
        colors.map(async (item) => {
          if (typeof item.src === "object" && item.src) {
            const tag = name;
            const type = 1;
            const isPublic = true;
            const file = item.src;

            const fileId = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();

            return { ...item, src: fileId }; // Replace src with the file ID
          }

          return item;
        })
      );

      const uploadedMedia = await Promise.all(
        media.map(async (item) => {
          let updatedItem = { ...item };

          if (typeof item.src === "object" && item.src) {
            const tag = name;
            const type = 2;
            const isPublic = true;
            const file = item.src;

            const fileId = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();

            updatedItem.src = fileId;
          }

          if (typeof item.poster === "object" && item.poster) {
            const tag = name;
            const type = 1;
            const isPublic = true;
            const file = item.poster;

            const fileId = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();
            console.log(fileId);

            updatedItem.poster = fileId;
          }
          return updatedItem;
        })
      );

      // Create the info object with all fields
      const info = {
        title,
        subtitle,
        subtitleCompelete,
        color: uploadedColors,
        sizes,
        imgData: uploadedImgData,
      };

      // Create the final product object
      const productData = {
        name,
        navId: selectedNavId,
        info,
        media: uploadedMedia,
      };

      const dataConfirmComing = await dispatch(
        productEdit({ productData, code: editedHonor.code })
      );

      if (dataConfirmComing.error) {
        setOpenModal3(true);
      } else {
        setOpenModal2(true);
        closeModalOnTimeout();
      }
    } catch (error) {
      console.error("Error editing product:", error);
      setOpenModal3(true);
    }
  };

  return (
    <form className="container" onSubmit={areYouShureFunction}>
      {/* Navigation Item Selection Dropdown */}
      <div className="d-flex flex-row align-items-center gap-2">
        <label
          style={{ whiteSpace: "nowrap" }}
          className=" seeOrderFont"
          htmlFor="productSelect"
        >
          انتخاب محصول :
        </label>
        <select
          className="w-100"
          id="productSelect"
          value={selectedNavId}
          onChange={(e) => {
            const selectedItem = availableItems.find(
              (item) => item.id.toString() === e.target.value
            );
            setSelectedNavId(e.target.value);
            setName(selectedItem ? selectedItem.title : "");
          }}
          required
        >
          <option value="" disabled>
            انتخاب کنید
          </option>
          {availableItems.map((item) => (
            <option key={item.id} value={item.id}>
              {item.title}
            </option>
          ))}
        </select>
      </div>

      

      {/* Title Field */}
      <label htmlFor="bannerDate">عنوان :</label>
      <input
        type="text"
        id="bannerDate"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Subtitle Field */}
      <label htmlFor="bannerTags">توضیحات :</label>
      <input
        type="text"
        id="bannerTags"
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        required
      />

      {/* Complete Subtitle Field */}
      <label htmlFor="DiscriptionCompelete">توضیحات تکمیلی :</label>
      <textarea
        type="text"
        id="DiscriptionCompelete"
        value={subtitleCompelete}
        onChange={(e) => setSubtitleCompelete(e.target.value)}
        required
      />

      {/* Colors Section */}
      <BorderInputBox className="mt-2">
        <label>رنگ ها :</label>
        <DivAdjustColorDivs columns="repeat(2, 1fr)">
          {colors.map((color, index) => (
            <div style={{ height: "fit-content" }} className="mt-2" key={index}>
              {color?.src === "" ? (
                <>
                  <label className="labelInsteadOfInput" htmlFor={`imageColor-${index}`}>
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
                    type="file"
                    className="d-none"
                    id={`imageColor-${index}`}
                    accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
                    onChange={(e) =>
                      handleFileChange(e, index, setColors, colors)
                    }
                    required
                  />
                  <input
                    type="text"
                    placeholder="اسم رنگ"
                    value={color.name}
                    onChange={(e) =>
                      setColors(
                        colors.map((c, i) =>
                          i === index ? { ...c, name: e.target.value } : c
                        )
                      )
                    }
                    required
                  />
                </>
              ) : (
                <div
                  className="d-flex flex-column"
                  style={{ width: "fit-content" }}
                >
                  <BOX
                    component="img"
                    src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${color?.src}`}
                    alt="UserColorImage"
                  />
                  <input
                    className="mt-2"
                    type="text"
                    placeholder="اسم رنگ"
                    value={color.name}
                    onChange={(e) =>
                      setColors(
                        colors.map((c, i) =>
                          i === index ? { ...c, name: e.target.value } : c
                        )
                      )
                    }
                    required
                  />
                </div>
              )}

              <button
                className="bg-danger mt-1 me-1"
                type="button"
                onClick={() => handleRemoveColor(index)}
              >
                حذف
              </button>
            </div>
          ))}
        </DivAdjustColorDivs>
        <button
          className="mt-2 bg-success"
          type="button"
          onClick={handleAddColor}
        >
          اضافه کردن رنگ
        </button>
      </BorderInputBox>

      {/* Sizes Section */}
      <BorderInputBox className="mt-3">
        <label>سایز ها :</label>
        {sizes.map((size, index) => (
          <div className="mt-2" key={index}>
            <input
              className="w-50"
              type="text"
              value={size}
              onChange={(e) =>
                setSizes(
                  sizes.map((s, i) => (i === index ? e.target.value : s))
                )
              }
              required
            />
            <button
              className="bg-danger me-2"
              type="button"
              onClick={() => handleRemoveSize(index)}
            >
              حذف
            </button>
          </div>
        ))}
        <button
          className="mt-2 bg-success"
          type="button"
          onClick={handleAddSize}
        >
          اضافه کردن سایز
        </button>
      </BorderInputBox>

      {/* Image and Video Section */}
      <BorderInputBox className="mt-3">
        <label>عکس ها و فیلم های محصول :</label>
        <DivAdjustColorDivs columns="repeat(1, 1fr)">
          {imgData.map((item, index) => (
            <div
              style={{ height: "fit-content" }}
              className="d-flex flex-row gap-2 flex-wrap mt-2 align-items-center"
              key={index}
            >
              <div className="d-flex flex-column">
                <span className="mb-1">عکس یا فیلم</span>
                {item?.src === "" ? (
                  <>
                    <label
                      className="labelInsteadOfInput"
                      htmlFor={`ImageVideoForProduct-${index}`}
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
                          یا فیلم mp4
                        </p>
                      </div>
                    </label>
                    <input
                      className="d-none"
                      id={`ImageVideoForProduct-${index}`}
                      accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_AND_VIDEO_FORMAT}`}
                      type="file"
                      onChange={(e) =>
                        handleFileChange(e, index, setImgData, imgData)
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
                        component={item.type === "1" ? "img" : "video"}
                        src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${item.src}`}
                        alt="UserColorImage"
                        controls={item.type === "2"}
                      />
                    </div>
                  </>
                )}

                {/* Type Selection */}
              </div>

              <select
                value={item.type}
                onChange={(e) =>
                  setImgData(
                    imgData.map((img, i) =>
                      i === index ? { ...img, type: e.target.value } : img
                    )
                  )
                }
                required
              >
                <option value={1}>عکس :</option>
                <option value={2}>فیلم :</option>
              </select>

              {/* Poster for Videos */}
              {item.type === "2" && (
                <>
                  <div className="d-flex flex-column">
                    <span className="mb-1">پوستر فیلم :</span>
                    {item?.poster === "" ? (
                      <>
                        <label
                          className="labelInsteadOfInput"
                          htmlFor={`posterFilm-${index}`}
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
                          className="d-none"
                          id={`posterFilm-${index}`}
                          accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
                          type="file"
                          onChange={(e) =>
                            handleFileChangePoster(e, index, setImgData, media)
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
                            component="img"
                            src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${item.poster}`}
                            alt="UserColorImage"
                          />
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    className="bg-danger me-2"
                    type="button"
                    onClick={() => handleRemoveImgData(index)}
                  >
                    حذف
                  </button>
                </>
              )}
            </div>
          ))}
        </DivAdjustColorDivs>
        <button
          className="mt-2 bg-success"
          type="button"
          onClick={handleAddImgData}
        >
          اضافه کردن عکس / فیلم
        </button>
      </BorderInputBox>

      {/* Media Section */}
      <BorderInputBox className="mt-3">
        <label>فیلم ها:</label>
        <DivAdjustColorDivs style={{ width: "100%" }} columns="repeat(1, 1fr)">
          {media.map((item, index) => (
            <div className="mt-2" key={index}>
              <div className="d-flex flex-row gap-2 flex-wrap">
                <input
                  style={{ width: "45%" }}
                  type="text"
                  placeholder="عنوان فیلم"
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

                <input
                  style={{ width: "45%" }}
                  type="text"
                  placeholder="توضیحات"
                  value={item.description}
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

              <DivAdjustColorDivs
                className="mt-2 mb-2"
                columns="repeat(2, 1fr)"
              >
                <div className="d-flex flex-column">
                  <span className="NormalTextSizing">فیلم :</span>
                  {item?.src === "" ? (
                    <>
                      <label
                        className="labelInsteadOfInput"
                        htmlFor={`MediaVideo-${index}`}
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
                            فیلم mp4
                          </p>
                        </div>
                      </label>
                      <input
                        className="d-none"
                        id={`MediaVideo-${index}`}
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
                          component="video"
                          src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${item.src}`}
                          controls
                        />
                      </div>
                    </>
                  )}
                </div>
              </DivAdjustColorDivs>
            </div>
          ))}
        </DivAdjustColorDivs>
        <button
          className="mt-2 bg-success"
          type="button"
          onClick={handleAddMedia}
        >
          اضافه کردن ویدیو
        </button>
      </BorderInputBox>

      {/* Action Buttons */}
      <BUTTONSSTYLE className="d-flex flex-row justify-content-between container">
        <div className="d-flex flex-row mt-3 mb-3 gap-3">
          <button type="submit" className="confirmButtonStyle">
            ویرایش محصول
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
            حذف محصول
          </button>
        </div>
      </BUTTONSSTYLE>

      {/* Confirmation Modals */}
      <AreYouShureModal
        open={openModal}
        onClose={closeModal}
        text={"ایا از ویرایش محصول مطمعن هستید"}
        func={handleSubmit}
      />
      <AreYouShureModal
        open={openModal4}
        onClose={closeModal4}
        text={"ایا از حذف محصول مطمعن هستید"}
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
        text={"خطا در عملیات، لطفاً دوباره تلاش کنید"}
      />
    </form>
  );
}
