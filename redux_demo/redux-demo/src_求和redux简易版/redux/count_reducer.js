const initCount = 0;
export default function countReducer(preState = initCount, action) {
  const { type, value } = action;
  switch (type) {
    case "increment":
      return preState + value * 1;
    case "decrement":
      return preState + value * 1;
    default:
      return preState;
  }
}
