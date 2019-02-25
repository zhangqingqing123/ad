import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
export const request = axios.create({
  baseURL: process.env.ADMIN_BASE_API, // api的base_url
  timeout: 50000 // request timeout
})

export const baseRequest = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 50000 // request timeout
})


// request interceptor
request.interceptors.request.use(config => {
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['token'] = getToken() // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

const responsehandle = {response:function(response){
    const res = response.data
    if (res.code === 501) {
      MessageBox.alert('系统未登录，请重新登录', '未登录', {
        confirmButtonText: '确定',
        type: 'error'
      }).then(() => {
        store.dispatch('FedLogOut').then(() => {
          location.reload()
        })
      })
      return Promise.reject('error')
    } else if (res.code === 502) {
      MessageBox.alert('系统内部错误，请联系管理员维护', '错误', {
        confirmButtonText: '确定',
        type: 'error'
      })
      return Promise.reject('error')
    }else if (res.code === 900) {
      MessageBox.alert('权限菜单ID重复', '警告', {
        confirmButtonText: '确定',
        type: 'error'
      })
      return Promise.reject('error')
    } else if (res.code === 503) {
      MessageBox.alert('请求业务目前未支持', '警告', {
        confirmButtonText: '确定',
        type: 'error'
      })
      return Promise.reject('error')
    }else if (res.code === 401) {
      MessageBox.alert('该类目名已存在', '警告', {
        confirmButtonText: '确定',
        type: 'error'
      })
      return Promise.reject('error')
    }
    else if (res.code !== 1) {
      // 非5xx的错误属于业务错误，留给具体页面处理
      return Promise.reject(response)
    } else {
      return response
    }
  }, error:function(error){
    console.log('err' + error)// for debug
    Message({
      message: '登录连接超时（后台不能连接，请联系系统管理员）',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }}

// respone interceptor
request.interceptors.response.use(responsehandle.response,responsehandle.error)
baseRequest.interceptors.response.use(responsehandle.response,responsehandle.error)
export default request