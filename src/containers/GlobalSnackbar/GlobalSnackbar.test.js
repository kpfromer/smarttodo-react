import { GlobalSnackbar } from "./GlobalSnackbar";
import { SetupComponent } from "react-component-setup";
import Snackbar from '@material-ui/core/Snackbar';
import SpecialSnackbar from "../../components/SpecialSnackbar/SpecialSnackbar";

const { shallow: setup } = SetupComponent({
  component: GlobalSnackbar,
  defaultProps: {
    closeSnackbar: () => {},
    isActive: true,
    message: 'WORKING!',
    variant: 'success',
    timing: 5000
  }
});

describe('GlobalSnackbar', () => {
  let wrapper, mockCloseSnackbar;

  beforeEach(() => {
    mockCloseSnackbar = jest.fn();
    ({ wrapper } = setup({
      closeSnackbar: mockCloseSnackbar
    }));
  });

  it('renders without crashing', () => {
    setup();
  });

  describe('Snackbar', () => {
    let snackbar;

    beforeEach(() => {
      snackbar =  wrapper.find(Snackbar).props();
    });

    it('renders a snackbar', () => {
      expect(snackbar).toMatchSnapshot();
    });
    it('calls closeSnackbar on Snackbar close', () => {
      expect(snackbar.onClose).toBe(mockCloseSnackbar);
    });
  });

  describe('SpecialSnackbar', () => {
    let specialSnackbar;

    beforeEach(() => {
      specialSnackbar =  wrapper.find(SpecialSnackbar).props();
    });

    it('renders a SpecialSnackbar as content', () => {
      expect(specialSnackbar).toMatchSnapshot();
    });
    it('calls closeSnackbar on SpecialSnackbar close', () => {
      expect(specialSnackbar.onClose).toBe(mockCloseSnackbar);
    });
  });
});