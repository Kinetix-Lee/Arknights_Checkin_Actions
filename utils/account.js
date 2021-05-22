const random = require('./random')
const network = require('./network')
const logger = require('./logger')

module.exports = {
  // 更新配置
  updateConfig(player) {
    const response = network.getConfig('/config/prod/official/network_config')
    if (response) {
      const responseData = JSON.parse(response.data)

      player.config.networkVersion = response.data.match(/(?<=")\d+/)
      player.config.resVersion = responseData.resVersion
      player.config.clientVersion = responseData.clientVersion

      logger.out('配置更新成功')
      return true
    } else {
      logger.error('配置更新失败')
      return false
    }
  },

  // 获取身份令牌
  getToken(player) {
    const { account, deviceId, password } = player
    sign_data = `account=${account}&deviceId=${deviceId}&password=${password}&platform=${player.config.platform}`
    sign = random.u8_sign(sign_data, player.config)
    data = {
      account,
      password,
      deviceId,
      platform: player.config.platform,
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

  // 登录鹰角账号
  accountLogin(player) {
    const { account, deviceId, password, config } = player

    sign_data = `account=${account}&deviceId=${deviceId}&password=${password}&platform=${config.platform}`
    sign = random.u8_sign(sign_data, config)

    data = {
      account,
      password,
      deviceId,
      platform: config.platform,
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
