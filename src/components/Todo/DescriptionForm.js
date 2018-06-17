import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class DescriptionForm extends Component {

  static propTypes = {
    onUpdate: PropTypes.func.isRequired,
    description: PropTypes.string,
    className: PropTypes.string,
    invalidClassName: PropTypes.string,
    clearOnUpdate: PropTypes.bool
  };

  static defaultProps = {
    description: '',
    className: '',
    invalidClassName: '',
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
    const { className, invalidClassName } = this.props;
    const invalidStyle = invalid ? invalidClassName : '';
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          className={`${className} ${invalidStyle}`}
          value={description}
          onChange={this.updateDescription}
        />
      </form>
    );
  }
}
