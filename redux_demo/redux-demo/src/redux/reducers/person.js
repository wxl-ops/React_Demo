import { APPLYPERSON } from "../constant";
const initPrePersonObj = [{ id: "001", name: "小明", age: 18 }];
export default function person(prePersonObj = initPrePersonObj, action) {
  const { type, personObj } = action;
  switch (type) {
    case APPLYPERSON:
      return [...prePersonObj, ...personObj];
    default:
      return prePersonObj;
  }
}
