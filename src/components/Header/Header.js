import React from "react";
import { NavLink } from "react-router-dom";

import styles from './Header.module.scss';

export const Header = () =>
  <div className={styles.mainContainer}>
    <div className={`container ${styles.navContainer}`}>
      <h1 className={styles.title}>
        <NavLink to="/">Smarttodo</NavLink>
      </h1>
      <ul className={styles.navList}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </ul>
    </div>
  </div>;