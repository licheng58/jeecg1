<template>
  <div class="login-main">
    <!-- <div class="login-logo">
      <img src="~@/assets/login-logo.png" alt="logo" />
    </div> -->

    <div class="login-from">
      <div style="width:455px;height:150px">
        <div class="middle-logo">
          <img src="~@/assets/logo_header.png"
               class="logo"
               alt="logo" />

        </div>
        <div class="middle-title"><span>可视化专家平台</span></div>
      </div>
      <div class="from">
        <!-- <div class="login_name">
          <img src="~@/assets/login_name.png"
               alt="logo"
               class="login_name_logo" />
          <div class="login_name_title">卡奥斯可视化专家平台</div>
        </div> -->
        <div style="height:20px"></div>
        <a-form :form="form"
                class="user-layout-login"
                ref="formLogin"
                id="formLogin">
          <a-form-item>
            <a-input size="large"
                     v-decorator="['username', validatorRules.username, { validator: this.handleUsernameOrEmail }]"
                     type="text"
                     :style="{ color: 'rgba(255,255,255,255)',paddingLeft:'30px',boxSizing:'box-sizing'}"
                     placeholder="请输入账号">
              <a-icon slot="prefix"
                      type="user"
                      :style="{ color: 'rgb(59, 127, 187)',borderRight:'1px solid #4e8ec4',fontSize:'20px',paddingRight:'15px'}" />
            </a-input>
          </a-form-item>
          <a-form-item>
            <a-input-password v-decorator="['password', validatorRules.password]"
                              size="large"
                              type="password"
                              autocomplete="false"
                              :style="{ color: 'rgba(255,255,255,255)' ,paddingLeft:'30px'}"
                              placeholder="请输入密码">
              <a-icon slot="prefix"
                      type="lock"
                      :style="{ color: 'rgb(59, 127, 187)',borderRight:'1px solid #4e8ec4',fontSize:'20px',paddingRight:'15px',boxSizing:'border-box' }" />
            </a-input-password>
          </a-form-item>
          <a-form-item>
            <SwipeVerificate />
          </a-form-item>
          <!-- <a-row :gutter="24"
                 type="flex">
            <a-col :span="16">
              <a-form-item>
                <a-input v-decorator="['inputCode', validatorRules.inputCode]"
                         size="large"
                         type="text"
                         @change="inputCodeChange"
                         placeholder="请输入验证码">
                  <a-icon slot="prefix"
                          type="smile"
                          :style="{ color: 'rgba(0,0,0,.25)' }" />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="8"
                   style="margin-top: 40px; text-align: right">
              <img v-if="requestCodeSuccess"
                   style="margin-top: 2px"
                   :src="randCodeImage"
                   @click="handleChangeCheckCode" />
              <img v-else
                   style="margin-top: 2px"
                   src="../../assets/checkcode.png"
                   @click="handleChangeCheckCode" />
            </a-col>
          </a-row> -->
          <a-form-item style="margin-top: 24px">
            <a-row justify="space-between"
                   type="flex">
              <a-button size="large"
                        type="primary"
                        htmlType="submit"
                        class="login-button"
                        :loading="loginBtn"
                        @click.stop.prevent="handleSubmit"
                        :disabled="loginBtn">登&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp录</a-button>
              <!-- <a-button size="large"
                        class="login-button"
                        :loading="loginBtn">取消</a-button> -->
            </a-row>
          </a-form-item>
        </a-form>
      </div>
    </div>

    <two-step-captcha v-if="requiredTwoStepCaptcha"
                      :visible="stepCaptchaVisible"
                      @success="stepCaptchaSuccess"
                      @cancel="stepCaptchaCancel"></two-step-captcha>
    <login-select-modal ref="loginSelect"
                        @success="loginSelectOk"></login-select-modal>
  </div>
</template>

