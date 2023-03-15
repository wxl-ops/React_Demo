import {
  Postinster,
  Postwithdraw,
  PostInfoByid,
  PostProcessInfoByid,
  PostExamine,
  PostReceive,
} from '@/api/assets/assets_process-api.js';
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
  namespaced: 'assets_process',
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
    *inster({ payload }, { call, put }) {
      let obj = JSON.parse(JSON.stringify(payload));
      let res = yield call(Postinster, obj);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `申请已添加成功，请耐心等待审核结果`,
        });
        return true;
      }
    },
    *delete({ payload }, { call, put }) {
      let obj = JSON.parse(JSON.stringify(payload));
      let res = yield call(Postwithdraw, obj);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `申请已成功撤销`,
        });
        return true;
      }
    },
    *info({ payload }, { call, put }) {
      let res = yield call(PostInfoByid, payload);
      if (res.code == 200) {
        let obj = JSON.parse(JSON.stringify(res.data));
        // obj.organizationId = [obj.organizationId]
        // obj.roleId = obj.roleId.toString()
        return obj;
      }
    },
    *processinfo({ payload }, { call, put }) {
      let res = yield call(PostProcessInfoByid, payload);
      if (res.code == 200) {
        let obj = JSON.parse(JSON.stringify(res.data));
        return obj;
      }
    },
    *examine({ payload }, { call, put }) {
      let res = yield call(PostExamine, payload);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `资产:${payload.assetsName}已审批成功`,
        });
        return true;
      }
    },
    *receive({ payload }, { call, put }) {
      let res = yield call(PostReceive, payload);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `资产:${payload.assetsName}已接收成功`,
        });
        return true;
      }
    },
  },
};
