import request from '@/request';
const url = '/dictionaries';
export const GetDictlist = (data) => {
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
export const PostInfoByid = (data) => {
  return request({
    url: `${url}/findByFid`,
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
