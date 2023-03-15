import request from '@/request';
const url = '/role';
export const GetRoleByPage = (data) => {
  return request({
    url: `${url}/findByPage`,
    method: 'post',
    data,
  });
};
export const GetRolelist = (data) => {
  return request({
    url: `${url}/findList`,
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
export const Postupdate = (data) => {
  return request({
    url: `${url}/update`,
    method: 'post',
    data,
  });
};
