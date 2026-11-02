"use client";

import { PrimaryButton } from "@/app/BaseComponent/Buttons";
import { SearchInputMainDiv } from "@/app/BaseComponent/SearchField";
import { HeadermakeOrder } from "@/app/BaseComponent/PageHeader";
import { useState, useEffect } from "react";

import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
// import base component
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import ConfirmingModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import Pagination from "@/app/BaseComponent/Pagination";
import EmptyState from "@/app/BaseComponent/EmptyState";
//redux import
import { useSelector, useDispatch } from "react-redux";
import { list, deleted } from "../../Store/thunks.js";
import { productListData } from "@/app/Store/slice";
// improt styles
import { Card, CardMedia, Skeleton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { NavDropdown } from "react-bootstrap";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";

const NavDropDown = styled(NavDropdown)`
  .dropdown-menu {
    border: 1px solid var(--c-border);
    width: 150px;
    padding: 12px;
    margin-top: 3px;
    border-radius: 4px;
    box-shadow: var(--shadow-md);
  }
  .dropdown-toggle::after {
    display: none;
  }
`;

const NavBarInsideDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  /* padding-bottom: 10px; */
  /* border-bottom: 1.4px solid #e1e5ea; */
`;

const FixTablePlace = styled.div`
  position: relative;
  overflow: hidden;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-md);
  box-shadow: var(--shadow-sm);
  .fixingTabel {
      padding: 16px 20px;
      margin: 0 !important;
      font-size: 15px;
      font-weight: 600;
      color: var(--c-ink);
      background-color: var(--c-surface);
      border-bottom: 1px solid var(--c-border);
    }
`;

const StyledTable = styled.table`
  th,
  td {
    vertical-align: middle;
  }

  border-collapse: separate;
  border-radius: 12px;
  overflow: hidden;
  width: 100%;

  th,
  td {
    padding: 10px;
    text-align: center;
    vertical-align: middle;
  }
  th {
    background-color: #f9fafb;
  }
`;

const ProductCard = styled(Card)`
  background-color: transparent;
  color: black !important;
  box-shadow: unset;
`;

const ImageWrapper = styled(CardMedia)`
  height: 100px;
  width: 100px;
  margin: 0 auto;
  border-radius: 5px;
  object-fit: cover;
