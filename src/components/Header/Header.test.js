import React from "react";
import { SetupComponent } from 'react-component-setup';
import { Header } from "./Header";

const { shallow: setup } = SetupComponent({
  Component: Header,
  elementsToFind: [
    {
      name: 'title',
      query: 'h1'
    },
    {
      name: 'list',
      query: 'ul'
    }
  ]
});

describe("Header", () => {
  let items;

  beforeEach(() => {
    items = setup();
  });

  it("renders without crashing", () => {
    setup();
  });

  it('renders a title', () => {
    const { title } = items;
    expect(title).toMatchSnapshot();
  });

  it('renders a menu bar', () => {
    const { list } = items;
    expect(list).toMatchSnapshot();
  });
});