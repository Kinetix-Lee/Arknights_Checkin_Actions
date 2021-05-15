const network = require('./network')
const logger = require('./logger')

module.exports = {
  /**
   * 登录游戏服务器
   * @author Kinetix-Lee
   * @date 2021-05-15
   * @param {any} player
   * @returns {any}
   */
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
  },

  /**
   * 同步游戏数据
   * @author Kinetix-Lee
   * @date 2021-05-15
   * @param {any} player
   * @returns {any}
   */
   syncData(player) {
    const data = JSON.stringify({ platform: PLATFORM })
    network.postGame('/account/syncData', data, player)
      .then((result) => {
        const resultObj = JSON.parse(result)

        // 分析服务器返回的数据
        const displayName = decodeURIComponent(resultObj.user.status.nickName) + '#' + result.user.status.nickNumber
        player.can_checkin = (resultObj.user.checkIn.canCheckIn !== 0)
        player.can_receive_social_point = (resultObj.user.social.yesterdayReward.canReceive !== 0)
        
        logger.out('游戏数据同步成功：' + displayName)
        logger.out('同步时间（服务器时间）：' + resultObj.rs)
        logger.out('签到状态：' + player.can_checkin ? '待签到' : '已经签到过了')
        logger.out('信用点收取状态：' + player.can_receive_social_point ? '信用点待收取' : '信用点已经收取过了')

        // 统计活动签到数量
        if (Object.getOwnPropertyNames(resultObj.user.activity.CHECKIN_ONLY).length > 0) {
          let listActivities = []
          for (let index in resultObj.user.activity.CHECKIN_ONLY) {
            listActivities.push(index)
          }
          logger.out('活动签到可用：' + listActivities.toString())
        } else logger.out('没有可用的活动签到')

        // 记录签到状况
        player.activity_checkin_history = (listActivities.length > 0) ? resultObj.user.activity.CHECKIN_ONLY[listActivities[0]].history : null

        // 记录上线时间
        player.login_time = resultObj.rs
      })
      .catch((error) => logger.error('游戏数据同步失败：' + error))
  }
}
