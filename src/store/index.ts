import { configureStore } from '@reduxjs/toolkit';
import ble from './ble/ble';
import thunk from 'redux-thunk';

const middlewares = [thunk];

if (__DEV__) {
    const createDebugger = require('redux-flipper').default;
    middlewares.push(createDebugger());
}

export const store = configureStore({
    reducer: {
        ble,
    },
    middleware: middlewares,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
