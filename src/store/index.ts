import { combineReducers, configureStore } from '@reduxjs/toolkit';
import ble from './ble';
import devices from './devices';
import thunk from 'redux-thunk';

const middlewares = [thunk];

if (__DEV__) {
    const createDebugger = require('redux-flipper').default;
    middlewares.push(createDebugger());
}

const rootReducer = combineReducers({
    ble,
    devices,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: middlewares,
});

export type AppState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
