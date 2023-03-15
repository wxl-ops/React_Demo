import {
  Postsystemlogin,
  GetUserInfo,
  PostMylist,
} from '@/api/login/login-api.js';
import { notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
let menulist = [];

function findmenu(menu) {
  menu.forEach((item) => {
    if (item.childrenList && item.status == 3) {
      findmenu(item.childrenList);
    } else {
      return menulist.push(item);
    }
  });
}
export default {
  namespaced: 'login',
  state: {
    role: [],
    userinfo: {},
    rolelist: [],
    menulist: [],
  },
  reducers: {
    setRole(state, { payload: role }) {
      return {
        ...state,
        role,
      };
    },
    setUserinfo(state, { payload: userinfo }) {
      return {
        ...state,
        userinfo,
      };
    },
    setRolelist(state, { payload: rolelist }) {
      return {
        ...state,
        rolelist,
      };
    },
    setMenulist(state, { payload: menulist }) {
      return {
        ...state,
        menulist,
      };
    },
  },
  effects: {
    *login({ payload }, { call }) {
      let res = yield call(Postsystemlogin, payload);
      if (res.code == 200) {
        sessionStorage.setItem('token', res.data);
        return true;
      }
    },
    *getuserinfo({ payload }, { call, put }) {
      let res = yield call(GetUserInfo, payload);
      if (res.code == 200) {
        yield put({
          type: 'setUserinfo',
          payload: res.data,
        });
        notification.open({
          message: `欢迎回来 ${res.data.nickname}`,
          description: `今天过得好吗？`,
          // icon: <SmileOutlined/>,
          style: {
            color: '#108ee9',
          },
        });
        sessionStorage.setItem('userinfo', JSON.stringify(res.data));
      }
    },
    *myrolelist({ payload }, { call, put }) {
      let res = yield call(PostMylist);
      if (res.code == 200) {
        yield put({
          type: 'setRolelist',
          payload: res.data,
        });
        findmenu(res.data);
        yield put({
          type: 'setMenulist',
          payload: menulist,
        });
        let rolearr = menulist.map((m_item) => {
          if (m_item.isDisable) {
            return m_item.math;
          }
        });
        sessionStorage.setItem(
          'rolearr',
          JSON.stringify(Array.from(new Set(rolearr))),
        );
        sessionStorage.getItem('rolelist', JSON.stringify(res.data));
      }
    },
  },
};
