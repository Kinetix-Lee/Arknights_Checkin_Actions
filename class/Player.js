const random = require('../utils/random')

random = require('../utils/random')

class Player {
  device_id = '' // 登录设备指纹, 注册账号时使用的唯一标识
  device_id2 = '' // imei
  device_id3 = '' // 登录设备指纹, 可为空
  account = '' // 账号
  password = '' // 密码
  uid = 0 // 当前账号唯一标识
  channel_uid = 0 // 渠道uid
  access_token = '' // 游客登录凭据, 用来获取channel_uid
  token = '' // 使用channel_uid和access_token换取的一次性登录凭据
  secret = '' // http session_id, 标志客户端登录状态

  is_yostar = false // 是否为国际服
  yostar_account = '' // 国际服_账号
  yostar_uid = '' // 国际服_uid
  yostar_channel_token = '' // 国际服_渠道token
  yostar_token = '' // 国际服_换取的一次性登录凭据
  yostar_login_token = '' // token&uid

  seqnum = 0 // 封包编号, 服务器会返回下一次请求使用的编号, 通常每次请求自增1
  login_time = 0 // syncData返回的服务器时间, 副本战斗日志加密时使用
  time_diff = 0 // 服务器与本地时间差
  can_checkin = true // 是否可以签到
  social_point = 0 // 信用数
  can_receive_social_point = true // 是否领取信用
  building_on = true // 基建是否解锁
  activity_checkin_history = [] // 活动签到历史
  manufacture_room_slot = [] // 制造站
  trade_room_slot = [] // 贸易站
  control_room_slot = [] // 控制中心
  dormitory_room_slot = [] // 宿舍
  power_room_slot = [] // 发电站
  meeting_room_slot = [] // 会客室
  hire_room_slot = [] // 办公室
  free_chars_list = [] // 空闲干员
  lowAp_chars_list = [] // 低理智干员

  constructor(device_id, device_id2, device_id3, access_token) {
    this.device_id = (device_id) ? this.device_id : random.randomDeviceId()
    this.device_id2 = (device_id2) ? this.device_id2 : random.randomDeviceId2()
    this.device_id3 = (device_id3) ? this.device_id3 : random.randomDeviceId3()
    this.access_token = access_token
  }
}

module.exports = Player
