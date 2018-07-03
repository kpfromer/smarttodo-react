import React from "react";
import { SetupComponent } from "react-component-setup";
import { PrivateRoute } from "./PrivateRoute";

const { shallow: setup } = SetupComponent({
  component: PrivateRoute
});

const CustomComponent = () => (
  <h1>hello world</h1>
);

describe('PrivateRoute', () => {
  let component, routerProps;

  beforeEach(() => {
    component = CustomComponent;
    routerProps = {
      hello: 'world',
      my: 'name is kyle'
    };
  });

  it('renders without crashing', () => {
    setup();
  });

  it('renders a route to component if `isAuthenticated`', () => {
    const { wrapper } = setup({
      component,
      isAuthenticated: true
    });

    expect(wrapper.props().render(routerProps)).toMatchSnapshot();
  });

  it('renders a route that redirects users to `/login` if not `isAuthenticated`', () => {
    const { wrapper } = setup({
      component,
      isAuthenticated: false
    });

    expect(wrapper.props().render(routerProps)).toMatchSnapshot();
  });

  it('passes the rest of it\'s props to the Route', () => {
    const { wrapper } = setup({
      component,
      isAuthenticated: false,
      otherProps: 'needed',
      to: '/an-example-location'
    });

    expect(wrapper).toMatchSnapshot();
  });
});