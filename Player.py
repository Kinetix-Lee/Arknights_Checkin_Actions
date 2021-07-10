from .utils import random
from math import floor
from time import time

class Player:
  deviceId = '' # 登录设备指纹, 注册账号时使用的唯一标识
  deviceId2 = '' # imei
  deviceId3 = '' # 登录设备指纹, 可为空
  account = '' # 账号
  password = '' # 密码
  uid = 0 # 当前账号唯一标识
  channelUid = 0 # 渠道uid
  accessToken = '' # 游客登录凭据, 用来获取channel_uid
  token = '' # 使用channel_uid和access_token换取的一次性登录凭据
  secret = '' # http session_id, 标志客户端登录状态

  isYostar = False # 是否为国际服
  yostarAccount = '' # 国际服_账号
  yostarUid = '' # 国际服_uid
  yostarChannelToken = '' # 国际服_渠道token
  yostarToken = '' # 国际服_换取的一次性登录凭据
  yostarLoginToken = '' # token&uid

  seqnum = 0 # 封包编号, 服务器会返回下一次请求使用的编号, 通常每次请求自增1
  loginTime = 0 # syncData返回的服务器时间, 副本战斗日志加密时使用
  timeDiff = 0 # 服务器与本地时间差
  canCheckin = True # 是否可以签到
  socialPoint = 0 # 信用点
  can_receive_social_point = True # 是否领取信用点
  buildingOn = True # 基建是否解锁
  activityCheckinHistory = [] # 活动签到历史
  manufactureRoomSlot = [] # 制造站
  tradeRoomSlot = [] # 贸易站
  controlRoomSlot = [] # 控制中心
  dormitoryRoomSlot = [] # 宿舍
  powerRoomSlot = [] # 发电站
  meetingRoomSlot = [] # 会客室
  hireRoomSlot = [] # 办公室
  freeCharsList = [] # 空闲干员
  lowApCharsList = [] # 低理智干员

  config = {
    'credentials': {},
    'hmacKey': '91240f70c09a08a6bc72af1a5c8d4670',

    'resVersion': '',
    'clientVersion': '',
    'networkVersion': '',

    'modules': 1631,
    'checkInActivityId': '',
    'checkInActivityOn': False,

    'appId': '1',
    'platformId': 'Android',
    'platform': 1
  }

  def __init__(self, user, deviceId='', deviceId2='', deviceId3='', accessToken=''):
    self.config['credentials'] = user
    self.config['credentials']['accessToken'] = accessToken
    self.config['platformId'] = user['platform']

    self.deviceId = self.deviceId if deviceId == '' else random.randomDeviceId()
    self.deviceId2 = self.deviceId2 if deviceId2 == '' else random.randomDeviceId2()
    self.deviceId3 = self.deviceId3 if deviceId3 == '' else random.randomDeviceId3()
  
  def setTimeOffset(self, serverTime):
    self.timeDiff = serverTime - floor(time())

  def getCorrectedTime(self):
    return floor(time()) + self.timeDiff