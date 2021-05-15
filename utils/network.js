const axios = require('axios')
require('../config')

module.exports = {
  get(url, params={}, headers={}) {
    return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'get',
        headers: Object.assign(COMMON_HEADER, headers),
        params
      }).then(resolve).catch(reject)
    })
  },
  post(url, data={}, headers={}) {
    return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'post',
        headers: Object.assign(COMMON_HEADER, headers),
        data
      }).then(resolve).catch(reject)
    })
  },

  // 命名规律：请求方法+服务器
  getConfig = (uri, params = {}, headers = {}) => this.get(USER.SERVER.CONF + uri, params, headers),
  postAuth = (uri, data = {}, headers = {}) => this.post(USER.SERVER.AUTH + uri, data, headers),
  postAccount = (uri, data = {}, headers = {}) => this.post(USER.SERVER.AUTH + uri, data, headers),
  postGame(uri, data = {}, player) {
    let headers = { // Headers 索引应该首字母大写吗？
      Uid: player.uid,
      Secret: player.secret,
      Seqnum: player.seqnum
    }
    return this.post(USER.SERVER.GAME + uri, data, Object.assign(COMMON_HEADER, headers))
  }
}
