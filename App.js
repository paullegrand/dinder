import React from 'react';
import { AppLoading } from 'expo';
import { Provider } from 'react-redux';
import Navigation from './navigation';
import configureStore from './configureStore';
import useCachedResources from './hooks/useCachedResources';

const store = configureStore();

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return <AppLoading />
  } else {
    return (
      <Provider store={store}>
        <Navigation />
      </Provider>
    )
  }
}
