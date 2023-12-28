import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  barcod: '',
  isLogin: true,
};

export const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setBarcodeId: (state, action) => {
      state.barcod = action.payload;
    },
    setLogin: (state, action) => {
      state.isLogin = action.payload;
    },
  },
});

export const {setBarcodeId, setLogin} = productSlice.actions;

export default productSlice.reducer;
