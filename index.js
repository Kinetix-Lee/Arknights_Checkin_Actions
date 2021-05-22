'use strict'

const Player = require('./class/Player')
const account = require('./utils/account')
const game = require('./utils/game')
const sleep = require('atomic-sleep')
const logger = require('./utils/logger')
const checkInfo = require('./utils/checkInfo')
const credentials = require('./credentials')

if (!checkInfo(credentials)) {
  console.error('请检查账号信息是否正确填写！')
  return false
}

const player = new Player(credentials)

account.updateConfig(player)

// 登录
account.accountLogin(player)
game.Login(player)

// 同步账号数据
game.syncData(player)
sleep(1000)

// 更新在线状态
game.syncStatus(player, player.config.modules)
sleep(1000)

// 获取未完成订单
game.getUnconfirmedOrderIdList(player)
sleep(1000)

// 每日签到
if (player.can_checkin) {
  game.checkIn(player)
  sleep(10000)
}

// 活动签到
if (player.config.checkInActivityOn) {
  let flag = false

  for (let i = 0; i < player.activity_checkin_history.length; ++i) {
    if (history[i]) {
      game.checkInActivity(player, player.config.checkInActivityId, i)
      flag = true
      sleep(1000)
    }
  }

  if (!flag) logger.out('今日活动已签到')
}

// 收取邮件
game.checkMailbox(player)
sleep(1000)

// 收取信用
if (player.can_receive_social_point) game.receiveSocialPoint(player)
sleep(1000)

// 同步基建数据
game.syncBase(player)
sleep(1000)

// 基建操作
if (player.building_on) {

  // 获取制造站产物
  game.receiveResources(player)
  sleep(1000)

  // 递交贸易站订单
  game.completeOrder(player)
  sleep(1000)

  // 收取干员信赖
  game.receiveIntimacy(player)

  // 同步信用
  game.syncSocialPoint(player)

  // 自动兑换信用
  game.tradeSocialPoint(player)

  // 自动设置基建助理干员
  game.setAssignChar(player)
  game.getMissionRewards(player)

} else logger.out('基建未解锁')

logger.out('完成')
