import { CHANGE_SNACKBAR, CLOSE_SNACKBAR } from '../actiontypes/snackbar';

export function snackbar
(
  state = {
    isActive: false,
    message: '',
    variant: '',
    timing: 5000
  },
  action
) {
  switch (action.type) {
    case CLOSE_SNACKBAR:
      return {
        ...state,
        isActive: false
      };
    case CHANGE_SNACKBAR:
      return {
        ...state,
        isActive: true,
        message: action.message,
        variant: action.variant,
        timing: action.timing
      };
    default:
      return state;
  }
}

export default snackbar;