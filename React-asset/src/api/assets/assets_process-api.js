import request from '@/request';
const url = '/apply';
//添加申请
export const Postinster = (data) => {
  return request({
    url: `${url}/add`,
    method: 'post',
    data,
  });
};
//撤回申请
export const Postwithdraw = (data) => {
  return request({
    url: `${url}/withdraw`,
    method: 'post',
    data,
  });
};
//流程详情
export const PostInfoByid = (data) => {
  return request({
    url: `${url}/getApplyInfo`,
    method: 'post',
    data,
  });
};
//审批详情
export const PostProcessInfoByid = (data) => {
  return request({
    url: `${url}/getOperationList`,
    method: 'post',
    data,
  });
};
//审批流程
export const PostExamine = (data) => {
  return request({
    url: `${url}/examine`,
    method: 'post',
    data,
  });
};
//接收流程
export const PostReceive = (data) => {
  return request({
    url: `${url}/receive`,
    method: 'post',
    data,
  });
};
