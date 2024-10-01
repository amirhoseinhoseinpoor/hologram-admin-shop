import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { deleted } from "@/app/Store/thunks";
import { uploadFile, productEdit } from "@/app/Store/thunks";
import { Box } from "@mui/material";

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
    try {
      const deleteProduct = await dispatch(
        deleted({ code: editedHonor.code, name: editedHonor.name })
      );

      if (deleteProduct.payload.message === "Success") {
        alert("محصول باموفقیت حذف شد");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      // Dispatch the final product submission
      await dispatch(productEdit({ productData, code: editedHonor.code }));
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
              value={color.value}
              onChange={(e) =>
                handleFileChange(e, index, setColors, colors)
              }
              // onChange={(e) =>
              //   setColors(
              //     colors.map((c, i) =>
              //       i === index ? { ...c, value: e.target.value } : c
              //     )
              //   )
              // }
              required
            />
            <button
              className="bg-danger"
              type="button"
              onClick={() => handleRemoveColor(index)}
            >
              حذف
            </button>
          </div>
        ))}
        <button className="mt-2" type="button" onClick={handleAddColor}>
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
              className="bg-danger"
              type="button"
              onClick={() => handleRemoveSize(index)}
            >
              حذف
            </button>
          </div>
        ))}
        <button className="mt-2" type="button" onClick={handleAddSize}>
          اضافه کردن سایز
        </button>
      </BorderInputBox>

      <BorderInputBox className="mt-3">
        <label>عکس ها و فیلم های محصول :</label>
        {imgData.map((item, index) => (
          <div className="d-flex flex-row gap-2 flex-wrap mt-2" key={index}>
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
                src={`http://localhost:7000/system/download/${item.src}`}
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
              className="bg-danger"
              type="button"
              onClick={() => handleRemoveImgData(index)}
            >
              حذف
            </button>
          </div>
        ))}
        <button className="mt-2" type="button" onClick={handleAddImgData}>
          اضافه کردن عکس / فیلم
        </button>
      </BorderInputBox>

      <BorderInputBox className="mt-3">
        <label>فیلم ها:</label>
        {media.map((item, index) => (
          <div className="mt-2" key={index}>
            <input
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
            <div className="d-flex flex-column">
              <span>فیلم :</span>
              <div>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, index, setMedia, media)}
                  required
                />
                {item.src && !objectUrls[index] && (
                  <Box
                    component="video"
                    src={`http://localhost:7000/system/download/${item.src}`}
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
                  required
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
              className="bg-danger"
              type="button"
              onClick={() => handleRemoveMedia(index)}
            >
              حذف
            </button>
          </div>
        ))}
        <button className="mt-2" type="button" onClick={handleAddMedia}>
          اضافه کردن ویدیو
        </button>
      </BorderInputBox>
      <button type="submit" className="mt-3">
        ویرایش محصول
      </button>
      <button
        className="bg-danger mt-2 mb-2"
        type="button"
        onClick={handleDelete}
      >
        حذف محصول
      </button>
      <button onClick={handleCancelEdit}>انصراف</button>
    </form>

    // <div className="mt-3">
    //   <h2>ویرایش محصولات</h2>
    //   <form onSubmit={handleHonorSave}>
    //     <TEXTFIELD
    //       label="Title"
    //       value={editedHonor.title}
    //       onChange={(e) =>
    //         setEditedHonor({ ...editedHonor, title: e.target.value })
    //       }
    //       fullWidth
    //       margin="normal"
    //     />
    //     <TEXTFIELD
    //       label="Date"
    //       value={editedHonor.date}
    //       onChange={(e) =>
    //         setEditedHonor({ ...editedHonor, date: e.target.value })
    //       }
    //       fullWidth
    //       margin="normal"
    //     />
    //     <TEXTFIELD
    //       label="Tags"
    //       value={editedHonor.tags}
    //       onChange={handleTagsChange}
    //       fullWidth
    //       margin="normal"
    //     />
    //     <input type="file" onChange={handleEditImageChange} accept="image/*" />
    //     {editedHonor.src && (
    //       <Box sx={{ width: "100px", height: "100px", marginTop: "10px" }}>
    //         <CardMedia
    //           component="img"
    //           src={editedHonor.src}
    //           sx={{ width: "100%", height: "100%", borderRadius: 3 }}
    //         />
    //       </Box>
    //     )}

    //   </form>
    // </div>
  );
}
