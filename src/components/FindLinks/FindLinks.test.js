import React from 'react';
import { shallow } from 'enzyme';

describe('FindLinks', () => {
  let FindLinks, Linkify, Tlds, mockTlds, mockMatch;
  beforeEach(() => {
    jest.doMock('linkify-it');
    jest.doMock('tlds');
    Linkify = require('linkify-it');
    Tlds = require('tlds');

    mockTlds = jest.fn();
    mockMatch = jest.fn();
    
    Linkify.mockReturnValue({
      tlds: mockTlds,
      match: mockMatch
    })

    FindLinks = require('./FindLinks').default;
  });
  afterEach(() => {
    jest.resetAllMocks();
  });
  it('constructs a new linkify with valid tlds', () => {
    shallow(
      <FindLinks handleLink={() => {}}>
        hello
      </FindLinks>
    );
    expect(Linkify).toHaveBeenCalled();
    expect(mockTlds).toHaveBeenCalledWith(Tlds);
  });
  // Finds and replaces with method
  // Check for literal edge cases
  it('returns an array of custom links with text', () => {
    const text = 'http://google.com hello world I need to check out example.com';
    mockMatch
      .mockReturnValue([{
              index: 0,
              lastIndex: 17,
              linkVal: 'google'
            },
            {
              index: 50,
              lastIndex: 62,
              linkVal: 'example'
            }
          ]);
    const handleLink = link => <h1 key={link.linkVal}>{link.linkVal}</h1>;
    const result = shallow(
      <FindLinks handleLink={handleLink}>
        {text}
      </FindLinks>
    );
    expect(result).toMatchSnapshot();
  });
});