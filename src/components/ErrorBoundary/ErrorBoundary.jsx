import React, { Component } from 'react';

import { notifyMessage } from '../../utils';
import EmptyIndicator from '../EmptyIndicator';

export default class ErrorBoundary extends Component {
  state = {};

  componentDidMount() {
    this.setState({ hasError: false });
  }

  componentDidCatch(err) {
    console.log('err :', err);

    this.setState({ hasError: true });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;

    if (!hasError) return children;

    const errorMessage = 'Oops! Something wrong =(';

    notifyMessage('error', errorMessage);

    return <EmptyIndicator label={errorMessage} />;
  }
}
