import React from "react";
import { Button, TextField, Box, CardMedia } from "@mui/material";
import styled from "styled-components";
import JoditEditor from "jodit-react";

const TEXTFIELD = styled(TextField)`
  .MuiInputBase-input {
    margin-bottom: 0;
  }
`;

export default function EditHonors({
  editedHonor,
  handleHonorSave,
  handleCancelEdit,
  handleEditImageChange,
  setEditedHonor,
  content,
  setContent,
}) {
  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  const handleTagsChange = (event) => {
    setEditedHonor({ ...editedHonor, tags: event.target.value });
  };

  return (
    <div className="mt-3">
      <h2>Edit Honor</h2>
      <form onSubmit={handleHonorSave}>
        <TEXTFIELD
          label="Title"
          value={editedHonor.title}
          onChange={(e) =>
            setEditedHonor({ ...editedHonor, title: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TEXTFIELD
          label="Date"
          value={editedHonor.date}
          onChange={(e) =>
            setEditedHonor({ ...editedHonor, date: e.target.value })
          }
          fullWidth
          margin="normal"
        />
        <TEXTFIELD
          label="Tags"
          value={editedHonor.tags}
          onChange={handleTagsChange}
          fullWidth
          margin="normal"
        />
        <input type="file" onChange={handleEditImageChange} accept="image/*" />
        {editedHonor.src && (
          <Box sx={{ width: "100px", height: "100px", marginTop: "10px" }}>
            <CardMedia
              component="img"
              src={editedHonor.src}
              sx={{ width: "100%", height: "100%", borderRadius: 3 }}
            />
          </Box>
        )}
        <div>
          <h2>Edit Blog Post Content</h2>
          <JoditEditor
            value={content}
            onChange={handleEditorChange}
            className="w-full h-[70%] mt-10 bg-white"
          />
          <style>{`.jodit-wysiwyg{height:300px !important}`}</style>
        </div>
        <Button className="mb-3 mt-3" variant="contained" type="submit">
          Save
        </Button>
        <Button variant="contained" onClick={handleCancelEdit}>
          Cancel
        </Button>
      </form>
    </div>
  );
}
