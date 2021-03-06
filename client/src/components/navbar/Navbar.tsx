import React, { useState } from "react";
import { UserElement } from "./UserElement";
import logo from "./../../img/logo_nav_64.png"
import { useAppSelector } from "../../store/hooks";
import { accountSelectors } from "../../store/account/state";
import { Link } from "react-router-dom";

import styles from './Navbar.module.scss';

export const Navbar = () => {
  const [mNavbarPopup, setmNavbarPopup] = useState(false);
  const userName = useAppSelector((state) => accountSelectors.UserName(state.account));

  const toggleMobileNavbar = () => setmNavbarPopup(!mNavbarPopup);

  return (
    <nav className={styles.navbar} role="navigation" aria-label="main navigation">
        <div className={styles.item_block}>
          <a className={styles.icon} href="/">
            <img src={logo} width="32" height="32" alt="logo" />
          </a>
          <Link className={styles.item} to="/">Home</Link>
          <Link className={styles.item} to="about">About</Link>

          {userName && <Link className={styles.item} to="mymaps">My maps</Link>}
        </div>

        <UserElement userName={userName} />
    </nav>
  );
}