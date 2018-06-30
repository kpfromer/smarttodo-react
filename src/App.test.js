import React from 'react';
import App from './App';
import { SetupComponent } from "react-component-setup";
import Header from "./components/Header/Header";
import { Switch } from "react-router-dom";

const { shallow: setup } = SetupComponent({
  Component: App
});

describe('App', () => {
  let wrapper;

  beforeEach(() => {
    ({ wrapper } = setup());
  });

  it('renders without crashing', () => {
    setup();
  });

  it('renders a header', () => {
    expect(wrapper.find(Header)).toExist();
  });

  it('renders routes', () => {
    expect(wrapper.find(Switch)).toMatchSnapshot();
  });
});