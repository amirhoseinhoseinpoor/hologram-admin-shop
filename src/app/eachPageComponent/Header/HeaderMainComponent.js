"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { HeaderList, headerEdit } from "@/app/Store/thunks";
import styled, { createGlobalStyle } from "styled-components";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import ConfirmModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import CloseIcon from "@mui/icons-material/Close";

// dnd-kit imports
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Global styles to set box-sizing
const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }
`;

/* ------------------ your existing styled-components (unchanged) ------------------ */
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
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-image: ${(props) => {
    if (props.$secondary)
      return "linear-gradient(195deg, #46506a 0%, #282e3f 100%)";
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
  cursor: grab;
  user-select: none;
`;

const SubItemList = styled.ul`
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

/* ------------------ utilities (kept from your original) ------------------ */

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const getItemByPath = (data, path) => {
  if (!Array.isArray(path) || path.length === 0) return undefined;
  let current = { subItems: data }; // virtual parent
  for (let i = 0; i < path.length; i++) {
    const idx = path[i];
    if (
      !current ||
      !Array.isArray(current.subItems) ||
      typeof idx !== "number"
    ) {
      return undefined;
    }
    current = current.subItems[idx];
    if (typeof current === "undefined") return undefined;
  }
  return current;
};

const removeItemByPath = (data, path) => {
  const newData = deepClone(data);
  if (!path || path.length === 0) return newData;

  if (path.length === 1) {
    newData.splice(path[0], 1);
    return newData;
  }

  const parentPath = path.slice(0, -1);
  const parent = getItemByPath(newData, parentPath);
  if (!parent || !Array.isArray(parent.subItems)) return newData;
  parent.subItems.splice(path[path.length - 1], 1);
  return newData;
};

const insertItemByPath = (data, path, item) => {
  const newData = deepClone(data);
  if (!path || path.length === 0) {
    newData.push(item);
    return newData;
  }

  const last = path[path.length - 1];
  if (last === "append") {
    const parentPath = path.slice(0, -1);
    if (parentPath.length === 0) {
      newData.push(item);
      return newData;
    }
    const parent = getItemByPath(newData, parentPath);
    if (!parent) return newData;
    if (!Array.isArray(parent.subItems)) parent.subItems = [];
    parent.subItems.push(item);
    return newData;
  }

  if (path.length === 1) {
    const idx = path[0];
    const i = Math.max(0, Math.min(idx, newData.length)); // clamp
    newData.splice(i, 0, item);
    return newData;
  } else {
    const parentPath = path.slice(0, -1);
    const insertIndex = path[path.length - 1];
    const parent = getItemByPath(newData, parentPath);
    if (!parent) return newData;
    if (!Array.isArray(parent.subItems)) parent.subItems = [];
    const i = Math.max(0, Math.min(insertIndex, parent.subItems.length));
    parent.subItems.splice(i, 0, item);
    return newData;
  }
};

const ensureSubItems = (items) => {
  if (!Array.isArray(items)) return;
  items.forEach((item) => {
    if (!item) return;
    if (!Array.isArray(item.subItems)) {
      item.subItems = [];
    }
    if (item.subItems.length > 0) {
      ensureSubItems(item.subItems);
    }
  });
};

const isDescendant = (fromPath, toPath) => {
  if (toPath.length < fromPath.length) return false;
  for (let i = 0; i < fromPath.length; i++) {
    if (fromPath[i] !== toPath[i]) return false;
  }
  return true;
};

/* ------------------ dnd-kit sortables + UI wiring ------------------ */

function SortableWrapper({ id, children, item, depth = 0 }) {
  // useSortable from dnd-kit
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} data-id={id} style={style}>
      {React.cloneElement(children, {
        dndAttributes: attributes,
        dndListeners: listeners,
        depth,
      })}
    </div>
  );
}

function SortableItem({
  item,
  depth,
  onAddSub,
  onRemove,
  renderChildren,
  dndAttributes,
  dndListeners,
  // new props for inline add + drop indicator:
  newSubItemMap,
  setNewSubItemMap,
  confirmAddSubItem,
  dropIndicatorForThis,
}) {
  // helper to update inline inputs
  const handleInlineChange = (field, value) => {
    setNewSubItemMap((m) => ({
      ...m,
      [item.id]: { ...(m[item.id] || {}), [field]: value },
    }));
  };

  const isAdding = Boolean(newSubItemMap && newSubItemMap[item.id]);

  // drop indicator visuals:
  const showBeforeLine = dropIndicatorForThis === "before";
  const showAfterLine = dropIndicatorForThis === "after";
  const showInside = dropIndicatorForThis === "inside";

  if (depth === 0) {
    // header style
    return (
      <div style={{ position: "relative" }}>
        {showBeforeLine && (
          <div
            style={{
              height: 4,
              background: "#2f86ff",
              margin: "-6px 0 6px 0",
              borderRadius: 2,
            }}
          />
        )}
        <HeaderItem
          style={
            showInside
              ? { boxShadow: "0 0 0 3px rgba(47,134,255,0.06)" }
              : undefined
          }
        >
          <div className="d-flex flex-row align-items-center gap-1">
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {/* drag handle */}
              <div
                {...dndListeners}
                {...dndAttributes}
                style={{ cursor: "grab", padding: 4 }}
              >
                ≡
              </div>

              <StrongText className="NormalTextSizing">{item.title}</StrongText>
            </div>

            <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
              <Button
                type="button"
                className="me-1"
                style={{
                  backgroundImage: "unset",
                  backgroundColor: "unset",
                  color: "#43A047",
                }}
                $secondary
                onClick={() => onAddSub(item)}
              >
                <AddCircleIcon />
              </Button>
              <RemoveButtonStyle onClick={() => onRemove(item)}>
                <DeleteIcon className="text-danger" />
              </RemoveButtonStyle>
            </div>
          </div>

          {/* Inline add input for this item */}
          {isAdding && (
            <AddSubItemContainer
              className="container"
              style={{ marginTop: 12 }}
            >
              <InputField
                className="addSubItemInput"
                type="text"
                name="title"
                placeholder="عنوان ساب ایتم"
                value={newSubItemMap[item.id]?.title || ""}
                onChange={(e) => handleInlineChange("title", e.target.value)}
              />
              <InputField
                className="addSubItemInput"
                type="text"
                name="link"
                placeholder="لینک ساب ایتم"
                value={newSubItemMap[item.id]?.link || ""}
                onChange={(e) => handleInlineChange("link", e.target.value)}
              />
              <div className="d-flex flex-row align-items-center">
                <Button
                  type="button"
                  $secondary
                  onClick={() => confirmAddSubItem(item.id)}
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
                  onClick={() =>
                    setNewSubItemMap((m) => {
                      const n = { ...m };
                      delete n[item.id];
                      return n;
                    })
                  }
                >
                  <CloseIcon className="text-danger" />
                </Button>
              </div>
            </AddSubItemContainer>
          )}

          {/* nested */}
          <SubItemList>
            {item.subItems &&
              item.subItems.length > 0 &&
              renderChildren(item.subItems, depth + 1)}
          </SubItemList>
        </HeaderItem>
        {showAfterLine && (
          <div
            style={{
              height: 4,
              background: "#2f86ff",
              margin: "6px 0 -6px 0",
              borderRadius: 2,
            }}
          />
        )}
      </div>
    );
  } else {
    // sub item style
    return (
      <div style={{ position: "relative" }}>
        {showBeforeLine && (
          <div
            style={{
              height: 4,
              background: "#2f86ff",
              margin: "-6px 0 6px 0",
              borderRadius: 2,
            }}
          />
        )}
        <SubItem
          style={
            showInside
              ? { boxShadow: "0 0 0 3px rgba(47,134,255,0.04)" }
              : undefined
          }
        >
          <div className="d-flex flex-row align-items-center justify-content-between p-2">
            <div className="d-flex flex-row align-items-center gap-1">
              <div
                {...dndListeners}
                {...dndAttributes}
                style={{ cursor: "grab", padding: 4 }}
              >
                ≡
              </div>
              <StrongText className="NormalTextSizing">{item.title}</StrongText>
              <Button
                type="button"
                style={{
                  backgroundImage: "unset",
                  backgroundColor: "unset",
                  color: "#43A047",
                }}
                className="me-1"
                $secondary
                onClick={() => onAddSub(item)}
              >
                <AddCircleIcon />
              </Button>
            </div>
            <RemoveButtonStyle onClick={() => onRemove(item)}>
              <DeleteIcon className="text-danger" />
            </RemoveButtonStyle>
          </div>

          {/* Inline add input for subitem */}
          {isAdding && (
            <AddSubItemContainer className="container">
              <InputField
                className="addSubItemInput"
                type="text"
                name="title"
                placeholder="عنوان ساب ایتم"
                value={newSubItemMap[item.id]?.title || ""}
                onChange={(e) => handleInlineChange("title", e.target.value)}
              />
              <InputField
                className="addSubItemInput"
                type="text"
                name="link"
                placeholder="لینک ساب ایتم"
                value={newSubItemMap[item.id]?.link || ""}
                onChange={(e) => handleInlineChange("link", e.target.value)}
              />
              <div className="d-flex flex-row align-items-center">
                <Button
                  type="button"
                  $secondary
                  onClick={() => confirmAddSubItem(item.id)}
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
                  onClick={() =>
                    setNewSubItemMap((m) => {
                      const n = { ...m };
                      delete n[item.id];
                      return n;
                    })
                  }
                >
                  <CloseIcon className="text-danger" />
                </Button>
              </div>
            </AddSubItemContainer>
          )}

          {/* nested */}
          {item.subItems &&
            item.subItems.length > 0 &&
            renderChildren(item.subItems, depth + 1)}
        </SubItem>
        {showAfterLine && (
          <div
            style={{
              height: 4,
              background: "#2f86ff",
              margin: "6px 0 -6px 0",
              borderRadius: 2,
            }}
          />
        )}
      </div>
    );
  }
}

/* ------------------ Main component (your existing props and logic preserved) ------------------ */

export default function HeaderMainComponent({ toggleShow }) {
  const dispatch = useDispatch();

  const [headerData, setHeaderData] = useState([]);
  const [newItem, setNewItem] = useState({ title: "", link: "", subItems: [] });
  const [newSubItem, setNewSubItem] = useState({ title: "", link: "" });
  // we keep newSubItemMap (map parentId -> object) for inline add inputs per item
  const [newSubItemMap, setNewSubItemMap] = useState({});
  const [addSubItemPath, setAddSubItemPath] = useState(null);
  const [isRemovingHeader, setIsRemovingHeader] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);

  const [selectedPath, setSelectedPath] = useState([]);

  // dnd state
  const [dropIndicator, setDropIndicator] = useState(null); // { id, position: 'before'|'inside'|'after' }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataComeAPI = await dispatch(HeaderList()).unwrap();
        const content = dataComeAPI?.content || [];
        ensureSubItems(content);
        setHeaderData(content);
      } catch (error) {
        console.error("Error fetching header data:", error);
        setOpenModal3(true);
      }
    };

    fetchData();
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubInputChange = (e) => {
    const { name, value } = e.target;
    setNewSubItem((prev) => {
      if (prev[name] === value) return prev;
      return { ...prev, [name]: value };
    });
  };

  const addItem = () => {
    if (newItem.title && newItem.link) {
      const newHeader = { ...newItem, id: Date.now().toString(), subItems: [] };
      setHeaderData((prev) => [...prev, newHeader]);
      setNewItem({ title: "", link: "", subItems: [] });
    } else {
      setOpenModal2(true);
    }
  };

  const openRemoveModal = (path, isHeader) => {
    setSelectedPath(path);
    setIsRemovingHeader(isHeader);
    setOpenModal(true);
    setAddSubItemPath(null);
  };

  const closeModalHandler = () => setOpenModal(false);
  const closeModal2Handler = () => setOpenModal2(false);
  const closeModal3Handler = () => setOpenModal3(false);

  function closeModalOnTimeout() {
    setTimeout(() => {
      setOpenModal3(false);
    }, 3000);
  }

  const confirmRemove = () => {
    if (isRemovingHeader) {
      removeItem(selectedPath[0]);
    } else {
      removeSubItem(selectedPath);
    }
    closeModalHandler();
  };

  const selectHeaderForSubItem = (index) => {
    // show inline input under this header
    const id = headerData[index].id;
    setNewSubItemMap((m) => ({ ...m, [id]: { title: "", link: "" } }));
    setNewSubItem({ title: "", link: "" });
  };

  const selectSubItemForSubItem = (path) => {
    // show inline input under the sub-item with that path
    const target = getItemByPath(headerData, path);
    if (!target) return;
    setNewSubItemMap((m) => ({ ...m, [target.id]: { title: "", link: "" } }));
    setNewSubItem({ title: "", link: "" });
  };

  // old addSubItem kept for compatibility, but confirmAddSubItem will be used by inline inputs
  const addSubItem = (path) => {
    if (newSubItem.title && newSubItem.link) {
      const updatedHeader = deepClone(headerData);
      let target = updatedHeader[path[0]];

      for (let i = 1; i < path.length; i++) {
        if (!target.subItems) {
          target.subItems = [];
        }
        target = target.subItems[path[i]];
      }

      if (!target.subItems) {
        target.subItems = [];
      }

      target.subItems.push({
        ...newSubItem,
        id: Date.now().toString(),
        subItems: [],
      });

      setHeaderData(updatedHeader);
      setNewSubItem({ title: "", link: "" });
      setAddSubItemPath(null);
    } else {
      setOpenModal2(true);
    }
  };

  // confirmAddSubItem used by inline inputs
  const confirmAddSubItem = (parentId) => {
    const payload = newSubItemMap[parentId];
    if (!payload || !payload.title || !payload.link) {
      setOpenModal2(true);
      return;
    }
    // find parent by id (we already have function below to find by id)
    const found = (function findById(list, id) {
      for (let i = 0; i < list.length; i++) {
        if (String(list[i].id) === String(id))
          return { node: list[i], path: [i] };
        if (list[i].subItems && list[i].subItems.length) {
          const subFound = (function inner(sublist, id, basePath) {
            for (let j = 0; j < sublist.length; j++) {
              if (String(sublist[j].id) === String(id))
                return { node: sublist[j], path: [...basePath, j] };
              if (sublist[j].subItems && sublist[j].subItems.length) {
                const deeper = inner(sublist[j].subItems, id, [...basePath, j]);
                if (deeper) return deeper;
              }
            }
            return null;
          })(list[i].subItems, parentId, [i]);
          if (subFound) return subFound;
        }
      }
      return null;
    })(headerData, parentId);

    if (!found) return;
    const newNode = {
      id: Date.now().toString(),
      title: payload.title,
      link: payload.link,
      subItems: [],
    };
    const newTree = insertItemByPath(
      headerData,
      [...found.path, "append"],
      newNode
    );
    setHeaderData(newTree);
    setNewSubItemMap((m) => {
      const n = { ...m };
      delete n[parentId];
      return n;
    });
  };

  const removeItem = (index) => {
    setHeaderData((prev) => removeItemByPath(prev, [index]));
  };

  const removeSubItem = (path) => {
    setHeaderData((prev) => removeItemByPath(prev, path));
  };

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

  // **************** dnd-kit logic starts here ****************

  // helper: find node by id and return { node, path, index }
  const findNodeById = (tree, id) => {
    const stack = [{ list: tree, path: [] }];
    while (stack.length) {
      const { list, path } = stack.shift();
      for (let i = 0; i < list.length; i++) {
        const node = list[i];
        const curPath = [...path, i];
        if (String(node.id) === String(id)) {
          return { node, path: curPath, index: i };
        }
        if (node.subItems && node.subItems.length) {
          stack.push({ list: node.subItems, path: curPath });
        }
      }
    }
    return null;
  };

  // move logic using your existing helpers
  const moveNode = (fromPath, toPath) => {
    if (!Array.isArray(fromPath) || !Array.isArray(toPath)) return;
    if (isDescendant(fromPath, toPath)) return;

    const current = deepClone(headerData);
    const itemToMove = getItemByPath(current, fromPath);
    if (!itemToMove) return;

    const afterRemoval = removeItemByPath(current, fromPath);
    const afterInsert = insertItemByPath(afterRemoval, toPath, itemToMove);
    ensureSubItems(afterInsert);
    setHeaderData(afterInsert);
  };

  // sensors
  const sensors = useSensors(useSensor(PointerSensor));

  // pendingDrop ref (set on dragOver, applied on dragEnd)
  const pendingDrop = useRef(null);
  const activeIdRef = useRef(null);

  const handleDragStart = (event) => {
    activeIdRef.current = event.active.id;
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over || !active) {
      setDropIndicator(null);
      return;
    }
    if (String(active.id) === String(over.id)) {
      setDropIndicator(null);
      return;
    }

    const dragged = findNodeById(headerData, active.id);
    const hovered = findNodeById(headerData, over.id);
    if (!dragged || !hovered) {
      setDropIndicator(null);
      return;
    }

    // get bounding rect of the hovered DOM element
    const el = document.querySelector(`[data-id='${over.id}']`);
    if (!el) {
      setDropIndicator(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    const pointerY = event.pointerY ?? rect.top + rect.height / 2;
    const relativeY = pointerY - rect.top;
    const height = rect.height;

    // Wider drop zones: top 40% => before, bottom 40% => after, middle 20% => inside
    let position;
    if (relativeY < height * 0.4) position = "before";
    else if (relativeY > height * 0.6) position = "after";
    else position = "inside";

    // determine insertPath corresponding to that position
    let insertPath;
    // Determine insert position based on pointer
    if (relativeY < height * 0.4) {
      // insert before hovered
      const parentPath = hovered.path.slice(0, -1);
      insertPath = [...parentPath, hovered.index];
    } else if (relativeY > height * 0.6) {
      // insert after hovered
      const parentPath = hovered.path.slice(0, -1);
      insertPath = [...parentPath, hovered.index + 1];
    } else {
      // middle: for now, just treat as after (no auto-nest)
      const parentPath = hovered.path.slice(0, -1);
      insertPath = [...parentPath, hovered.index + 1];
    }

    // prevent invalid move into own descendant
    if (isDescendant(dragged.path, insertPath)) {
      setDropIndicator(null);
      pendingDrop.current = null;
      return;
    }

    // set pending drop and a visual dropIndicator
    pendingDrop.current = { from: dragged.path, to: insertPath };
    setDropIndicator({ id: over.id, position });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    activeIdRef.current = null;
    setDropIndicator(null);

    if (pendingDrop.current) {
      const { from, to } = pendingDrop.current;
      pendingDrop.current = null;

      // ignore no-op
      if (JSON.stringify(from) === JSON.stringify(to)) return;

      moveNode(from, to);
      return;
    }

    // fallback: reorder inside same parent when drop on sibling without hover computed
    if (over && active.id !== over.id) {
      const dragged = findNodeById(headerData, active.id);
      const hovered = findNodeById(headerData, over.id);
      if (dragged && hovered) {
        const fromParent = dragged.path.slice(0, -1);
        const toParent = hovered.path.slice(0, -1);
        if (JSON.stringify(fromParent) === JSON.stringify(toParent)) {
          // same parent, reorder
          const parent =
            fromParent.length === 0
              ? headerData
              : getItemByPath(headerData, fromParent);
          const arr = deepClone(parent.subItems ?? parent);
          const item = arr.splice(dragged.index, 1)[0];
          arr.splice(hovered.index, 0, item);

          // apply result by re-inserting into tree
          if (fromParent.length === 0) {
            setHeaderData(arr);
          } else {
            const newTree = deepClone(headerData);
            const p = getItemByPath(newTree, fromParent);
            if (p) p.subItems = arr;
            setHeaderData(newTree);
          }
        }
      }
    }
  };

  // ---------------- recursive render: wraps each children-level in SortableContext ----------------
  const renderSubItems = (subItems, parentPath = []) => {
    if (!Array.isArray(subItems) || subItems.length === 0) return null;
    const ids = subItems.map((s) => String(s.id));

    return (
      <SubItemList>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {subItems.map((subItem, subIndex) => {
            const curPath = [...parentPath, subIndex];
            const idStr = String(subItem.id);
            const indicatorForThis =
              dropIndicator && String(dropIndicator.id) === idStr
                ? dropIndicator.position
                : null;

            return (
              <SortableWrapper
                key={idStr}
                id={idStr}
                item={subItem}
                depth={parentPath.length + 1}
              >
                <SortableItem
                  item={subItem}
                  depth={parentPath.length + 1}
                  onAddSub={() => {
                    // show inline input for this subitem
                    setNewSubItemMap((m) => ({
                      ...m,
                      [subItem.id]: { title: "", link: "" },
                    }));
                  }}
                  onRemove={() => openRemoveModal(curPath, false)}
                  renderChildren={(children, depth) =>
                    renderSubItems(children, curPath)
                  }
                  dndAttributes={{}}
                  dndListeners={{}}
                  newSubItemMap={newSubItemMap}
                  setNewSubItemMap={setNewSubItemMap}
                  confirmAddSubItem={confirmAddSubItem}
                  dropIndicatorForThis={indicatorForThis}
                />
              </SortableWrapper>
            );
          })}
        </SortableContext>
      </SubItemList>
    );
  };

  // render top-level headers
  const topLevelIds = headerData.map((h) => String(h.id));

  return (
    <>
      <GlobalStyle />
      <HeadermakeOrder className="d-flex flex-row mb-3 justify-content-between">
        <div className="d-block d-lg-none">
          <NavBarToggleBurgerButton func={() => toggleShow("main")} />
        </div>
        <div className="NormalTextSizing text-decoration-underline textHeaderStyle d-flex align-items-center">
          ساخت هدر
        </div>
        <ProfileComponent colorGet={"#282e3f"} />
      </HeadermakeOrder>

      <Container>
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

        <div>
          {headerData.length > 0 ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            >
              <HeaderListWrapper>
                <SortableContext
                  items={topLevelIds}
                  strategy={verticalListSortingStrategy}
                >
                  {headerData.map((item, index) => {
                    const idStr = String(item.id);
                    const indicatorForThis =
                      dropIndicator && String(dropIndicator.id) === idStr
                        ? dropIndicator.position
                        : null;

                    return (
                      <SortableWrapper
                        key={idStr}
                        id={idStr}
                        item={item}
                        depth={0}
                      >
                        <SortableItem
                          item={item}
                          depth={0}
                          onAddSub={() => {
                            // show inline input for top-level header
                            setNewSubItemMap((m) => ({
                              ...m,
                              [item.id]: { title: "", link: "" },
                            }));
                          }}
                          onRemove={() => openRemoveModal([index], true)}
                          renderChildren={(children) =>
                            renderSubItems(children, [index])
                          }
                          dndAttributes={{}}
                          dndListeners={{}}
                          newSubItemMap={newSubItemMap}
                          setNewSubItemMap={setNewSubItemMap}
                          confirmAddSubItem={confirmAddSubItem}
                          dropIndicatorForThis={indicatorForThis}
                        />
                      </SortableWrapper>
                    );
                  })}
                </SortableContext>
              </HeaderListWrapper>

              <DragOverlay>{/* optional overlay while dragging */}</DragOverlay>
            </DndContext>
          ) : (
            <p>هدر خود را بسازید</p>
          )}
        </div>

        <Button
          type="button"
          $secondary
          onClick={submitHeaderData}
          style={{ marginTop: "20px" }}
        >
          تایید هدر
        </Button>

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
