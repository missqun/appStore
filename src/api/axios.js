// 封装统一的请求
import axios from 'axios'
const axiosInstance = axios.create({
  baseURL: 'https://itunes.apple.com',
  timeout: 30000
})
axiosInstance.interceptors.response.use((res) => {
  if (res.status === 200) {
    return res.data
  } else {
    alert(res.statusText)
  }
}, (err) => {
  return Promise.reject(err)
})
export default axiosInstance
