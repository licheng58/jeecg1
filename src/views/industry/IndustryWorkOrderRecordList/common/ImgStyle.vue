<template>
  <div class="imgStyle">

    <a-popover title="预览"
               placement="rightTop">
      <template slot="content">
        <img v-lazy="getImgView(item)"
             v-show="checkFile(item) === 'img'"
             style="height: 500px;width: 500px ;" />

        <video :src="getImgView(item)"
               disablePictureInPicture
               controlsList="nodownload"
               v-show="checkFile(item) === 'video'"
               controls="controls"
               width="500"
               height="500"></video>
      </template>

      <img v-lazy="getImgView(item)"
           v-show="checkFile(item) === 'img'"
           alt=""
           style="width: 40px; height: 40px">
      <video :src="getImgView(item)"
             disablePictureInPicture
             controlsList="nodownload"
             v-show="checkFile(item) === 'video'"
             controls="controls"
             width="40"
             height="40"></video>

    </a-popover>

  </div>
</template>

<script>
import writes from '@/utils/writes'
import { getFileAccessHttpUrl } from '@/api/manage'
export default {
  props: {
    item: String,
  },

  data() {
    return {}
  },

  methods: {
    // 判断图片和视频格式
    checkFile(fileName) {
      if (fileName) {
        var flieArr = fileName.split('.')
        let lastName = flieArr[flieArr.length - 1]
        let imgTypes = writes.imgTypes
        let videoTypes = writes.videoTypes

        let isImg = imgTypes.some((v) => {
          return v === lastName.toUpperCase()
        })

        let isVideo = videoTypes.some((v) => {
          return v === lastName
        })

        if (isImg) {
          return 'img'
        } else if (isVideo) {
          return 'video'
        }
      }
    },

    /* 图片预览 */
    getImgView(text) {
      if (text && text.indexOf(',') > 0) {
        text = text.substring(0, text.indexOf(','))
      }
      return getFileAccessHttpUrl(text)
    },
  },
}
</script>

