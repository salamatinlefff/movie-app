import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { notifyMessage } from '../../utils';
import EmptyView from '../EmptyView';

export default class ErrorBoundary extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  state = {};

  componentDidMount() {
    this.setState({ hasError: false });
  }

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (!hasError) return children;

    const errorMessage = 'Oops! Something wrong =(';

    notifyMessage('error', errorMessage);

    return <EmptyView label={errorMessage} />;
  }
}
