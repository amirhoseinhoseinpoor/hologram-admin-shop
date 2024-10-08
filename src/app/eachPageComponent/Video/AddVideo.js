import React, { useState, useMemo } from "react";
// import redux
import { useDispatch } from "react-redux";
import { videopot } from "@/app/Store/thunks";
import { uploadFile } from "@/app/Store/thunks";

import styled from "styled-components";

const BorderInputBox = styled.div`
  border: 2px solid #28a745;
  padding: 5px;
`;

export default function AddHonors() {
  const dispatch = useDispatch();

  // const [content, setContent] = useState("");
  // const [bannerImage, setBannerImage] = useState(null);
  // const [bannerTitle, setBannerTitle] = useState("");
  // const [bannerDate, setBannerDate] = useState("");
  // const [bannerTags, setBannerTags] = useState("");

  const [media, setMedia] = useState([
    { title: "", description: "", src: "", poster: "" },
  ]);

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

  const handleAddMedia = () => {
    setMedia([...media, { title: "", description: "", src: "", poster: "" }]);
  };

  const handleRemoveMedia = (index) => {
    if (media.length > 1) {
      setMedia(media.filter((_, i) => i !== index));
    }
  };

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       // Use Promise.all to upload both `src` and `poster` for each media item individually
       await Promise.all(
        media.map(async (item) => {
          let updatedItem = { ...item };

          // Upload src (video) if it's a file object
          if (item.src && typeof item.src === "object") {
            const tag = "homePageVideo";
            const type = 2;
            const isPublic = true;
            const fileIdSrc = await dispatch(
              uploadFile({ file: item.src, tag, type, isPublic })
            ).unwrap();
            updatedItem.src = fileIdSrc; // Update src with the file ID
          }

          // Upload poster if it's a file object
          if (item.poster && typeof item.poster === "object") {
            const tag = "homePageVideoPoster";
            const type = 1;
            const isPublic = true;
            const fileIdPoster = await dispatch(
              uploadFile({ file: item.poster, tag, type, isPublic })
            ).unwrap();
            updatedItem.poster = fileIdPoster; // Update poster with the file ID
          }

          // Once both `src` and `poster` are uploaded, dispatch `videopot` to create an individual media entry
          await dispatch(videopot({
            media :updatedItem
          }));

          console.log(`Uploaded media:`, updatedItem);
        })
      );
      console.log("All media successfully uploaded and saved.");

    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        

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

        <button type="submit">اضافه کردن ویدیو</button>
      </form>
    </>
  );
}
