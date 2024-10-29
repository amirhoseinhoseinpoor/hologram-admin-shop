import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { deleted } from "@/app/Store/thunks";
import { uploadFile, productEdit } from "@/app/Store/thunks";
import { Box } from "@mui/material";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import ConfirmModal from "@/app/BaseComponent/Confirmmodal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";

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
  const [openModal3, setOpenModal3] = useState(false);
  const [openModal4, setOpenModal4] = useState(false);
  // Close modal
  const closeModal = () => setOpenModal(false);
  const closeModal2 = () => setOpenModal2(false);
  const closeModal3 = () => setOpenModal3(false);
  const closeModal4 = () => setOpenModal4(false);

  const [objectUrls, setObjectUrls] = useState({});
  const [posterObjectUrls, setPosterObjectUrls] = useState({});

  useEffect(() => {
    if (editedHonor) {
      setName(editedHonor.name || "");
      setTitle(editedHonor.info.title || "");
      setSubtitle(editedHonor.info.subtitle || "");
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

  useEffect(() => {
    console.log(editedHonor);
  }, [editedHonor]);

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
      // setObjectUrls((prev) => {
      //   const updated = { ...prev };
      //   delete updated[index];
      //   return updated;
      // });
    }
  };

  const handleAddMedia = () => {
    setMedia([...media, { title: "", description: "", src: "", poster: "" }]);
  };

  const handleRemoveMedia = (index) => {
    setMedia(media.filter((_, i) => i !== index));
  };

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
    }
  };

  const areYouShureFunction = (e) => {
    e.preventDefault();
    setOpenModal(true);
  };

  const areYouShureFunction2 = (e) => {
    e.preventDefault();
    setOpenModal4(true);
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

          if (typeof item.src === "object" && item.src) {
            const tag = name;
            const type = item.type;
            const isPublic = true;
            const file = item.src;

            const fileId = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();

            updatedItem.src = fileId;
          } else if (typeof item.src !== "object" && item.src) {
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
          } else if (typeof item.poster !== "object" && item.poster) {
          }
          return item;
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
          } else if (typeof item.src !== "object" && item.src) {
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
          } else if (typeof item.poster !== "object" && item.poster) {
          }
          return item;
        })
      );

      // Create the info object with all fields
      const info = {
        title,
        subtitle,
        color: uploadedColors,
        sizes,
        imgData: uploadedImgData,
      };

      // Create the final product object
      const productData = {
        name,
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
      console.error("Error creating product:", error);
    }
  };

  return (
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
        {colors.map((color, index) => (
          <div className="mt-2" key={index}>
            <input
              className="w-50"
              type="text"
              placeholder="Name"
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
              type="file"
              onChange={(e) => handleFileChange(e, index, setColors, colors)}
            />
            <button
              className="bg-danger me-2"
              type="button"
              onClick={() => handleRemoveColor(index)}
            >
              حذف
            </button>
          </div>
        ))}
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

      <BorderInputBox className="mt-3">
        <label>عکس ها و فیلم های محصول :</label>
        {imgData.map((item, index) => (
          <div
            className="d-flex flex-row gap-2 flex-wrap mt-2 align-items-center"
            key={index}
          >
            <div className="d-flex flex-column">
              <span className="mb-1">عکس یا فیلم</span>
              <input
                type="file"
                onChange={(e) =>
                  handleFileChange(e, index, setImgData, imgData)
                }
              />
            </div>
            {item.src && !objectUrls[index] && (
              <Box
                component={item.type === "1" ? "img" : "video"}
                src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${item.src}`}
                sx={{
                  width: "140px",
                  maxHeight: "100%",
                  borderRadius: "2px",
                }}
                controls={item.type === "2"}
              />
            )}

            {objectUrls[index] && (
              <Box
                component={item.type === "1" ? "img" : "video"}
                src={objectUrls[index]}
                sx={{
                  width: "140px",
                  maxHeight: "100%",
                  borderRadius: "2px",
                }}
                controls={item.type === "2"}
              />
            )}

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
              <>
                <div className="d-flex flex-column">
                  <span className="mb-1">پوستر فیلم</span>
                  <input
                    type="file"
                    onChange={(e) =>
                      handleFileChangePoster(e, index, setImgData, imgData)
                    }
                  />
                </div>
                {posterObjectUrls[index] && (
                  <Box
                    component="img"
                    src={posterObjectUrls[index]}
                    sx={{
                      width: "140px",
                      maxHeight: "100%",
                      borderRadius: "2px",
                    }}
                  />
                )}
              </>
            )}
            <button
              className="bg-danger me-2"
              type="button"
              onClick={() => handleRemoveImgData(index)}
            >
              حذف
            </button>
          </div>
        ))}
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
        {media.map((item, index) => (
          <div className="mt-2" key={index}>
            <div className="d-flex flex-row gap-2 flex-wrap">
              <input
                style={{width: "40%"}}
                type="text"
                placeholder="Title"
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
                style={{width: "40%"}}
                type="text"
                placeholder="Description"
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

            <div className="d-flex flex-column">
              <span>فیلم :</span>
              <div className=" d-flex flex-row align-items-center">
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, index, setMedia, media)}
                />
                {item.src && !objectUrls[index] && (
                  <Box
                    component="video"
                    src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${item.src}`}
                    sx={{
                      width: "140px",
                      maxHeight: "100%",
                      borderRadius: "2px",
                    }}
                    controls
                  />
                )}

                {objectUrls[index] && (
                  <Box
                    component="video"
                    src={objectUrls[index]}
                    sx={{
                      width: "140px",
                      maxHeight: "100%",
                      borderRadius: "2px",
                    }}
                    controls
                  />
                )}
              </div>
            </div>

            <div className="d-flex flex-column">
              <span>پوستر فیلم :</span>
              <div>
                <input
                  type="file"
                  onChange={(e) =>
                    handleFileChangePoster(e, index, setMedia, media)
                  }
                />
                {posterObjectUrls[index] && (
                  <Box
                    component="img"
                    src={posterObjectUrls[index]}
                    sx={{
                      width: "140px",
                      maxHeight: "100%",
                      borderRadius: "2px",
                    }}
                  />
                )}
              </div>
            </div>

            <button
              className="bg-danger mt-2 mb-2"
              type="button"
              onClick={() => handleRemoveMedia(index)}
            >
              حذف
            </button>
          </div>
        ))}
        <button
          className="mt-2 bg-success"
          type="button"
          onClick={handleAddMedia}
        >
          اضافه کردن ویدیو
        </button>
      </BorderInputBox>
      <button type="submit" className="mt-3 bg-success">
        ویرایش محصول
      </button>
      <button
        className="bg-danger mt-2 mb-2"
        type="button"
        onClick={areYouShureFunction2}
      >
        حذف محصول
      </button>
      <button className="bg-warning" onClick={handleCancelEdit}>
        انصراف
      </button>
      {/* modal  */}
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
        text={"خطا از لاگین بودن خود اطمینان حاصل فرمایید"}
      />
    </form>
  );
}
