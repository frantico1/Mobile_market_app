import {configureStore} from '@reduxjs/toolkit';
import productReducer from './features/productReducer';

export const store = configureStore({
  reducer: {
    products: productReducer,
  },
});

export default store;

// import {configureStore} from '@reduxjs/toolkit';
// import rootReducer from './features/productReducer';
// import thunk from 'redux-thunk';

// const store = configureStore({
//   reducer: rootReducer,
//   middleware: [thunk],
// });
