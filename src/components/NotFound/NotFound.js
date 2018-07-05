import React, { PureComponent } from 'react';

import styles from './NotFound.module.css';

export default class NotFound extends PureComponent {
  render() {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Page Not Found</h1>
      </div>
    );
  }
}
