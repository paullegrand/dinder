import React from 'react';
import { Provider } from 'react-redux';
import { Navigation } from './navigation';
import configureStore from './configureStore';

const store = configureStore();

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    )
  }
}
