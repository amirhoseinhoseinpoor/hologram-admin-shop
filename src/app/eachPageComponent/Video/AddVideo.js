import React, { useState } from "react";
// import redux
import { useDispatch } from "react-redux";
import { videopot } from "@/app/Store/thunks";
import { uploadFile } from "@/app/Store/thunks";
// import modals
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import ConfirmModal from "@/app/BaseComponent/Confirmmodal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";

import styled from "styled-components";

const BorderInputBox = styled.div`
  border: 2px solid #28a745;
  padding: 5px;
`;

export default function AddHonors() {
  const dispatch = useDispatch();

  // modal state
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  // Close modal
  const closeModal = () => setOpenModal(false);
  const closeModal2 = () => setOpenModal2(false);
  const closeModal3 = () => setOpenModal3(false);

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

          await dispatch(
            videopot({
              media: updatedItem,
            })
          );
        })
      );
      setOpenModal2(true);
      closeModalOnTimeout();
    } catch (error) {
      setOpenModal3(true);
      console.error("Error creating product:", error);
    }
  };

  return (
    <>
      <form onSubmit={areYouShureFunction}>
        <BorderInputBox className="mt-3">
          <label>فیلم ها:</label>
          {media.map((item, index) => (
            <div className="mt-2" key={index}>
              <div className="d-flex flex-row flex-wrap align-items-center gap-2">
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

              <div className="d-flex flex-column mt-2">
                <span className="mb-1">فیلم :</span>
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, index, setMedia, media)}
                  required
                />
              </div>

              <div className="d-flex flex-column mt-2 mb-1">
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
                className="bg-danger mt-1"
                type="button"
                onClick={() => handleRemoveMedia(index)}
              >
                حذف
              </button>
            </div>
          ))}
          <button
            className="mt-2 bg-success mb-2"
            type="button"
            onClick={handleAddMedia}
          >
            اضافه کردن ویدیو
          </button>
        </BorderInputBox>

        <button className="bg-success mt-3" type="submit">
          اضافه کردن ویدیو
        </button>

        {/* modals */}
        <AreYouShureModal
          open={openModal}
          onClose={closeModal}
          text={"ایا از اضافه کردن ویدیو مطمعن هستید"}
          func={handleSubmit}
        />
        <ConfirmModal
          open={openModal2}
          onClose={closeModal2}
          text={"ویدیو با موفقیت اضافه شد"}
        />
        <ErrorModal
          open={openModal3}
          onClose={closeModal3}
          text={"خطا از لاگین بودن خود اطمینان حاصل فرمایید"}
        />
      </form>
    </>
  );
}
