import React, { useState, useEffect } from "react";
import { Button, TextField, Box, CardMedia } from "@mui/material";
import styled from "styled-components";
// import redux
import { useDispatch } from "react-redux";
import { bannerEdit, bannerDeleted, uploadFile } from "@/app/Store/thunks";

const TEXTFIELD = styled(TextField)`
  .MuiInputBase-input {
    margin-bottom: 0;
  }
`;

export default function EditHonors({
  editedHonor,
  handleCancelEdit,
  setEditedHonor,
}) {
  const dispatch = useDispatch();

  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerLink, setBannerLink] = useState("");
  const [bannerImage, setBannerImage] = useState(null);

  useEffect(() => {
    if (editedHonor) {
      setBannerTitle(editedHonor.title);
      setBannerLink(editedHonor.link);
      setBannerImage(editedHonor.src);
    }
  }, [editedHonor]);

  const handleBannerImageUpload = async (event) => {
    const file = event.target.files[0];
    const tag = "bannerImage";
    const type = 1;
    const isPublic = true;

    try {
      const fileId = await dispatch(
        uploadFile({ file, tag, type, isPublic })
      ).unwrap();
      const imageUrl = `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${fileId}`;
      setBannerImage(imageUrl);
    } catch (error) {
      console.error("Error uploading banner image:", error);
    }
  };

  const handleTitleChange = (event) => {
    setBannerTitle(event.target.value);
  };

  const handleLinkChange = (event) => {
    setBannerLink(event.target.value);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const deleteVideo = await dispatch(
        bannerDeleted({ code: editedHonor.code })
      );
      if (deleteVideo.payload.message === "Success") {
        alert("banner deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting honors:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      title: bannerTitle,
      src: bannerImage,
      link: bannerLink,
    };
    try {
      const fetchData = await dispatch(
        bannerEdit({ banner: formData, code: editedHonor.code })
      ).unwrap();
      console.log(fetchData);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="mt-3">
      <h2>Edit Banner</h2>
      <form onSubmit={handleSubmit}>
        <TEXTFIELD
          label="Title"
          value={bannerTitle}
          onChange={handleTitleChange}
          fullWidth
          margin="normal"
        />
        <TEXTFIELD
          label="Link"
          value={bannerLink}
          onChange={handleLinkChange}
          fullWidth
          margin="normal"
        />

        <label htmlFor="bannerImage">Select Image:</label>
        <input
          type="file"
          id="bannerImage"
          onChange={handleBannerImageUpload}
          accept="image/*"
        />

        {bannerImage && (
          <Box sx={{ width: "100px", height: "100px", marginTop: "10px" }}>
            <CardMedia
              component="img"
              src={bannerImage}
              sx={{ width: "100%", height: "100%", borderRadius: 3 }}
            />
          </Box>
        )}

        <Button className="mb-3 mt-3" variant="contained" type="submit">
          Save
        </Button>
        <button
          className="bg-danger mt-2 mb-2"
          type="button"
          onClick={handleDelete}
        >
          Delete Banner
        </button>
        <Button variant="contained" onClick={handleCancelEdit}>
          Cancel
        </Button>
      </form>
    </div>
  );
}
