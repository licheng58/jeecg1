// 获取时间差
function getDiffTime(startTime, endTime) {
  const stime = new Date(startTime).getTime()
  let etime
  if (endTime) {
    etime = new Date(endTime).getTime()
  } else {
    etime = new Date().getTime()
  }

  const usedTime = etime - stime //两个时间戳相差的毫秒数
  const days = Math.floor(usedTime / (24 * 3600 * 1000))
  //计算出小时数
  const leave1 = usedTime % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
  const hours = Math.floor(leave1 / (3600 * 1000))
  //计算相差分钟数
  const leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
  const minutes = Math.floor(leave2 / (60 * 1000))
  let time
  if (minutes) {
    time = minutes + '分'
  }
  if (hours) {
    time = hours + '时' + time
  }

  if (days) {
    time = days + '天' + time
  }

  if (time) {
    return time
  }
  return ''
}

export default getDiffTime
