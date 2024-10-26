"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import styled from "styled-components";

// import redux
import { useSelector, useDispatch } from "react-redux";
import { deleteUser } from "@/app/Store/thunks";

const AddUserModal = styled(Modal)`
  .modal-dialog {
    max-width: 500px;
  }
  .modal-content {
    background-color: #f0f0f0;
  }
  .modal-header {
    border-bottom: 1px solid #ddd;
    justify-content: space-between;
    button {
      margin: 0;
    }
  }
  .modal-title {
    font-weight: bold;
  }
  .modal-body {
    padding: 20px;
  }
  .form-group {
    margin-bottom: 14px;
  }

  .form-control {
    border: 1px solid #ccc;
    border-radius: 4px;
    padding: 8px 12px;
  }
  .form-control:focus{
     box-shadow: none; 
     border: 1px solid black;   
  }
`;
const AddUserBtnstyle = styled(Button)`
  background-color: #4caf50; /* Green */
  border: none;
  color: white;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #3e8e41;
  }
`;

export default function deleteUserBtn() {



  return (
    <section>
      <div></div>
    </section>
  );
}
