import { request } from '@/plugins/request'

// 用户登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/api/users/login',
    data,
  })
}

// 用户注册
export const register = data => {
  return request({
    method: 'POST',
    url: '/api/users',
    data,
  })
}

// 更新用户
export const updateUser = data => {
  return request({
    method: 'PUT',
    url: '/api/user',
    data,
  })
}

// 获取当前用户
export const getCurrentUser = () => {
  return request({
    method: 'GET',
    url: '/api/user',
  })
}
