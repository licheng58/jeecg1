<template>
  <a-drawer :title="title"
            :maskClosable="true"
            :width="drawerWidth"
            placement="right"
            :closable="true"
            @close="handleCancel"
            :visible="visible"
            style="height: 100%; overflow: auto; padding-bottom: 53px">
    <template slot="title">
      <div style="width: 100%">
        <span>{{ title }}</span>
        <a-button style="display: inline-block; width: calc(100% - 51px); padding-right: 10px; text-align: right">
          <a-button @click="toggleScreen"
                    icon="appstore"
                    style="height: 20px; width: 20px; border: 0px"></a-button>
        </a-button>
      </div>
    </template>

    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="用户账号"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户账号"
                   :maxLength='12'
                   :disabled="title === '编辑'"
                   v-decorator.trim="['username', validatorRules.username]"
                   :read-only="!!model.id" />
        </a-form-item>

        <template v-if="!model.id">
          <a-form-item label="登陆密码"
                       :labelCol="labelCol"
                       :wrapperCol="wrapperCol">

            <a-input-password :maxLength='12'
                              placeholder="请输入登陆密码"
                              v-decorator="['password',validatorRules.password]" />
          </a-form-item>

          <a-form-item label="确认密码"
                       :labelCol="labelCol"
                       :wrapperCol="wrapperCol">

            <a-input-password @blur="handleConfirmBlur"
                              :maxLength='12'
                              placeholder="请重新输入登陆密码"
                              v-decorator="['confirmpassword', validatorRules.confirmpassword]" />
          </a-form-item>
        </template>

        <a-form-item label="用户姓名"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-input placeholder="请输入用户姓名"
                   :maxLength='12'
                   v-decorator.trim="['realname', validatorRules.realname]" />
        </a-form-item>

        <a-form-item label="工号"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-input placeholder="请输入工号"
                   :maxLength='12'
                   oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
                   v-decorator.trim="['workNo', validatorRules.workNo]" />
        </a-form-item>

        <!-- <a-form-item label="职务" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <j-select-position placeholder="请选择职务" :multiple="false" v-decorator="['post', {}]" />
        </a-form-item> -->

        <a-form-item label="角色分配"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     v-show="!roleDisabled">
          <a-select style="width: 100%"
                    @change="handleRoleChange"
                    placeholder="请选择用户角色"
                    optionFilterProp="children"
                    v-decorator="['roleCode', validatorRules.roleCode]"
                    :getPopupContainer="(target) => target.parentNode">
            <a-select-option v-for="(role, roleindex) in roleList"
                             :key="role.id"
                             :value="role.roleCode">{{
              role.roleName
            }}</a-select-option>
          </a-select>

        </a-form-item>

        <!--机构分配-->
        <a-form-item label="机构分配"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol"
                     v-show="!departDisabled">
          <a-input-search placeholder="点击选择机构"
                          v-decorator="['orgCodeTxt', validatorRules.orgCodeTxt]"
                          read-only
                          @search="onSearch">
            <a-button slot="enterButton"
                      icon="search">选择</a-button>
          </a-input-search>
        </a-form-item>

        <a-form-item label="生日"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-date-picker style="width: 100%"
                         placeholder="请选择生日"
                         v-decorator="['birthday']"
                         :getCalendarContainer="(node) => node.parentNode" />
        </a-form-item>

        <a-form-item label="性别"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-select v-decorator="['sex', {}]"
                    placeholder="请选择性别"
                    :getPopupContainer="(target) => target.parentNode">
            <a-select-option :value="1">男</a-select-option>
            <a-select-option :value="2">女</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item label="邮箱"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-input placeholder="请输入邮箱"
                   v-decorator="['email', validatorRules.email]" />
        </a-form-item>

        <a-form-item label="手机号码"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-input placeholder="请输入手机号码"
                   v-decorator="['phone', validatorRules.phone]" />
        </a-form-item>

        <a-form-item label="座机"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">
          <a-input placeholder="请输入座机"
                   v-decorator="['telephone', validatorRules.telephone]" />
        </a-form-item>

        <a-form-item label="人脸图片"
                     :labelCol="labelCol"
                     :wrapperCol="wrapperCol">

          <a-upload v-decorator="[
             'avatar', validatorRules.avatar
            ]"
                    :headers="tokenHeader"
                    name="file"
                    list-type="picture-card"
                    class="avatar-uploader"
                    :show-upload-list="false"
                    :action="uploadUrl"
                    :before-upload="beforeUpload"
                    @change="handleChange"
                    :data="{ bucketName: 'industry' }">
            <img v-if="model.avatar"
                 :src="model.avatar"
                 alt="avatar"
                 style="height:100px;width:100px" />
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                Upload
              </div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-spin>
    <depart-window ref="departWindow"
                   @ok="modalFormOk"></depart-window>

    <div class="drawer-bootom-button"
         v-show="!disableSubmit">
      <a-popconfirm title="确定放弃编辑？"
                    @confirm="handleCancel"
                    okText="确定"
                    cancelText="取消">
        <a-button style="margin-right: 0.8rem">取消</a-button>
      </a-popconfirm>
      <a-button @click="handleSubmit"
                type="primary"
                :loading="confirmLoading">提交</a-button>
    </div>
  </a-drawer>
