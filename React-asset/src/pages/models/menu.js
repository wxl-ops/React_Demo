import {
  GetCataloguelist,
  Postinster,
  Postupdate,
} from '@/api/system/menu-api.js';
import router from '@/routes';
import { notification } from 'antd';

function getlist(row) {
  row.forEach((item) => {
    if (item.childrenList) {
      getlist(item.childrenList);
    }
    item.key = item.id;
    if (item.value) {
      item.dictValue = item.value;
    } else {
      item.dictValue = item.id;
    }
  });
}

function getstatust(status) {
  let text;
  if (status == 1) {
    text = '菜单';
  } else if (status == 2) {
    text = '按钮';
  } else if (status == 3) {
    text = '文件夹';
  }
  return text;
}

export default {
  namespaced: 'menu',
  state: {
    list: [],
  },
  reducers: {
    setList(state, { payload: list }) {
      return {
        ...state,
        list,
      };
    },
  },
  effects: {
    *getcataloguelist({ payload }, { call, put }) {
      let res = yield call(GetCataloguelist, payload);
      if (res.code == 200) {
        let arr = JSON.parse(JSON.stringify(res.data));
        getlist(arr);
        yield put({
          type: 'setList',
          payload: arr,
        });
      }
    },
    *inster({ payload }, { call, put }) {
      let res = yield call(Postinster, payload);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `${getstatust(payload.status)}:${
            payload.name
          }已添加成功`,
        });
        return true;
      }
    },
    *update({ payload }, { call, put }) {
      let res = yield call(Postupdate, payload);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `${getstatust(payload.status)}:${
            payload.name
          }已修改成功`,
        });
        return true;
      }
    },
    *delete({ payload }, { call, put }) {
      let res = yield call(Postupdate, payload);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `${getstatust(payload.status)}:${
            payload.name
          }已删除成功`,
        });
        return true;
      }
    },
  },
};
