import React, { Component } from 'react';

import Button from '@material-ui/core/Button';
import Raven from 'raven-js';

import styles from './ErrorBoundary.module.css';

export default class ErrorBoundary extends Component {

  state = {
    error: null
  };

  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    if (process.env.NODE_ENV === 'production') {
      Raven.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className={styles.container}>
          <div
            className={styles.content}
          >
            <p>We're sorry — something's gone wrong.</p>
            <p>Our team has been notified, but click below to fill out a report.</p>
            <p>Please try refreshing the page.</p>
          </div>
          <Button variant="contained" onClick={() => Raven.lastEventId() && Raven.showReportDialog()}>
            Send Crash Report
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
