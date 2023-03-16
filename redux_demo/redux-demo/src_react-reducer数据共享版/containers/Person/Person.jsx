// import React, { useRef, useState } from "react";
import React, { useRef } from "react";
import { connect } from "react-redux";
import { applyPersonAction } from "../../redux/actions/person";
import { nanoid } from "nanoid";
function Person(props) {
  // const [personArr, setPersonArr] = useState([]);
  const personArr = props.personObj;
  const input1 = useRef(null);
  const input2 = useRef(null);
  const handleAddPerson = () => {
    // setPersonArr([
    //   ...personArr,
    //   {
    //     id: nanoid(),
    //     name: input1.current.value.trim(),
    //     age: input2.current.value.trim(),
    //   },
    // ]);
    props.applyPerson([
      {
        id: nanoid(),
        name: input1.current.value.trim(),
        age: input2.current.value.trim(),
      },
    ]);
    input1.current.value = "";
    input2.current.value = "";
  };
  const personCopy = [...personArr];
  return (
    <div>
      <input type="text" ref={input1} />
      <input type="text" ref={input2} />
      <input type="button" onClick={handleAddPerson} value="添加" />
      <h2>{props.count}</h2>
      <ul>
        {personCopy?.map((person) => {
          return (
            <li key={person.id}>
              姓名：{person.name}，年龄：{person.age}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default connect(
  (state) => ({ personObj: state.personReducer, count: state.countReducer }),
  {
    applyPerson: applyPersonAction,
  }
)(Person);
