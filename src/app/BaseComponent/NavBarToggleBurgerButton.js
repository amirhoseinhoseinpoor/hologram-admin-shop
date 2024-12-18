import React from "react";
import style from "../Styles/BaseComponentStyle/NavBarToggleBurgerButton.module.scss";
import { Navbar } from "react-bootstrap";

export default function NavBarToggleBurgerButton({func}) {
  return (
    <Navbar.Toggle
      onClick={func}
      className={`basic-navbar-nav`}
      aria-controls="basic-navbar-nav"
    >
      <div className={style.navIcon3}>
        <span style={{backgroundColor : "black"}}></span>
        <span style={{backgroundColor : "black"}}></span>
        <span style={{backgroundColor : "black"}}></span>
        <span style={{backgroundColor : "black"}}></span>
      </div>
    </Navbar.Toggle>
  );
}
