import {
  incrementAction,
  decrementAction,
  asyncIncrementAction,
} from "../../redux/count_action";
import { connect } from "react-redux";
import React, { useRef } from "react";
function Count(props) {
  const refSelect = useRef(null);
  const increment = () => {
    const value = refSelect.current.value;
    props.increment(value);
  };
  const decrement = () => {
    const value = refSelect.current.value;
    props.decrement(value);
  };
  const incrementIfOdd = () => {
    const value = refSelect.current.value;
    if (props.count % 2) {
      props.increment(value);
    }
  };
  const incrementAsync = () => {
    const value = refSelect.current.value;
    props.asyncIncrement(value, 1000);
  };
  return (
    <div>
      <h2>{props.count}</h2>
      <select ref={refSelect}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      &nbsp;
      <button onClick={increment}>+</button>&nbsp;
      <button onClick={decrement}>-</button>&nbsp;
      <button onClick={incrementIfOdd}>当前求和为奇数再加</button>&nbsp;
      <button onClick={incrementAsync}>异步加</button>&nbsp;
    </div>
  );
}

// function mapStateToProps(state) {
//   return { count: state };
// }
// function mapDispatchToProps(dispatch) {
//   return {
//     increment: (value) => dispatch(incrementAction(value)),
//     decrementAction: (value) => dispatch(decrementAction(value)),
//     asyncIncrementAction: (value, time) =>
//       dispatch(asyncIncrementAction(value, time)),
//   };
// }
export default connect((state) => ({ count: state }), {
  increment: incrementAction,
  decrement: decrementAction,
  asyncIncrement: asyncIncrementAction,
})(Count);
