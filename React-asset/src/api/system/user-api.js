import request from '@/request';
const url = '/user';
export const GetUserlist = (data) => {
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
