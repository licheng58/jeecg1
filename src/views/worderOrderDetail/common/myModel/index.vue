<template>
  <div class="myModel"
       v-show="modelShow">
    <div class="myMask"></div>
    <div class="top">
      <i class="el-icon-close"
         style="color:'#4e5159'"
         @click="closeModel"></i>
    </div>

    <!-- 显示图片和视频 -->
    <div class="body">
      <video :src="videoUrl"
             disablePictureInPicture
             controlsList="nodownload"
             controls="controls"
             style="max-height: 100%;max-width: 100%;z-index:99; vertical-align: middle" />
    </div>

  </div>
</template>

<script>
export default {
  props: {
    videoUrl: String,
  },

  data() {
    return {
      modelShow: false,
    }
  },

  methods: {
    closeModel() {
      this.modelShow = false
    },
  },
}
</script>

<style lang="less" scoped>
.myModel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 999;
  .myMask {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0.5;
    background: #000;
  }

  .top {
    top: 40px;
    right: 40px;
    width: 40px;
    height: 40px;
    font-size: 24px;
    color: #fff;
    background-color: #606266;
    position: absolute;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    opacity: 0.8;
    cursor: pointer;
    box-sizing: border-box;
    user-select: none;
  }

  .body {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .el-carousel,
    .el-carousel--horizontal,
    /deep/.el-carousel__container {
      width: 100%;
      height: 100%;
    }
    /deep/.el-carousel__arrow {
      font-size: 30px;
    }

    /deep/.el-carousel__arrow:hover {
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #4f5360;
    }
    img {
      transform: scale(1) rotate(0deg);
      margin-left: 8px;
      margin-top: -76px;
      max-height: 100%;
      max-width: 100%;
      transition: transform 0.3s ease 0s;
    }
  }

  .footer {
    height: 80px;
    text-align: center;
    i {
      font-size: 30px;
      color: #fff;
      cursor: pointer;
    }
    &-inner {
      position: absolute;
      left: 50%;
      bottom: 30px;
      transform: translateX(-50%);
      width: 282px;
      height: 44px;
      padding: 0 23px;
      background-color: #606266;
      border-color: #fff;
      border-radius: 22px;
      display: flex;
      justify-content: space-around;
      align-items: center;
    }
  }
}
</style>