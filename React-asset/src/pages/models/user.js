import {
  GetUserlist,
  Postinster,
  PostInfoByid,
  Postupdate,
} from '@/api/system/user-api.js';
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
  namespaced: 'user',
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
    *getuserlist({ payload }, { call, put }) {
      let res = yield call(GetUserlist, payload);
      // return
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
    *inster({ payload }, { call, put }) {
      let obj = JSON.parse(JSON.stringify(payload));
      obj.organizationIds = obj.organizationIds.toString();
      obj.organizationId = obj.organizationIds[obj.organizationIds.length - 1];
      let res = yield call(Postinster, obj);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `用户:${payload.nickname}已添加成功`,
        });
        return true;
      }
    },
    *info({ payload }, { call, put }) {
      let res = yield call(PostInfoByid, payload);
      if (res.code == 200) {
        let obj = JSON.parse(JSON.stringify(res.data));
        obj.organizationIds = obj.organizationIds.split(',').map((item) => {
          return Number(item);
        });
        obj.password = '******';
        return obj;
      }
    },
    *update({ payload }, { call, put }) {
      let obj = JSON.parse(JSON.stringify(payload));
      obj.organizationIds = obj.organizationIds.toString();
      obj.organizationId = obj.organizationIds[obj.organizationIds.length - 1];
      if (obj.password === '******') {
        obj.password = null;
      }
      let res = yield call(Postupdate, obj);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `用户:${payload.nickname}已修改成功`,
        });
        return true;
      }
    },
    *delete({ payload }, { call, put }) {
      let res = yield call(Postupdate, payload);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `用户:${payload.nickname}已删除成功`,
        });
        return true;
      }
    },
  },
};