<script>
//import md5 from "md5"
import api from '@/api'
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import Vue from 'vue'
import { ACCESS_TOKEN, ENCRYPTED_STRING } from '@/store/mutation-types'
import { putAction, postAction, getAction } from '@/api/manage'
import { encryption, getEncryptedString } from '@/utils/encryption/aesEncrypt'
import store from '@/store/'
import { USER_INFO } from '@/store/mutation-types'
import LoginSelectModal from './LoginSelectModal.vue'
import SwipeVerificate from './SwipeVerificate.vue'
import { lc_getIndustryWorkOrderRecordList } from '@/api/lc_api'
export default {
  components: {
    TwoStepCaptcha,
    LoginSelectModal,
    SwipeVerificate,
  },
  data() {
    return {
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      encryptedString: {
        key: '',
        iv: '',
      },
      state: {
        time: 60,
        smsSendBtn: false,
      },
      validatorRules: {
        username: { rules: [{ required: true, message: '请输入用户名!' }, { validator: this.handleUsernameOrEmail }] },
        password: { rules: [{ required: true, message: '请输入密码!', validator: 'click' }] },
        mobile: { rules: [{ validator: this.validateMobile }] },
        captcha: { rule: [{ required: true, message: '请输入验证码!' }] },
        inputCode: { rules: [{ required: true, message: '请输入验证码!' }] },
      },
      verifiedCode: '',
      inputCodeContent: '',
      inputCodeNull: true,
      currentUsername: '',
      currdatetime: '',
      randCodeImage: '',
      requestCodeSuccess: false,
    }
  },
  created() {
    this.currdatetime = new Date().getTime()
    Vue.ls.remove(ACCESS_TOKEN)
    this.getRouterData()
    this.handleChangeCheckCode()
    window.localStorage.setItem('isSwipe', 0)
  },
  methods: {
    ...mapActions(['Login', 'Logout', 'PhoneLogin', 'ThirdLogin']),
    //第三方登录
    onThirdLogin(source) {
      let url = window._CONFIG['domianURL'] + `/thirdLogin/render/${source}`
      window.open(
        url,
        `login ${source}`,
        'height=500, width=500, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no'
      )
      let that = this
      let receiveMessage = function (event) {
        var origin = event.origin
        console.log('origin', origin)

        let token = event.data
        console.log('event.data', token)
        that.ThirdLogin(token).then((res) => {
          if (res.success) {
            that.loginSuccess()
          } else {
            that.requestFailed(res)
          }
        })
      }
      window.addEventListener('message', receiveMessage, false)
    },
    // handler
    handleUsernameOrEmail(rule, value, callback) {
      const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/
      if (regex.test(value)) {
        this.loginType = 0
      } else {
        this.loginType = 1
      }
      callback()
    },
    handleTabClick(key) {
      this.customActiveKey = key
      // this.form.resetFields()
    },

    // 登录
    handleSubmit() {
      let that = this
      let loginParams = {}
      that.loginBtn = true
      // 使用账户密码登陆

      if (that.customActiveKey === 'tab1') {
        if (window.localStorage.getItem('isSwipe') != 1) {
          this.$notification['error']({
            message: '请拖动滑块验证',
            description: '请拖动滑块验证',
            duration: 4,
          })
          this.loginBtn = false
          return
        }
        that.form.validateFields(
          ['username', 'password', 'inputCode', 'rememberMe'],
          { force: true },
          (err, values) => {
            if (!err) {
              loginParams.username = values.username
              loginParams.password = values.password
              loginParams.remember_me = values.rememberMe
              loginParams.captcha = that.inputCodeContent
              loginParams.checkKey = that.currdatetime
              console.log('登录参数', loginParams)
              that
                .Login(loginParams)
                .then((res) => {
                  // console.log('登录成功了')
                  // this.PreloadeData()
                  this.$refs.loginSelect.show(res.result)
                })
                .catch((err) => {
                  that.requestFailed(err)
                })
            } else {
              that.loginBtn = false
            }
          }
        )
        // 使用手机号登陆
      } else {
        that.form.validateFields(['mobile', 'captcha', 'rememberMe'], { force: true }, (err, values) => {
          if (!err) {
            loginParams.mobile = values.mobile
            loginParams.captcha = values.captcha
            loginParams.remember_me = values.rememberMe
            that
              .PhoneLogin(loginParams)
              .then((res) => {
                console.log(res.result)
                this.$refs.loginSelect.show(res.result)
              })
              .catch((err) => {
                that.requestFailed(err)
              })
          }
        })
      }
    },

    // 登录成功预加载数据
    async PreloadeData() {
      const res = await lc_getIndustryWorkOrderRecordList()
    },

    getCaptcha(e) {
      e.preventDefault()
      let that = this
      this.form.validateFields(['mobile'], { force: true }, (err, values) => {
        if (!values.mobile) {
          that.cmsFailed('请输入手机号')
        } else if (!err) {
          this.state.smsSendBtn = true
          let interval = window.setInterval(() => {
            if (that.state.time-- <= 0) {
              that.state.time = 60
              that.state.smsSendBtn = false
              window.clearInterval(interval)
            }
          }, 1000)

          const hide = this.$message.loading('验证码发送中..', 0)
          let smsParams = {}
          smsParams.mobile = values.mobile
          smsParams.smsmode = '0'
          postAction('/sys/sms', smsParams)
            .then((res) => {
              if (!res.success) {
                setTimeout(hide, 0)
                this.cmsFailed(res.message)
              }
              console.log(res)
              setTimeout(hide, 500)
            })
            .catch((err) => {
              setTimeout(hide, 1)
              clearInterval(interval)
              that.state.time = 60
              that.state.smsSendBtn = false
              this.requestFailed(err)
            })
        }
      })
    },
    stepCaptchaSuccess() {
      this.loginSuccess()
    },
    stepCaptchaCancel() {
      this.Logout().then(() => {
        this.loginBtn = false
        this.stepCaptchaVisible = false
      })
    },
    handleChangeCheckCode() {
      this.currdatetime = new Date().getTime()
      getAction(`/sys/randomImage/${this.currdatetime}`)
        .then((res) => {
          if (res.success) {
            this.randCodeImage = res.result
            this.requestCodeSuccess = true
          } else {
            this.$message.error(res.message)
            this.requestCodeSuccess = false
          }
        })
        .catch(() => {
          this.requestCodeSuccess = false
        })
    },
    loginSuccess() {
      // update-begin- author:sunjianlei --- date:20190812 --- for: 登录成功后不解除禁用按钮，防止多次点击
      // this.loginBtn = false
      // update-end- author:sunjianlei --- date:20190812 --- for: 登录成功后不解除禁用按钮，防止多次点击
      this.$router.push({ path: '/dashboard/analysis' }).catch(() => {
        console.log('登录跳转首页出错,这个错误从哪里来的')
      })
      this.$notification.success({
        message: '欢迎',
        description: `${timeFix()}，欢迎回来`,
      })
    },
    cmsFailed(err) {
      this.$notification['error']({
        message: '登录失败',
        description: err,
        duration: 4,
      })
    },
    requestFailed(err) {
      this.$notification['error']({
        message: '登录失败',
        description: ((err.response || {}).data || {}).message || err.message || '请求出现错误，请稍后再试',
        duration: 4,
      })
      this.loginBtn = false
    },
    validateMobile(rule, value, callback) {
      if (!value || new RegExp(/^1([38][0-9]|4[579]|5[0-3,5-9]|6[6]|7[0135678]|9[89])\d{8}$/).test(value)) {
        callback()
      } else {
        callback('您的手机号码格式不正确!')
      }
    },
    validateInputCode(rule, value, callback) {
      if (!value || this.verifiedCode == this.inputCodeContent) {
        callback()
      } else {
        callback('您输入的验证码不正确!')
      }
    },
    generateCode(value) {
      this.verifiedCode = value.toLowerCase()
    },
    inputCodeChange(e) {
      this.inputCodeContent = e.target.value
    },
    loginSelectOk() {
      this.loginSuccess()
    },
    getRouterData() {
      this.$nextTick(() => {
        if (this.$route.params.username) {
          this.form.setFieldsValue({
            username: this.$route.params.username,
          })
        }
      })
    },
    //获取密码加密规则
    getEncrypte() {
      var encryptedString = Vue.ls.get(ENCRYPTED_STRING)
      if (encryptedString == null) {
        getEncryptedString().then((data) => {
          this.encryptedString = data
        })
      } else {
        this.encryptedString = encryptedString
      }
    },
  },
}
</script>

