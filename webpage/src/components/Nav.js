import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Nav.css";

const Nav = () => {
  return (
    <nav>
      <div>
        <NavLink to="/">Home</NavLink>
      </div>
     
      <div>
        <NavLink to="/parkinglot">Parkinglot</NavLink>
      </div>
      <div>
        <NavLink to="/prediction">Prediction</NavLink>
      </div>
     
    </nav>
  );
};

export default Nav;