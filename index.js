'use strict'

const Player = require('./class/Player')
const account = require('./utils/account')
const game = require('./utils/game')
const sleep = require('atomic-sleep')
const logger = require('./utils/logger')
const checkInfo = require('./utils/checkInfo')
require('./config')

if (!checkInfo()) {
  console.error('请检查账号信息是否正确填写！')
  return false
}

const player = new Player()
player.account = USER.ACCOUNT
player.password = USER.PASSWORD

// 登录
account.accountLogin(player)
account.gameLogin(player)

// 同步账号数据
game.syncStatus(player, MODULES)
sleep(10000)

// 获取未完成订单
game.getUnconfirmedOrderIdList(player)
sleep(10000)

// 每日签到
if (player.can_checkin) {
  game.checkIn(player)
  sleep(10000)
}

// 活动签到
if (CHECKIN_ACTIVITY_ON) {
  game.checkInActivity(player)
  sleep(10000)
}

// 收取邮件
game.checkMailbox(player)
sleep(10000)

// 收取信用
if (player.can_receive_social_point) game.receiveSocialPoint(player)
sleep(10000)

// 同步基建数据
game.syncBase(player)
sleep(10000)

// 基建操作
if (player.building_on) {

  // 获取制造站产物
  game.receiveResources(player)
  sleep(10000)

  // 递交贸易站订单
  game.completeOrder(player)
  sleep(10000)

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