</template>

<script>
import pick from 'lodash.pick'
import Vue from 'vue'
// 引入搜索机构弹出框的组件
import departWindow from './DepartWindow'
import JSelectPosition from '@/components/jeecgbiz/JSelectPosition'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getAction } from '@/api/manage'
import { addUser, editUser, queryUserRole, queryall } from '@/api/api'
import { disabledAuthFilter } from '@/utils/authFilter'
import { duplicateCheck } from '@/api/api'
import JImageUpload from '@/components/jeecg/JImageUpload'
import { Message } from 'element-ui'
import { lc_faceValidate } from '@/api/lc_api'

export default {
  name: 'UserModal',
  components: {
    JImageUpload,
    departWindow,
    JSelectPosition,
  },

  data() {
    return {
      imgUrl: '',
      tokenHeader: { 'X-Access-Token': Vue.ls.get(ACCESS_TOKEN) },
      loading: false,
      departDisabled: false, //是否是我的机构调用该页面
      roleDisabled: false, //是否是角色维护调用该页面
      modalWidth: 800,
      drawerWidth: 700,
      modaltoggleFlag: true,
      confirmDirty: false,
      selectedDepartKeys: [], //保存用户选择机构id
      checkedDepartKeys: [],
      checkedDepartNames: [], // 保存机构的名称 =>title
      checkedDepartNameString: '', // 保存机构的名称 =>title
      resultDepartOptions: [],
      userId: '', //保存用户id
      disableSubmit: false,
      userDepartModel: { userId: '', departIdList: [] }, // 保存SysUserDepart的用户机构中间表数据需要的对象
      dateFormat: 'YYYY-MM-DD',
      validatorRules: {
        username: {
          rules: [
            {
              required: true,
              message: '请输入用户账号!',
            },
            {
              validator: this.validateUsername,
            },
          ],
        },
        password: {
          rules: [
            {
              required: true,
              // pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}:";'<>?,./]).{8,}$/,
              pattern: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*]{8,}$/,
              message: '密码由8位数字、数字 英文 特殊符号且必须包含数字及英文!',
            },
            {
              validator: this.validateToNextPassword,
            },
          ],
        },
        confirmpassword: {
          rules: [
            {
              required: true,
              message: '请重新输入登陆密码!',
            },
            {
              validator: this.compareToFirstPassword,
            },
          ],
        },

        avatar: {
          rules: [
            {
              required: true,
              message: '请选择人脸图片!',
            },
          ],
        },

        roleCode: {
          rules: [
            {
              required: true,
              message: '请选择角色分配!',
            },
          ],
        },

        orgCodeTxt: {
          rules: [
            {
              required: true,
              message: '请选择机构分配!',
            },
          ],
        },
        // birthday: { rules: [{ validator: this.validateBirthday }] },

        realname: {
          rules: [
            {
              required: true,
              pattern: /^[\u4e00-\u9fa5A-Za-z]*$/,
              message: '用户姓名不能是数字和特殊符号!',
            },
          ],
        },
        phone: { rules: [{ validator: this.validatePhone }] },
        email: {
          rules: [
            {
              validator: this.validateEmail,
            },
          ],
        },
        roles: {},
        //  sex:{initialValue:((!this.model.sex)?"": (this.model.sex+""))}
        workNo: {
          rules: [{ required: true, message: '请输入工号' }, { validator: this.validateWorkNo }],
        },
        telephone: {
          rules: [{ pattern: /^0\d{2,3}-[1-9]\d{6,7}$/, message: '请输入正确的座机号码' }],
        },
      },
      departIdShow: false,
      departIds: [], //负责机构id
      title: '操作',
      visible: false,
      model: {},
      roleList: [],
      selectedRole: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
      uploadLoading: false,
      confirmLoading: false,
      headers: {},
      form: this.$form.createForm(this),
      picUrl: '',
      url: {
        fileUpload: window._CONFIG['domianURL'] + '/sys/common/upload',
        userWithDepart: '/sys/user/userDepartList', // 引入为指定用户查看机构信息需要的url
        userId: '/sys/user/generateUserId', // 引入生成添加用户情况下的url
        syncUserByUserName: '/process/extActProcess/doSyncUserByUserName', //同步用户到工作流
        queryTenantList: '/sys/tenant/queryList',
      },
      identity: '1',
      fileList: [],
      tenantList: [],
      currentTenant: [],
    }
  },

  created() {
    const token = Vue.ls.get(ACCESS_TOKEN)
    this.headers = { 'X-Access-Token': token }
    // this.initTenantList()
  },

  computed: {
    uploadAction: function () {
      return this.url.fileUpload
    },

    uploadUrl: function () {
      return `${window._CONFIG['domianURL']}/sys/upload/uploadFile`
    },
  },

  methods: {
    // 选择角色
    handleRoleChange(val) {
      let res = this.roleList.find((v) => {
        return val === v.roleCode
      })

      this.selectedRole = res.id
    },

    isDisabledAuth(code) {
      return disabledAuthFilter(code)
    },

    initTenantList() {
      getAction(this.url.queryTenantList).then((res) => {
        if (res.success) {
          this.tenantList = res.result
        }
      })
    },

    //窗口最大化切换
    toggleScreen() {
      if (this.modaltoggleFlag) {
        this.modalWidth = window.innerWidth
      } else {
        this.modalWidth = 800
      }
      this.modaltoggleFlag = !this.modaltoggleFlag
    },

    initialRoleList() {
      queryall().then((res) => {
        if (res.success) {
          // console.log(res.result)
          this.roleList = res.result
        } else {
          console.log(res.message)
        }
      })
    },

    loadUserRoles(userid) {
      // console.log(userid)
      queryUserRole({ userid: userid }).then((res) => {
        if (res.success) {
          console.log(res.result)
          this.selectedRole = res.result ? res.result.join(',') : ''
        } else {
          console.log(res.message)
        }
      })
    },

    refresh() {
      // this.model.username = ''
      // this.model.password = ''
      // this.$nextTick(() => {
      //   this.form.setFieldsValue(pick(this.model, 'username', 'password'))
      //   // console.log(that.form)
      // })
      this.selectedDepartKeys = []
      this.checkedDepartKeys = []
      this.checkedDepartNames = []
      this.checkedDepartNameString = ''
      this.userId = ''
      this.resultDepartOptions = []
      this.departId = []
      this.departIdShow = false
      this.currentTenant = []
    },

    add() {
      this.picUrl = ''
      this.refresh()
      this.edit({})
    },

    edit(record) {
      // console.log(record)
      // console.log(333)
      this.resetScreenSize() // 调用此方法,根据屏幕宽度自适应调整抽屉的宽度
      let that = this
      that.initialRoleList()
      that.checkedDepartNameString = ''
      that.form.resetFields()
      if (record.hasOwnProperty('id')) {
        that.loadUserRoles(record.id)
        setTimeout(() => {
          this.fileList = record.avatar
        }, 5)
      }
      that.userId = record.id

      that.visible = true
      that.model = Object.assign({}, record)
      // 调用查询用户对应的机构信息的方法
      that.checkedDepartKeys = []
      that.loadCheckedDeparts()
      // console.log(that.model)
      that.$nextTick(() => {
        that.form.setFieldsValue(
          pick(
            that.model,
            'orgCodeTxt',
            'username',
            'sex',
            'realname',
            'email',
            'phone',
            'workNo',
            'telephone',
            'post',
            'roleCode',
            'birthday',
            'avatar',
            'faceImage'
          )
        )
      })
      // console.log(that.model)

      //身份为上级显示负责机构，否则不显示
      if (this.model.userIdentity == '2') {
        this.identity = '2'
        this.departIdShow = true
      } else {
        this.identity = '1'
        this.departIdShow = false
      }

      //update-begin-author:taoyan date:2020710 for:多租户配置
      if (!record.relTenantIds || record.relTenantIds.length == 0) {
        this.currentTenant = []
      } else {
        this.currentTenant = record.relTenantIds.split(',').map(Number)
      }
      //update-end-author:taoyan date:2020710 for:多租户配置
    },

    //弹框执行  获取机构分配数据
    loadCheckedDeparts() {
      let that = this
      if (!that.userId) {
        return
      }
      // console.log(that.userId)
      getAction(that.url.userWithDepart, { userId: that.userId }).then((res) => {
        that.checkedDepartNames = []
        if (res.success) {
          // console.log(111)
          var depart = []
          var departId = []
          // console.log(res)
          for (let i = 0; i < res.result.length; i++) {
            that.checkedDepartNames.push(res.result[i].title)
            // console.log(that.checkedDepartNames)
            this.checkedDepartNameString = this.checkedDepartNames.join(',')
            that.checkedDepartKeys.push(res.result[i].key)
            //新增负责机构选择下拉框
            depart.push({
              key: res.result[i].key,
              title: res.result[i].title,
            })
            departId.push(res.result[i].key)
          }

          that.resultDepartOptions = depart

          //判断机构id是否存在，不存在择直接默认当前所在机构
          // console.log(departId)
          // console.log(this.model.departIds)
          if (this.model.departIds) {
            this.departIds = this.model.departIds.split(',')
          } else {
            this.departIds = departId
          }
          that.userDepartModel.departIdList = that.checkedDepartKeys
        } else {
          console.log(res.message)
        }
      })
    },

    close() {
      this.$emit('close')
      this.visible = false
      this.disableSubmit = false
      this.selectedRole = ''
      this.userDepartModel = { userId: '', departIdList: [] }
      this.checkedDepartNames = []
      this.checkedDepartNameString = ''
      this.checkedDepartKeys = []
      this.selectedDepartKeys = []
      this.resultDepartOptions = []
      this.departIds = []
      this.departIdShow = false
      this.identity = '1'
      this.fileList = []
    },

    handleSubmit() {
      const that = this
      // 触发表单验证
      that.form.validateFields((err, values) => {
        if (!err) {
          values.avatar = that.model.imgUrl
          // console.log(that.model)
          var canvas = document.createElement('canvas')
          var ctx = canvas.getContext('2d')

          var base64 = canvas.toDataURL('image/jpeg', that.model.imgUrl).split('ddata:image/jpeg;base64,')[1]
          // var base64 = canvas.toDataURL(this.model.imgUrl).split('data:image/png;base64,')[1]
          values.faceImage = base64

          // if (!values.avatar) {
          //   this.$message.error('请选择人脸图片!')
          //   return
          // }
          that.confirmLoading = true
          // if (!values.birthday) {
          //   values.birthday = ''
          // } else {
          //   values.birthday = values.birthday.format('YYYY-MM-DD')
          // }
          let formData = Object.assign(this.model, values)

          //update-begin-author:taoyan date:2020710 for:多租户配置
          formData.relTenantIds = this.currentTenant.length > 0 ? this.currentTenant.join(',') : ''
          //update-end-author:taoyan date:2020710 for:多租户配置
          // console.log(this.selectedRole)
          formData.selectedroles = this.selectedRole
          formData.selecteddeparts =
            this.userDepartModel.departIdList.length > 0 ? this.userDepartModel.departIdList.join(',') : ''
          formData.userIdentity = this.identity
          //如果是上级择传入departIds,否则为空
          if (this.identity === '2') {
            formData.departIds = this.departIds.join(',')
          } else {
            formData.departIds = ''
          }
          // that.addDepartsToUser(that,formData); // 调用根据当前用户添加机构信息的方法
          delete formData.imgUrl
          // console.log(formData)
          // return
          let obj
          if (!this.model.id) {
            formData.id = this.userId
            obj = addUser(formData)
          } else {
            obj = editUser(formData)
          }
          obj
            .then((res) => {
              if (res.success) {
                that.$message.success(res.message)
                that.$emit('ok')
              } else {
                that.$message.warning(res.message)
              }
            })
            .finally(() => {
              that.confirmLoading = false
              that.checkedDepartNames = []
              that.userDepartModel.departIdList = { userId: '', departIdList: [] }
              that.close()
            })
        } else {
          // console.log(err)
          if (err.avatar) {
            Message.error(err.avatar.errors[0].message)
          }
        }
      })
    },

    handleCancel() {
      this.close()
    },

    validateToNextPassword(rule, value, callback) {
      const form = this.form
      const confirmpassword = form.getFieldValue('confirmpassword')

      // if (value && confirmpassword && value !== confirmpassword) {
      //   callback('两次输入的密码不一样！')
      // }
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },

    compareToFirstPassword(rule, value, callback) {
      const form = this.form
      if (value && value !== form.getFieldValue('password')) {
        callback('两次输入的密码不一样！')
      } else {
        callback()
      }
    },

    validatePhone(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        //update-begin--Author:kangxiaolin  Date:20190826 for：[05] 手机号不支持199号码段--------------------
        if (new RegExp(/^1[3|4|5|7|8|9][0-9]\d{8}$/).test(value)) {
          //update-end--Author:kangxiaolin  Date:20190826 for：[05] 手机号不支持199号码段--------------------

          var params = {
            tableName: 'sys_user',
            fieldName: 'phone',
            fieldVal: value,
            dataId: this.userId,
          }
          duplicateCheck(params).then((res) => {
            if (res.success) {
              callback()
            } else {
              callback('手机号已存在!')
            }
          })
        } else {
          callback('请输入正确格式的手机号码!')
        }
      }
    },

    validateEmail(rule, value, callback) {
      if (!value) {
        callback()
      } else {
        if (
          new RegExp(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ).test(value)
        ) {
          var params = {
            tableName: 'sys_user',
            fieldName: 'email',
            fieldVal: value,
            dataId: this.userId,
          }
          duplicateCheck(params).then((res) => {
            console.log(res)
            if (res.success) {
              callback()
            } else {
              callback('邮箱已存在!')
            }
          })
        } else {
          callback('请输入正确格式的邮箱!')
        }
      }
    },

    validateUsername(rule, value, callback) {
      var params = {
        tableName: 'sys_user',
        fieldName: 'username',
        fieldVal: value,
        dataId: this.userId,
      }
      duplicateCheck(params).then((res) => {
        if (res.success) {
          callback()
        } else {
          callback('用户名已存在!')
        }
      })
      const reNum = /^[0-9]*$/
      const rege = /[`~!@#$%^&*()\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/im
      if (rege.test(value) || reNum.test(value)) {
        callback('用户名不能是特殊字符和数字!')
      }
    },

    validateWorkNo(rule, value, callback) {
      var params = {
        tableName: 'sys_user',
        fieldName: 'work_no',
        fieldVal: value,
        dataId: this.userId,
      }
      duplicateCheck(params).then((res) => {
        if (res.success) {
          callback()
        } else {
          callback('工号已存在!')
        }
      })
    },

    handleConfirmBlur(e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },

    normFile(e) {
      console.log('Upload event:', e)
      if (Array.isArray(e)) {
        return e
      }
      return e && e.fileList
    },

    beforeUpload: function (file) {
      var fileType = file.type

      let types = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'video/mp4',
        'video/rmvb',
        'video/avi',
        'video/ts',
      ]
      const isJpgOrPng = types.indexOf(file.type) === -1
      if (isJpgOrPng) {
        return this.$message.error('请选择正确格式附件!')
      }

      //TODO 验证文件大小
    },

    // 搜索用户对应的机构API
    onSearch(val) {
      // console.log(val)
      this.$refs.departWindow.add(this.checkedDepartKeys, this.userId)
    },

    // 获取用户对应机构弹出框提交给返回的数据
    modalFormOk(formData) {
      // console.log(formData)
      this.checkedDepartNames = []
      this.selectedDepartKeys = []
      this.checkedDepartNameString = ''
      this.userId = formData.userId
      this.userDepartModel.userId = formData.userId
      this.departIds = []
      this.resultDepartOptions = []
      var depart = []
      // console.log(formData.departIdList)
      for (let i = 0; i < formData.departIdList.length; i++) {
        this.selectedDepartKeys.push(formData.departIdList[i].key)
        this.checkedDepartNames.push(formData.departIdList[i].title)
        this.checkedDepartNameString = this.checkedDepartNames.join(',')
        //新增机构选择，如果上面机构选择后不为空直接付给负责机构
        depart.push({
          key: formData.departIdList[i].key,
          title: formData.departIdList[i].title,
        })
        this.departIds.push(formData.departIdList[i].key)
      }
      // console.log(this.selectedDepartKeys)
      // console.log(this.checkedDepartNames)
      // console.log(this.checkedDepartNameString)
      // console.log(this.departIds)
      this.model.orgCodeTxt = this.checkedDepartNameString
      this.$nextTick(() => {
        this.form.setFieldsValue(
          pick(
            this.model,
            'orgCodeTxt',
            'username',
            'sex',
            'realname',
            'email',
            'phone',
            'workNo',
            'telephone',
            'post',
            'roleCode'
          )
        )
        // console.log(that.form)
      })
      this.resultDepartOptions = depart
      this.userDepartModel.departIdList = this.selectedDepartKeys
      this.checkedDepartKeys = this.selectedDepartKeys //更新当前的选择keys
    },

    // 根据屏幕变化,设置抽屉尺寸
    resetScreenSize() {
      let screenWidth = document.body.clientWidth
      if (screenWidth < 500) {
        this.drawerWidth = screenWidth
      } else {
        this.drawerWidth = 700
      }
    },

    identityChange(e) {
      if (e.target.value === '1') {
        this.departIdShow = false
      } else {
        this.departIdShow = true
      }
    },

    // 上传图像
    handleChange(info) {
      const that = this
      if (info.file.status === 'uploading') {
        that.loading = true
        return
      }
      if (info.file.status === 'done') {
        that.loading = false
        if (info.file.response.success) {
          let val = info.file
          lc_faceValidate(val.response.message).then((res) => {
            if (res.result) {
              that.model.fileType = val.type
              that.model.imgUrl = val.response.message
              that.model.avatar = val.response.message
              this.$nextTick(() => {
                this.form.setFieldsValue(pick(this.model, 'avatar'))
              })
              console.log(this.form)
              console.log(that.model.imgUrl)
              console.log(that.model.avatar)
            } else {
              that.$message.error('上传的头像必须是人脸图片!')
            }
          })

          // console.log(this.model, '---------------')
        } else {
          that.$message.error(info.file.response.message)
        }
      } else if (info.file.status === 'error') {
        this.loading = false
        this.$message.error(`${info.file.name} 上传失败.`)
      }
    },

    beforeImageUpload(file) {
      const isJPG =
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png' ||
        file.type === 'image/bmp'
      if (!isJPG) {
        this.$message.error('请上传图片文件')
      }
      const isLt2M = file.size / 1024 < 1024 * 16 && file.size / 1024 > 10
      if (!isLt2M) {
        this.$message.error('文件大小应在10KB~200KB之间')
      }
      return isJPG && isLt2M
    },
  },
}
</script>

<style scoped>
.avatar-uploader > .ant-upload {
  width: 104px;
  height: 104px;
}
.ant-upload-select-picture-card i {
  font-size: 49px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

.ant-table-tbody .ant-table-row td {
  padding-top: 10px;
  padding-bottom: 10px;
}

.drawer-bootom-button {
  position: absolute;
  bottom: -8px;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>