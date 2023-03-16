import {
  incrementAction,
  decrementAction,
  asyncIncrementAction,
} from "../../redux/count_action";
import CountUI from "../../components/Count/Count";
import { connect } from "react-redux";
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
  decrementAction: decrementAction,
  asyncIncrementAction: asyncIncrementAction,
})(CountUI);
