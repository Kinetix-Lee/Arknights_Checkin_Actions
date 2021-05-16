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
    const response = network.getConfig('/config/prod/official/network_config')
    if (response) {
      const responseData = JSON.parse(response.data)

      NETWORK_VERSION = response.data.match(/(?<=")\d+/)
      RES_VERSION = responseData.resVersion
      CLIENT_VERSION = responseData.clientVersion

      logger.out('配置更新成功')
      return true
    } else {
      logger.error('配置更新失败')
      return false
    }
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
    const response = network.postAuth('/u8/user/getToken', data)
    if (response) {
      const responseData = JSON.parse(response.data)

      player.uid = responseData.uid
      player.token = responseData.token

      logger.out(`获取 Token 成功：uid=${responseData.uid}, channel_uid=${responseData.channelUid}`)
      return true
    } else {
      logger.error('获取 Token 失败')
      return false
    }
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
    const response = network.postAccount('/user/login', data)
    if (response) {
      const responseData = JSON.parse(response.data)

      player.channelUid = responseData.uid
      player.token = responseData.token
      
      logger.out(`账号登录成功：uid=${player.uid}`)
      return true
    } else {
      logger.error('账号登陆失败')
      return false
    }
  }
}