`;

const ButtonColor = PrimaryButton;

export default function HonorsMainComponent({ toggleShow }) {
  const dispatch = useDispatch();

  // add honors
  const [activekey, setActiveKey] = useState("editUserPage");

  const [dataUpdated, setDataUpdated] = useState(false);
  const [trackLoadingProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // edit honors
  const [editedHonor, setEditedHonor] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState(false);
  const [openModal3, setOpenModal3] = useState(false);
  const [dataForDelete, setDataForDelete] = useState(null);

  const closeModal = () => setOpenModal(false);
  const closeModal2 = () => setOpenModal2(false);
  const closeModal3 = () => setOpenModal3(false);

  const datacome = useSelector(productListData);

  const normalizeString = (str) => str.replace(/\s+/g, "").toLowerCase();

  const fetchData = async (page) => {
    try {
      const dataResponse = await dispatch(list({ page, limit: 10 })).unwrap();
      setTotalPages(dataResponse?.pageCount);
      setCurrentPage(dataResponse?.page);
    } catch (error) {
      console.error(error);
    } finally {
      setDataUpdated(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [dataUpdated, currentPage, dispatch]);

  const handleCancelEdit = () => {
    setEditedHonor(null);
  };

  const areYouShureFunction = (product) => {
    setDataForDelete(product);
    setOpenModal(true);
  };

  function closeModalOnTimeout() {
    setTimeout(() => {
      setOpenModal2(false);
    }, 3000);
  }

  useEffect(() => {
    if (!datacome?.data) {
      return;
    }

    let filtered = datacome.data;

    if (searchTerm) {
      const normalizedSearchTerm = normalizeString(searchTerm);

      filtered = filtered.filter((data) => {
        const fullName = `${data.name || ""} ${data.code || ""}`;
        const normalizedFullName = normalizeString(fullName);
        return normalizedFullName.includes(normalizedSearchTerm);
      });
    }

    setFilteredOrders(filtered);
  }, [searchTerm, datacome]);

  const handleDelete = async (e) => {
    e.preventDefault();
    setOpenModal(false);
    try {
      const deleteProduct = await dispatch(
        deleted({ code: dataForDelete.code, name: dataForDelete.name }),
      );

      if (deleteProduct.payload.message === "Success") {
        setOpenModal2(true);
        closeModalOnTimeout();
      } else {
        setOpenModal3(true);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDataUpdated(true);
    }
  };

  return (
    <section>
      <HeadermakeOrder className="d-flex flex-row mb-3 justify-content-between">
        <div className="d-block d-lg-none">
          <NavBarToggleBurgerButton func={() => toggleShow("main")} />
        </div>

        <div>
          {activekey === "editUserPage" && !editedHonor && (
            <>
              <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
                مدیریت محصولات
              </div>
            </>
          )}
          {activekey === "addUser" && !editedHonor && (
            <>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => setActiveKey("editUserPage")}
                className="text-decoration-underline NormalTextSizing textHeaderStyle d-flex align-items-center"
              >
                مدیریت محصولات {`>`} اضافه کردن
              </div>
            </>
          )}
          {editedHonor && (
            <>
              <div
                style={{ cursor: "pointer" }}
                onClick={handleCancelEdit}
                className="NormalTextSizing text-decoration-underline textHeaderStyle d-flex align-items-center"
              >
                مدیریت محصولات {`>`} ویرایش
              </div>
            </>
          )}
        </div>
        <ProfileComponent />
      </HeadermakeOrder>

      <div className="d-flex justify-content-end ms-3">
        {activekey === "editUserPage" && !editedHonor && (
          <>
            <div className="d-flex w-100 align-items-center mt-4 mb-2 justify-content-between">
              {/* فیلد جستجو */}
              <SearchInputMainDiv className="me-2 position-relative">
                <input
                  className="inputSreachStyle"
                  type="text"
                  placeholder="جستجو..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <SearchIcon className="SearchIconStyle" />
              </SearchInputMainDiv>
              <ButtonColor onClick={() => setActiveKey("addUser")}>
                <AddIcon />
                افزودن محصول
              </ButtonColor>
            </div>
          </>
        )}
      </div>

      {activekey === "editUserPage" && !editedHonor && (
        <>
          {trackLoadingProduct ? (
            <FixTablePlace className="container">
              <p className="me-2 NormalTextSizing mb-2 fixingTabel">محصولات</p>
              <Skeleton
                animation="wave"
                variant="rounded"
                className="w-100"
                height={250}
              />
            </FixTablePlace>
          ) : (
            <>
              {filteredOrders && filteredOrders.length > 0 ? (
                <>
                  <FixTablePlace className="container">
                    <p className="me-2 NormalTextSizing mb-2 fixingTabel">
                      محصولات
                    </p>
                    <StyledTable className="table table-striped">
                      <thead>
                        <tr>
                          <th>عکس</th>
                          <th>نام محصول</th>
                          <th className="d-none d-lg-table-cell">کد محصول</th>
                          <th>عملیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders &&
                          filteredOrders?.map((product, index) => (
                            <tr key={index}>
                              <td>
                                {product &&
                                product.info?.imgData?.[0]?.src &&
                                product.info?.imgData?.[0]?.type == 1 ? (
                                  <ProductCard>
                                    <ImageWrapper
                                      component="img"
                                      src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${product.info.imgData[0].src}`}
                                    />
                                  </ProductCard>
                                ) : (
                                  <>
                                    <ImageWrapper
                                      component="img"
                                      src={`/HomeImages/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg`}
                                    />
                                  </>
                                )}
                              </td>
                              <td>{product.name}</td>
                              <td className="d-none d-lg-table-cell">
                                <p
                                  style={{
                                    color: "var(--c-primary)",
                                    cursor: "pointer",
                                  }}
                                  className="text-decoration-underline"
                                  onClick={() => {
                                    setEditedHonor(product);
                                  }}
                                >
                                  {product.code}
                                </p>
                              </td>
                              <td>
                                <NavDropDown
                                  title={
                                    <>
                                      <MoreHorizIcon
                                        style={{
                                          color: "var(--c-ink)",
                                          cursor: "pointer",
                                          fontSize: "28px",
                                        }}
                                      />
                                    </>
                                  }
                                  id="basic-nav-dropdown"
                                >
                                  <NavBarInsideDiv>
                                    <div
                                      onClick={() => {
                                        setEditedHonor(product);
                                      }}
                                      style={{
                                        borderBottom: "1px solid black",
                                        cursor: "pointer",
                                      }}
                                      className="d-flex flex-row gap-2 align-items-center pb-2"
                                    >
                                      <div style={{ color: "var(--c-warning)" }}>
                                        <EditIcon className="subitem" />
                                      </div>
                                      <p className="VodeoDisSizing  text-end">
                                        ویرایش
                                      </p>
                                    </div>

                                    <div
                                      onClick={() =>
                                        areYouShureFunction(product)
                                      }
                                      style={{
                                        cursor: "pointer",
                                      }}
                                      className="d-flex flex-row gap-2 align-items-center mt-2"
                                    >
                                      <div style={{ color: "var(--c-warning)" }}>
                                        <DeleteIcon className="text-danger subitem" />
                                      </div>
                                      <p className="VodeoDisSizing text-end">
                                        حذف
                                      </p>
                                    </div>
                                  </NavBarInsideDiv>
                                  <div className="d-flex justify-content-end"></div>
                                </NavDropDown>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </StyledTable>
                  </FixTablePlace>
                  {/* Pagination Component */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                  />
                </>
              ) : (
                <>
                  <EmptyState
                    illustrationUrl="/illustrations/empty-products.svg"
                    title="هیچ محصولی یافت نشد"
                    description="در حال حاضر محصولی برای نمایش وجود ندارد. محصول جدید اضافه کنید."
                    actionButtonText="افزودن محصول جدید"
                    actionButtonIcon={<AddIcon />}
                    onActionClick={() => setActiveKey("addUser")}
                    variant="grid"
                  />
                </>
              )}
            </>
          )}
        </>
      )}

      {activekey === "addUser" && !editedHonor && (
        <>
          <AddProduct
            setDataUpdated={setDataUpdated}
            setActiveKey={setActiveKey}
          />
        </>
      )}
      {editedHonor && (
        <>
          <EditProduct
            editedHonor={editedHonor}
            handleCancelEdit={handleCancelEdit}
            setEditedHonor={setEditedHonor}
            setDataUpdated={setDataUpdated}
          />
        </>
      )}
      {/* modals */}
      <AreYouShureModal
        open={openModal}
        onClose={closeModal}
        text={"آیا از حذف محصول مطمئن هستید؟"}
        func={handleDelete}
      />
      <ConfirmingModal
        open={openModal2}
        onClose={closeModal2}
        text={"عملیات با موفقیت انجام شد"}
      />
      <ErrorModal
        open={openModal3}
        onClose={closeModal3}
        text={"خطا در انجام عملیات، لطفاً دوباره تلاش کنید"}
      />
    </section>
  );
}
