import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'

// import {    } from '@/api/lc_api'

// 获取工作流信息
export const lc_getWorkFlows = (id, name) =>
  getAction(
    `/industry/industryWorkFlow/queryAllList?${id ? 'workFlowId=' + id : ''}${name ? '&workFlowName=' + name : ''}`
  )

// 获取指定人
export const lc_getAppointors = () => getAction(`/industry/industryWorkOrder/queryUsersByDept`)

// 获取工作流进度条详情信息
export const lc_getWorkFlowDetails = id =>
  getAction(`/industry/industryWorkOrder/queryById`, {
    id
  })

// 全局获取产品型号信息
export const lc_getGrobalProductType = () => getAction(`/industry/industryProduct/queryAllList`)

// 获取工单数据
export const lc_getWorderOrders = (status, pageNo) =>
  getAction(`/industry/industryWorkOrder/list?${[0, 1, 2, 3].indexOf(status) !== -1 ? 'status=' + status : ''}
${pageNo ? '&pageNo=' + pageNo + '&pageSize:10' : ''}`)

// 工单删除
// 获取工作流进度条详情信息
export const lc_delWorderOrder = id =>
  deleteAction(`/industry/industryWorkOrder/delete`, {
    id
  })

// 获取工单数据统计
export const lc_getInfoCount = () => getAction(`/industry/industryWorkOrder/dataSummary`)

// check产品型号
export const lc_validateProductNo = productNo =>
  putAction(`/industry/industryProduct/check?${'productNo=' + productNo}`)

// check设备序列号
export const lc_validateSerialNo = serialNo => putAction(`/industry/industryHelmet/check?${'serialNo=' + serialNo}`)

// check产品型号
export const lc_validateTitle = title => putAction(`/industry/industryResources/check?${'title=' + title}`)

// check工单名称
export const lc_validateName = name => putAction(`/industry/industryWorkOrder/check?${'name=' + name}`)

// check工作流名称
export const lc_validateName_flow = name => putAction(`/industry/industryWorkFlow/check?${'name=' + name}`)

// 发布工作流
export const lc_addWorkFlows = params =>
  postAction(`/industry/industryWorkOrder/add`, {
    ...params
  })

// 部门人员集合
export const lc_getindustryHelmetUser = helmetId =>
  getAction(`/industry/industryHelmetUser/queryUsersByDept?${'helmetId=' + helmetId}`)

// 设备绑定用户
export const lc_bindUsers = industryHelmetUsers =>
  postAction(`/industry/industryHelmetUser/add`, [...industryHelmetUsers])

// 用户绑定设备
export const lc_bindDivices = helmetYcxz => putAction(`/industry/helmetYcxz/edit`, helmetYcxz)

// 首页获取数据
export const lc_getHomeInfo = () => getAction(`/industry/homepage/queryHomepage`)

// 验证人脸
export const lc_faceValidate = avatar => putAction(`/industry/homepage/checkHeaderImgae?${'avatar=' + avatar}`)

// 获取首页周 月 季度
export const lc_getTimeInfo = type => getAction(`/industry/homepage/queryHomepageOrders?${'type=' + type}`)

// 工单记录预加载
export const lc_getIndustryWorkOrderRecordList = () => getAction(`/industry/industryWorkOrderRecord/list`)

// check 发布任务工单
export const lc_validatePublicName = name => putAction(`/industry/industryWorkOrder/check?${'name=' + name}`)

// 设备管理 - 获取设备类型
export const lc_getDeviceTypes = () => getAction(`/sys/dict/getDictItems/helmet_type?dictCode=helmet_type&sign=`)

// 工单记录 - 获取历史详情
export const lc_getHistoryDetail = (orderId, pageNo) =>
  getAction(
    `/industry/industryWorkOrderRecord/queryByOrderId?${'orderId=' + orderId + '&pageNo=' + pageNo + '&pageSize=10'}`
  )

// 获取设备信息
export const lc_getDiviceInfo = pageNo =>
  getAction(`industry/helmetYcxz/queryAllUsersInToukui?${pageNo ? '&pageNo=' + pageNo + '&pageSize:10' : ''}`)

//设备管理 绑定远程协作账号获取远程用户数据
export const lc_getRemoteInfo = userId => getAction(`/industry/industryHelmet/getAccountList?${'userId=' + userId}`)

//设备管理 绑定远程协作账号
export const lc_BindRemote = (userId, account) =>
  putAction(`/industry/industryHelmet/bdycxzzh?${'userId=' + userId + '&account=' + account}`)
