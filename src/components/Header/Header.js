import React from "react";
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { NavLink } from "react-router-dom";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import styles from './Header.module.scss';

export const Header = ({ isAuthenticated }) => {

  const menuItems =
    isAuthenticated ?
      <NavLink id="logout" to="/logout">
        <Button color="inherit">
          Logout
        </Button>
      </NavLink>
      :
      <NavLink id="login" to="/login">
        <Button color="inherit">
          Login
        </Button>
      </NavLink>;

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton className={styles.menuButton} color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="title" color="inherit" className={styles.flex}>
          <NavLink to="/">Smarttodo</NavLink>
        </Typography>
        {menuItems}
      </Toolbar>
    </AppBar>
  )
};

Header.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired
};

export const mapStateToProps = state => ({
  isAuthenticated: !!state.login.token
});

export default connect(mapStateToProps)(Header);