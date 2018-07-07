import snackbar from './snackbar';
import { CHANGE_SNACKBAR, CLOSE_SNACKBAR } from '../actiontypes/snackbar';

describe('snackbar reducer', () => {
  let state, action;

  describe('CLOSE_SNACKBAR', () => {
    beforeEach(() => {
      state = {
        isActive: true,
        message: 'hello world',
        variant: 'success',
        timing: 5000
      };

      action = {
        type: CLOSE_SNACKBAR
      };
    });

    it('deactivates the snackbar', () => {
      expect(snackbar(state, action)).toEqual({
        ...state,
        isActive: false
      });
    });
  });

  describe('CHANGE_SNACKBAR', () => {
    beforeEach(() => {
      state = {
        isActive: false,
        message: '',
        variant: '',
        timing: 1000
      };

      action = {
        type: CHANGE_SNACKBAR,
        message: 'new!',
        variant: 'success',
        timing: 10000
      };
    });

    it('changes the snackbar\'s message, type, and time and activates it', () => {
      expect(snackbar(state, action)).toEqual({
        message: 'new!',
        variant: 'success',
        timing: 10000,
        isActive: true
      });
    });
  });
});