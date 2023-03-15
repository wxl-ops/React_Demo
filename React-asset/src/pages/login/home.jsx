import React, { useState, useEffect } from 'react';
import { Skeleton, Button } from 'antd';
import { connect } from 'dva';
// import modelfile from '@/assets/file/model.xlsx'

function home(props) {
  const { dispatch, home } = props;
  const [loading, setloading] = useState(false);
  useEffect(() => {}, []);

  return (
    <div>
      首页 敬请期待
      <Skeleton active />
    </div>
  );
}
export default connect(({ home }) => {
  return { home };
})(home);
