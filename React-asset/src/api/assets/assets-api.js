import request from '@/request';
const url = '/assets';
export const Getgroupassets = (data) => {
  //集团资产
  return request({
    url: `${url}/findByPageAll`,
    method: 'post',
    data,
  });
};
//部门资产
export const GetDepartment = (data) => {
  return request({
    url: `${url}/findByPageDepartment`,
    method: 'post',
    data,
  });
};
//个人资产
export const GetUserAssets = (data) => {
  return request({
    url: `${url}/findByPageUser`,
    method: 'post',
    data,
  });
};
//领用/租借
export const GetAssetsAll = (data) => {
  return request({
    url: `${url}/getUse`,
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
//资产绑定
export const Postbinding = (data) => {
  return request({
    url: `${url}/binding`,
    method: 'post',
    data,
  });
};
