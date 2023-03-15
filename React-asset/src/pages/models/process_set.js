import {
  GetUserProcessList,
  GetProcessList,
  PostProcessList,
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
  namespaced: 'process_set',
  state: {
    list: [],
    userlist: [],
  },
  reducers: {
    setList(state, { payload: list }) {
      return {
        ...state,
        list,
      };
    },
    setUserlist(state, { payload: userlist }) {
      return {
        ...state,
        userlist,
      };
    },
  },
  effects: {
    *processuserlist({ payload }, { call, put }) {
      let res = yield call(GetUserProcessList, payload);
      if (res.code == 200) {
        let arr = JSON.parse(JSON.stringify(res.data));
        yield put({
          type: 'setUserlist',
          payload: arr,
        });
      }
    },
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
    *list({ payload }, { call, put }) {
      let obj = {
        organizationId: Number(payload.organizationId),
        processType: Number(payload.processType),
        pageNum: Number(payload.pageNum),
        pageSize: Number(payload.pageSize),
      };
      let res = yield call(PostProcessList, obj);
      if (res.code == 200) {
        let arr = JSON.parse(JSON.stringify(payload.res));
        arr.forEach((item) => {
          res.data.content.forEach((item2) => {
            if (item.value == item2.processType) {
              item.infoid = item2.id;
              item.desc = item2.desc;
              item.approvalUids = item2.approvalUids.split(',').map((item) => {
                return Number(item);
              });
              item.receiveUid = Number(item2.receiveUid);
            }
          });
        });
        return arr;
      }
    },
    *inster({ payload }, { call, put }) {
      let obj = JSON.parse(JSON.stringify(payload));
      obj.type = Number(obj.type);
      obj.processType = Number(obj.processType);
      obj.organizationId = Number(obj.organizationId);
      obj.receiveUid = Number(obj.receiveUid);
      obj.approvalUids = obj.approvalUids.toString();
      let res = yield call(Postinster, obj);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `流程已编辑成功`,
        });
        return true;
      }
    },
    *delete({ payload }, { call, put }) {
      let obj = {
        id: payload.infoid,
        isDel: true,
      };
      let res = yield call(Postupdate, obj);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `流程已删除成功`,
        });
        return true;
      }
    },
  },
};
