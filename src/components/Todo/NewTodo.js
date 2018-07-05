import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DescriptionForm from "./DescriptionForm";

export default class NewTodo extends PureComponent {

  static propTypes = {
    onCreate: PropTypes.func.isRequired
  };

  render() {
    return (
      <ListItem>
        <ListItemText>
          <DescriptionForm clearOnUpdate onUpdate={this.props.onCreate}/>
        </ListItemText>
      </ListItem>
    );
  }
}
