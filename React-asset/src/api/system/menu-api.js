import request from '@/request';
const url = '/catalogue';
export const GetCataloguelist = (data) => {
  return request({
    url: `${url}/list`,
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
