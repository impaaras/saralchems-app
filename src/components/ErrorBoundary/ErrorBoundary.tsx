import React from 'react';
import {Text, View} from 'react-native';
import ErrorFallback from './ErrorFallback';

type Props = {children: React.ReactNode};
type State = {hasError: boolean; error?: Error};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {hasError: false};
  }

  static getDerivedStateFromError(error: Error) {
    console.log('this is the error on Error fallback', error);
    return {hasError: true, error};
  }

  componentDidCatch(error: Error, info: any) {}

  render() {
    if (this.state.hasError) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ErrorFallback />
        </View>
      );
    }

    return this.props.children;
  }
}
