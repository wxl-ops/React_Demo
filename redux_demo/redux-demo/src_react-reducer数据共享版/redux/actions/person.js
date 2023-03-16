import { APPLYPERSON } from "../constant";
export const applyPersonAction = (personObj) => {
  return { type: APPLYPERSON, personObj };
};
