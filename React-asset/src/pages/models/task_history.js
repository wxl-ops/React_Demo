import {
  GetProcessList,
  Postinster,
  Postupdate,
} from '@/api/system/process_set-api.js';
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
  namespaced: 'task_history',
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
    setPage(state, { payload: page }) {
      return {
        ...state,
        page,
      };
    },
  },
  effects: {
    *processlist({ payload }, { call, put }) {
      let res = yield call(GetProcessList, payload);
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
      let newarr = obj.catalogueIds.map((item) => {
        return item.value;
      });
      obj.catalogueIds = newarr.toString();
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
      if (obj.catalogueIds[0].value) {
        let newarr = obj.catalogueIds.map((item) => {
          return item.value;
        });
        obj.catalogueIds = newarr.toString();
      } else {
        obj.catalogueIds = obj.catalogueIds.toString();
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
