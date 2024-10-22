'use client';

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { HeaderList, headerEdit } from "@/app/Store/thunks";
import styled from "styled-components";
import { Modal, Box, Button as MUIButton, Typography } from "@mui/material"; // Import MUI components

// Styled components
const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 20px;
`;

const InputField = styled.input`
  padding: 10px;
  width: 200px;
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
  margin-left: ${(props) => (props.$danger || props.$secondary ? "10px" : "0px")};

  &:hover {
    opacity: 0.9;
  }
`;

// MUI Modal style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

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

export default function HeaderMainComponent() {
  const dispatch = useDispatch();

  const [headerData, setHeaderData] = useState([]);
  const [newItem, setNewItem] = useState({ title: "", link: "", subItems: [] });
  const [newSubItem, setNewSubItem] = useState({ title: "", link: "" });
  const [activeHeaderIndex, setActiveHeaderIndex] = useState(null);
  const [nestedPath, setNestedPath] = useState([]);
  const [isRemovingHeader, setIsRemovingHeader] = useState(false); // Track if removing a header or sub-item

  const [openModal, setOpenModal] = useState(false); // Modal state
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
      alert("Please enter both a title and a link.");
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
              <StrongText>{subItem.title}</StrongText>
              <Button
                $danger
                onClick={() => openRemoveModal(newPath, false)}
              >
                Remove Sub-item
              </Button>

              {/* Render nested sub-items recursively */}
              {subItem.subItems.length > 0 && renderSubItems(subItem.subItems, headerIndex, newPath)}

              {/* Button to add sub-items recursively */}
              <Button $secondary onClick={() => selectSubItemForSubItem(headerIndex, newPath)}>
                Add Sub-item to {subItem.title}
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
      alert("Please enter both a title and link for the sub-item.");
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
      target.subItems = target.subItems.filter((_, i) => i !== path[path.length - 1]);
    }

    setHeaderData(updatedHeader);
  };

  // Submit the header data to the API
  const submitHeaderData = async () => {
    try {
      const finalDataSending = {
        content: headerData,
      };
      const response = await dispatch(headerEdit({ header: finalDataSending })).unwrap();
      alert("Header data successfully submitted!");
    } catch (error) {
      console.error("Error submitting header data:", error);
      alert("Failed to submit header data.");
    }
  };

  return (
    <Container>
      <Title>Header Editor</Title>

      {/* Input for new header item */}
      <div style={{ marginBottom: "20px" }}>
        <InputField
          type="text"
          name="title"
          placeholder="Header Title"
          value={newItem.title}
          onChange={handleInputChange}
        />
        <InputField
          type="text"
          name="link"
          placeholder="Header Link"
          value={newItem.link}
          onChange={handleInputChange}
        />
        <Button onClick={addItem}>Add Header Item</Button>
      </div>

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
                <Button $secondary onClick={() => selectHeaderForSubItem(index)}>
                  Add Sub-item to {item.title}
                </Button>
                <Button $danger onClick={() => openRemoveModal([index], true)}>
                  Remove Header Item
                </Button>
              </HeaderItem>
            ))}
          </HeaderListWrapper>
        ) : (
          <p>No header items added yet.</p>
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
          <Button $secondary onClick={addSubItem}>
            Add Sub-item
          </Button>
        </div>
      )}

      {/* Submit Button */}
      <Button onClick={submitHeaderData} style={{ marginTop: "20px" }}>
        Submit Header Data
      </Button>

      {/* Modal for confirming header or sub-item removal */}
      <Modal
        open={openModal}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Confirm Deletion
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Are you sure you want to delete this {isRemovingHeader ? "header" : "sub-item"}?
          </Typography>
          <div style={{ marginTop: "20px" }}>
            <MUIButton variant="contained" color="error" onClick={confirmRemove}>
              Confirm
            </MUIButton>
            <MUIButton variant="contained" onClick={closeModal} style={{ marginLeft: "10px" }}>
              Cancel
            </MUIButton>
          </div>
        </Box>
      </Modal>
    </Container>
  );
}
