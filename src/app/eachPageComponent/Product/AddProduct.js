import React, { useState } from "react";

export default function AddHonors({ dispatch }) {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [colors, setColors] = useState([{ name: "", value: "" }]);
  const [sizes, setSizes] = useState([""]);
  const [imgData, setImgData] = useState([{ src: "", type: "", poster: "" }]);
  const [media, setMedia] = useState([
    { title: "", description: "", src: "", poster: "" },
  ]);

  const handleAddColor = () => {
    setColors([...colors, { name: "", value: "" }]);
  };

  const handleRemoveColor = (index) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const handleAddSize = () => {
    setSizes([...sizes, ""]);
  };

  const handleRemoveSize = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };

  const handleAddImgData = () => {
    setImgData([...imgData, { src: "", type: "", poster: "" }]);
  };

  const handleRemoveImgData = (index) => {
    setImgData(imgData.filter((_, i) => i !== index));
  };

  const handleAddMedia = () => {
    setMedia([...media, { title: "", description: "", src: "", poster: "" }]);
  };

  const handleRemoveMedia = (index) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the info object with all fields
    const info = {
      title,
      subtitle,
      color: colors,
      sizes,
      imgData,
    };

    // Create the final product object
    const productData = {
      name,
      info,
      media,
    };

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to create new product");
      }

      const result = await response.json();
      console.log("Product created successfully:", result);
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* <label htmlFor="bannerImage">Image:</label>
        <input type="file" id="bannerImage" onChange={handleImageChange} /> */}
        <label htmlFor="name">اسم محصول :</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label htmlFor="bannerDate">عنوان :</label>
        <input
          type="text"
          id="bannerDate"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label htmlFor="bannerTags">توضیحات :</label>
        <input
          type="text"
          id="bannerTags"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          required
        />

        <div>
          <label>Colors:</label>
          {colors.map((color, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Name"
                value={color.name}
                onChange={(e) =>
                  setColors(
                    colors.map((c, i) =>
                      i === index ? { ...c, name: e.target.value } : c
                    )
                  )
                }
                required
              />
              <input
                type="text"
                placeholder="Value"
                value={color.value}
                onChange={(e) =>
                  setColors(
                    colors.map((c, i) =>
                      i === index ? { ...c, value: e.target.value } : c
                    )
                  )
                }
                required
              />
              <button type="button" onClick={() => handleRemoveColor(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddColor}>
            Add Color
          </button>
        </div>

        <div>
          <label>Sizes:</label>
          {sizes.map((size, index) => (
            <div key={index}>
              <input
                type="text"
                value={size}
                onChange={(e) =>
                  setSizes(
                    sizes.map((s, i) => (i === index ? e.target.value : s))
                  )
                }
                required
              />
              <button type="button" onClick={() => handleRemoveSize(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddSize}>
            Add Size
          </button>
        </div>

        <div>
          <label>Image Data:</label>
          {imgData.map((item, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Source"
                value={item.src}
                onChange={(e) =>
                  setImgData(
                    imgData.map((img, i) =>
                      i === index ? { ...img, src: e.target.value } : img
                    )
                  )
                }
                required
              />
              <input
                type="text"
                placeholder="Type"
                value={item.type}
                onChange={(e) =>
                  setImgData(
                    imgData.map((img, i) =>
                      i === index ? { ...img, type: e.target.value } : img
                    )
                  )
                }
                required
              />
              {item.type === "video" && (
                <input
                  type="text"
                  placeholder="Poster (only for video)"
                  value={item.poster}
                  onChange={(e) =>
                    setImgData(
                      imgData.map((img, i) =>
                        i === index ? { ...img, poster: e.target.value } : img
                      )
                    )
                  }
                />
              )}
              <button type="button" onClick={() => handleRemoveImgData(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddImgData}>
            Add Image/Video
          </button>
        </div>

        <div>
          <label>Media:</label>
          {media.map((item, index) => (
            <div key={index}>
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
              <input
                type="text"
                placeholder="Source"
                value={item.src}
                onChange={(e) =>
                  setMedia(
                    media.map((m, i) =>
                      i === index ? { ...m, src: e.target.value } : m
                    )
                  )
                }
                required
              />
              <input
                type="text"
                placeholder="Poster"
                value={item.poster}
                onChange={(e) =>
                  setMedia(
                    media.map((m, i) =>
                      i === index ? { ...m, poster: e.target.value } : m
                    )
                  )
                }
                required
              />
              <button type="button" onClick={() => handleRemoveMedia(index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddMedia}>
            Add Media
          </button>
        </div>
        <button type="submit" className="mt-3">
          اضافه کردن محصول
        </button>
      </form>
    </>
  );
}