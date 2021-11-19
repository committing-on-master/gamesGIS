import React from "react";
import { useDispatch, useSelector } from 'react-redux'

export const Navbar = () => {

  return (
    <nav className="navbar navbar-expand-sm bg-success navbar-dark">
      <div className="container-fluid">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a className="nav-link active" href="#">Active</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Link</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">Link</a>
          </li>
          <li className="nav-item">
            <a className="nav-link disabled" href="#">Disabled</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}