import reducer, { addStroke, undo, redo } from "./canvasSlice";

const stroke1 = { id: "1", points: [{ x: 0, y: 0 }] };
const stroke2 = { id: "2", points: [{ x: 10, y: 10 }] };

describe("canvasSlice", () => {
  it("should add strokes correctly", () => {
    let state = reducer(undefined, { type: "@@INIT" });

    state = reducer(state, addStroke(stroke1));
    expect(state.strokes).toEqual([stroke1]);

    state = reducer(state, addStroke(stroke2));
    expect(state.strokes).toEqual([stroke1, stroke2]);
    expect(state.history.length).toBe(2);
  });

  it("should undo correctly", () => {
    let state = reducer(undefined, { type: "@@INIT" });

    state = reducer(state, addStroke(stroke1));
    state = reducer(state, addStroke(stroke2));

    state = reducer(state, undo());
    expect(state.strokes).toEqual([stroke1]);
    expect(state.future.length).toBe(1);
  });

  it("should redo correctly", () => {
    let state = reducer(undefined, { type: "@@INIT" });

    state = reducer(state, addStroke(stroke1));
    state = reducer(state, addStroke(stroke2));
    state = reducer(state, undo());
    state = reducer(state, redo());

    expect(state.strokes).toEqual([stroke1, stroke2]);
  });
});
