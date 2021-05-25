<template>
    <div class="app-info">
        <div class="flex-start">
            <img  class="info-img" :src="appInfo['im:image'][2].label" alt="">
            <div class="info-title">
                <p>{{appInfo.title.label}}</p>
                <p class="type">{{appInfo.category.attributes.label}}</p>
                <van-button class="btn" @click="alert('开始下载了')" round type="info">下载</van-button>
            </div>
        </div>
        <p class="desc-title">应用描述:</p>
        <p class="desc">{{appInfo.summary.label}}</p>
    </div>
</template>
<script>
export default {
    name: 'detail',
    computed :{
       appInfo () {
           return this.$route.params || {}
       }
    }
}
</script>

<style  lang="scss" scoped>
   .app-info{
       width: 100%;
       height:100vh;
       background: #fff;
       box-sizing: border-box;
       padding: 20px 12px;
       .info-img{
           border-radius: 20px;
           height:90px;
           margin-top:20px;
       }
       .info-title{
           width:66%;
           margin-left:2%;
           margin-top:30px;
           font-size: 18px;
           font-weight: bold;
           .type{
               color:#999;
           }
           .btn{
               text-align: right;
               width:100px;
               float: right;
           }
       }
       .desc-title{
           font-size:16px;
           margin:10px 0;
       }
       .desc{
           font-size:14px;
       }
   }
</style>