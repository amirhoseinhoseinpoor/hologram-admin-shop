import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import JoditEditor from "jodit-react";
import { updateBannerContent } from "../../Store/thunks.js";

export default function AddHonors({ dispatch }) {
  // editor
  const [content, setContent] = useState("");
  const [bannerImage, setBannerImage] = useState(null);
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerDate, setBannerDate] = useState("");
  const [bannerTags, setBannerTags] = useState("");

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  const handleImageChange = (event) => {
    const newImage = event.target.files[0];
    setBannerImage(newImage);
  };

  const handleTitleChange = (event) => {
    setBannerTitle(event.target.value);
  };

  const handleDateChange = (event) => {
    setBannerDate(event.target.value);
  };

  const handleTagsChange = (event) => {
    setBannerTags(event.target.value);
  };

  // form submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("image", bannerImage); // Append image file
    formData.append("title", bannerTitle); // Append title
    formData.append("date", bannerDate); // Append date
    formData.append("tags", bannerTags); // Append tags
    formData.append("content", content); // Append editor content
    await dispatch(updateBannerContent(formData)); // Dispatch update thunk
  };

  const config = useMemo(
    () => ({
      buttons: [
        'source', '|',
        'bold', 'italic', 'underline', '|',
        'ul', 'ol', '|',
        'outdent', '|', // Removed 'indent'
        'image', 'table', '|',
        'link', '|',
        'hr', '|',
        'align', 'undo', 'redo', '|',
        'fullsize', 'print',
      ],
      removeButtons: ['audio', 'font'],
    }),
    []
  );

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="bannerImage">Image:</label>
        <input type="file" id="bannerImage" onChange={handleImageChange} />
        <label htmlFor="bannerTitle">عنوان :</label>
        <input
          id="bannerTitle"
          value={bannerTitle}
          onChange={handleTitleChange}
        />
        <label htmlFor="bannerDate">تاریخ :</label>
        <input
          type="date"
          id="bannerDate"
          value={bannerDate}
          onChange={handleDateChange}
        />
        <label htmlFor="bannerTags">برچسب‌ها :</label>
        <input
          id="bannerTags"
          value={bannerTags}
          onChange={handleTagsChange}
        />

        <div>
          <h2>Create Blog Post</h2>
          <JoditEditor
            value={content}
            config={config}
            onChange={handleEditorChange}
            className="w-full h-[70%] mt-10 bg-white"
          />
          <style>{`.jodit-wysiwyg{height:300px !important}`}</style>
        </div>
        <button type="submit">اضافه کردن افتخار</button>
      </form>
    </>
  );
}
