import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { uploadFile } from "@/app/Store/thunks";
import { productpot } from "@/app/Store/thunks";
import styled from "styled-components";

const BorderInputBox = styled.div`
  border: 2px solid #28a745;
  padding: 5px;
`;

export default function AddHonors() {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [colors, setColors] = useState([{ name: "", value: "" }]);
  const [sizes, setSizes] = useState([""]);
  const [imgData, setImgData] = useState([{ src: "", type: "1", poster: "" }]);
  const [media, setMedia] = useState([
    { title: "", description: "", src: "", poster: "" },
  ]);

  useEffect(() => {
    console.log(media);
  }, [media]);

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
    setColors([...colors, { name: "", value: "" }]);
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
    }
  };

  const handleAddMedia = () => {
    setMedia([...media, { title: "", description: "", src: "", poster: "" }]);
  };

  const handleRemoveMedia = (index) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Upload all images/videos and get the IDs
      const uploadedImgData = await Promise.all(
        imgData.map(async (item) => {
          if (item.src) {
            const tag = name;
            const type = item.type;
            const isPublic = true;
            const file = item.src;

            const fileId = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();

            return { ...item, src: fileId }; // Replace src with the file ID
          }
          if (item.poster) {
            const tag = name;
            const type = 1;
            const isPublic = true;
            const file = item.poster;

            const fileId = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();

            return { ...item, poster: fileId }; // Replace src with the file ID
          }
          return item;
        })
      );

      const uploadedMedia = await Promise.all(
        media.map(async (item) => {
          if (item.src) {
            const tag = name;
            const type = 2;
            const isPublic = true;
            const file = item.src;

            const fileId = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();
            console.log(fileId);

            return { ...item, src: fileId }; // Replace src with the file ID
          }
          if (item.poster) {
            const tag = name;
            const type = 1;
            const isPublic = true;
            const file = item.poster;

            const fileId = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();
            console.log(fileId);

            return { ...item, poster: fileId }; // Replace src with the file ID
          }
          return item;
        })
      );

      // Create the info object with all fields
      const info = {
        title,
        subtitle,
        color: colors,
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
      await dispatch(productpot(productData));
      
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <>
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
                type="text"
                placeholder="Value"
                value={color.value}
                onChange={(e) =>
                  setColors(
                    colors.map((c, i) =>
                      i === index ? { ...c, value: e.target.value } : c
                    )
                  )
                }
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
                  required
                />
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
                  <span className="mb-1">پوستر فیلم</span>
                  <input
                    type="file"
                    
                    onChange={(e) =>
                      handleFileChangePoster(e, index, setImgData, imgData)
                    }
                  />
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
                value={item.title }
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
                value={item.description }
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
                <input
                  type="file"              
                  onChange={(e) => handleFileChange(e, index, setMedia, media)}
                  required
                />
              </div>

              <div className="d-flex flex-column">
                <span>پوستر فیلم :</span>
                <input
                  type="file"                
                  onChange={(e) =>
                    handleFileChangePoster(e, index, setMedia, media)
                  }
                  required
                />
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
          اضافه کردن محصول
        </button>
      </form>
    </>
  );
}
