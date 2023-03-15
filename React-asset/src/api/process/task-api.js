import request from '@/request';
const url = '/apply';
export const GetMyList = (data) => {
  return request({
    url: `${url}/myList`,
    method: 'post',
    data,
  });
};
export const GetTaskList = (data) => {
  return request({
    url: `${url}/taskList`,
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
