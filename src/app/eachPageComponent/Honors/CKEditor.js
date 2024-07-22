import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const BlogEditor = () => {
  const [content, setContent] = useState('');

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setContent(data);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
   
    console.log('Blog content:', content);
  };

  return (
    <div>
      <h2>Create Blog Post</h2>
      <form onSubmit={handleSubmit}>
        <CKEditor
          editor={ClassicEditor}
          data={content}
          onChange={handleEditorChange}
        />
        <button type="submit">Save Blog Post</button>
      </form>
    </div>
  );
};

export default BlogEditor;
