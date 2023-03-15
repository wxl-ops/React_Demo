import request from '@/request';
//文件上传
export const Postupload = (data) => {
  return request({
    url: `/upload`,
    method: 'post',
    data,
  });
};
//固定资产批量导入
export const Postexcelupload = (data) => {
  return request({
    url: `/excel/importList`,
    method: 'post',
    data,
  });
};
//全部资产到处
export const PostexportList = (params) => {
  return request({
    url: `/excel/exportList`,
    responseType: 'blob',
    method: 'get',
    params,
  });
};
//部门资产到处
export const PostdepartmentexportList = (params) => {
  return request({
    url: `/excel/departmentExportList`,
    responseType: 'blob',
    method: 'get',
    params,
  });
};
//我的资产到处
export const PostmyexportList = (params) => {
  return request({
    url: `/excel/myExportList`,
    responseType: 'blob',
    method: 'get',
    params,
  });
};
