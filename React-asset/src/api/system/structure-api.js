import request from '@/request';
const url = '/organization';
export const GetorganizationListUser = (data) => {
  return request({
    url: `${url}/dataListUser`,
    method: 'post',
    data,
  });
};
export const GetorganizationList = (data) => {
  return request({
    url: `${url}/dataList`,
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
