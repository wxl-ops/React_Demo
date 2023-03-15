import request from '@/request';
const url = '/process';
export const GetUserProcessList = (data) => {
  return request({
    url: `/user/findAll`,
    method: 'get',
  });
};
export const GetProcessList = (data) => {
  return request({
    url: `/organization/getProcessList`,
    method: 'get',
  });
};
export const PostProcessList = (data) => {
  return request({
    url: `${url}/findByPage`,
    method: 'post',
    data,
  });
};
export const Postinster = (data) => {
  return request({
    url: `${url}/add`,
    method: 'post',
    data,
  });
};
export const PostInfoByid = (data) => {
  return request({
    url: `${url}/getUserInfoId`,
    method: 'post',
    data,
  });
};
export const Postupdate = (data) => {
  return request({
    url: `${url}/update`,
    method: 'post',
    data,
  });
};
