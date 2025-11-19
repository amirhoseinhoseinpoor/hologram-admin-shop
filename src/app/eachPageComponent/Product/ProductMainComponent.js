"use client";

import React, { useState, useEffect } from "react";

import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
// import base component
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import AreYouShureModal from "@/app/BaseComponent/AreYouSureModal";
import ConfirmingModal from "@/app/BaseComponent/ConfirmingModal";
import ErrorModal from "@/app/BaseComponent/ErrorModal";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
import Pagination from "@/app/BaseComponent/Pagination";
//redux import
import { useSelector, useDispatch } from "react-redux";
import { list } from "../../Store/thunks.js";
import { productListData } from "@/app/Store/slice";
import { deleted } from "../../Store/thunks.js";
// improt styles
import { Card, CardMedia, Typography, Skeleton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { NavDropdown } from "react-bootstrap";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";

const NavDropDown = styled(NavDropdown)`
  .dropdown-menu {
    border: 1px solid gray;
    width: 150px;
    padding: 12px;
    margin-top: 3px;
    border-radius: 4px;
    box-shadow: 1px 1px 5px gray;
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

const HeadermakeOrder = styled.div`
  padding: 10px;
  color: white;
  background-color: rgb(225, 223, 223);
  border-radius: 4px;
  margin: 7px 15px;
  .textHeaderStyle {
    color: black;
  }
  @media (max-width: 980px) {
    .textHeaderStyle {
      color: black;
    }
  }
`;

const SearchInputMainDiv = styled.div`
  width: 50%;
  .inputSreachStyle {
    font-size: 15px;
    width: 100%;
    padding: 4px;
  }
  .SearchIconStyle {
    position: absolute;
    transform: translate(50%, -50%);
    left: 0;
    top: 50%;
  }
`;

const FixTablePlace = styled.div`
  position: relative;
  margin-top: 60px;
  .fixingTabel {
    position: absolute;
    transform: translate(-50%, 50%);
    left: 50%;
    width: 94%;
    top: -55px;
    border-radius: 10px;
    padding: 18px 12px;
    background-image: linear-gradient(195deg, #42424a 0%, #191919 100%);
    color: white;
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
    background-color: #f2f2f2;
    padding-top: 55px;
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

const CARD = styled(Card)`
  background-color: white !important;
  color: black !important;
  border: 1px solid #ddd;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  .MuiCardContent-root {
    .titleHonors {
      font-size: 20px;
      font-weight: 500;
    }
  }
  .css-46bh2p-MuiCardContent-root:last-child {
    padding-bottom: 10px;
  }
`;

const ButtonColor = styled.button`
  background-image: linear-gradient(195deg, #66bb6a 0%, #43a047 100%);
`;

export default function HonorsMainComponent({ toggleShow }) {
  const dispatch = useDispatch();

  // add honors
  const [activekey, setActiveKey] = useState("editUserPage");

  const [dataUpdated, setDataUpdated] = useState(false);
  const [trackLoadingProduct, setTrackLoadingProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  console.log(filteredOrders);
  

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

  // console.log(datacome);

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

  const handleEditProduct = (product) => {
    setEditedHonor(product);
  };

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
        deleted({ code: dataForDelete.code, name: dataForDelete.name })
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
        <ProfileComponent colorGet={"#191919"} />
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
                افزودن محصول
              </ButtonColor>
            </div>
          </>
        )}
        {/* {activekey === "addUser" && !editedHonor && (
          <>
            <div>
              <ButtonColor onClick={() => setActiveKey("editUserPage")}>
                ویرایش محصولات
              </ButtonColor>
            </div>
          </>
        )} */}
        {/* {editedHonor && (
          <>
            <div>
              <ButtonColor onClick={handleCancelEdit}>محصولات</ButtonColor>
            </div>
          </>
        )} */}
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
                                {product && product.info?.imgData?.[0]?.src && product.info?.imgData?.[0]?.type == 1  ? (
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
                                    color: "#43A047",
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
                                          color: "#191919",
                                          cursor: "pointer",
                                          fontSize: "28px",
                                          cursor: "pointer",
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
                                      <div style={{ color: "#F3802C" }}>
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
                                      <div style={{ color: "#F3802C" }}>
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
                  <p className="me-2 NormalTextSizing mb-2">
                    هیچ سفارشی یافت نشد.
                  </p>
                </>
              )}
            </>
          )}
        </>
      )}

      {/* {activekey === "editUserPage" && !editedHonor && (
        <>
          <GridbaseDiv className="mt-3 container" style={{ cursor: "pointer" }}>
            {datacome &&
              datacome.map((data, index) => (
                <div key={index}>
                  <CARD
                    onClick={() => {
                      setEditedHonor(data);
                    }}
                  >
                    {data.info.imgData && (
                      <CardMedia
                        component="img"
                        src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${data.info.imgData[0].src}`}
                        sx={{
                          width: "100%",
                          maxHeight: "100%",
                          borderRadius: "2px",
                        }}
                      />
                    )}

                    <CardContent className="d-flex flex-column justify-content-around">
                      <TYPOGRAPHY className="titleHonors">
                        {data.name}
                      </TYPOGRAPHY>
                      <div className="d-flex flex-row gap-2">
                        <p>کد محصول :</p>
                        <TYPOGRAPHY className="dateHonors">
                          {data.code}
                        </TYPOGRAPHY>
                      </div>
                    </CardContent>
                  </CARD>
                </div>
              ))}
           
          </GridbaseDiv>
        </>
      )} */}

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
        text={"ایا از حذف محصول مطمعن هستید"}
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
        text={"خطا از لاگین بودن خود اطمینان حاصل فرمایید"}
      />
    </section>
  );
}
