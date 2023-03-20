import { APPLYPERSON } from "../constant";
export const applyPerson = (personObj) => {
  return { type: APPLYPERSON, personObj };
};
