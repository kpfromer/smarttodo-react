import { logout } from "./login";
import { changeSnackbar } from "./snackbar";

export const serverLogout = dispatch => {
  dispatch(changeSnackbar({
    message: 'Redirecting to login. You were logged out.',
    variant: 'info'
  }));
  dispatch(logout());
};