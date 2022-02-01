import React, { useState } from "react";
import { UserElement } from "./UserElement";
import logo from "./../../img/logo_nav_64.png"
import { useAppSelector } from "../../store/hooks";
import { accountSelectors } from "../../store/account/state";
import { Link } from "react-router-dom";

import "./Navbar.scss";

export const Navbar = () => {
  const [mNavbarPopup, setmNavbarPopup] = useState(false);
  const userName = useAppSelector((state) => accountSelectors.UserName(state.account));

  const toggleMobileNavbar = () => setmNavbarPopup(!mNavbarPopup);

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar__start">
          <a className="navbar__icon" href="/">
            <img src={logo} width="32" height="32" alt="logo" />
          </a>
          <Link className="navbar__item" to="/">Home</Link>
          <Link className="navbar__item" to="about">About</Link>

          {userName && <Link className="navbar__item" to="howto">How to</Link>}
          {userName && <Link className="navbar__item" to="mymaps">My maps</Link>}
        </div>

        <div className="navbar__end">
          <UserElement userName={userName} />
        </div>
    </nav>
  );
}