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


}) {

  console.log(editedHonor);
  
  

  const handleTagsChange = (event) => {
    setEditedHonor({ ...editedHonor, tags: event.target.value });
  };

  return (
    <div className="mt-3">
      <h2>ویرایش محصولات</h2>
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
