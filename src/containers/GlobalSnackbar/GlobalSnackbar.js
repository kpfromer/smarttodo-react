import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import SpecialSnackbar from "../../components/SpecialSnackbar/SpecialSnackbar";
import { closeSnackbar } from "../../actions/snackbar";

export class GlobalSnackbar extends Component {

  static propTypes = {
    closeSnackbar: PropTypes.func.isRequired,
    isActive: PropTypes.bool.isRequired,
    message: PropTypes.string,
    variant: PropTypes.string,
    timing: PropTypes.number
  };

  render() {
    const { closeSnackbar, isActive, message, variant, timing } = this.props;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={isActive}
        autoHideDuration={timing}
        onClose={closeSnackbar}
      >
        <SpecialSnackbar
          onClose={closeSnackbar}
          variant={variant}
          message={message}
        />
      </Snackbar>
    );
  }
}

const mapStateToProps = state => {
  const { isActive, message, variant, timing } = state.snackbar;
  return {
    isActive,
    message,
    variant,
    timing
  }
};

export default connect(mapStateToProps, { closeSnackbar })(GlobalSnackbar);