import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    search: "",
};

export const productSlide = createSlice({
    name: "products",
    initialState: {
        value: 0,
    },
    reducers: {
        searchProduct: (state, action) => {
            state.search = action.payload;
        },
    },
});

// Action creators are generated for each case reducer function
export const { searchProduct } = productSlide.actions;

export default productSlide.reducer;
