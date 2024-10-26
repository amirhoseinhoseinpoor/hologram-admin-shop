import React, { useState, useEffect } from "react";
import { Button, TextField, Box, CardMedia } from "@mui/material";
import styled from "styled-components";
import { Editor } from "@tinymce/tinymce-react";
import { useDispatch } from "react-redux";
import { honorsDeleted, uploadFile, honorsEdit } from "@/app/Store/thunks";

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

  const [content, setContent] = useState(""); // No array, just a string
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerTags, setBannerTags] = useState("");
  const [bannerImage, setBannerImage] = useState(null);

  useEffect(() => {
    if (editedHonor) {
      setContent(editedHonor.content); // Set content directly
      setBannerTitle(editedHonor.title);
      setBannerTags(editedHonor.tags);
      setBannerImage(editedHonor.src);
    }
  }, [editedHonor]);

  const handleEditorChange = (newContent) => {
    setContent(newContent); // Update content state
  };

  const handleTitleChange = (event) => {
    setBannerTitle(event.target.value);
  };

  const handleTagsChange = (event) => {
    setBannerTags(event.target.value);
  };

  const handleImageUpload = async (blobInfo, success, failure) => {
    const file = blobInfo.blob();
    const tag = "editorImageHonors";
    const type = 1;
    const isPublic = true;

    try {
      const fileId = await dispatch(
        uploadFile({ file, tag, type, isPublic })
      ).unwrap();
      const imageUrl = `http://176.120.16.221:7000/system/download/${fileId}`;
      const editor = tinymce.activeEditor;
      editor.insertContent(`<img src="${imageUrl}" alt="Image" />`);
    } catch (error) {
      failure("Image upload failed");
    }
  };

  const handleBannerImageUpload = async (event) => {
    const file = event.target.files[0];
    const tag = "honorImage";
    const type = 1;
    const isPublic = true;

    try {
      const fileId = await dispatch(
        uploadFile({ file, tag, type, isPublic })
      ).unwrap();
      // const imageUrl = `${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${fileId}`;
      setBannerImage(fileId);
    } catch (error) {
      console.error("Error uploading banner image:", error);
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const deleteVideo = await dispatch(
        honorsDeleted({ code: editedHonor.code })
      );
      if (deleteVideo.payload.message === "Success") {
        alert("Honor deleted successfully");
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
      tags: bannerTags,
      content: content, // Send the content state directly
    };
    try {
      const fetchData = await dispatch(
        honorsEdit({ honor: formData, code: editedHonor.code })
      ).unwrap();
      console.log(fetchData);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <div className="mt-3">
      <h2>ویرایش افتخارات</h2>
      <form onSubmit={handleSubmit}>
        <TEXTFIELD
          label="Title"
          value={bannerTitle}
          onChange={handleTitleChange}
          fullWidth
          margin="normal"
        />
        <TEXTFIELD
          label="Tags"
          value={bannerTags}
          onChange={handleTagsChange}
          fullWidth
          margin="normal"
        />
        <input
          type="file"
          onChange={handleBannerImageUpload}
          accept="image/*"
        />
        {bannerImage && (
          <Box sx={{ width: "100px", height: "100px", marginTop: "10px" }}>
            <CardMedia
              component="img"
              src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${bannerImage}`}
              sx={{ width: "100%", height: "100%", borderRadius: 3 }}
            />
          </Box>
        )}

        <div>
          
          <Editor
            apiKey="3akk9p7jow7ksa3txzom0c8qr4e59rtg6xy1fzvux8vysqs0"
            value={content} // Set the content state directly
            onEditorChange={handleEditorChange} // Update content state on change
            init={{
              height: 500,
              menubar: false,
              plugins: [
                "advlist",
                "autolink",
                "lists",
                "link",
                "image",
                "charmap",
                "preview",
                "anchor",
                "searchreplace",
                "visualblocks",
                "code",
                "fullscreen",
                "insertdatetime",
                "media",
                "table",
                "help",
                "wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | removeformat | image",
              images_upload_handler: handleImageUpload,
            }}
          />
        </div>

        <Button className="mb-3 mt-3" variant="contained" type="submit">
          Save
        </Button>
        <button
          className="bg-danger mt-2 mb-2"
          type="button"
          onClick={handleDelete}
        >
          حذف افتخار
        </button>
        <Button style={{fontFamily: "unset"}} className="bg-warning" variant="contained" onClick={handleCancelEdit}>
          لغو
        </Button>
      </form>
    </div>
  );
}
