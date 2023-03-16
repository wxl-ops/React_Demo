import { INCREMENT, DECREMENT } from "./constant";

export const incrementAction = (value) => {
  return { type: INCREMENT, value };
};
export const decrementAction = (value) => {
  return { type: DECREMENT, value };
};
export const asyncIncrementAction = (value, time) => {
  console.log(value);
  return (dispatch) => {
    setTimeout(() => {
      dispatch(incrementAction(value));
    }, time);
  };
};
