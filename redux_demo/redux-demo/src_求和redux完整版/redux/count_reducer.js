import { INCREMENT, DECREMENT } from "./constant";
const initCount = 0;
export default function countReducer(preState = initCount, action) {
  const { type, value } = action;
  switch (type) {
    case INCREMENT:
      return preState + value * 1;
    case DECREMENT:
      return preState + value * 1;
    default:
      return preState;
  }
}
