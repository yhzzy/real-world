/**
 * 基于 axios 封装的请求模块
 */

import axios from 'axios'

// 创建请求对象
export const request = axios.create({
  baseURL: 'https://conduit.productionready.io',
})

export default ({ store }) => {

  // Add a request interceptor
  request.interceptors.request.use(function (config) {
    // Do something before request is sent
    const { user } = store.state

    if (user && user.token) {
      config.headers.Authorization = `Token ${user.token}`
    }

    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })
}
