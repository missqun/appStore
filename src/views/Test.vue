<template>
  <div class="test-container">
    <van-search
    class="search"
    shape="round"
    v-model.trim="keyWord"
    @input="onSearch"
    placeholder="Search..." >
    </van-search>
    <template v-if="keyWord.length === 0">
      <div class="recommend-container">
        <p class="reconmend-title">Recommend</p>
        <div class="swper-list-box" style="width:100%;over">
          <ul class="swper-list">
            <li class="swper-item" v-for="item in recommendList" :key="item.artistId" @click="toDetail(item)">
              <img :src='item.artworkUrl100' alt="">
              <p class="name">{{item.trackName}}</p>
              <p class="content-type">{{item.genres[0]}}</p>
            </li>
          </ul>
        </div>
      </div>
      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
        <van-list
          v-model="loading"
          class="free-list"
          :finished="finished"
        >
          <van-cell v-for="(item,index) in freeDownloadList" :key="item.artistId"  @click.native="toDetail(item)">
            <template #icon>
              <div class="icon flex-start">
                <p class="icon-index">{{index+1}}</p>
                <img :class='["icon-img",index%2 ==0 ?"square":"round"]' :src='item.artworkUrl60' alt="">
              </div>
            </template>
            <template #title>
                <p class="title">{{item.trackName}}</p>
            </template>
            <template #label>
              <div  class="label">
                <p>{{item.genres[0]}}</p>
                <van-rate
                  :value="item.averageUserRating" allow-half void-icon="star-o" :count="5" :size="10" :gutter="2" readonly color="#d7d73f"  />
                <span class="count">({{item.userRatingCount}})</span>
              </div>
            </template>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </template>
    <template v-else>
      <van-list  :class="['free-list',keyWord.length > 0? 'margin50': '']">
        <van-cell v-for="item in relativeList" :key="item.artistId"  @click.native="toDetail(item)">
          <template #icon>
            <div class="icon">
              <img class="icon-img square" :src='item.artworkUrl60' alt="">
            </div>
          </template>
          <template #title>
              <p class="title">{{item.trackName}}</p>
          </template>
          <template #label>
            <div  class="label">
              <p class="author">{{item.genres[0]}}</p>
              <p class="desc">{{item.description}}</p>
            </div>
          </template>
        </van-cell>
      </van-list>
    </template>
  </div>
</template>
<script>
import serve from '@/api/serve.js'
export default {
  name: 'test',
  data () {
    return {
      keyWord: '',
      recommendList: [],
      freeDownloadList: [],
      appResource: [],
      relativeList: [],
      loading: false,
      finished: false,
      refreshing: false
    }
  },
  methods: {
    // 初始化
    init () {
      this.getRecommendFun()
      this.getFreeDownloadFun()
    },
    // 获取推荐app列表
    async getRecommendFun () {
      const reqData = {
        limit: 10
      }
      let resData = await serve.getRecommend(reqData)
      let idArr = []
      resData.feed.entry.map(item => {
        if (item.id) {
          idArr.push(item.id.attributes['im:id'])
        }
      })
      let idsString = idArr.join(',')
      let matchRes = await serve.matchData(idsString)
      this.recommendList = matchRes.results
    },
    // 获取免费下载app列表
    async getFreeDownloadFun () {
      const reqData = {
        limit: 100
      }
      let resData = await serve.getFreeDownload(reqData)
      let idArr = []
      resData.feed.entry.map(item => {
        if (item.id) {
          idArr.push(item.id.attributes['im:id'])
        }
      })
      let idsString = idArr.join(',')
      let matchRes = await serve.matchData(idsString)
      this.freeDownloadList = matchRes.results
      this.allAppResource()
      this.refreshing = false
      this.finished = true
      this.loading = false
    },
    // 本地应用app数据
    allAppResource () {
      this.appResource = this.recommendList.concat(this.freeDownloadList)
    },
    // search事件
    onSearch () {
      this.relativeList = []
      this.relativeList = this.appResource.filter(item => {
        return item.trackName.indexOf(this.keyWord) > -1 || item.description.indexOf(this.keyWord) > -1 || item.artistName.indexOf(this.keyWord) > -1
      })
    },
    // 跳转app详情
    toDetail (item) {
      this.$router.push({name: 'detail', params: item})
    },
    // 下拉刷新免费app列表
    onRefresh () {
      this.finished = false
      this.loading = true
      setTimeout(() => {
        this.getFreeDownloadFun()
      }, 500)
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style  lang="scss" scoped>
  .test-container{
    width:100%;
    background: #fff;
    .search{
      position: fixed;
      left:50%;
      top:0;
      width:100%;
      transform: translateX(-50%);
      z-index:100;
    }
    .recommend-container{
      width:100%;
      box-sizing: border-box;
      padding:10px 0 10px 24px;
      margin-top:100px;
      background: #fff;
      border-bottom: 2px solid #ecebeb;
      border-top: 2px solid #ecebeb;
      .reconmend-title{
        margin: 20px 0;
      }
      .swper-list-box{
        width:100%;
        overflow-x: auto;
        &::-webkit-scrollbar {
          width: 0 !important
        }
        .swper-list{
            width:1800px;
            height:260px;
            display: flex;
            justify-content: flex-start;
            flex-wrap: nowrap;
            .swper-item{
              width:150px !important;
              height:150px;
              margin-right:30px;
              color:#333;
              img{
                height:100%;
                border-radius: 30px;
              }
              p{
                width:150px;
                margin-top:20px;
                font-size:24px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: center;
                &.content-type{
                  margin-top:10px;
                  color:#999;
                  font-size: 24px;
                  font-weight: bold;
                }
              }
            }
        }
      }

    }
    .free-list{
      &.margin50{
        margin-top:100px;
      }
      .icon{
        height:106px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: nowrap;
        .icon-index{
          margin-right:30px;
          line-height: 106px;
          color:#999;
        }
        .icon-img{
          width:106px;
          vertical-align: bottom;
          &.round{
            border-radius: 50%;
          }
          &.square{
            border-radius: 30px;
          }
        }
      }
      .title{
        width:420px;
        overflow:hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-left:30px;
        font-weight: bold;
      }
      .label{
        color:#999;
        margin-left:30px;
        font-weight: bold;
        .count{
          font-weight: 500;
          margin-left:10px;
        }
        .desc{
          width:520px;
          overflow:hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top:20px;
        }
      }
    }
  }
</style>
