import urllib3
from . import logger
from ..credentials import user

COMMON_HEADER = {
  'Content-Type': 'application/json',
  'X-Unity-Version': '2017.4.39f1',
  'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 6.0.1; X Build/V417IR)',
  'Connection': 'Keep-Alive'
}
PASSPORT_HEADER = {
  'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 6.0.1; X Build/V417IR)',
  'Connection': 'Keep-Alive'
}

http = urllib3.PoolManager()

# 基础请求方法
# 均自带 COMMON_HEADER 并自动合并头
# 同步写起来有点爽 233

def __get(url, params={}, headersAddition={}, debug=True):
  if debug:
    logger.out('GET ', url)
    logger.out(params)
  return http.request('GET', url, 
    headers=(COMMON_HEADER.items() + headersAddition.items()),
    fields=params)

def __post(url, data={}, headersAddition={}, debug=True):
  if debug:
    logger.out('POST', url)
    logger.out(data)
  return http.request('POST', url,
    headers=(COMMON_HEADER.items() + headersAddition.items()),
    fields=data)

# 获取配置信息
def getConfig(uri):
  return __get(user['server']['conf'] + uri)

# 访问账号认证服务器
def postAuth(uri, data={}):
  return __post(user['server']['auth'] + uri, data)

# 访问游戏服务器
def postGame(uri, player, data={}):
  return __post(user['server']['game'] + uri, data, {
    'uid': player.uid,
    'secret': player.secret,
    'seqnum': player.seqnum
  })

# 访问 Yostar 账号服务器
# 外服专用
def postPassport(uri, data={}):
  return __post(user['server']['passport'] + uri, data, PASSPORT_HEADER)
