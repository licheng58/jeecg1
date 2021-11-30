import Vue from 'vue'
import Router from 'vue-router'
import { constantRouterMap } from '@/config/router.config'
import { stringifyQuery, parseQuery } from "@/utils/query";

//update-begin-author:taoyan date:20191011 for:TASK #3214 【优化】访问online功能测试 浏览器控制台抛出异常
try {
  const originalPush = Router.prototype.push
  Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
  }
} catch (e) {
}
//update-end-author:taoyan date:20191011 for:TASK #3214 【优化】访问online功能测试 浏览器控制台抛出异常

Vue.use(Router)

export default new Router({
  // mode: 'history',
  // base: window._CONFIG['domianURL'],
  stringifyQuery: stringifyQuery,//加密 router query 传参
  parseQuery: parseQuery,//解密 router query 传参
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})