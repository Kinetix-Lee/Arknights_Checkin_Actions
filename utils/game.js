const network = require('./network')
const logger = require('./logger')

module.exports = {
  login(player) {
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
    network.postGame('/account/login', data, player)
      .then((result) => {
        result = JSON.parse(result.data)

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
