import * as snackbar from './snackbar';
import { CHANGE_SNACKBAR, CLOSE_SNACKBAR } from '../actiontypes/snackbar';

describe('snackbar actions', () => {
  describe('closeSnackbar', () => {
    it('closes the snackbar', () => {
      expect(snackbar.closeSnackbar()).toEqual({
        type: CLOSE_SNACKBAR
      });
    });
  });

  describe('changeSnackbar', () => {
    it('changes message, variant, and timing', () => {
      const message = 'hello world';
      const variant = 'success';
      const timing = 666;
      expect(snackbar.changeSnackbar({ message, variant, timing })).toEqual({
        type: CHANGE_SNACKBAR,
        message,
        variant,
        timing
      });
    });
  });
});