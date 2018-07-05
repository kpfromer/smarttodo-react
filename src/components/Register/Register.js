import React, { Component } from 'react';

export default class Register extends Component {
  render() {
    return (
      <Fragment>
        <div className={styles.container}>
          <Card className={styles.card}>
            <FormValidator onSubmit={this.handleSubmit}>
              <CardContent>
                <Typography variant="title">
                  Login
                </Typography>
                <TextValidator
                  autoFocus
                  margin="dense"
                  label="Username"
                  type="text"
                  fullWidth
                  name="username"
                  value={this.state.username}
                  onChange={this.updateValue('username')}
                  validate={this.validate}
                />
                <TextValidator
                  autoFocus
                  margin="dense"
                  label="Password"
                  type="password"
                  name="password"
                  value={this.state.password}
                  fullWidth
                  onChange={this.updateValue('password')}
                  validate={this.validate}
                />
              </CardContent>
              <CardActions className={styles.cardActions}>
                <Button type="submit" size="medium" color="primary">
                  Submit
                </Button>
              </CardActions>
            </FormValidator>
          </Card>
        </div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={this.state.loginError}
          autoHideDuration={3000}
          onClose={this.handleClose}
        >
          <SpecialSnackbar
            onClose={this.handleClose}
            variant="error"
            message={this.state.errorMessage}
          />
        </Snackbar>
      </Fragment>
    );
  }
}
