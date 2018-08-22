import React, { Component, Fragment } from 'react'
import { PropTypes } from 'prop-types';
import Linkify from 'linkify-it';
import tlds from 'tlds';

export default class FindLinks extends Component {

  static propTypes = {
    children: PropTypes.string.isRequired,
    handleLink: PropTypes.func.isRequired
  };

  linkify;
  
  componentWillMount() {
    const link = Linkify();
    link.tlds(tlds);
    this.linkify = link;
  }

  errorIfChildrenAreNotPlainText = () => {
    if (React.Children) {
      React.Children.forEach(child => {
        if (React.isValidElement(child)) {
          throw new TypeError('Children of FindLinks must be plain text.');
        }
      })
    }
  }

  splitAtLinks = (string, links, replace = link => link.raw) => {
    const spiltUp = [];
    let prevIndex = 0;
    links.forEach((link, index, list) => {
      const items = [];
      const preText = string.substring(prevIndex, link.index);
      if (preText) {
        items.push(preText);
      }
      items.push(replace(link));
      if (index === list.length - 1) { // last link
        const postText = string.substring(link.lastIndex);
        if (postText) {
          items.push(postText); // Add everything to the right in the `string` since we are not going to loop again
        }
      }
      spiltUp.push(...items);
      prevIndex = link.lastIndex;
    });
    return spiltUp;
  }

  render() {
    this.errorIfChildrenAreNotPlainText();
    const { children, handleLink } = this.props;
    const links = this.linkify.match(children);
    if (!links) {
      return children;
    }
    // TODO: replace with returning an array when enzyme issue is fixed
    // https://github.com/airbnb/enzyme/issues/1149
    const elements = this.splitAtLinks(children, links, handleLink);
    return <Fragment>{elements}</Fragment>
  }
}
