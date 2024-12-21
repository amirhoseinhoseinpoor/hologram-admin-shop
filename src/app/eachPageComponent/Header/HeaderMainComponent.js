"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { HeaderList, headerEdit } from "@/app/Store/thunks";
import styled, { createGlobalStyle } from "styled-components";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
// Import base components
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
// Import modals
import ConfirmModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import CloseIcon from '@mui/icons-material/Close';

// Global styles to set box-sizing
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

// Styled components

const MainTitleDiv = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: row;
  .firstTwoInput {
    width: 65%;
    display: flex;
    flex-direction: row;
    input {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    .buttonMainHeaderCreate {
      width: fit-content;
      margin-top: 15px;
    }
    .firstTwoInput {
      width: 100%;
    }
  }
`;

const Container = styled.div`
  padding: 20px;
`;

const HeadermakeOrder = styled.div`
  padding: 10px;
  color: white;
  .textHeaderStyle {
    color: black;
  }

  @media (max-width: 980px) {
    .textHeaderStyle {
    }
  }
`;

const InputField = styled.input`
  padding: 10px;
  width: 36%;
  /* margin-right: 10px; */
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-image: ${(props) => {
    if (props.$secondary)
      return "linear-gradient(195deg, #42424a 0%, #191919 100%)";
    return "#28a745";
  }};

  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: ${(props) =>
    props.$danger || props.$secondary ? "10px" : "0px"};

  &:hover {
    opacity: 0.9;
  }
`;

const RemoveButtonStyle = styled.button`
  color: #e53935 !important;
  background-color: transparent !important;
  border: none;
  cursor: pointer;
`;

// حذف حاشیه از لیست‌های اصلی و زیر لیست‌ها
const HeaderListWrapper = styled.ul`
  list-style-type: none;
  padding-left: 0;
`;

const HeaderItem = styled.li`
  padding: 15px;
  margin-bottom: 20px; /* افزایش فاصله بین جعبه‌ها */
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  position: relative;
`;

const SubItemList = styled.ul`
  margin-top: 15px; /* افزایش فاصله بین جعبه اصلی و زیرجعبه */
  padding-right: 20px; 
  list-style-type: none;
`;

const SubItem = styled.li`
  padding: 10px;
  margin-bottom: 10px; /* فاصله بین زیر آیتم‌ها */
  background-color: #fff; /* تغییر رنگ پس‌زمینه */
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const StrongText = styled.strong`
  display: block;
  margin-bottom: 5px;
`;

const AddSubItemContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  gap : 10px;
  align-items: flex-start;
  @media (max-width : 980px) {
    flex-direction: column;
  }
  .addSubItemInput {
    width: 100%;
    margin-bottom: 10px;
  }
`;

export default function HeaderMainComponent({ toggleShow }) {
  const dispatch = useDispatch();

  const [headerData, setHeaderData] = useState([]);
  const [newItem, setNewItem] = useState({ title: "", link: "", subItems: [] });
  const [newSubItem, setNewSubItem] = useState({ title: "", link: "" });
  const [addSubItemPath, setAddSubItemPath] = useState(null); // Path where to show add sub-item input
  const [isRemovingHeader, setIsRemovingHeader] = useState(false); // Track if removing a header or sub-item

  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);

  const [selectedPath, setSelectedPath] = useState([]); // Store the selected sub-item path

  // Fetch header data from API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataComeAPI = await dispatch(HeaderList()).unwrap();
        setHeaderData(dataComeAPI?.content || []);
      } catch (error) {
        console.error("Error fetching header data:", error);
        setOpenModal3(true);
      }
    };

    fetchData();
  }, [dispatch]);

  // Handle input changes for new header item
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  // Handle input changes for new sub-item
  const handleSubInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubItem((prev) => ({ ...prev, [name]: value }));
  };

  // Add new header item
  const addItem = () => {
    if (newItem.title && newItem.link) {
      setHeaderData([...headerData, { ...newItem, subItems: [] }]);
      setNewItem({ title: "", link: "", subItems: [] });
    } else {
      setOpenModal2(true);
    }
  };

  // Recursive function to render sub-items
  const renderSubItems = (subItems, currentPath) => {
    return (
      <SubItemList>
        {subItems.map((subItem, subIndex) => {
          const newPath = [...currentPath, subIndex];
          const isAddSubItem =
            addSubItemPath &&
            addSubItemPath.length === newPath.length &&
            addSubItemPath.every((val, idx) => val === newPath[idx]);

          return (
            <React.Fragment key={subIndex}>
              <SubItem>
                <div className="d-flex flex-row align-items-center justify-content-between">
                  <div className="d-flex flex-row align-items-center gap-1">
                    <StrongText className="NormalTextSizing">{subItem.title}</StrongText>
                    <Button
                      type="button"
                      style={{
                        backgroundImage: "unset",
                        backgroundColor: "unset",
                        color: "#43A047",
                      }}
                      className="me-1"
                      $secondary
                      onClick={() => selectSubItemForSubItem(newPath)}
                    >
                      <AddCircleIcon />
                    </Button>
                  </div>

                  <RemoveButtonStyle
                    onClick={() => openRemoveModal(newPath, false)}
                  >
                    <DeleteIcon className="text-danger" />
                  </RemoveButtonStyle>
                </div>

                {/* Render add sub-item input below this sub-item if path matches */}
                {isAddSubItem && (
                  <AddSubItemContainer className="container">
                    <InputField
                      className="addSubItemInput"
                      type="text"
                      name="title"
                      placeholder="عنوان ساب ایتم"
                      value={newSubItem.title}
                      onChange={handleSubInputChange}
                    />
                    <InputField
                      className="addSubItemInput"
                      type="text"
                      name="link"
                      placeholder="لینک ساب ایتم"
                      value={newSubItem.link}
                      onChange={handleSubInputChange}
                    />
                    <div className="d-flex flex-row align-items-center">
                      <Button
                        type="button"
                        $secondary
                        onClick={() => addSubItem(newPath)}
                        style={{whiteSpace : "nowrap"}}
                      >
                        اضافه کردن
                      </Button>
                      <Button
                        type="button"
                        style={{
                          backgroundImage: "unset",
                          backgroundColor: "unset",
                          color: "#e53935",
                        }}
                        onClick={() => setAddSubItemPath(null)}
                      >
                        <CloseIcon className="text-danger" />
                      </Button>
                    </div>
                  </AddSubItemContainer>
                )}

                {/* Render nested sub-items recursively */}
                {subItem.subItems.length > 0 &&
                  renderSubItems(subItem.subItems, newPath)}
              </SubItem>
            </React.Fragment>
          );
        })}
      </SubItemList>
    );
  };

  // Open modal for sub-item or header removal
  const openRemoveModal = (path, isHeader) => {
    setSelectedPath(path); // Store the sub-item or header path
    setIsRemovingHeader(isHeader); // Track if we are removing a header or sub-item
    setOpenModal(true); // Open modal
    setAddSubItemPath(null); // Close any open add sub-item inputs
  };

  // Close modals
  const closeModalHandler = () => setOpenModal(false);
  const closeModal2Handler = () => setOpenModal2(false);
  const closeModal3Handler = () => setOpenModal3(false);

  function closeModalOnTimeout() {
    setTimeout(() => {
      setOpenModal3(false);
    }, 3000);
  }

  // Confirm sub-item or header removal
  const confirmRemove = () => {
    if (isRemovingHeader) {
      removeItem(selectedPath[0]); // Remove header
    } else {
      removeSubItem(selectedPath); // Remove sub-item
    }
    closeModalHandler(); // Close the modal
  };

  // Set addSubItemPath for adding sub-items
  const selectHeaderForSubItem = (index) => {
    setAddSubItemPath([index]);
    setNewSubItem({ title: "", link: "" });
  };

  const selectSubItemForSubItem = (path) => {
    setAddSubItemPath(path);
    setNewSubItem({ title: "", link: "" });
  };

  // Add new sub-item to the selected header or sub-item
  const addSubItem = (path) => {
    if (newSubItem.title && newSubItem.link) {
      const updatedHeader = [...headerData];
      let target = updatedHeader[path[0]];

      for (let i = 1; i < path.length; i++) {
        target = target.subItems[path[i]];
      }

      target.subItems.push({ ...newSubItem, subItems: [] });

      setHeaderData(updatedHeader);
      setNewSubItem({ title: "", link: "" });
      setAddSubItemPath(null);
    } else {
      setOpenModal2(true);
    }
  };

  // Remove a header item
  const removeItem = (index) => {
    const updatedHeader = headerData.filter((_, i) => i !== index);
    setHeaderData(updatedHeader);
  };

  // Remove a sub-item using the path
  const removeSubItem = (path) => {
    const updatedHeader = [...headerData];
    let target = updatedHeader[path[0]];

    for (let i = 1; i < path.length - 1; i++) {
      target = target.subItems[path[i]];
    }

    target.subItems = target.subItems.filter(
      (_, i) => i !== path[path.length - 1]
    );

    setHeaderData(updatedHeader);
  };

  // Submit the header data to the API
  const submitHeaderData = async () => {
    try {
      const finalDataSending = {
        content: headerData,
      };
      await dispatch(headerEdit({ header: finalDataSending })).unwrap();
      setOpenModal3(true);
      closeModalOnTimeout();
    } catch (error) {
      console.error("Error submitting header data:", error);
      setOpenModal3(true);
      closeModalOnTimeout();
    }
  };

  return (
    <>
      <GlobalStyle />
      <HeadermakeOrder className="d-flex flex-row mb-3 justify-content-between">
        <div className="d-block d-lg-none">
          <NavBarToggleBurgerButton func={() => toggleShow("main")} />
        </div>
        <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
          ساخت هدر
        </div>
        <ProfileComponent colorGet={"#191919"} />
      </HeadermakeOrder>
      <Container>
        {/* Input for new header item */}
        <MainTitleDiv>
          <div className="firstTwoInput">
            <InputField
              type="text"
              name="title"
              placeholder="عنوان هدر"
              value={newItem.title}
              onChange={handleInputChange}
            />
            <InputField
              type="text"
              name="link"
              placeholder="لینک هدر"
              value={newItem.link}
              onChange={handleInputChange}
            />
          </div>

          <Button
            type="button"
            className="me-2 buttonMainHeaderCreate"
            $secondary
            onClick={addItem}
          >
            اضافه کردن هدر اصلی
          </Button>
        </MainTitleDiv>

        {/* Render the current header structure */}
        <div>
          {headerData.length > 0 ? (
            <HeaderListWrapper>
              {headerData.map((item, index) => (
                <React.Fragment key={index}>
                  <HeaderItem>
                    <div className="d-flex flex-row align-items-center gap-1">
                      <StrongText className="NormalTextSizing">{item.title}</StrongText>
                      <Button
                        type="button"
                        className="me-1"
                        style={{
                          backgroundImage: "unset",
                          backgroundColor: "unset",
                          color: "#43A047",
                        }}
                        $secondary
                        onClick={() => selectHeaderForSubItem(index)}
                      >
                        <AddCircleIcon />
                      </Button>
                      <RemoveButtonStyle
                        onClick={() => openRemoveModal([index], true)}
                      >
                        حذف هدر اصلی
                      </RemoveButtonStyle>
                    </div>

                    {/* Render sub-items */}
                    {item.subItems.length > 0 &&
                      renderSubItems(item.subItems, [index])}

                    {/* Render add sub-item input below this header if path matches */}
                    {addSubItemPath &&
                      addSubItemPath.length === 1 &&
                      addSubItemPath[0] === index && (
                        <AddSubItemContainer>
                          <InputField
                            className="addSubItemInput"
                            type="text"
                            name="title"
                            placeholder="عنوان ساب ایتم"
                            value={newSubItem.title}
                            onChange={handleSubInputChange}
                          />
                          <InputField
                            className="addSubItemInput"
                            type="text"
                            name="link"
                            placeholder="لینک ساب ایتم"
                            value={newSubItem.link}
                            onChange={handleSubInputChange}
                          />
                          <div className="d-flex flex-row align-items-center">
                            <Button
                              type="button"
                              style={{whiteSpace : "nowrap"}}
                              $secondary
                              onClick={() => addSubItem([index])}
                            >
                              اضافه کردن
                            </Button>
                            <Button
                              type="button"
                              style={{
                                backgroundImage: "unset",
                                backgroundColor: "unset",
                                color: "#e53935",
                              }}
                              onClick={() => setAddSubItemPath(null)}
                            >
                              <CloseIcon className="text-danger" />
                            </Button>
                          </div>
                        </AddSubItemContainer>
                      )}
                  </HeaderItem>
                </React.Fragment>
              ))}
            </HeaderListWrapper>
          ) : (
            <p>هدر خود را بسازید</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="button"
          $secondary
          onClick={submitHeaderData}
          style={{ marginTop: "20px" }}
        >
          تایید هدر
        </Button>

        {/* Modal for confirming header or sub-item removal */}
        <AreYouShureModal
          open={openModal}
          onClose={closeModalHandler}
          func={confirmRemove}
          text={`از حذف ${isRemovingHeader ? "هدر" : "ساب ایتم"} مطمئن هستید؟`}
        />

        <ErrorModal
          open={openModal2}
          onClose={closeModal2Handler}
          text={"لطفا تایتل و لینک را وارد کنید"}
        />
        <ConfirmModal
          open={openModal3}
          onClose={closeModal3Handler}
          text={"هدر با موفقیت تغییر یافت"}
        />
      </Container>
    </>
  );
}
