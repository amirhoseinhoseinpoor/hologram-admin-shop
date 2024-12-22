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
//redux import
import { useSelector, useDispatch } from "react-redux";
import { list } from "../../Store/thunks.js";
import { productListData } from "@/app/Store/slice";
import { deleted } from "../../Store/thunks.js";
// improt styles
import { Card, CardMedia, Typography } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { NavDropdown } from "react-bootstrap";
import styled from "styled-components";

const NavDropDown = styled(NavDropdown)`
  .dropdown-menu {
    border: 1px solid gray;
    width: 230px;
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
  background-color:rgb(225, 223, 223);
  border-radius: 4px;
  .textHeaderStyle {
    color: black;
  }
  @media (max-width: 980px) {
    .textHeaderStyle {
      color: black;
    }
  }
`;

const TableContainer = styled.div`
  margin-top: 20px;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  th,
  td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    vertical-align: middle;
  }
  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
`;

const ProductCard = styled(Card)`
  background-color: #f5f5f5;
  color: black !important;
  /* border: 1px solid #ddd; */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
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

const GridbaseDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px;
  @media (max-width: 980px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const ButtonColor = styled.button`
  background-image: linear-gradient(195deg, #66bb6a 0%, #43a047 100%);
`;

const TYPOGRAPHY = styled(Typography)`
  font-family: unset !important;
  font-size: 17px !important;
`;

export default function HonorsMainComponent({ toggleShow }) {
  const dispatch = useDispatch();

  // add honors
  const [activekey, setActiveKey] = useState("editUserPage");

  const [dataUpdated, setDataUpdated] = useState(false);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(list());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setDataUpdated(false);
      }
    };
    fetchData();
  }, [dispatch, dataUpdated]);

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
              <div className="NormalTextSizing text-decoration-underline textHeaderStyle d-flex align-items-center">
                ویرایش محصولات
              </div>
            </>
          )}
          {activekey === "addUser" && !editedHonor && (
            <>
              <div className="text-decoration-underline NormalTextSizing textHeaderStyle d-flex align-items-center">
                افزودن محصول
              </div>
              
            </>
          )}
          {editedHonor && (
            <>
              <div className="NormalTextSizing text-decoration-underline textHeaderStyle d-flex align-items-center">
                ویرایش محصول
              </div>
            </>
          )}
        </div>
        <ProfileComponent colorGet={"#191919"} />
      </HeadermakeOrder>

      <div className="d-flex  justify-content-end ms-3">
        {activekey === "editUserPage" && !editedHonor && (
          <>
            <div>
              <ButtonColor onClick={() => setActiveKey("addUser")}>
                افزودن محصول
              </ButtonColor>
            </div>
          </>
        )}
        {activekey === "addUser" && !editedHonor && (
          <>
            <div>
              <ButtonColor onClick={() => setActiveKey("editUserPage")}>
                ویرایش محصولات
              </ButtonColor>
            </div>
          </>
        )}
        {editedHonor && (
          <>
            <div>
              <ButtonColor onClick={handleCancelEdit}>محصولات</ButtonColor>
            </div>
          </>
        )}
      </div>

      {activekey === "editUserPage" && !editedHonor && (
        <TableContainer className="container">
          <StyledTable>
            <thead>
              <tr>
                <th>عکس</th>
                <th>نام محصول</th>
                <th className="d-none d-lg-table-cell">کد محصول</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {datacome &&
                datacome?.map((product, index) => (
                  <tr key={index}>
                    <td>
                      {product && product.info?.imgData?.[0]?.src && (
                        <ProductCard>
                          <ImageWrapper
                            component="img"
                            src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${product.info.imgData[0].src}`}
                          />
                        </ProductCard>
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td className="d-none d-lg-table-cell">{product.code}</td>
                    <td>
                      {/* <Button
                        style={{fontFamily : "unset"}}
                        variant="contained"
                        color="secondary"
                        onClick={() => handleEditProduct(product)}
                      >
                        ویرایش
                      </Button> */}
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
                            <p className="VodeoDisSizing  text-end">ویرایش</p>
                            <div style={{ color: "#F3802C" }}>
                              <EditIcon className="subitem" />
                            </div>
                          </div>

                          <div
                            onClick={() => areYouShureFunction(product)}
                            style={{
                              cursor: "pointer",
                            }}
                            className="d-flex flex-row gap-2 align-items-center mt-2"
                          >
                            <p className="VodeoDisSizing text-end">حذف</p>
                            <div style={{ color: "#F3802C" }}>
                              <DeleteIcon className="text-danger subitem" />
                            </div>
                          </div>
                        </NavBarInsideDiv>
                        <div className="d-flex justify-content-end"></div>
                      </NavDropDown>
                    </td>
                  </tr>
                ))}
            </tbody>
          </StyledTable>
        </TableContainer>
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
          <AddProduct />
        </>
      )}
      {editedHonor && (
        <>
          <EditProduct
            editedHonor={editedHonor}
            handleCancelEdit={handleCancelEdit}
            setEditedHonor={setEditedHonor}
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
