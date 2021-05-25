<template>
    <div class="app-info">
        <div class="flex-start">
            <img  class="info-img" :src="appInfo.artworkUrl100" alt="">
            <div class="info-title">
                <p>{{appInfo.trackCensoredName}}</p>
                <p class="type">{{appInfo.formattedPrice}}</p>
                <van-button class="btn" @click="downLoad" round type="info">下载</van-button>
            </div>
        </div>
        <p class="desc-title">应用描述:</p>
        <p class="desc">{{appInfo.description}}</p>
    </div>
</template>
<script>
import serve from '@/api/serve.js'
export default {
  name: 'detail',
  data () {
    return {
      appInfo: {}
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },
  methods: {
    // 获取AppInfo
    async getAppInfoFun () {
      const reqData = [this.id]
      let resData = await serve.getAppInfo(reqData)
      let { results } = { ...resData }
      this.appInfo = results[0] || {}
      console.log(this.appInfo)
    },
    downLoad () {
      alert('下载')
    }
  },
  mounted () {
    this.getAppInfoFun()
  }
}
</script>

<style  lang="scss" scoped>
   .app-info{
       width: 100%;
       height:100vh;
       background: #fff;
       box-sizing: border-box;
       padding: 40px 24px;
       .info-img{
           border-radius: 40px;
           height:180px;
           margin-top:40px;
       }
       .info-title{
           width:66%;
           margin-left:2%;
           margin-top:60px;
           font-size: 36px;
           font-weight: bold;
           .type{
               color:#999;
           }
           .btn{
               text-align: right;
               width:200px;
               float: right;
           }
       }
       .desc-title{
           font-size:32px;
           margin:20px 0;
       }
       .desc{
           font-size:28px;
       }
   }
</style>
