import request from '@/request'
export const Postsystemlogin = (data) => {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
export const GetUserInfo = () => {
  return request({
    url: '/user/getUserInfo',
    method: 'post',
  })
}
export const PostMylist = () => {
  return request({
    url: '/catalogue/listMy',
    method: 'post',
  })
}
