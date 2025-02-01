import React, { useState, useEffect } from "react";
// Import Redux
import { useDispatch } from "react-redux";
import {
  HeaderList,
  uploadFile,
  prodNameAndNav,
  productpot,
} from "@/app/Store/thunks";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import styled from "styled-components";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import ConfirmModal from "@/app/BaseComponent/ConfirmingModal";
import { Modal, Box } from "@mui/material";
import CustomCloseButton from "@/app/BaseComponent/CustomCloseButton";

// Styled Components
const DivAdjustColorDivs = styled.div`
  display: grid;
  grid-template-columns: ${(props) => props.columns || "1fr"};
  /* grid-gap: 18px; */
  width: 100%;
  /* padding: 15px; */
  .dropDownSpecoficStyle {
    border: 1.5px solid #c0c0c0;
    border-radius: 4px;
  }
  .dropDownSpecoficStyleHeader{
    border-bottom: 1.5px solid #c0c0c0;
    border-radius: 4px;
    padding: 10px;
  }
  .labelInsteadOfInput {
    border: 1px solid #c0c0c0;
    border-radius: 4px;
    padding: 10px;
    width: 100%;
    height: 77%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .colorTheInputFile {
    color: #404040;
    margin: 0;
  }
  .divBorderFileds {
    border: 1.5px solid #c0c0c0;
    padding: 10px;
    border-radius: 4px;
  }
  @media (max-width: 768px) {
    grid-template-columns: ${(props) => props.recolumns || ""};
  }
`;

const DivAdjustGrodimageMedia = styled.div`
  border: 2px solid #ccc;
  border-radius: 4px;
  /* padding: 10px; */
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 6px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const ButtonAddSection = styled.button`
  width: fit-content;
`;

const BOX = styled(Box)`
  max-width: 350px;
  width: 100%;
  max-height: 200px;
  border-radius: 4px;
`;

const SelectWidth = styled.select`
  width: 50%;

  @media (max-width: 768px) {
    width: 75%;
  }
`;

const NavTabs = styled(Tabs)`
  display: flex;
  flex-direction: row;
  border-bottom: none;
  gap: 10px;
  width: 100%;
  border-bottom: 1px solid #191919;

  .nav-item {
    border-radius: 10px !important;
    .css-i4bv87-MuiSvgIcon-root {
      opacity: 0.7;
    }
  }
  .nav-link {
    border: 1px solid #191919;
    border-radius: 10px !important;
    color: #191919;
    width: 100%;
    padding: 5px 11px;
    position: relative;
    cursor: pointer;
  }
  .nav-link:hover {
    border: 1px solid #191919 !important;
  }
  .nav-link.active {
    background-image: linear-gradient(195deg, #42424a 0%, #191919 100%);
    color: white;
    border: none !important;
    border-radius: 10px;
  }

  .nav {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
  }
`;

const AddSectionForm = styled.div`
  border: 2px solid #ccc;
  margin-bottom: 20px;
  border-radius: 8px;
`;

const BorderInputBox = styled.div`
  border: 2px solid #ccc;
  margin-bottom: 20px;
  border-radius: 8px;
`;

const ResponsiveDivFileds = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  width: 100%;
  .labelInsteadOfInput {
    border: 1px solid #c0c0c0;
    border-radius: 4px;
    padding: 10px;
    width: 100%;
    height: 77%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .colorTheInputFile {
    color: #404040;
    margin: 0;
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const ButtonCancelOrder = styled.button`
  border: 1px solid #e91e63 !important;
  color: #e91e63 !important;
`;

const HeaderEachSection = styled.div`
  background-color: rgb(225, 223, 223);
  border-bottom: 2px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  width: 100%;
`;

const InsideAddSectionForm = styled.div`
  padding: 13px;
`;

const HeaderModalShowAccessMainDiv = styled.div`
  background-color: rgb(225, 223, 223);
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  .HeaderModalShowAccess {
    padding: 10px;
  }
`;
const DivHeaderInfoMedia = styled.div`
  background-color: rgb(225, 223, 223);
  padding: 7px;
  border-radius: 4px;
`;

const MediaDivMainGrid = styled.div`
  /* display: flex; */
  border: 2px solid #ccc;
  border-radius: 4px;
  /* padding: 10px; */
`;

const StyleGridInsideMedia = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 10px;
`;

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
};

