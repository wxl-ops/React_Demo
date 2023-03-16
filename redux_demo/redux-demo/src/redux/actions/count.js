import { INCREMENT, DECREMENT } from "../constant";
import store from "../store";
export const incrementAction = (value) => {
  return { type: INCREMENT, value };
};
export const decrementAction = (value) => {
  return { type: DECREMENT, value };
};
export const asyncIncrementAction = (value, time) => {
  return () => {
    setTimeout(() => {
      console.log(123);
      store.dispatch(incrementAction(value));
    }, time);
  };
};
