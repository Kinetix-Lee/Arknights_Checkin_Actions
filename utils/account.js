const random = require('./random')
const axios = require('axios').default
const network = require('./network')
const logger = require('./logger')

module.exports = {
  get_token(player) {
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
    network.post_auth('/u8/user/getToken', data)
      .then((result) => {
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

  account_login(player) {
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
    network.post_account('/user/login', data)
      .then((result) => {
        player.channelUid = result.uid
        player.token = result.token
        
        logger.out(`账号登录成功：uid=${player.uid}`)
        return true
      })
      .catch((error) => {
        logger.error(`游戏服务器登录失败：${error}`)
        return false
      })
  },

  game_login(player) {
    if (!RES_VERSION || !CLIENT_VERSION) {
      logger.error('登录失败：客户端版本号获取失败')
      return false
    }
    const { deviceId, deviceId2, deviceId3, uid, token } = player

    data = {
      uid,
      token,
      assetsVersion: RES_VERSION,
      clientVersion: CLIENT_VERSION,
      platform: PLATFORM,
      deviceId,
      deviceId2,
      deviceId3
    }
    network.post_game('/account/login', data, player)
      .then((result) => {
        player.channelUid = result.uid
        player.token = result.token
        
        logger.out(`游戏服务器登录成功：uid=${player.uid}`)
        return true
      })
      .catch((error) => {
        logger.error(`游戏服务器登录失败：${error}`)
        return false
      })
  }
}
