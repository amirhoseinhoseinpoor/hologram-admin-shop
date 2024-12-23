import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch } from "react-redux";
import { HeaderList, headerEdit } from "@/app/Store/thunks";
import styled, { createGlobalStyle } from "styled-components";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider, useDragLayer } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
// Import base components
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
// Import modals
import ConfirmModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import CloseIcon from "@mui/icons-material/Close";

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
  background-color: rgb(225, 223, 223);
  border-radius: 4px;
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
  gap: 10px;
  align-items: flex-start;
  @media (max-width: 980px) {
    flex-direction: column;
  }
  .addSubItemInput {
    width: 100%;
    margin-bottom: 10px;
  }
`;

// Helper functions (outside of components):
function arraysAreEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
  }
  return true;
}

function isDescendant(parentPath, childPath) {
  if (childPath.length <= parentPath.length) return false;
  for (let i = 0; i < parentPath.length; i++) {
      if (parentPath[i] !== childPath[i]) return false;
  }
  return true;
}

// Drag and Drop logic for reordering headers
const Header = ({
  item,
  index,
  moveItem,
  newSubItem,
  handleSubInputChange,
  setAddSubItemPath,
  addSubItem,
  addSubItemPath,
  selectSubItemForSubItem,
  openRemoveModal,
  headerData,
  setHeaderData,
  selectHeaderForSubItem,
}) => {
  const dragRef = useRef(null);
  const dropRef = useRef(null);

  const [, drag] = useDrag(
    () => ({
      type: "ITEM",
      item: { index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [index]
  );

  const [, drop] = useDrop(
    () => ({
      accept: "ITEM",
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveItem(draggedItem.index, index);
        }
      },
    }),
    [moveItem, index]
  );

  useEffect(() => {
    drag(drop(dragRef.current));
  }, [drag, drop]);


  const moveSubItem = useCallback((draggedPath, targetPath) => {
    if (arraysAreEqual(draggedPath, targetPath)) return;

    setHeaderData(prevHeaderData => {
        // Create a DEEP COPY of the previous state *inside* the functional update
        const updatedHeader = JSON.parse(JSON.stringify(prevHeaderData));

        const findAndRemoveByPath = (obj, path) => {
            if (path.length === 1) {
                return obj.splice(path[0], 1)[0];
            } else {
                let current = obj;
                for (let i = 0; i < path.length - 1; i++) {
                    current = current[path[i]].subItems;
                    if (!current) return null;
                }
                return current.splice(path[path.length - 1], 1)[0];
            }
        };

        const insertByPath = (obj, path, item) => {
            if (path.length === 1) {
                obj.splice(path[0], 0, item);
            } else {
                let current = obj;
                for (let i = 0; i < path.length - 1; i++) {
                    current = current[path[i]].subItems;
                }
                current.splice(path[path.length - 1], 0, item);
            }
        };

        try {
            const draggedItem = findAndRemoveByPath(updatedHeader, draggedPath);
            if (draggedItem) {
                insertByPath(updatedHeader, targetPath, draggedItem);
            }
        } catch (error) {
            console.error("Error during move operation:", error, { draggedPath, targetPath, prevHeaderData });
            return prevHeaderData; // VERY IMPORTANT: Return previous state on error
        }

        return updatedHeader; // Return the updated state
    });
}, [setHeaderData]);

  // Recursive function to render sub-items

  return (
    <HeaderItem ref={dragRef}>
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
        <RemoveButtonStyle onClick={() => openRemoveModal([index], true)}>
          حذف هدر اصلی
        </RemoveButtonStyle>
      </div>

      {/* Render sub-items */}
      {item.subItems.length > 0 && (
        <SubItemsComponent
          subItems={item.subItems}
          currentPath={[index]}
          moveSubItem={moveSubItem}
          newSubItemProps={newSubItem}
          handleSubInputChange={handleSubInputChange}
          setAddSubItemPath={setAddSubItemPath}
          addSubItemPath={addSubItemPath}
          selectSubItemForSubItem={selectSubItemForSubItem}
          openRemoveModal={openRemoveModal}
          addSubItem={addSubItem}
        />
      )}

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
                style={{ whiteSpace: "nowrap" }}
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
  );
};

const SubItemsComponent = ({
  subItems,
  currentPath,
  moveSubItem,
  newSubItem,
  handleSubInputChange,
  setAddSubItemPath,
  addSubItemPath,
  selectSubItemForSubItem,
}) => {
  return (
    <SubItemList>
      {subItems.map((subItem, subIndex) => {
        const newPath = [...currentPath, subIndex];
        const isAddSubItem =
          addSubItemPath &&
          addSubItemPath.length === newPath.length &&
          addSubItemPath.every((val, idx) => val === newPath[idx]);

        return (
          <SubItemComponent
            key={subIndex}
            subItem={subItem}
            newPath={newPath}
            moveSubItem={moveSubItem}
            newSubItemProps={newSubItem}
            handleSubInputChange={handleSubInputChange}
            setAddSubItemPath={setAddSubItemPath}
            selectSubItemForSubItem={selectSubItemForSubItem}
            isAddSubItem={isAddSubItem}
            addSubItemPath={addSubItemPath}
          />
        );
      })}
    </SubItemList>
  );
};

const SubItemComponent = ({
  subItem,
  newPath,
  moveSubItem,
  newSubItemProps,
  handleSubInputChange,
  setAddSubItemPath,
  addSubItemPath,
  selectSubItemForSubItem,
  isAddSubItem,
}) => {
  const ref = useRef(null);


  const [{ isDragging }, drag] = useDrag(() => ({
    type: "SUB_ITEM",
    item: { path: newPath },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
}));

const [, drop] = useDrop(useCallback(() => ({
    accept: "SUB_ITEM",
    canDrop: (item) => {
        const draggedPath = item.path;
        const targetPath = newPath;
        return !isDescendant(targetPath, draggedPath) && !arraysAreEqual(draggedPath, targetPath); // Prevent drop on self or descendants
    },
    hover(item) {
        if (!ref.current) return;
        const draggedPath = item.path;
        const targetPath = newPath;
        if (!arraysAreEqual(draggedPath, targetPath) && !isDescendant(targetPath, draggedPath)) {
            moveSubItem(draggedPath, targetPath);
        }
    },
}), [moveSubItem, newPath]),);

useEffect(() => { drag(drop(ref.current)); }, [drag, drop]);

  return (
    <React.Fragment>
      <SubItem ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <div className="d-flex flex-row align-items-center justify-content-between">
          <div className="d-flex flex-row align-items-center gap-1">
            <StrongText className="NormalTextSizing">
              {subItem?.title && <>{subItem?.title}</>}
            </StrongText>
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

          <RemoveButtonStyle onClick={() => openRemoveModal(newPath, false)}>
            <DeleteIcon className="text-danger" />
          </RemoveButtonStyle>
        </div>
      </SubItem>
      {isAddSubItem && (
        <AddSubItemContainer className="container">
          <InputField
            className="addSubItemInput"
            type="text"
            name="title"
            placeholder="عنوان ساب ایتم"
            value={newSubItemProps.title}
            onChange={handleSubInputChange}
          />
          <InputField
            className="addSubItemInput"
            type="text"
            name="link"
            placeholder="لینک ساب ایتم"
            value={newSubItemProps.link}
            onChange={handleSubInputChange}
          />
          <div className="d-flex flex-row align-items-center">
            <Button
              type="button"
              $secondary
              onClick={() => addSubItem(newPath)}
              style={{ whiteSpace: "nowrap" }}
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
      {subItem.subItems && subItem.subItems.length > 0 && (
        <SubItemsComponent
          subItems={subItem.subItems}
          currentPath={newPath}
          moveSubItem={moveSubItem}
          newSubItem={newSubItemProps}
          handleSubInputChange={handleSubInputChange}
          setAddSubItemPath={setAddSubItemPath}
          addSubItemPath={addSubItemPath}
          selectSubItemForSubItem={selectSubItemForSubItem}
        />
      )}
    </React.Fragment>
  );
};

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
    setNewSubItem((prev) => {
      if (prev[name] === value) return prev; // Avoid unnecessary state updates
      return { ...prev, [name]: value };
    });
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

  const moveItem = (draggedIndex, targetIndex) => {
    const updatedHeader = [...headerData];
    const draggedItem = updatedHeader.splice(draggedIndex, 1)[0];
    updatedHeader.splice(targetIndex, 0, draggedItem);
    setHeaderData(updatedHeader);
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <GlobalStyle />
        <HeadermakeOrder className="d-flex flex-row mb-3 justify-content-between">
          <div className="d-block d-lg-none">
            <NavBarToggleBurgerButton func={() => toggleShow("main")} />
          </div>
          <div className="NormalTextSizing text-decoration-underline textHeaderStyle d-flex align-items-center">
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

          <HeaderListWrapper>
            {headerData.map((item, index) => (
              <Header
                item={item}
                key={index}
                index={index}
                moveItem={moveItem}
                newSubItem={newSubItem}
                handleSubInputChange={handleSubInputChange}
                setAddSubItemPath={setAddSubItemPath}
                addSubItem={addSubItem}
                addSubItemPath={addSubItemPath}
                selectSubItemForSubItem={selectSubItemForSubItem}
                openRemoveModal={openRemoveModal}
                headerData={headerData}
                setHeaderData={setHeaderData}
                selectHeaderForSubItem={selectHeaderForSubItem}
              />
            ))}
          </HeaderListWrapper>

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
            text={`از حذف ${
              isRemovingHeader ? "هدر" : "ساب ایتم"
            } مطمئن هستید؟`}
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
      </DndProvider>
    </>
  );
}
