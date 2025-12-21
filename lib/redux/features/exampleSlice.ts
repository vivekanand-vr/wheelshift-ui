import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Example slice - replace with your actual state
interface ExampleState {
  value: number;
  status: "idle" | "loading" | "succeeded" | "failed";
}

const initialState: ExampleState = {
  value: 0,
  status: "idle",
};

export const exampleSlice = createSlice({
  name: "example",
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
    setStatus: (state, action: PayloadAction<ExampleState["status"]>) => {
      state.status = action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount, setStatus } =
  exampleSlice.actions;

// Selectors
export const selectValue = (state: RootState) => state.example.value;
export const selectStatus = (state: RootState) => state.example.status;

export default exampleSlice.reducer;
