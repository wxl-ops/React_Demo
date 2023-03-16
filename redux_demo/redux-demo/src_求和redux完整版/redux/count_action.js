import { INCREMENT, DECREMENT } from "./constant";
export function incrementAction(value) {
  return { type: INCREMENT, value };
}
export function decrementAction(value) {
  return { type: DECREMENT, value };
}
