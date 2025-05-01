import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Point {
  x: number;
  y: number;
}

interface Stroke {
  points: Point[];
  id: string;
}

interface CanvasState {
  strokes: Stroke[];
  history: Stroke[][];
  future: Stroke[][];
}

const initialState: CanvasState = {
  strokes: [],
  history: [],
  future: [],
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    addStroke: (state, action: PayloadAction<Stroke>) => {
      state.history.push(state.strokes);
      state.strokes = [...state.strokes, action.payload];
      state.future = [];
    },
    undo: (state) => {
      if (state.history.length === 0) return;
      state.future.unshift(state.strokes);
      state.strokes = state.history.pop()!;
    },
    redo: (state) => {
      if (state.future.length === 0) return;
      state.history.push(state.strokes);
      state.strokes = state.future.shift()!;
    },
  },
});

export const { addStroke, undo, redo } = canvasSlice.actions;
export default canvasSlice.reducer;
