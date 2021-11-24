import React, { useState } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { UserElement } from "./account/UserElement";
import logo from "./../../img/logo_nav_64.png"

export const Navbar = () => {
  const [mNavbarPopup, setmNavbarPopup] = useState(false);

  const navbarClassName = `navbar-menu is-pulled-right${mNavbarPopup ? " is-active" : ""}`;
  const burgerClassName = `navbar-burger${mNavbarPopup ? " is-active" : ""}`;
  
  const toggleMobileNavbar = () => setmNavbarPopup(!mNavbarPopup);

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src={logo} width="32" height="32" alt="logo"/>
        </a>

        {/* You can add the modifier class is-active to turn it into a cross. */}
        <a role="button" className={burgerClassName} onClick={toggleMobileNavbar}>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div className={navbarClassName}>
        <div className="navbar-start">
          <a href="/" className="navbar-item">
            Home
          </a>

          <a className="navbar-item">
            Documentation
          </a>

        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <UserElement dropdownAlignDirection="right" />
          </div>
        </div>
      </div>
    </nav>
  );
}