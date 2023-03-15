import {
  GetRoleByPage,
  GetRolelist,
  Postinster,
  Postupdate,
} from '@/api/system/role-api.js';
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
  namespaced: 'role',
  state: {
    list: [],
    page: {
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
    },
  },
  reducers: {
    setList(state, { payload: list }) {
      return {
        ...state,
        list,
      };
    },
    setPage(state, { payload: page }) {
      return {
        ...state,
        page,
      };
    },
  },
  effects: {
    *getrolelistforpage({ payload }, { call, put }) {
      let res = yield call(GetRoleByPage, payload);
      if (res.code == 200) {
        let arr = JSON.parse(JSON.stringify(res.data.content));
        getlist(arr);
        yield put({
          type: 'setList',
          payload: arr,
        });
        let page = {
          pageNum: res.data.pageNum,
          pageSize: res.data.pageSize,
          totalSize: res.data.totalSize,
        };
        yield put({
          type: 'setPage',
          payload: page,
        });
      }
    },
    *getrolelist({ payload }, { call, put }) {
      let res = yield call(GetRolelist, payload);
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
      let obj = JSON.parse(JSON.stringify(payload));
      console.log(obj);
      if (obj.catalogueIds) {
        let newarr = obj.catalogueIds.map((item) => {
          return item.value;
        });
        obj.catalogueIds = newarr.toString();
      }
      let res = yield call(Postinster, obj);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `角色:${payload.name}已添加成功`,
        });
        return true;
      }
    },
    *update({ payload }, { call, put }) {
      let obj = JSON.parse(JSON.stringify(payload));
      if (obj.catalogueIds) {
        let newarr = obj.catalogueIds.map((item) => {
          return item.value;
        });
        obj.catalogueIds = newarr.toString();
      }
      let res = yield call(Postupdate, obj);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `角色:${payload.name}已修改成功`,
        });
        return true;
      }
    },
    *delete({ payload }, { call, put }) {
      let res = yield call(Postupdate, payload);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `角色:${payload.name}已删除成功`,
        });
        return true;
      }
    },
  },
};
