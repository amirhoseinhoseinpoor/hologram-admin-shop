// src/app/Store/storeProvider.js

'use client';
import React from 'react';
import { Provider } from 'react-redux';
import store from './store'; // Import the exported store instance

export default function StoreProvider({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
