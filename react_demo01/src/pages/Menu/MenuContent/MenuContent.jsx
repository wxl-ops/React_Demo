import React from "react";
import MenuHeader from "../../../components/MenuHeader/MenuHeader";
import { useSearchParams } from "react-router-dom";
export default function MenuContent() {
  // let params = useParams();
  let [search] = useSearchParams();
  console.log(search.get("search"));
  return (
    <div>
      <MenuHeader />
      {/* <h2>{params.params}</h2> */}
      <h2>{search.get("search")}</h2>
    </div>
  );
}
