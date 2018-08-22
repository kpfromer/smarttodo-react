import React, { Component, Fragment } from "react";
import PropTypes from 'prop-types';

import FindLinks from '../FindLinks/FindLinks';
import DescriptionForm from "./DescriptionForm";
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import { withTheme } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';

export class Todo extends Component {

  static propTypes = {
    description: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
    onCheck: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired
  };

  state = {
    editing: false
  };

  checkTodo = event => this.props.onCheck(event.target.checked);
  removeTodo = () => this.props.onRemove();

  startEditing = () =>
    this.setState({ editing: true });

  handleUpdate = description => {
    this.setState({ editing: false });
    this.props.onUpdate(description);
  };

  stopPropagation = event =>
    event.stopPropagation();

  handleDescriptionLink = ({ raw, url }) => (
      <a
        key={raw}
        style={{ color: this.props.theme.palette.secondary.main }}
        target="_blank"
        onClick={this.stopPropagation}
        href={url}
      >
        {raw}
      </a>
    );

  render() {
    const { description, completed } = this.props;

    const body = !this.state.editing ?
      <Fragment>
        <Checkbox
          checked={completed}
          onChange={this.checkTodo}
          tabIndex={1}
        />
        <ListItemText onClick={this.startEditing}>
          <FindLinks
            handleLink={this.handleDescriptionLink}
          >
          {description}
          </FindLinks>
        </ListItemText>
        <ListItemSecondaryAction>
          <IconButton onClick={this.removeTodo} aria-label="Delete">
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </Fragment>
      :
      <ListItemText>
        <DescriptionForm textFieldProps={{ autoFocus: true }} description={description} onUpdate={this.handleUpdate} />
      </ListItemText>;

    return (
        <ListItem divider>
          {body}
        </ListItem>
    );
  }
}

export default withTheme()(Todo);