import React from 'react';
import Header from '../../components/Header';
import Side from '../../components/Side';
import Style from './index.less';

export default function BaseLayout(props) {
  return (
    <div className={Style.container}>
      <button
        onClick={() => {
          console.log(1);
        }}
      >
        点我点我
      </button>
      <Header />
      <Side />
      {props.children}
    </div>
  );
}
