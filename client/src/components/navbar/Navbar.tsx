import React, { useState } from "react";
import { UserElement } from "./account/UserElement";
import logo from "./../../img/logo_nav_64.png"
import { useAppSelector } from "../../store/hooks";
import { accountSelectors } from "../../store/account/state";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const [mNavbarPopup, setmNavbarPopup] = useState(false);
  const userName = useAppSelector((state) => accountSelectors.UserName(state.account));

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
          <Link className="navbar-item"  to="/">Home</Link>
          <Link className="navbar-item"  to="about">About</Link>

          {userName && <Link className="navbar-item"  to="howto">How to</Link>}
          {userName && <Link className="navbar-item"  to="mymaps">My maps</Link>}
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <UserElement dropdownAlignDirection="right" userName={userName} />
          </div>
        </div>
      </div>
    </nav>
  );
}