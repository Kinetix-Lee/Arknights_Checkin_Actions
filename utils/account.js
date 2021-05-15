const random = require('./random')
const network = require('./network')
const logger = require('./logger')

module.exports = {
  /**
   * 更新配置
   * @author Kinetix-Lee
   * @date 2021-05-15
   * @returns {any}
   */
  updateConfig() {
    network.getConfig('/config/prod/official/network_config')
      .then((result) => {
        const resultObj = JSON.parse(result.data)

        NETWORK_VERSION = result.data.match(/(?<=")\d+/)
        RES_VERSION = resultObj.resVersion
        CLIENT_VERSION = resultObj.clientVersion

        return true
      })
      .catch((error) => {
        logger.error(error)
        return false
      })
  },

  /**
   * 获取身份令牌（u8 登录）
   * @author Kinetix-Lee
   * @date 2021-05-15
   * @param {any} player
   * @returns {any}
   */
  getToken(player) {
    const { account, deviceId, password } = player
    sign_data = `account=${account}&deviceId=${deviceId}&password=${password}&platform=${PLATFORM}`
    sign = random.u8_sign(sign_data)
    data = {
      account,
      password,
      deviceId,
      platform: PLATFORM,
      sign
    }
    network.postAuth('/u8/user/getToken', data)
      .then((result) => {
        result = JSON.parse(result.data)

        player.uid = result.uid
        player.token = result.token

        logger.out(`获取 Token 成功：uid=${result.uid}, channel_uid=${result.channelUid}`)
        return true
      })
      .catch((error) => {
        logger.error(`获取 Token 失败：${error}`)
        return false
      })
  },

  /**
   * 登录 Hypergryph Account
   * @author Kinetix-Lee
   * @date 2021-05-15
   * @param {any} player
   * @returns {any}
   */
  accountLogin(player) {
    const { account, deviceId, password } = player

    sign_data = `account=${account}&deviceId=${deviceId}&password=${password}&platform=${PLATFORM}`
    sign = random.u8_sign(sign_data)

    data = {
      account,
      password,
      deviceId,
      platform: PLATFORM,
      sign
    }
    network.postAccount('/user/login', data)
      .then((result) => {
        result = JSON.parse(result.data)

        player.channelUid = result.uid
        player.token = result.token
        
        logger.out(`账号登录成功：uid=${player.uid}`)
        return true
      })
      .catch((error) => {
        logger.error(`账号登录失败：${error}`)
        return false
      })
  }
}
