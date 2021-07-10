const axios = require('axios').default
const logger = require('./logger')
const user = require('../credentials')
const COMMON_HEADER = [
  'Content-Type: application/json',,
  'X-Unity-Version: 2017.4.39f1',,
  'User-Agent: Dalvik/2.1.0 (Linux; U; Android 6.0.1; X Build/V417IR)',,
  'Connection: Keep-Alive',
]
const PASSPORT_HEADER = [
  'Content-Type: application/x-www-form-urlencoded; charset=UTF-8',,
  'User-Agent: Dalvik/2.1.0 (Linux; U; Android 6.0.1; X Build/V417IR)',,
  'Connection: Keep-Alive',
]

// 基础 get/post
// 均自带 commonHeader，使用 Object.assign() 合并 headers
// BTW, Fuck Promise.
function get(url, params = {}, headersAddition = {}) {
  console.log('hello');
  return axios.get(url, {
    headers: Object.assign(COMMON_HEADER, headersAddition),
    params
  })
    .catch((err) => {
      logger.halt(err)
    })
}
function post(url, data = {}, headersAddition = {}) {
  logger.out('POST ' + url)
  return axios.post(url, {
    headers: Object.assign(COMMON_HEADER, headersAddition),
    data
  })
    .catch((err) => {
      logger.halt(err)
    })
}
  
module.exports = {

  // 命名规律：请求方法+服务器

  // 获取 配置信息
  getConfig: (uri) => get(user.server.CONF + uri),

  // 访问 账号认证服务器
  postAuth: (uri, data = {}) => post(user.server.AUTH + uri, data),

  // 访问 游戏服务器
  postGame(uri, data = {}, player) {
    let headers = {
      uid: player.uid,
      secret: player.secret,
      seqnum: player.seqnum
    }
    return post(user.server.GAME + uri, data, headers)
  },

  // 访问 Yostar 账号服务器（外服专用）
  postPassport: (uri, data = {}) => post(user.server.PASSPORT + uri, data, PASSPORT_HEADER)

}
