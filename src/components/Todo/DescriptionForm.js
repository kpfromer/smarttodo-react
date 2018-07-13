import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextField from '@material-ui/core/TextField';

export default class DescriptionForm extends Component {

  static propTypes = {
    onUpdate: PropTypes.func.isRequired,
    description: PropTypes.string,
    textFieldProps: PropTypes.object,
    clearOnUpdate: PropTypes.bool
  };

  static defaultProps = {
    description: '',
    textFieldProps: {},
    clearOnUpdate: false
  };

  state = {
    description: this.props.description,
    invalid: false
  };

  updateDescription = event => {
    const value = event.target.value;
    this.setState({
      description: value,
      invalid: value.length === 0
    });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { description } = this.state;
    if (description.length > 0) {
      this.props.onUpdate(description);
      if (this.props.clearOnUpdate) {
        this.setState({ description: '' });
      }
    } else {
      this.setState({ invalid: true })
    }
  };

  render() {
    const { description, invalid } = this.state;
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          {...this.props.textFieldProps}
          value={description}
          error={invalid}
          onChange={this.updateDescription}
          InputLabelProps={{
            shrink: true
          }}
          fullWidth
          margin="normal"
        />
      </form>
    );
  }
}
