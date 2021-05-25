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
  // 获取app应用的相关数据
  matchData (data) {
    return axios({
      method: 'post',
      url: `/hk/lookup?id=${data}`
    })
  }
}
