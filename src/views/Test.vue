<template>
  <div class="test-container">
    <van-search
    class="search"
    shape="round"
    v-model="keyWord"
    @input="onSearch"
    placeholder="Search..." >
    </van-search>
    <template v-if="keyWord.length === 0">
      <div class="recommend-container">
        <p class="reconmend-title">Recommend</p>
        <div class="swper-list-box" style="width:100%;over">
          <ul class="swper-list">
            <li class="swper-item" v-for="(item, index) in recommendList" :key="index" @click="toDetail(item)">
              <img :src='item["im:image"][2].label' alt="">
              <p class="name">{{item["im:name"].label}}</p>
              <p class="content-type">{{item.category.attributes.label}}</p>
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
          <van-cell v-for="(item,index) in freeDownloadList" :key="(item.id.attributes)['im:id']"  @click.native="toDetail(item)">
            <template #icon>
              <div class="icon flex-start">
                <p class="icon-index">{{index+1}}</p>
                <img :class='["icon-img",index%2 ==0 ?"square":"round"]' :src='item["im:image"][1].label' alt="">
              </div>
            </template>
            <template #title>
                <p class="title">{{item.title.label}}</p>
            </template>
            <template #label>
              <div  class="label">
                <p>{{item.category.attributes.label}}</p>
                <van-rate
                  :value="fomateRate(index)" allow-half void-icon="star-o" :count="5" :size="10" :gutter="2" readonly color="#d7d73f"  />
                <span class="count">({{(item.category.attributes)['im:id']}})</span>
              </div>
            </template>
          </van-cell>
        </van-list>
      </van-pull-refresh>
    </template>
    <template v-else>
      <van-list  :class="['free-list',keyWord.length > 0? 'margin50': '']">
        <van-cell v-for="item in relativeList" :key="(item.id.attributes)['im:id']"  @click.native="toDetail(item)">
          <template #icon>
            <div class="icon">
              <img class="icon-img square" :src='item["im:image"][1].label' alt="">
            </div>
          </template>
          <template #title>
              <p class="title">{{item.title.label}}</p>
          </template>
          <template #label>
            <div  class="label">
              <p class="author">{{item.category.attributes.label}}</p>
              <p class="desc">{{item.summary.label}}</p>
            </div>
          </template>
        </van-cell>
      </van-list>
      <!-- <van-empty v-else image="search" description="暂无该应用信息" /> -->
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
  // watch: {
  //   keyWord (val) {
  //     if (val.length === 0) {
  //       this.startSearch = false
  //     }
  //   }
  // },
  methods: {
    // 初始化界面
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
      this.recommendList = resData.feed.entry || []
    },
    // 获取免费下载app列表
    async getFreeDownloadFun () {
      const reqData = {
        limit: 100
      }
      let resData = await serve.getFreeDownload(reqData)
      this.freeDownloadList = resData.feed.entry || []
      this.allAppResource()
      this.refreshing = false
      this.finished = true
      this.loading = false
    },
    // 本地应用app数据
    allAppResource () {
      this.appResource = this.recommendList.concat(this.freeDownloadList)
    },
    fomateRate (value) {
      return parseFloat((100 - value) / 20)
    },
    // search事件
    onSearch () {
      this.relativeList = []
      this.relativeList = this.appResource.filter(item => {
        return item.title.label.indexOf(this.keyWord) > -1 || item.summary.label.indexOf(this.keyWord) > -1
      })
    },
    // 跳转app详情
    toDetail (item) {
      this.$router.push({name: 'detail', query: {id: (item.id.attributes)['im:id']}})
    },
    // 下拉刷新免费app列表
    onRefresh () {
      this.finished = false
      this.loading = true
      setTimeout(() => {
        this.getFreeDownloadFun()
      })
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
      padding:5px 0 5px 12px;
      margin-top:50px;
      background: #fff;
      border-bottom: 1px solid #ecebeb;
      border-top: 1px solid #ecebeb;
      .reconmend-title{
        margin: 10px 0;
      }
      .swper-list-box{
        width:100%;
        overflow-x: auto;
        &::-webkit-scrollbar {
          width: 0 !important
        }
        .swper-list{
            width:900px;
            height:130px;
            display: flex;
            justify-content: flex-start;
            flex-wrap: nowrap;
            .swper-item{
              width:75px !important;
              height:75px;
              margin-right:15px;
              color:#333;
              img{
                height:100%;
                border-radius: 15px;
              }
              p{
                width:75px;
                margin-top:10px;
                font-size:12px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: center;
                &.content-type{
                  margin-top:5px;
                  color:#999;
                  font-size: 12px;
                  font-weight: bold;
                }
              }
            }
        }
      }

    }
    .free-list{
      &.margin50{
        margin-top:50px;
      }
      .icon{
        height:53px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: nowrap;
        .icon-index{
          margin-right:15px;
          line-height: 53px;
          color:#999;
        }
        .icon-img{
          width:53px;
          vertical-align: bottom;
          &.round{
            border-radius: 50%;
          }
          &.square{
            border-radius: 15px;
          }
        }
      }
      .title{
        width:210px;
        overflow:hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-left:15px;
        font-weight: bold;
      }
      .label{
        color:#999;
        margin-left:15px;
        margin-top:-5px;
        font-weight: bold;
        .count{
          font-weight: 500;
          margin-left:5px;
        }
        .desc{
          width:260px;
          overflow:hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
</style>
