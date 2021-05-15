const random = require('./random')
const network = require('./network')
const logger = require('./logger')

module.exports = {
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
  },

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