export default function AddHonors({ setDataUpdated, setActiveKey }) {
  const dispatch = useDispatch();

  // State Variables
  const [selectedNavId, setSelectedNavId] = useState("");
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [subtitleCompelete, setSubtitleCompelete] = useState("");
  const [dynamicSections, setDynamicSections] = useState([]);
  const [imgData, setImgData] = useState([{ src: "", type: "1", poster: "" }]);
  const [media, setMedia] = useState([
    { title: "", description: "", src: "", poster: "" },
  ]);

  const [filedOrder, setFiledOrder] = useState([
    { type: "text", name: "", dropDownOP: [""] },
  ]);

  const [headerCome, setHeaderCome] = useState([]);
  const [availableItems, setAvailableItems] = useState([]);
  const [usedNavIds, setUsedNavIds] = useState([]);

  const [activeTab, setActiveTab] = useState("discrib");
  const [loadingConfirmModal, setLoadingConfirmModal] = useState(false);
  const [disableConfirm, setDisableConfirm] = useState(true);



  // Modal States
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  // Close modal functions
  const closeModal = () => setOpenModal(false);
  const closeModal2 = () => setOpenModal2(false);
  const closeModal3 = () => setOpenModal3(false);

  // custom modal state
  const [modalthings, setModalthings] = useState(null);
  const handleCloseModalThings = () => setModalthings(false);

  // Fetch Header and Product Data on Mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataComeAPI = await dispatch(HeaderList()).unwrap();
        const prodComeApi = await dispatch(prodNameAndNav()).unwrap();

        const content = dataComeAPI?.content || [];
        setHeaderCome(content);

        const usedIds = prodComeApi.map((prod) => prod.navId);
        setUsedNavIds(usedIds);
      } catch (error) {
        console.error("Error fetching header data:", error);
        setOpenModal3(true);
      }
    };

    fetchData();
  }, [dispatch]);
  
  useEffect(() => {
    const flattenHeader = (items, parentPath = '', isTopLevel = true) => {
      let flatList = [];
      items.forEach((item) => {
        if (isTopLevel) {
          // Process subItems with full path but skip parent-level entry
          if (item.subItems?.length) {
            flatList = flatList.concat(flattenHeader(item.subItems, item.title, false));
          }
        } else {
          const currentPath = parentPath ? `${parentPath} / ${item.title}` : item.title;
          // Only add final leaf nodes with full hierarchy
          if (item.subItems?.length) {
            flatList = flatList.concat(flattenHeader(item.subItems, currentPath, false));
          } else {
            flatList.push({ id: item.id, title: currentPath });
          }
        }
      });
      return flatList;
    };
  
    const allHeaderItems = flattenHeader(headerCome);
    const filteredItems = allHeaderItems.filter(
      (item) => !usedNavIds.includes(item.id.toString()) || 
      item.id.toString() === selectedNavId.toString()
    );
    setAvailableItems(filteredItems);
  }, [headerCome, usedNavIds, selectedNavId]);
  
  // Handle File Changes for Dynamic Sections (Image-Based)
  const handleSectionFileChange = (e, sectionIndex, itemIndex) => {
    const file = e.target.files[0];
    if (file) {
      const updatedSections = dynamicSections.map((section, sIdx) => {
        if (sIdx === sectionIndex) {
          const updatedItems = section.items.map((item, iIdx) => {
            if (iIdx === itemIndex) {
              return { ...item, src: file };
            }
            return item;
          });
          return { ...section, items: updatedItems };
        }
        return section;
      });
      setDynamicSections(updatedSections);
    }
  };

  // Handle Adding a New Section with Type Selection via HTML Form
  const [newSectionName, setNewSectionName] = useState("");
  const [newSectionType, setNewSectionType] = useState("text");

  useEffect(() => {
    const isFilled =
      name.trim() !== "" &&
      title.trim() !== "" &&
      subtitle.trim() !== "" &&
      subtitleCompelete.trim() !== "" &&
      dynamicSections.length > 0 &&
      imgData.some((img) => img.src !== "") &&
      media.some(
        (item) =>
          item.title.trim() !== "" &&
          item.description.trim() !== "" &&
          item.src !== "" &&
          item.poster !== ""
      ) &&
      filedOrder.some(
        (item) =>
          item.name.trim() !== "" &&
          item.type.trim() !== "" &&
          item?.dropDownOP?.length > 0
      );

    // Update the disableConfirm state based on the check
    setDisableConfirm(!isFilled);
  }, [
    name,
    title,
    subtitle,
    subtitleCompelete,
    dynamicSections,
    imgData,
    media,
    filedOrder,
  ]);

  const handleAddSectionForm = (e) => {
    e.preventDefault();
    if (!newSectionName.trim()) {
      alert("نام بخش نمی‌تواند خالی باشد.");
      return;
    }

    const type = newSectionType;

    if (type === "text") {
      setDynamicSections([
        ...dynamicSections,
        { sectionName: newSectionName, type: "text", items: [{ name: "" }] },
      ]);
    } else if (type === "image") {
      setDynamicSections([
        ...dynamicSections,
        {
          sectionName: newSectionName,
          type: "image",
          items: [{ name: "", src: "" }],
        },
      ]);
    }

    // Reset the form
    setNewSectionName("");
    setNewSectionType("text");
  };

  // Handle Removing a Section
  const handleRemoveSection = (sectionIndex) => {
    if (dynamicSections.length > 1) {
      setDynamicSections(dynamicSections.filter((_, i) => i !== sectionIndex));
    }
  };

  // Handle Adding an Item to a Section
  const handleAddItem = (sectionIndex) => {
    const updatedSections = dynamicSections.map((section, sIdx) => {
      if (sIdx === sectionIndex) {
        if (section.type === "image") {
          return {
            ...section,
            items: [...section.items, { name: "", src: "" }],
          };
        } else {
          return { ...section, items: [...section.items, { name: "" }] };
        }
      }
      return section;
    });
    setDynamicSections(updatedSections);
  };

  // Handle Removing an Item from a Section
  const handleRemoveItem = (sectionIndex, itemIndex) => {
    const updatedSections = dynamicSections.map((section, sIdx) => {
      if (sIdx === sectionIndex) {
        const updatedItems = section.items.filter(
          (_, iIdx) => iIdx !== itemIndex
        );
        return { ...section, items: updatedItems };
      }
      return section;
    });
    setDynamicSections(updatedSections);
  };

  // Handle Changing Section Name
  const handleSectionNameChange = (e, sectionIndex) => {
    const updatedSections = dynamicSections.map((section, sIdx) => {
      if (sIdx === sectionIndex) {
        return { ...section, sectionName: e.target.value };
      }
      return section;
    });
    setDynamicSections(updatedSections);
  };

  // Handle Changing Item Name
  const handleItemNameChange = (e, sectionIndex, itemIndex) => {
    const updatedSections = dynamicSections.map((section, sIdx) => {
      if (sIdx === sectionIndex) {
        const updatedItems = section.items.map((item, iIdx) => {
          if (iIdx === itemIndex) {
            return { ...item, name: e.target.value };
          }
          return item;
        });
        return { ...section, items: updatedItems };
      }
      return section;
    });
    setDynamicSections(updatedSections);
  };

  // Handle File Changes for imgData
  const handleImgDataChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImgData = imgData.map((item, iIdx) => {
        if (iIdx === index) {
          return { ...item, src: file };
        }
        return item;
      });
      setImgData(updatedImgData);
    }
  };

  const handlePosterChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImgData = imgData.map((item, iIdx) => {
        if (iIdx === index) {
          return { ...item, poster: file };
        }
        return item;
      });
      setImgData(updatedImgData);
    }
  };

  // Handlers to Add/Remove ImgData and Media Items
  const handleAddImgData = () => {
    setImgData([...imgData, { src: "", type: "1", poster: "" }]);
  };

  const handleRemoveImgData = (index) => {
    if (imgData.length > 1) {
      setImgData(imgData.filter((_, i) => i !== index));
    }
  };

  const handleAddMedia = () => {
    setMedia([...media, { title: "", description: "", src: "", poster: "" }]);
  };

  const handleAddFileds = () => {
    setFiledOrder([
      ...filedOrder,
      { type: "text", name: "", dropDownOP: [""] },
    ]);
  };

  const handleRemoveMedia = (index) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleRemoveFileds = (index) => {
    setFiledOrder(filedOrder.filter((_, i) => i !== index));
  };

  // Handle Form Submission with Confirmation Modal
  const areYouShureFunction = (e) => {
    e.preventDefault();
    setOpenModal(true);
  };

  // Close Confirm Modal After Timeout
  function closeModalOnTimeout() {
    setTimeout(() => {
      setOpenModal2(false);
      setActiveKey("editUserPage");
    }, 3000);
  }

  // Handler to Add a New Dropdown Option
  const handleAddDropDownOption = (fieldIndex) => {
    const updatedFiledOrder = [...filedOrder];
    updatedFiledOrder[fieldIndex].dropDownOP.push("");
    setFiledOrder(updatedFiledOrder);
  };

  // Handler to Remove a Dropdown Option
  const handleRemoveDropDownOption = (fieldIndex, optionIndex) => {
    const updatedFiledOrder = [...filedOrder];
    updatedFiledOrder[fieldIndex].dropDownOP.splice(optionIndex, 1);
    setFiledOrder(updatedFiledOrder);
  };

  // Handle Final Form Submission
  const handleSubmit = async () => {
    try {
      setLoadingConfirmModal(true);
      // Upload dynamic sections
      const uploadedSections = await Promise.all(
        dynamicSections.map(async (section) => {
          const uploadedItems = await Promise.all(
            section.items.map(async (item) => {
              let uploadedItem = { ...item };

              if (
                section.type === "image" &&
                typeof item.src === "object" &&
                item.src
              ) {
                const tag = name;
                const type = 1; // Assuming type 1 for images
                const isPublic = true;
                const file = item.src;

                const fileId = await dispatch(
                  uploadFile({ file, tag, type, isPublic })
                ).unwrap();

                uploadedItem.src = fileId;
              }

              return uploadedItem;
            })
          );

          return {
            sectionName: section.sectionName,
            type: section.type,
            items: uploadedItems,
          };
        })
      );

      // Upload imgData
      const uploadedImgData = await Promise.all(
        imgData.map(async (item) => {
          let updatedItem = { ...item };

          if (typeof item.src === "object" && item.src) {
            const tag = name;
            const type = item.type;
            const isPublic = true;
            const file = item.src;

            const fileId = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();

            updatedItem.src = fileId;
          }

          if (typeof item.poster === "object" && item.poster) {
            const tag = name;
            const type = 1; // Assuming type 1 is for posters
            const isPublic = true;
            const file = item.poster;

            const fileId = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();

            updatedItem.poster = fileId;
          }

          return updatedItem;
        })
      );

      // Upload media
      const uploadedMedia = await Promise.all(
        media.map(async (item) => {
          let updatedItem = { ...item };

          if (typeof item.src === "object" && item.src) {
            const tag = name;
            const type = 2; // Assuming type 2 for media
            const isPublic = true;
            const file = item.src;

            const fileIdSrc = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();

            updatedItem.src = fileIdSrc;
          }

          if (typeof item.poster === "object" && item.poster) {
            const tag = name;
            const type = 1;
            const isPublic = true;
            const file = item.poster;

            const fileIdPoster = await dispatch(
              uploadFile({ file, tag, type, isPublic })
            ).unwrap();

            updatedItem.poster = fileIdPoster;
          }

          return updatedItem;
        })
      );

      // Create the info object with all fields
      const info = {
        title,
        subtitle,
        subtitleCompelete,
        sections: uploadedSections,
        imgData: uploadedImgData, // Use uploaded image data with IDs
      };

      // Create the final product object
      const productData = {
        name,
        navId: selectedNavId,
        info,
        media: uploadedMedia,
        filedOrder,
      };

      // Dispatch the final product submission
      const dataConfirmComing = await dispatch(
        productpot(productData)
      ).unwrap();
      if (dataConfirmComing) {
        setOpenModal2(true);
        closeModalOnTimeout();
        // Reset form if needed
        setSelectedNavId("");
        setName("");
        setTitle("");
        setSubtitle("");
        setSubtitleCompelete("");
        setDynamicSections([]);
        setImgData([{ src: "", type: "1", poster: "" }]);
        setMedia([{ title: "", description: "", src: "", poster: "" }]);
        setFiledOrder([{ type: "", name: "", dropDownOP: "" }]);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      setOpenModal3(true);
    } finally {
      setLoadingConfirmModal(false);
      setDataUpdated(true);
    }
  };

  return (
    <div className="container">
      <p className="QASize text-center mb-4 mt-2">افزودن محصول</p>
      <form onSubmit={areYouShureFunction}>
        {/* Product Selection Dropdown */}
        <div className="d-flex flex-row align-items-center gap-2">
          <label
            style={{ whiteSpace: "nowrap" }}
            className="seeOrderFont"
            htmlFor="productSelect"
          >
            انتخاب محصول :
          </label>
          <SelectWidth
            id="productSelect"
            value={selectedNavId}
            onChange={(e) => {
              const selectedItem = availableItems.find(
                (item) => item.id.toString() === e.target.value
              );
              setSelectedNavId(e.target.value);
              setName(selectedItem ? selectedItem.title : "");
            }}
            required
          >
            <option value="" disabled>
              انتخاب کنید
            </option>
            {availableItems.map((item, index) => (
              <option key={index} value={item.id}>
                {item.title}
              </option>
            ))}
          </SelectWidth>
        </div>

        {/* Short Description */}
        <div className="d-flex flex-row align-items-center gap-2 mt-3">
          <label
            style={{ whiteSpace: "nowrap" }}
            className="seeOrderFont"
            htmlFor="bannerDate"
          >
            شرح مختصر :
          </label>
          <input
            type="text"
            id="bannerDate"
            className="w-100 form-control"
            placeholder="حداکثر 100 کلمه"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Subtitle Field */}
        <div className="d-flex flex-row align-items-center gap-2 mt-3">
          <label
            style={{ whiteSpace: "nowrap" }}
            className="seeOrderFont"
            htmlFor="bannerTags"
          >
            توضیحات :
          </label>
          <input
            type="text"
            id="bannerTags"
            className="w-100 form-control"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            required
          />
        </div>

        {/* Complete Subtitle Field */}
        <div className="d-flex flex-row align-items-center gap-2 mt-3 mb-3">
          <label
            style={{ whiteSpace: "nowrap" }}
            className="seeOrderFont"
            htmlFor="DiscriptionCompelete"
          >
            توضیحات تکمیلی :
          </label>
          <textarea
            type="text"
            id="DiscriptionCompelete"
            className="w-100 form-control"
            value={subtitleCompelete}
            onChange={(e) => setSubtitleCompelete(e.target.value)}
            required
          />
        </div>

        {/* Navigation Tabs */}
        <NavTabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          id="admin-tabs1"
          className={`seeOrderFont mt-3 mb-3`}
        >
          <Tab eventKey="discrib" title={<>مشخصه محصول</>}></Tab>
          <Tab eventKey="info" title={<>تصویر / فیلم</>}></Tab>
          <Tab eventKey="media" title={<>افکت ها</>}></Tab>
          <Tab eventKey="fileds" title={<>فیلد سفارش</>}></Tab>
        </NavTabs>

        {/* Discrib Tab Content */}
        {activeTab === "discrib" && (
          <div>
            {/* Add Section Form */}
            <AddSectionForm>
              <HeaderEachSection className="NormalTextSizing d-flex flex-row align-items-center justify-content-between">
                <p>مشخصه</p>
                <div className="d-flex justify-content-end">
                  <ButtonAddSection
                    className="bg-success text-white px-2 py-1 rounded"
                    type="button"
                    onClick={handleAddSectionForm}
                  >
                    اضافه کردن بخش
                  </ButtonAddSection>
                </div>
              </HeaderEachSection>
              <InsideAddSectionForm className="d-flex flex-column gap-3">
                <div className="d-flex flex-column gap-1">
                  <label
                    htmlFor="newSectionName"
                    className="NormalTextSizing"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    نام مشخصه:
                  </label>
                  <input
                    type="text"
                    id="newSectionName"
                    value={newSectionName}
                    onChange={(e) => setNewSectionName(e.target.value)}
                    placeholder="نام بخش"
                    className="form-control w-100"
                  />
                </div>
                {/* <div className="d-flex flex-row gap-2 mt-3 align-items-center">
                  <label
                    htmlFor="newSectionType"
                    className="NormalTextSizing"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    نوع بخش:
                  </label>
                  <select
                    id="newSectionType"
                    value={newSectionType}
                    onChange={(e) => setNewSectionType(e.target.value)}
                    className="w-50"
                    required
                  >
                    <option value="text">متن</option>
                    <option value="image">تصویر</option>
                  </select>
                </div> */}
                <div>
                  <ButtonAddSection
                    className="bg-success text-white px-2 py-1 rounded"
                    type="button"
                    onClick={() => setModalthings(true)}
                  >
                    تعریف مقدار مشخصه
                  </ButtonAddSection>
                  <Modal
                    open={modalthings}
                    onClose={handleCloseModalThings}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={modalStyle}>
                      <HeaderModalShowAccessMainDiv className="d-flex flex-row justify-content-between align-items-center">
                        <p className="NormalTextSizing HeaderModalShowAccess">
                          دسترسی ها
                        </p>
                        <CustomCloseButton
                          onClick={handleCloseModalThings}
                          color={`#e91e63`}
                        />
                      </HeaderModalShowAccessMainDiv>
                      <div className="d-flex flex-column gap-2 justify-content-center align-items-center p-3">
                        <p>awpidierf</p>
                      </div>
                    </Box>
                  </Modal>
                </div>
              </InsideAddSectionForm>
            </AddSectionForm>

            {/* Dynamic Sections */}
            {dynamicSections.map((section, sectionIndex) => (
              <BorderInputBox className="mt-2" key={sectionIndex}>
                <div className="d-flex flex-row justify-content-between align-items-center mb-3">
                  <HeaderEachSection className="d-flex flex-row align-items-center gap-2">
                    <div className="d-flex flex-row align-items-center justify-content-between w-100">
                      <div className="d-flex flex-row align-items-center gap-2">
                        <label
                          htmlFor={`sectionName-${sectionIndex}`}
                          className="NormalTextSizing"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          لیست مشخصه ها:
                        </label>
                        <input
                          type="text"
                          id={`sectionName-${sectionIndex}`}
                          placeholder="نام بخش"
                          value={section.sectionName}
                          onChange={(e) =>
                            handleSectionNameChange(e, sectionIndex)
                          }
                          required
                          className="form-control "
                        />
                      </div>

                      {dynamicSections.length > 1 && (
                        <div>
                          <ButtonCancelOrder
                            className="px-2 py-1 rounded"
                            type="button"
                            onClick={() => handleRemoveSection(sectionIndex)}
                          >
                            حذف بخش
                          </ButtonCancelOrder>
                        </div>
                      )}
                    </div>
                  </HeaderEachSection>
                </div>

                <DivAdjustColorDivs
                  columns="repeat(2, 1fr)"
                  recolumns="repeat(1, 1fr)"
                >
                  {section.items.map((item, itemIndex) => (
                    <div
                      style={{ height: "fit-content" }}
                      className="d-flex flex-column gap-2 mb-3"
                      key={itemIndex}
                    >
                      <div className="d-flex flex-column align-items-center gap-2">
                        <div className="d-flex flex-column w-100">
                          <div className="d-flex flex-row align-items-center gap-2">
                            <label
                              htmlFor="ItemInsideName"
                              style={{ whiteSpace: "nowrap" }}
                            >
                              نام ایتم :
                            </label>
                            <input
                              type="text"
                              id="ItemInsideName"
                              placeholder="نام آیتم"
                              value={item.name}
                              onChange={(e) =>
                                handleItemNameChange(e, sectionIndex, itemIndex)
                              }
                              className="flex-grow-1 form-control"
                              required
                            />
                            <ButtonCancelOrder
                              className=" px-2 py-1 rounded"
                              style={{ width: "fit-content" }}
                              type="button"
                              onClick={() =>
                                handleRemoveItem(sectionIndex, itemIndex)
                              }
                            >
                              حذف
                            </ButtonCancelOrder>
                          </div>
                          <div>
                            {section.type === "image" && (
                              <div className="mt-3">
                                {!item.src && (
                                  <label
                                    className="labelInsteadOfInput"
                                    htmlFor={`section-${sectionIndex}-item-${itemIndex}`}
                                  >
                                    <div className="d-flex flex-column text-center p-1">
                                      <div>
                                        <svg
                                          width={21}
                                          height={21}
                                          viewBox="0 0 18 18"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M2.25 11.25C2.25 13.3713 2.25 14.432 2.909 15.091C3.568 15.75 4.629 15.75 6.75 15.75H11.25C13.3713 15.75 14.432 15.75 15.091 15.091C15.75 14.432 15.75 13.3713 15.75 11.25"
                                            stroke="#404040"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          <path
                                            d="M9 12V2.25M9 2.25L12 5.53125M9 2.25L6 5.53125"
                                            stroke="#404040"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </div>

                                      <p
                                        className={`colorTheInputFile discription`}
                                      >
                                        بارگذاری فایل .png یا .jpg
                                      </p>
                                      <p
                                        className={`colorTheInputFile discription`}
                                      >
                                        حداکثر تا 5 مگابایت
                                      </p>
                                    </div>
                                  </label>
                                )}
                                <input
                                  type="file"
                                  className="d-none"
                                  id={`section-${sectionIndex}-item-${itemIndex}`}
                                  accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
                                  onChange={(e) =>
                                    handleSectionFileChange(
                                      e,
                                      sectionIndex,
                                      itemIndex
                                    )
                                  }
                                  required={section.type === "image"}
                                />

                                {section.type === "image" && item.src && (
                                  <div className="d-flex flex-column align-items-center">
                                    <BOX
                                      component="img"
                                      src={URL.createObjectURL(item.src)}
                                      alt="ItemImage"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </DivAdjustColorDivs>
                <div className="d-flex justify-content-end mb-3 ms-3">
                  <ButtonAddSection
                    className="bg-success text-white px2 py-1 rounded mt-2"
                    type="button"
                    onClick={() => handleAddItem(sectionIndex)}
                  >
                    اضافه کردن آیتم
                  </ButtonAddSection>
                </div>
              </BorderInputBox>
            ))}
          </div>
        )}

        {/* Info Tab Content */}
        {activeTab === "info" && (
          <div>
            {/* Image and Video Section */}
            <BorderInputBox className="mt-3">
              <HeaderEachSection className="NormalTextSizing d-flex flex-row align-items-center justify-content-between">
                <p>عکس ها و فیلم های محصول :</p>
                <div className="d-flex justify-content-end ">
                  <ButtonAddSection
                    className=" ms-3 bg-success text-white px-2 py-1 rounded"
                    type="button"
                    onClick={handleAddImgData}
                  >
                    اضافه کردن
                  </ButtonAddSection>
                </div>
              </HeaderEachSection>
              <DivAdjustColorDivs columns="repeat(2, 1fr)">
                {imgData.map((item, index) => (
                  <div
                    style={{ height: "fit-content" }}
                    className="d-flex flex-row gap-2 flex-wrap mt-2 align-items-center justify-content-between"
                    key={index}
                  >
                    <DivAdjustGrodimageMedia className="mb-2 me-2 ms-2">
                      <DivHeaderInfoMedia className="d-flex justify-content-between">
                        <select
                          value={item.type}
                          onChange={(e) =>
                            setImgData(
                              imgData.map((img, iIdx) =>
                                iIdx === index
                                  ? { ...img, type: e.target.value }
                                  : img
                              )
                            )
                          }
                          required
                        >
                          <option value={1}>عکس</option>
                          <option value={2}>فیلم</option>
                        </select>
                        <ButtonCancelOrder
                          className="px-2 py-1 rounded"
                          style={{ width: "fit-content" }}
                          type="button"
                          onClick={() => handleRemoveImgData(index)}
                        >
                          حذف
                        </ButtonCancelOrder>
                      </DivHeaderInfoMedia>

                      <div className="p-2">
                        <div className="d-flex flex-column w-100">
                          <span className="mb-1 NormalTextSizing">
                            عکس یا فیلم
                          </span>
                          {item?.src === "" ? (
                            <>
                              <label
                                className="labelInsteadOfInput"
                                htmlFor={`ImageVideoForProduct-${index}`}
                              >
                                <div className="d-flex flex-column text-center p-1">
                                  <div>
                                    <svg
                                      width={21}
                                      height={21}
                                      viewBox="0 0 18 18"
                                      fill="none"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        d="M2.25 11.25C2.25 13.3713 2.25 14.432 2.909 15.091C3.568 15.75 4.62868 15.75 6.75 15.75H11.25C13.3713 15.75 14.432 15.75 15.091 15.091C15.75 14.432 15.75 13.3713 15.75 11.25"
                                        stroke="#404040"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                      <path
                                        d="M9 12V2.25M9 2.25L12 5.53125M9 2.25L6 5.53125"
                                        stroke="#404040"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </div>
                                  <p
                                    className={`colorTheInputFile discription`}
                                  >
                                    بارگذاری فایل .png یا .jpg
                                  </p>
                                  <p
                                    className={`colorTheInputFile discription`}
                                  >
                                    یا فیلم mp4
                                  </p>
                                </div>
                              </label>
                              <input
                                type="file"
                                className="d-none"
                                id={`ImageVideoForProduct-${index}`}
                                accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_AND_VIDEO_FORMAT}`}
                                onChange={(e) => handleImgDataChange(e, index)}
                                required
                              />
                            </>
                          ) : (
                            <>
                              <div
                                className="d-flex flex-column"
                                style={{ width: "fit-content" }}
                              >
                                {item.type === "2" ? (
                                  <BOX
                                    style={{
                                      maxWidth: "unset",
                                      maxHeight: "unset",
                                    }}
                                    component="video"
                                    src={URL.createObjectURL(item.src)}
                                    controls
                                  />
                                ) : (
                                  <BOX
                                    style={{
                                      maxWidth: "unset",
                                      maxHeight: "unset",
                                    }}
                                    component="img"
                                    src={URL.createObjectURL(item.src)}
                                    alt="ProductImage"
                                  />
                                )}
                              </div>
                            </>
                          )}
                        </div>
                        {item.type === "2" && (
                          <div className="d-flex flex-column w-100">
                            <span className="mb-1 NormalTextSizing">
                              پوستر فیلم :
                            </span>
                            {item?.poster === "" ? (
                              <>
                                <label
                                  className="labelInsteadOfInput"
                                  htmlFor={`posterFilm-${index}`}
                                >
                                  <div className="d-flex flex-column text-center p-1">
                                    <div>
                                      <svg
                                        width={21}
                                        height={21}
                                        viewBox="0 0 18 18"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                      >
                                        <path
                                          d="M2.25 11.25C2.25 13.3713 2.25 14.432 2.909 15.091C3.568 15.75 4.62868 15.75 6.75 15.75H11.25C13.3713 15.75 14.432 15.75 15.091 15.091C15.75 14.432 15.75 13.3713 15.75 11.25"
                                          stroke="#404040"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                        <path
                                          d="M9 12V2.25M9 2.25L12 5.53125M9 2.25L6 5.53125"
                                          stroke="#404040"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        />
                                      </svg>
                                    </div>
                                    <p
                                      className={`colorTheInputFile discription`}
                                    >
                                      بارگذاری فایل .png یا .jpg
                                    </p>
                                    <p
                                      className={`colorTheInputFile discription`}
                                    >
                                      حداکثر تا 5 مگابایت
                                    </p>
                                  </div>
                                </label>
                                <input
                                  type="file"
                                  className="d-none"
                                  id={`posterFilm-${index}`}
                                  accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
                                  onChange={(e) => handlePosterChange(e, index)}
                                  required
                                />
                              </>
                            ) : (
                              <>
                                <div
                                  className="d-flex flex-column"
                                  style={{ width: "fit-content" }}
                                >
                                  <BOX
                                    style={{
                                      maxWidth: "unset",
                                      maxHeight: "unset",
                                    }}
                                    component="img"
                                    src={URL.createObjectURL(item.poster)}
                                    alt="PosterImage"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </DivAdjustGrodimageMedia>
                  </div>
                ))}
              </DivAdjustColorDivs>
            </BorderInputBox>
          </div>
        )}

        {/* Media Tab Content */}
        {activeTab === "media" && (
          <div>
            {/* Media Section */}
            <BorderInputBox>
              <HeaderEachSection className="NormalTextSizing d-flex flex-row align-items-center justify-content-between">
                <p>فیلم ها:</p>
                <div className="d-flex justify-content-end">
                  <ButtonAddSection
                    className="ms-2 bg-success text-white px-2 py-1 rounded"
                    type="button"
                    onClick={handleAddMedia}
                  >
                    اضافه کردن ویدیو
                  </ButtonAddSection>
                </div>
              </HeaderEachSection>

              <DivAdjustColorDivs
                style={{ width: "100%", padding: "20px" }}
                columns="repeat(1, 1fr)"
              >
                {media.map((item, index) => (
                  <>
                    <MediaDivMainGrid className="mt-2" key={index}>
                      <DivHeaderInfoMedia className="d-flex justify-content-end">
                        <ButtonCancelOrder
                          className="px-2 py-1 rounded"
                          style={{ width: "fit-content" }}
                          type="button"
                          onClick={() => handleRemoveMedia(index)}
                        >
                          حذف
                        </ButtonCancelOrder>
                      </DivHeaderInfoMedia>

                      <div className="p-3">
                        <div className="d-flex flex-row gap-3">
                          <DivAdjustColorDivs
                            columns="repeat(1, 1fr)"
                            className="w-50"
                          >
                            <div className="d-flex flex-column">
                              <span className="NormalTextSizing">فیلم :</span>
                              {item?.src === "" ? (
                                <>
                                  <label
                                    className="labelInsteadOfInput"
                                    htmlFor={`MediaVideo-${index}`}
                                  >
                                    <div className="d-flex flex-column text-center p-1">
                                      <div>
                                        <svg
                                          width={21}
                                          height={21}
                                          viewBox="0 0 18 18"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M2.25 11.25C2.25 13.3713 2.25 14.432 2.909 15.091C3.568 15.75 4.62868 15.75 6.75 15.75H11.25C13.3713 15.75 14.432 15.75 15.091 15.091C15.75 14.432 15.75 13.3713 15.75 11.25"
                                            stroke="#404040"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          <path
                                            d="M9 12V2.25M9 2.25L12 5.53125M9 2.25L6 5.53125"
                                            stroke="#404040"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </div>

                                      <p
                                        className={`colorTheInputFile discription`}
                                      >
                                        فیلم mp4
                                      </p>
                                    </div>
                                  </label>
                                  <input
                                    type="file"
                                    className="d-none"
                                    id={`MediaVideo-${index}`}
                                    accept={`${process.env.NEXT_PUBLIC_INPUT_VIDEO_FORMAT}`}
                                    onChange={(e) =>
                                      setMedia(
                                        media.map((m, iIdx) =>
                                          iIdx === index
                                            ? { ...m, src: e.target.files[0] }
                                            : m
                                        )
                                      )
                                    }
                                    required
                                  />
                                </>
                              ) : (
                                <>
                                  <div
                                    className="d-flex flex-column"
                                    style={{ width: "fit-content" }}
                                  >
                                    <BOX
                                      component="video"
                                      src={URL.createObjectURL(item.src)}
                                      controls
                                    />
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="d-flex flex-column">
                              <span className="NormalTextSizing">
                                پوستر فیلم :
                              </span>
                              {item?.poster === "" ? (
                                <>
                                  <label
                                    className="labelInsteadOfInput"
                                    htmlFor={`PosterVideo-${index}`}
                                  >
                                    <div className="d-flex flex-column text-center p-1">
                                      <div>
                                        <svg
                                          width={21}
                                          height={21}
                                          viewBox="0 0 18 18"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M2.25 11.25C2.25 13.3713 2.25 14.432 2.909 15.091C3.568 15.75 4.62868 15.75 6.75 15.75H11.25C13.3713 15.75 14.432 15.75 15.091 15.091C15.75 14.432 15.75 13.3713 15.75 11.25"
                                            stroke="#404040"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          <path
                                            d="M9 12V2.25M9 2.25L12 5.53125M9 2.25L6 5.53125"
                                            stroke="#404040"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </div>
                                      <p
                                        className={`colorTheInputFile discription`}
                                      >
                                        بارگذاری فایل .png یا .jpg
                                      </p>
                                      <p
                                        className={`colorTheInputFile discription`}
                                      >
                                        حداکثر تا 5 مگابایت
                                      </p>
                                    </div>
                                  </label>
                                  <input
                                    type="file"
                                    className="d-none"
                                    id={`PosterVideo-${index}`}
                                    accept={`${process.env.NEXT_PUBLIC_INPUT_IMAGE_FORMAT}`}
                                    onChange={(e) =>
                                      setMedia(
                                        media.map((m, iIdx) =>
                                          iIdx === index
                                            ? {
                                                ...m,
                                                poster: e.target.files[0],
                                              }
                                            : m
                                        )
                                      )
                                    }
                                    required
                                  />
                                </>
                              ) : (
                                <>
                                  <div
                                    className="d-flex flex-column"
                                    style={{ width: "fit-content" }}
                                  >
                                    <BOX
                                      component="img"
                                      src={URL.createObjectURL(item.poster)}
                                      alt="PosterImage"
                                    />
                                  </div>
                                </>
                              )}
                            </div>
                          </DivAdjustColorDivs>

                          <div className="d-flex flex-row align-items-center gap-3 flex-wrap w-50">
                            <div className="d-flex flex-column gap-1 w-100">
                              <label
                                htmlFor="OnvanFilm"
                                className="NormalTextSizing"
                              >
                                عنوان
                              </label>
                              <input
                                id="OnvanFilm"
                                // style={{ width: "45%" }}
                                type="text"
                                placeholder="عنوان فیلم"
                                value={item.title}
                                onChange={(e) =>
                                  setMedia(
                                    media.map((m, iIdx) =>
                                      iIdx === index
                                        ? { ...m, title: e.target.value }
                                        : m
                                    )
                                  )
                                }
                                required
                                className="form-control"
                              />
                            </div>
                            <div className="d-flex flex-column gap-1 w-100">
                              <label
                                htmlFor="OnvanFilm"
                                className="NormalTextSizing"
                              >
                                توضیحات
                              </label>
                              <input
                                // style={{ width: "45%" }}
                                type="text"
                                placeholder="توضیحات"
                                value={item.description}
                                onChange={(e) =>
                                  setMedia(
                                    media.map((m, iIdx) =>
                                      iIdx === index
                                        ? { ...m, description: e.target.value }
                                        : m
                                    )
                                  )
                                }
                                required
                                className="form-control"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </MediaDivMainGrid>
                  </>
                ))}
              </DivAdjustColorDivs>
            </BorderInputBox>
          </div>
        )}

        {/* filed Tab Content */}
        {activeTab === "fileds" && (
          <div>
            <BorderInputBox>
              <HeaderEachSection className="NormalTextSizing d-flex flex-row align-items-center justify-content-between">
                <p>فیلد ها:</p>

                <div className="d-flex justify-content-end">
                  <ButtonAddSection
                    className="ms-2 bg-success text-white px-2 py-1 rounded"
                    type="button"
                    onClick={handleAddFileds}
                  >
                    اضافه کردن
                  </ButtonAddSection>
                </div>
              </HeaderEachSection>

              <DivAdjustColorDivs
                className="p-2"
                style={{ width: "100%" }}
                columns="repeat(1, 1fr)"
              >
                {filedOrder.map((item, index) => (
                  <div
                    className="mt-2 d-flex flex-column gap-3 divBorderFileds"
                    key={index}
                  >
                    <div className="d-flex  flex-row align-items-center gap-3">
                      <select
                        value={item.type}
                        onChange={(e) =>
                          setFiledOrder(
                            filedOrder.map((f, iIdx) =>
                              iIdx === index
                                ? {
                                    ...f,
                                    type: e.target.value,
                                    dropDownOP: [""],
                                  }
                                : f
                            )
                          )
                        }
                        required
                        className="mt-2 mb-1 w-50"
                      >
                        <option value="text">متن</option>
                        <option value="dropDown">دراپ دون</option>
                      </select>
                      <input
                        style={{ width: "45%" }}
                        type="text"
                        placeholder="عنوان فیلد"
                        value={item.name}
                        onChange={(e) =>
                          setFiledOrder(
                            filedOrder.map((f, iIdx) =>
                              iIdx === index
                                ? { ...f, name: e.target.value }
                                : f
                            )
                          )
                        }
                        required
                        className="form-control"
                      />
                      <ButtonCancelOrder
                        className=" px-2 py-1 rounded"
                        type="button"
                        style={{ width: "fit-content" }}
                        onClick={() => handleRemoveFileds(index)}
                      >
                        حذف
                      </ButtonCancelOrder>
                    </div>

                    {item.type === "dropDown" && (
                      <div className="d-flex flex-column dropDownSpecoficStyle gap-2">
                        <div className="d-flex flex-row align-items-center justify-content-between dropDownSpecoficStyleHeader">
                          <label
                            htmlFor={`dropDownOP-${index}`}
                            className="form-label NormalTextSizing"
                            style={{ whiteSpace: "nowrap" }}
                          >
                            گزینه‌های دراپ دون:
                          </label>
                          <button
                            type="button"
                            className="NormalTextSizing"
                            style={{
                              backgroundColor: "#43A047",
                              width: "fit-content",
                            }}
                            onClick={() => handleAddDropDownOption(index)}
                          >
                            اضافه کردن گزینه
                          </button>
                        </div>

                        <ResponsiveDivFileds
                          className="mt-2 mb-2 p-2"
                          columns="repeat(2, 1fr)"
                        >
                          {item.dropDownOP.map((option, optIndex) => (
                            <div
                              className="d-flex flex-row align-items-center gap-2 mb-2"
                              key={optIndex}
                            >
                              <input
                                type="text"
                                placeholder={`گزینه ${optIndex + 1}`}
                                value={option}
                                onChange={(e) => {
                                  const updatedFiledOrder = [...filedOrder];
                                  updatedFiledOrder[index].dropDownOP[
                                    optIndex
                                  ] = e.target.value;
                                  setFiledOrder(updatedFiledOrder);
                                }}
                                required
                                className="form-control"
                              />
                              {item.dropDownOP.length > 1 && (
                                <ButtonCancelOrder
                                  type="button"
                                  className=" px-2 py-1 rounded"
                                  onClick={() =>
                                    handleRemoveDropDownOption(index, optIndex)
                                  }
                                >
                                  حذف
                                </ButtonCancelOrder>
                              )}
                            </div>
                          ))}
                        </ResponsiveDivFileds>
                      </div>
                    )}
                  </div>
                ))}
              </DivAdjustColorDivs>
            </BorderInputBox>
          </div>
        )}

        {/* Submit Button */}
        <div className="d-flex flex-row align-items-center justify-content-between">
          <button
            type="submit"
            className="mt-3 mb-3 text-white px-4 py-2 rounded"
            disabled={disableConfirm}
            style={{
              backgroundColor: disableConfirm ? "lightgray" : "#43A047",
              cursor: disableConfirm ? "not-allowed" : "pointer",
            }}
          >
            اضافه کردن محصول
          </button>
          <ButtonCancelOrder
            type="button"
            className="mt-3 mb-3 text-white px-3 py-2 rounded"
            onClick={() => setActiveKey("editUserPage")}
          >
            انصراف
          </ButtonCancelOrder>
        </div>

        {/* Confirmation Modals */}
        <AreYouShureModal
          open={openModal}
          onClose={closeModal}
          text={"ایا از اضافه کردن محصول مطمعن هستید"}
          func={handleSubmit}
          loading={loadingConfirmModal}
        />
        <ConfirmModal
          open={openModal2}
          onClose={closeModal2}
          text={"محصول با موفقیت اضافه شد"}
        />
        <ConfirmModal
          open={openModal3}
          onClose={closeModal3}
          text={"خطا در عملیات، لطفاً دوباره تلاش کنید"}
        />
      </form>
    </div>
  );
}