<style lang="less" scoped>
.login-main {
  height: 100%;
  width: 100%;
  // display: inline-block;
  // position: relative;
  overflow: hidden;
  background-image: url(~@/assets/login_bg.jpg);
  background-position: bottom center;
  background-size: cover auto;
  background-repeat: no-repeat;
  /deep/.ant-input-password-icon {
    color: #fff;
  }
  .login-from {
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -50%);
    width: 587px;
    height: 286px;
    padding: 0 60px 0 46px;

    .from {
      width: 100%;
      height: 100%;
      // background: #ffffff;
      // box-shadow: 0px 0px 13px 4px rgba(205, 206, 210, 0.21);
      border: 2px solid #0466b2;
      background-image: linear-gradient(to bottom right, #0d569a, #0c73bf);

      // border-radius: 10px;
      // h6 {
      //   margin-left: 20px;
      //   font-size: 28px;
      //   font-family: PingFang SC;
      //   // font-weight: 800;
      //   color: #151414;
      //   margin: 30px 0;
      //   letter-spacing: 5px;
      // }
    }
  }
}

.user-layout-login {
  // padding: 0 73px;
  padding: 10px 50px;
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    background: #00b6ff;
    border: 0;
    color: #fff;
    // box-shadow: 0px 0px 20px 8px rgba(106, 121, 165, 0.28);
    // border-radius: 25px;
    padding: 0 15px;
    font-size: 16px;
    width: 100%;
    height: 40px;
    line-height: 40px;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
.login_name {
  display: flex;
  align-items: center;
  color: #fff;
  &_logo {
    margin: 0 30px;
    width: 150px;
  }
  &_title {
    margin-left: 20px;
    font-size: 22px;
    font-family: PingFang SC;
    color: #151414;
    margin: 30px 0;
    letter-spacing: 5px;
  }
}
/deep/ .ant-form-item-required::before {
  display: none;
}
/deep/ .ant-form-item-label > label {
  color: #334378;
}
/deep/ .ant-form-item-label > label::after {
  display: none;
}
</style>
<style lang="less" >
.valid-error .ant-select-selection__placeholder {
  color: #f5222d;
}
.login-main {
  .ant-input {
    box-shadow: 0 0 0 1000px #0b5a9f inset;
    background: #0b5a9f;
    border: none;
    color: #fff;
    border-radius: 0;
    /* border-bottom: 2px solid #1779bc; */
  }
  .ant-input:hover,
  input:focus {
    box-shadow: 0 0 0 1000px #0b5a9f inset;
    background: #0b5a9f;
    border-radius: 0;
    border: none;
    /* border-bottom: 2px solid #1779bc; */
  }
  .ant-input-affix-wrapper {
    border-bottom: 2px solid #1779bc;
  }
  .top {
    display: none;
  }
  .middle-logo {
    text-align: center;
  }
  .logo {
    max-width: 100%;
    max-height: 60px;
    vertical-align: middle;
    border-style: none;
  }
  .middle-title {
    color: #fff;
    text-align: center;
    padding-top: 20px;
    font-size: 1.8em;
    height: 30px;
  }
}
input:-webkit-autofill,
textarea:-webkit-autofill,
select:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
  background-color: transparent !important; //设置input框记住密码背景颜色
  background-image: none;
  transition: background-color 50000s ease-in-out 0s;
  // -webkit-text-fill-color: #fff !important; //设置浏览器默认密码字体颜色
}
</style>

<style>
.login-main input:-webkit-autofill,
.login-main textarea:-webkit-autofill,
.login-main select:-webkit-autofill {
  -webkit-text-fill-color: #d4d7df !important;
}
</style>