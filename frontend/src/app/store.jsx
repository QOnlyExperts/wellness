// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';
// import cartReducer from './cartSlice';


const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  // cart: cartReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // getDefaultMiddleware ya incluye thunk
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware(), 
});

export const persistor = persistStore(store);
