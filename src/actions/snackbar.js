import { CHANGE_SNACKBAR, CLOSE_SNACKBAR } from '../actiontypes/snackbar';

export const closeSnackbar = () => ({
  type: CLOSE_SNACKBAR
});

export const changeSnackbar = ({ message, variant, timing = 3000 }) => ({
  type: CHANGE_SNACKBAR,
  message,
  variant,
  timing
});