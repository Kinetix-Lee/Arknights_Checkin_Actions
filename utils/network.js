const axios = require('axios')
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

module.exports = {
  // 基础 get/post
  // 均自带 commonHeader，使用 Object.assign() 合并 headers
  get(url, params={}, headersAddition={}) {
    try {
      const response = axios({
        url,
        method: 'get',
        headers: Object.assign(COMMON_HEADER, headersAddition),
        params
      }) 
      return response
    } catch (error) {
      logger.error(error)
      return false
    }
  },
  post(url, data={}, headersAddition={}) {
    try {
      const response = axios({
        url,
        method: 'post',
        headers: Object.assign(COMMON_HEADER, headersAddition),
        data
      })
      return response
    } catch (error) {
      logger.error(error)
      return false
    }
  },

  // 命名规律：请求方法+服务器

  // 获取 配置信息
  getConfig: (uri) => this.get(user.server.CONF + uri),

  // 访问 账号认证服务器
  postAuth: (uri, data = {}) => this.post(user.server.AUTH + uri, data),

  // 访问 游戏服务器
  postGame(uri, data = {}, player) {
    let headers = {
      uid: player.uid,
      secret: player.secret,
      seqnum: player.seqnum
    }
    return this.post(user.server.GAME + uri, data, headers)
  },

  // 访问 Yostar 账号服务器（外服专用）
  postPassport: (uri, data = {}) => this.post(user.server.PASSPORT + uri, data, PASSPORT_HEADER)
}
