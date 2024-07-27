import React, { useState } from "react";
import JoditEditor from "jodit-react";

const BlogEditor = () => {
  const [content, setContent] = useState("");

  const handleEditorChange = (newContent) => {
    setContent(newContent);
    console.log(newContent);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Blog content:", content);
  };

  return (
    <div>
      <h2>Create Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <JoditEditor
          value={content}
          
          onChange={handleEditorChange}
        />
        <button type="submit">Save Blog Post</button>
      </form>
    </div>
  );
};

export default BlogEditor;
