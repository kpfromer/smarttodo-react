import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import styles from './Home.module.css';

export default class Home extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.main}>
          <Typography variant="display4" color="primary">Smarttodo</Typography>
          <Typography variant="display1" gutterBottom>A homework planner for students</Typography>
          <Typography paragraph>
            A student's day is busy and you may forget things, We get that.
            That's why Smarttodo's categorizes your homework by classes and sends you reminders.
          </Typography>
        </div>
      </div>
    );
  }
}