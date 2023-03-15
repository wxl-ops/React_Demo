import {
  Postupload,
  PostexportList,
  PostdepartmentexportList,
  PostmyexportList,
} from '@/api/upload-api.js';
import { notification } from 'antd';
import { saveAs } from 'file-saver';
export default {
  namespaced: 'task',
  state: {},
  reducers: {},
  effects: {
    *fileupload({ payload }, { call, put }) {
      let res = yield call(Postupload, payload);
      if (res.code == 200) {
        return res.data;
      }
    },
    *downloadFile({ payload }, { call, put }) {
      let link = document.createElement('a');
      link.href =
        'http://192.168.2.200:10000/assets/files/2022.07.15/e89754fd-75b1-4610-8c54-bce20a8b95d1.xlsx';
      link.download = '固定资产导入模板.xlsx';
      link.click();
    },
    *exportassets({ payload }, { call, put }) {
      // window.URL.createObjectURL(new Blob([res]))
      // 1.集团资产 2.部门资产 3.个人资产
      let res;
      if (payload.type == 1) {
        res = yield call(PostexportList);
      } else if (payload.type == 2) {
        res = yield call(PostdepartmentexportList);
      } else if (payload.type == 3) {
        res = yield call(PostmyexportList);
      }
      return new Promise((resolve, reject) => {
        const blob = new Blob([res]);
        if (navigator.msSaveBlob) {
          // 兼容IE
          navigator.msSaveBlob(blob, '资产明细.xlsx');
        } else {
          const url = window.URL.createObjectURL(blob);
          saveAs(url, '资产明细.xlsx');
        }
        resolve();
      });
    },
  },
};
