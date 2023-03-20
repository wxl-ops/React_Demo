import { INCREMENT, DECREMENT } from "../constant";
import store from "../store";
export const increment = (value) => {
  return { type: INCREMENT, value };
};
export const decrement = (value) => {
  return { type: DECREMENT, value };
};
export const asyncIncrement = (value, time) => {
  return () => {
    setTimeout(() => {
      console.log(123);
      store.dispatch(increment(value));
    }, time);
  };
};
