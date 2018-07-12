import React, { Component } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { SetupComponent } from "react-component-setup";
import raven from 'raven-js';
import Button from '@material-ui/core/Button';

jest.mock('raven-js', () => ({
  captureException: jest.fn(),
  lastEventId: jest.fn(),
  showReportDialog: jest.fn()
}));

const { mount: setup } = SetupComponent({
  component: ErrorBoundary,
  defaultProps: {
    children: (
      <div>
        <h1>Children!</h1>
      </div>
    )
  }
});

describe('ErrorBoundary', () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    setup();
  });

  describe('no errors', () => {
    it('renders children', () => {
      expect(setup().wrapper).toMatchSnapshot();
    });
  });

  describe('if child error', () => { // TODO: try to refactor code so error is not logged in jest
    class ThrowErrorChild extends Component {
      render() {
        throw new Error('An error!');
      }
    }

    it('reports error to sentry.io on production', () => {
      process.env.NODE_ENV = 'production';
      setup({
        children: (
          <ThrowErrorChild />
        )
      });
      expect(raven.captureException.mock.calls[0]).toMatchSnapshot();
    });
    it('renders error message and crash report button', () => {
      const { wrapper } = setup({
        children: (
          <ThrowErrorChild />
        )
      });
      expect(wrapper).toMatchSnapshot();
    });
    describe('when user clicks on crash report button', () => {
      it('calls sentry.io showReportDialog', () => {
        raven.lastEventId.mockReturnValue('asdfasd');
        const { wrapper } = setup({
          children: (
            <ThrowErrorChild />
          )
        });

        wrapper.find(Button).simulate('click');
        expect(raven.showReportDialog).toHaveBeenCalled();
      });
    });
  });
});