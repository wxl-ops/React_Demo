import {
  GetorganizationListUser,
  GetorganizationList,
  Postinster,
  Postupdate,
} from '@/api/system/structure-api.js';
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
export default {
  namespaced: 'structure',
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
    *structurelist({ payload }, { call, put }) {
      let res = yield call(GetorganizationList, payload);
      if (res.code == 200) {
        let arr = JSON.parse(JSON.stringify(res.data));
        yield put({
          type: 'setList',
          payload: res.data,
        });
      }
    },
    *structurelistuser({ payload }, { call, put }) {
      let res = yield call(GetorganizationListUser, payload);
      if (res.code == 200) {
        let arr = JSON.parse(JSON.stringify(res.data));
        yield put({
          type: 'setList',
          payload: res.data,
        });
      }
    },
    *inster({ payload }, { call, put }) {
      let res = yield call(Postinster, payload);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `节点:${payload.name}已添加成功`,
        });
        return true;
      }
    },
    *update({ payload }, { call, put }) {
      let res = yield call(Postupdate, payload);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `节点:${payload.name}已修改成功`,
        });
        return true;
      }
    },
    *delete({ payload }, { call, put }) {
      let res = yield call(Postupdate, payload);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `节点:${payload.name}已删除成功`,
        });
        return true;
      }
    },
  },
};
