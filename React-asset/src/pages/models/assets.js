import {
  Getgroupassets,
  GetDepartment,
  GetUserAssets,
  GetAssetsAll,
  Postinster,
  PostInfoByid,
  Postupdate,
  Postbinding,
} from '@/api/assets/assets-api.js';
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
  namespaced: 'assets',
  state: {
    grouplist: [],
    departmentlist: [],
    userassetslist: [],
    recipientlist: [],
    loanlist: [],
    page: {
      pageNum: 1,
      pageSize: 10,
      totalSize: 0,
    },
  },
  reducers: {
    setGrouplist(state, { payload: grouplist }) {
      return {
        ...state,
        grouplist,
      };
    },
    setDepartmentlist(state, { payload: departmentlist }) {
      return {
        ...state,
        departmentlist,
      };
    },
    setUserassetslist(state, { payload: userassetslist }) {
      return {
        ...state,
        userassetslist,
      };
    },
    setRecipientlist(state, { payload: recipientlist }) {
      return {
        ...state,
        recipientlist,
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
    *groupassets({ payload }, { call, put }) {
      let obj = JSON.parse(JSON.stringify(payload));
      obj.type = Number(obj.type);
      if (obj.typeTwo) {
        obj.typeTwo = Number(obj.typeTwo);
      }
      let res = yield call(Getgroupassets, obj);
      if (res.code == 200) {
        let arr = JSON.parse(JSON.stringify(res.data.content));
        getlist(arr);
        yield put({
          type: 'setGrouplist',
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
    *getdepartment({ payload }, { call, put }) {
      let obj = JSON.parse(JSON.stringify(payload));
      obj.type = Number(obj.type);
      if (obj.typeTwo) {
        obj.typeTwo = Number(obj.typeTwo);
      }
      let res = yield call(GetDepartment, obj);
      if (res.code == 200) {
        let arr = JSON.parse(JSON.stringify(res.data.content));
        getlist(arr);
        yield put({
          type: 'setDepartmentlist',
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
    *getuserassets({ payload }, { call, put }) {
      let obj = JSON.parse(JSON.stringify(payload));
      obj.type = Number(obj.type);
      if (obj.typeTwo) {
        obj.typeTwo = Number(obj.typeTwo);
      }
      let res = yield call(GetUserAssets, obj);
      if (res.code == 200) {
        let arr = JSON.parse(JSON.stringify(res.data.content));
        getlist(arr);
        yield put({
          type: 'setUserassetslist',
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
    *getassetsall({ payload }, { call, put }) {
      console.log(payload);
      let obj = JSON.parse(JSON.stringify(payload));
      obj.type = Number(obj.type);
      if (obj.typeTwo) {
        obj.typeTwo = Number(obj.typeTwo);
      }
      let res = yield call(GetAssetsAll, obj);
      if (res.code == 200) {
        let arr = JSON.parse(JSON.stringify(res.data.content));
        getlist(arr);
        yield put({
          type: 'setRecipientlist',
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
      if (obj.organizationId.length) {
        obj.organizationId = obj.organizationId[obj.organizationId.length - 1];
      }
      let res = yield call(Postinster, obj);
      if (res.code == 200) {
        notification['success']({
          message: '成功',
          description: `资产:${obj.name}已添加成功`,
        });
        return true;
      }
    },
    *info({ payload }, { call, put }) {
      let res = yield call(PostInfoByid, payload);
      if (res.code == 200) {
        let obj = JSON.parse(JSON.stringify(res.data));
        obj.organizationId = [obj.organizationId];
        obj.roleId = obj.roleId.toString();
        return obj;
      }
    },
    *update({ payload }, { call, put }) {
      let obj = JSON.parse(JSON.stringify(payload));
      obj.organizationId = obj.organizationId.toString();
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
    *binding({ payload }, { call, put }) {
      let res = yield call(Postbinding, payload);
      if (res.code == 200) {
        console.log(payload);
        if (payload.type == 1) {
          notification['success']({
            message: '成功',
            description: `资产已绑定成功`,
          });
        } else {
          notification['success']({
            message: '成功',
            description: `资产已解除绑定`,
          });
        }
      }
      return true;
    },
  },
};
