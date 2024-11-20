import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { uploadFile } from "@/app/Store/thunks";
import { productpot } from "@/app/Store/thunks";
import styled from "styled-components";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import ConfirmModal from "@/app/BaseComponent/ConfirmingModal";
import { Box } from "@mui/material";

const DivAdjustColorDivs = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns || '1fr'};;
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

const DivAdjustImageAndVideoDivs = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
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

const BOX = styled(Box)`
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
`;

const BorderInputBox = styled.div`
  border: 2px solid rgb(26, 32, 53);
  padding: 5px;
`;

export default function AddHonors() {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [colors, setColors] = useState([{ name: "", src: "" }]);
  const [sizes, setSizes] = useState([""]);
  const [imgData, setImgData] = useState([{ src: "", type: "1", poster: "" }]);
  const [media, setMedia] = useState([
    { title: "", description: "", src: "", poster: "" },
  ]);

  // modal state
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  // Close modal
  const closeModal = () => setOpenModal(false);
  const closeModal2 = () => setOpenModal2(false);

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
    setImgData([...imgData, { src: "", type: "1", poster: "" }]);
  };

  const handleRemoveImgData = (index) => {
    if (imgData.length > 1) {
      setImgData(imgData.filter((_, i) => i !== index));
    }
  };

  const handleAddMedia = () => {
    setMedia([...media, { title: "", description: "", src: "", poster: "" }]);
  };

  const handleRemoveMedia = (index) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const areYouShureFunction = (e) => {
    e.preventDefault();
    setOpenModal(true);
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
      const uploadedImgData = await Promise.all(
        imgData.map(async (item) => {
          let updatedItem = { ...item };

          // Handle src if it's a file object
          if (typeof item.src === "object" && item.src) {
            const tag = name;
            const type = item.type;
            const isPublic = true;
            const file = item.src;

            const fileId = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();

            updatedItem.src = fileId; // Update src with the file ID
          }

          // Handle poster if it's a file object
          if (typeof item.poster === "object" && item.poster) {
            const tag = name;
            const type = 1; // Assuming type 1 is for posters
            const isPublic = true;
            const file = item.poster;

            const fileId = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();

            updatedItem.poster = fileId; // Update poster with the file ID
          }

          return updatedItem; // Return the updated item after all modifications
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

          // Handle src if it's a file object
          if (typeof item.src === "object" && item.src) {
            const tag = name;
            const type = 2;
            const isPublic = true;
            const file = item.src;

            const fileIdSrc = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();

            updatedItem.src = fileIdSrc; // Update src with the file ID
          }

          // Handle poster if it's a file object
          if (typeof item.poster === "object" && item.poster) {
            const tag = name;
            const type = 1;
            const isPublic = true;
            const file = item.poster;

            const fileIdPoster = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();

            updatedItem.poster = fileIdPoster; // Update poster with the file ID
          }

          return updatedItem;
        })
      );

      // Create the info object with all fields
      const info = {
        title,
        subtitle,
        color: uploadedColors,
        sizes,
        imgData: uploadedImgData, // Use uploaded image data with IDs
      };

      // Create the final product object
      const productData = {
        name,
        info,
        media: uploadedMedia, // Use uploaded media with IDs
      };

      // Dispatch the final product submission
      const dataConfirmComing = await dispatch(productpot(productData));
      if (dataConfirmComing) {
        setOpenModal2(true);
        closeModalOnTimeout();
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={areYouShureFunction}>
        {/* <label htmlFor="bannerImage">Image:</label>
        <input type="file" id="bannerImage" onChange={handleImageChange} /> */}
        <label htmlFor="name">اسم محصول :</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="bannerDate">عنوان :</label>
        <input
          type="text"
          id="bannerDate"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label htmlFor="bannerTags">توضیحات :</label>
        <input
          type="text"
          id="bannerTags"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          required
        />

        <BorderInputBox className="mt-2">
          <label>رنگ ها :</label>
          <DivAdjustColorDivs columns="repeat(2, 1fr)">
            {colors.map((color, index) => (
              <div style={{ height: "fit-content" }} key={index}>
                {color?.src === "" ? (
                  <>
                    <label className="labelInsteadOfInput" htmlFor="imageColor">
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
                    <input
                      className="d-none"
                      id="imageColor"
                      accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
                      type="file"
                      value={color.value}
                      onChange={(e) =>
                        handleFileChange(e, index, setColors, colors)
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
                      // onClick={() => handleOpen(logo)}
                      component="img"
                      src={URL.createObjectURL(color?.src) || ""}
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

        <BorderInputBox className="mt-3">
          <label>سایز ها :</label>
          {sizes.map((size, index) => (
            <div className="mt-2" key={index}>
              <input
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
                className="me-1 bg-danger"
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
                  <span className="mb-1 NormalTextSizing">عکس یا فیلم</span>
                  {item?.src === "" ? (
                    <>
                      <label
                        className="labelInsteadOfInput"
                        htmlFor="ImageVideoForProduct"
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
                        id="ImageVideoForProduct"
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
                          // onClick={() => handleOpen(logo)}
                          component="img"
                          src={URL.createObjectURL(item?.src) || ""}
                          alt="UserColorImage"
                        />
                      </div>
                    </>
                  )}
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
                {item.type === "2" && (
                  <div className="d-flex flex-column">
                    <span className="mb-1 NormalTextSizing">پوستر فیلم</span>
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
                              setImgData,
                              imgData
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
                  </div>
                )}
                <button
                  className="bg-danger"
                  type="button"
                  onClick={() => handleRemoveImgData(index)}
                >
                  حذف
                </button>
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

        <BorderInputBox className="mt-3">
          <label>فیلم ها:</label>
          <DivAdjustColorDivs style={{width: "100%"}} columns="repeat(1, 1fr)">
          {media.map((item, index) => (
            <div className="mt-2" key={index}>
              <div className="d-flex flex-row align-items-center gap-3 flex-wrap">
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
              <DivAdjustColorDivs className="mt-2 mb-2"  columns="repeat(2, 1fr)">
              <div className="d-flex flex-column">
                <span className="NormalTextSizing">فیلم :</span>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, index, setMedia, media)}
                  required
                />
              </div>

              <div className="d-flex flex-column">
                <span className="NormalTextSizing">پوستر فیلم :</span>
                <input
                  accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
                  type="file"
                  onChange={(e) =>
                    handleFileChangePoster(e, index, setMedia, media)
                  }
                  required
                />
              </div>
              </DivAdjustColorDivs>
              <button
                className="bg-danger"
                type="button"
                onClick={() => handleRemoveMedia(index)}
              >
                حذف
              </button>
              
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
        <button type="submit" className="mt-3 mb-3 bg-success">
          اضافه کردن محصول
        </button>
        {/* modal  */}
        <AreYouShureModal
          open={openModal}
          onClose={closeModal}
          text={"ایا از اضافه کردن محصول مطمعن هستید"}
          func={handleSubmit}
        />
        <ConfirmModal
          open={openModal2}
          onClose={closeModal2}
          text={"محصول با موفقیت اضافه شد"}
        />
      </form>
    </div>
  );
}
