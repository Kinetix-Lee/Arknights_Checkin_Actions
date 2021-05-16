const network = require('./network')
const logger = require('./logger')

module.exports = {
  // 登录游戏服务器
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
    const response = network.postGame('/account/login', data, player)
    if (response) {
      const responseData = JSON.parse(response.data)

      player.channelUid = responseData.uid
      player.token = responseData.token
      
      logger.out(`游戏服务器登录成功：uid=${player.uid}`)
      return true
    } else {
      logger.error('游戏服务器登录失败')
      return false
    }
  },

  // 同步游戏数据
  syncData(player) {
    const data = { platform: PLATFORM }
    const response = network.postGame('/account/syncData', data, player)
    if (response) {
      const responseData = JSON.parse(response.data)

      // 分析服务器返回的数据
      const displayName = decodeURIComponent(responseData.user.status.nickName) + '#' + response.user.status.nickNumber
      player.can_checkin = (responseData.user.checkIn.canCheckIn !== 0)
      player.can_receive_social_point = (responseData.user.social.yesterdayReward.canReceive !== 0)
      
      logger.out('游戏数据同步成功：' + displayName)
      logger.out('签到状态：' + player.can_checkin ? '待签到' : '已经签到过了')
      logger.out('信用点收取状态：' + player.can_receive_social_point ? '信用点待收取' : '信用点已经收取过了')

      // 统计活动签到数量
      if (Object.getOwnPropertyNames(responseData.user.activity.CHECKIN_ONLY).length > 0) {
        let listActivities = []
        for (let index in responseData.user.activity.CHECKIN_ONLY) {
          listActivities.push(index)
        }
        logger.out('活动签到可用：' + listActivities.toString())
      } else logger.out('没有可用的活动签到')

      // 记录签到状况
      player.activity_checkin_history = (listActivities.length > 0) ? responseData.user.activity.CHECKIN_ONLY[listActivities[0]].history : null

      return true
    } else {
      logger.error('游戏数据同步失败')
      return false
    }
  },
  
  // 更新在线状态
  syncStatus(player, modules) {
    const data = {
      modules,
      params: {
        '16': {
          goodIdMap: {
            CASH: [],
            ES: [],
            GP: ['GP_Once_1'],
            HS: [],
            LS: [],
            SOCIAL: []
          }
        }
      }
    }

    const response = network.postGame('/account/syncStatus', data, player)
    if (response) {
      const responseData = JSON.parse(response.data)
      logger.out('状态同步成功，更新上线时间（服务器时间）：' + responseData.data.ts)
      return true
    } else {
      logger.error('状态同步失败')
      return false
    }
  },

  // 同步基建数据
  syncBuilding(player) {
    const response = network.postGame('/building/sync', {}, player)
    if (response) {
      const responseData = JSON.parse(response.data)

      let listManufactureRoomSlot = []
      let listTradingRoomSlot = []
      let listControlRoomSlot = []
      let listDormitoryRoomSlot = []
      let listPowerRoomSlot = []
      let listHireRoomSlot = []
      let listMeetingRoomSlot = []

      let listFreeCharacters = []
      let listLowApCharacters = []

      let rooms = responseData.playerDataDelta.modified.building.rooms
      let roomSlots = responseData.playerDataDelta.modified.building.roomSlots

      // I12e = Infrastructure
      function listI12eUpdate(list, room, slotId) {
        list.push({
          count: Object.getOwnPropertyNames(room.charInstIds).length,
          slot_id: slotId
        })
      }

      // Char = Characters
      function listCharUpdate(list, index, char) {
        list.push({
          index: Number(index),
          ap: char.ap
        })
      }

      if (Object.getOwnPropertyNames(rooms).length > 0) {
        // 原项目代码中，有单位没有解锁就会直接跳过基建维护操作。
        // 实测即使有部分单位没有解锁，服务器仍会返回目前拥有的所有基建单位。
        // 结论是不影响。只须维护已解锁的基建单位即可。
        roomSlots.forEach((room, slotId) => {
          switch (room.slotId) {
            case 'MANUFACTURE': // 制造站
              listI12eUpdate(listManufactureRoomSlot, room, slotId)
              break
            
            case 'TRADING': // 贸易站
              listI12eUpdate(listTradingRoomSlot, room, slotId)
              break
            
            case 'CONTROL': // 控制中枢
              listI12eUpdate(listControlRoomSlot, room, slotId)
              break
            
            case 'DORMITORY': // 宿舍
              listI12eUpdate(listDormitoryRoomSlot, room, slotId)
              break
            
            case 'POWER': // 发电站
              listI12eUpdate(listPowerRoomSlot, room, slotId)
              break
            
            case 'HIRE': // 人力办公室
              listI12eUpdate(listHireRoomSlot, room, slotId)
              break
            
            case 'MEETING': // 会客室
              listI12eUpdate(listMeetingRoomSlot, room, slotId)
              break
          }
        })

        responseData.playerDataDelta.modified.building.chars.forEach((char, index) => {
          listCharUpdate(listFreeCharacters, index, char)
          listCharUpdate(listLowCharacters, index, char)
        })

        // 整理（排列）干员列表
        listFreeCharacters.sort((a, b) => (a.ap < b.ap) ? -1 : 1)   // 降序排列
        listLowApCharacters.sort((a, b) => (a.ap > b.ap) ? -1 : 1)  // 升序排列

        player.free_chars_list = listFreeCharacters
        player.lowap_chars_list = listLowApCharacters
      } else player.building_on = false

      player.manufacture_room_slot = listManufactureRoomSlot
      player.trade_room_slot = listTradingRoomSlot
      player.control_room_slot = listControlRoomSlot
      player.dormitory_room_slot = listDormitoryRoomSlot
      player.power_room_slot = listPowerRoomSlot
      player.hire_room_slot = listHireRoomSlot
      player.meeting_room_slot = listMeetingRoomSlot

      logger.out('基建数据同步成功')
      return true
    } else {
      logger.error('基建数据同步失败')
      return false
    }
  },

  // 获取未完成订单列表
  getUnconfirmedOrderIdList(player) {
    const response = network.postGame('/pay/getUnconfirmedOrderIdList', {}, player)
    if (response) {
      logger.out('获取未完成订单成功')
      return true
    } else {
      logger.error('获取未完成订单失败')
      return false
    }
  },

  // 获取邮件列表
  getMailList(player) {
    data = { from: player.getCorrectedTime() }
    const response = network.postGame('/mail/getMetaInfoList', data, player)
    if (response) {
      const resultObj = JSON.parse(result)
      let listUnreadMail = []
      let countMailWithItems = 0

      resultObj.forEach((mail) => {
        if (mail.state === 0) {
          listUnreadMail.push({
            mailId: mail.mailId,
            type: mail.type
          })
          if (mail.hasItem) ++countMailWithItems
          logger.out(`邮件：mailId=${mail.mailId}${mail.hasItem ? ' 有物品' : ''}`)
        }
      })
      logger.out(`获取邮件列表成功：未读邮件${listUnreadMail.length}封，其中${countMailWithItems}封有附件`)
      return listUnreadMail
    } else {
      logger.error('获取邮件列表失败')
      return false
    }
  },

  // 收取邮件
  receiveMail(player, mailId, type) {
    const data = { type, mailId }
    const response = network.postGame('/mail/receiveMail', data, player)
    if (response) {
      logger.out('邮件收取成功：mailId=' + mailId)
      return true
    } else {
      logger.error('邮件收取失败')
      return false
    }
  },

  // 每日签到
  checkIn(player) {
    const response = network.postGame('/user/checkIn', {}, player)
    if (response) {
      logger.out('每日签到成功')
      return true
    } else {
      logger.error('每日签到失败')
      return false
    }
  },

  // 活动签到
  checkInActivity(player, activityId, index) {
    const data = { index, activityId }
    const response = network.postGame('/activity/getActivityCheckInReward', data, player)
    if (response) {
      logger.out(`活动签到完成：activityId=${activityId}, index=${index}`)
      return true
    } else {
      logger.out('活动签到失败')
      return false
    }
  },

  // 收取制造站产物
  settleManufacture(player) {
    let roomSlotIdList = []
    player.manufacture_room_slot.forEach((room) => {
      roomSlotIdList.push(room.slot_id)
    })

    const data = {
      roomSlotIdList,
      supplement: 1
    }
    const response = network.postGame('/building/settleManufacture', data, player)
    if (response) {
      logger.out('制造站产物收取完成')
      return true
    } else {
      logger.error('制造站产物收取失败')
      return false
    }
  },

  // 结算贸易站订单
  deliveryBatchOrder(player) {
    let roomSlotIdList = []
    player.trade_room_slot.forEach((room) => {
      roomSlotIdList.push(room.slot_id)
    })

    const data = { slotList: roomSlotIdList }
    const response = postGame('/building/deliveryBatchOrder', data, player)
    if (response) {
      const responseData = JSON.parse(response.data)
      const items = []

      responseData.delivered.forEach((room) => {
        room.forEach((item) => {
          items.push({
            type: item.type,
            count: item.count
          })
        })
      })

      logger.out(`贸易站订单结算完成：获得物品${items.length}种，数据：${items.toString()}`)
      return true
    } else {
      logger.error('贸易站订单结算失败')
      return false
    }
  },

  // 收取干员信赖
  gainAllIntimacy(player) {
    const response = network.postGame('/building/gainAllIntimacy', {}, player)
    if (response) {
      const responseData = JSON.parse(response.data)
      logger.out(`干员信赖收取完成：干员总数${responseData.assist}，信赖总数${responseData.normal}`)
      return true
    } else {
      logger.error('干员信赖收取失败')
      return false
    }
  },

  // 领取信用
  receiveSocialPoint(player) {
    const response = postGame('/social/receiveSocialPoint', {}, player)
    if (response) {
      const responseData = JSON.parse(response.data)
      let socialPoint = 0

      responseData.reward.forEach((reward) => {
        if (reward.id === 'SOCIAL_PT')
        socialPoint = reward.count
      })

      logger.out(`信用领取完成：领取了${socialPoint}点`)
      return true
    } else {
      logger.error('信用领取失败')
      return false
    }
  }
}
