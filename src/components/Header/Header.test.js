import React from "react";
import { SetupComponent } from 'react-component-setup';
import { Header, mapStateToProps } from "./Header";
import AppBar from '@material-ui/core/AppBar';

const { shallow: setup } = SetupComponent({
  component: Header,
  defaultProps: {
    isAuthenticated: false
  }
});

describe("Header", () => {
  let items;

  beforeEach(() => {
    items = setup();
  });

  it("renders without crashing", () => {
    setup();
  });

  it('renders a material design AppBar', () => {
    const { wrapper } = setup();
    expect(wrapper.find(AppBar)).toMatchSnapshot();
  });

  it('renders a logout link when the user is logged in', () => {
    const { wrapper } = setup({
      isAuthenticated: true
    });

    expect(wrapper.find('#logout')).toMatchSnapshot();
  });
  it('renders a login link when the user is not logged in', () => {
    const { wrapper } = setup({
      isAuthenticated: false
    });

    expect(wrapper.find('#login')).toMatchSnapshot();
  });
});

describe('mapStateToProps', () => {
  it('make login token to a boolean `isAuthenticated` value', () => {
    const state = {
      login: {
        token: 'jwt-token'
      }
    };
    const expected = {
      isAuthenticated: true
    };
    expect(mapStateToProps(state)).toEqual(expected);
  });
});