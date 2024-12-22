"use client";

import React, { useState, useEffect } from "react";

import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
// import base component
import ProfileComponent from "@/app/BaseComponent/ProfileComponent";
import NavBarToggleBurgerButton from "@/app/BaseComponent/NavBarToggleBurgerButton";
//redux import
import { useSelector, useDispatch } from "react-redux";
import { list } from "../../Store/thunks.js";
import { productListData } from "@/app/Store/slice";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
} from "@mui/material";
import styled from "styled-components";

const HeadermakeOrder = styled.div`
  padding: 10px;
  color: white;
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
  }
  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
`;

const ProductCard = styled(Card)`
  background-color: white !important;
  color: black !important;
  border: 1px solid #ddd;
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
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;
  @media (max-width: 980px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
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

  // edit honors
  const [editedHonor, setEditedHonor] = useState(null);

  const datacome = useSelector(productListData);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsData = await dispatch(list()).unwrap();
      setProducts(productsData);
    };
    fetchProducts();
  }, [dispatch]);

  const handleEditProduct = (product) => {
    setEditedProduct(product);
    setActiveKey("editProduct");
  };

  const handleCancelEdit = () => {
    setEditedProduct(null);
    setActiveKey("viewProducts");
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
                ویرایش محصولات
              </div>
            </>
          )}
          {activekey === "addUser" && !editedHonor && (
            <>
              <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
                افزودن محصول
              </div>
            </>
          )}
          {editedHonor && (
            <>
              <div className="NormalTextSizing textHeaderStyle d-flex align-items-center">
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
        <TableContainer>
          <StyledTable>
            <thead>
              <tr>
                <th>عکس</th>
                <th>نام محصول</th>
                <th>کد محصول</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {datacome &&
                datacome?.map((product, index) => (
                  <tr key={index}>
                    <td>
                      {datacome && datacome.info?.imgData?.[0]?.src && (
                        <ProductCard>
                          <ImageWrapper
                            component="img"
                            src={`${process.env.NEXT_PUBLIC_BACK_END_SERVER}/system/download/${product.info.imgData[0].src}`}
                          />
                        </ProductCard>
                      )}
                    </td>
                    <td>{product.name}</td>
                    <td>{product.code}</td>
                    <td>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleEditProduct(product)}
                      >
                        ویرایش
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      )}

      {activekey === "editUserPage" && !editedHonor && (
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
            {/* {honorsData.map((honor, index) => (
              <React.Fragment key={index}>
                <CARD
                  className="d-flex flex-row"
                  onClick={() => {
                    setEditedHonor(honor);
                    setContent(honor.content); // Set content when editing
                  }}
                >
                  <CardMedia
                    component="img"
                    src={honor.src}
                    sx={{
                      width: "120px",
                      maxHeight: "100%",
                      borderRadius: "2px",
                    }}
                  />
                  <CardContent className="d-flex flex-column justify-content-around">
                    <Typography className="titleHonors">
                      {honor.title}
                    </Typography>
                    <Typography className="dateHonors">{honor.date}</Typography>
                  </CardContent>
                </CARD>
              </React.Fragment>
            ))} */}
          </GridbaseDiv>
        </>
      )}

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
    </section>
  );
}
