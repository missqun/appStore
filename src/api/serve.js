import axios from '@/api/axios'

export default {
  // 获取app推荐列表
  getRecommend (data) {
    return axios({
      method: 'get',
      url: `hk/rss/topgrossingapplications/limit=${data.limit}/json`
    })
  },
  // 获取免费下载app列表
  getFreeDownload (data) {
    return axios({
      method: 'get',
      url: `/hk/rss/topfreeapplications/limit=${data.limit}/json`
    })
  },
  // 获取app数据
  getAppInfo (data) {
    return axios({
      method: 'get',
      url: `/hk/lookup?id=${data.join(',')}`
    })
  }
}
