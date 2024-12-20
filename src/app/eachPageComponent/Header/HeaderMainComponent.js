"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { HeaderList, headerEdit } from "@/app/Store/thunks";
import styled from "styled-components";
import DeleteIcon from "@mui/icons-material/Delete";
//import base components
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
// improt modals
import ConfirmModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";

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
  /* background-color: white; */
  padding: 10px;
  color: white;
  .textHeaderStyle {
    color: black;
  }

  @media (max-width: 980px) {
    /* background-color: rgb(26, 32, 53) !important; */
    .textHeaderStyle {
      /* color: white !important; */
    }
  }
`;

const InputField = styled.input`
  padding: 10px;
  width: 36%;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: ${(props) => {
    if (props.$danger) return "#dc3545"; // Red for remove buttons
    if (props.$secondary) return "#007bff"; // Blue for secondary actions
    return "#28a745"; // Green for add actions
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

// MUI Modal style
// const modalStyle = {
//   position: "absolute",
//   top: "50%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   width: 400,
//   bgcolor: "background.paper",
//   boxShadow: 24,
//   p: 4,
//   borderRadius: 2,
// };

const HeaderListWrapper = styled.ul`
  list-style-type: none;
  padding-left: 0;
`;

const HeaderItem = styled.li`
  padding: 15px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

const SubItemList = styled.ul`
  margin-left: 20px;
  margin-top: 10px;
  padding-left: 20px;
`;

const SubItem = styled.li`
  padding: 5px 0;
`;

const StrongText = styled.strong`
  display: block;
  margin-bottom: 5px;
`;

export default function HeaderMainComponent({ toggleShow }) {
  const dispatch = useDispatch();

  const [headerData, setHeaderData] = useState([]);
  const [newItem, setNewItem] = useState({ title: "", link: "", subItems: [] });
  const [newSubItem, setNewSubItem] = useState({ title: "", link: "" });
  const [activeHeaderIndex, setActiveHeaderIndex] = useState(null);
  const [nestedPath, setNestedPath] = useState([]);
  const [isRemovingHeader, setIsRemovingHeader] = useState(false); // Track if removing a header or sub-item

  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);

  const [selectedPath, setSelectedPath] = useState([]); // Store the selected sub-item path

  // Fetch header data from API on mount
  useEffect(() => {
    const fetchData = async () => {
      const dataComeAPI = await dispatch(HeaderList()).unwrap();
      setHeaderData(dataComeAPI?.content || []);
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
  const renderSubItems = (subItems, headerIndex, currentPath) => {
    return (
      <SubItemList>
        {subItems.map((subItem, subIndex) => {
          const newPath = [...currentPath, subIndex];
          return (
            <SubItem key={subIndex}>
              <div className="d-flex flex-row align-items-center">
                <StrongText>{subItem.title}</StrongText>
                <Button
                  style={{ background: "unset" }}
                  onClick={() => openRemoveModal(newPath, false)}
                >
                  <DeleteIcon className="text-danger" />
                </Button>
              </div>

              {/* Render nested sub-items recursively */}
              {subItem.subItems.length > 0 &&
                renderSubItems(subItem.subItems, headerIndex, newPath)}

              {/* Button to add sub-items recursively */}
              <Button
                className="me-1"
                $secondary
                onClick={() => selectSubItemForSubItem(headerIndex, newPath)}
              >
                اضافه کردن ساب ایتم به {subItem.title}
              </Button>
            </SubItem>
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
  };

  // Close modal
  const closeModal = () => setOpenModal(false);
  const closeModal2 = () => setOpenModal2(false);
  const closeModal3 = () => setOpenModal3(false);

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
      removeSubItem(activeHeaderIndex, selectedPath); // Remove sub-item
    }
    closeModal(); // Close the modal
  };

  // Set active header index for adding sub-items
  const selectHeaderForSubItem = (index) => {
    setActiveHeaderIndex(index);
    setNestedPath([]); // Reset path
  };

  // Set active sub-item path for adding nested sub-items
  const selectSubItemForSubItem = (headerIndex, path) => {
    setActiveHeaderIndex(headerIndex);
    setNestedPath(path);
  };

  // Add new sub-item to the selected header or sub-item
  const addSubItem = () => {
    if (newSubItem.title && newSubItem.link) {
      const updatedHeader = [...headerData];
      let target = updatedHeader[activeHeaderIndex];

      if (nestedPath.length > 0) {
        // Navigate to the correct nested sub-item using the path
        for (const index of nestedPath) {
          target = target.subItems[index];
        }
      }

      target.subItems.push({ ...newSubItem, subItems: [] });

      setHeaderData(updatedHeader);
      setNewSubItem({ title: "", link: "" });
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
  const removeSubItem = (headerIndex, path) => {
    const updatedHeader = [...headerData];
    let target = updatedHeader[headerIndex];

    if (path.length === 1) {
      target.subItems = target.subItems.filter((_, i) => i !== path[0]);
    } else {
      for (let i = 0; i < path.length - 1; i++) {
        target = target.subItems[path[i]];
      }
      target.subItems = target.subItems.filter(
        (_, i) => i !== path[path.length - 1]
      );
    }

    setHeaderData(updatedHeader);
  };

  // Submit the header data to the API
  const submitHeaderData = async () => {
    try {
      const finalDataSending = {
        content: headerData,
      };
      const response = await dispatch(
        headerEdit({ header: finalDataSending })
      ).unwrap();
      setOpenModal3(true);
      closeModalOnTimeout();
    } catch (error) {
      console.error("Error submitting header data:", error);
      alert("Failed to submit header data.");
    }
  };

  return (
    <>
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
            className="me-2 buttonMainHeaderCreate"
            style={{ backgroundColor: "#007bff" }}
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
                <HeaderItem key={index}>
                  <StrongText>{item.title}</StrongText>

                  {/* Render sub-items */}
                  {renderSubItems(item.subItems, index, [])}

                  {/* Button to add sub-items */}
                  <Button
                    className="me-1"
                    $secondary
                    onClick={() => selectHeaderForSubItem(index)}
                  >
                    اضافه کردن ساب ایتم به {item.title}
                  </Button>
                  <Button
                    $danger
                    onClick={() => openRemoveModal([index], true)}
                  >
                    حذف هدر اصلی
                  </Button>
                </HeaderItem>
              ))}
            </HeaderListWrapper>
          ) : (
            <p>هدر خود را بسازید</p>
          )}
        </div>

        {/* Input for new sub-item */}
        {activeHeaderIndex !== null && (
          <div style={{ marginBottom: "20px", marginTop: "20px" }}>
            <InputField
              type="text"
              name="title"
              placeholder="Sub-item Title"
              value={newSubItem.title}
              onChange={handleSubInputChange}
            />
            <InputField
              type="text"
              name="link"
              placeholder="Sub-item Link"
              value={newSubItem.link}
              onChange={handleSubInputChange}
            />
            <Button className="me-1" $secondary onClick={addSubItem}>
              اضافه کردن ساب ایتم
            </Button>
          </div>
        )}

        {/* Submit Button */}
        <Button onClick={submitHeaderData} style={{ marginTop: "20px" }}>
          تایید هدر
        </Button>

        {/* Modal for confirming header or sub-item removal */}

        <AreYouShureModal
          open={openModal}
          onClose={closeModal}
          func={confirmRemove}
          text={`از حذف ${" "}${
            isRemovingHeader ? "هدر" : "ساب ایتم"
          }${" "}مطمعن هستید`}
        />

        <ErrorModal
          open={openModal2}
          onClose={closeModal2}
          text={"لطفا تایتل و لینک را وارد کنید"}
        />
        <ConfirmModal
          open={openModal3}
          onClose={closeModal3}
          text={"هدر با موفقیت تغییر یافت"}
        />
      </Container>
    </>
  );
}
