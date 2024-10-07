import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { uploadFile } from "@/app/Store/thunks";

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

  const [media, setMedia] = useState([{ title: "", description: "", src: "", poster: "" }]);

  const [objectUrls, setObjectUrls] = useState({});
  const [posterObjectUrls, setPosterObjectUrls] = useState({});

  useEffect(() => {
    if (editedHonor) {
      // Set the media based on the edited honor
      setMedia([editedHonor]); // Wrap editedHonor in an array
    }
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

  const handleAddMedia = () => {
    setMedia([...media, { title: "", description: "", src: "", poster: "" }]);
  };

  const handleRemoveMedia = (index) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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

          console.log(`Uploaded media:`, updatedItem);
          // Once both `src` and `poster` are uploaded, dispatch the final action
        })
      );
      console.log("All media successfully uploaded and saved.");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="mt-3">
      <h2>ادیت ویدیو</h2>
      <form onSubmit={handleSubmit}>
        <BorderInputBox className="mt-3">
          <label>فیلم ها:</label>
          {media.map((item, index) => (
            <div className="mt-2" key={index}>
              <input
                type="text"
                placeholder="Title"
                value={item.title} // Use item.title instead of media.title
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
                value={item.description} // Use item.description instead of media.description
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
                    onChange={(e) =>
                      handleFileChange(e, index, setMedia, media)
                    }
                    required
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
                    required
                  />
                  {item.poster && !posterObjectUrls[index] && (
                    <Box
                      component="img"
                      src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${item.poster}`}
                      sx={{
                        width: "140px",
                        maxHeight: "100%",
                        borderRadius: "2px",
                      }}
                    />
                  )}

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
        <button className="bg-danger mt-2 mb-2" type="button">
          حذف محصول
        </button>
        <button onClick={handleCancelEdit}>انصراف</button>
      </form>
    </div>
  );
}
