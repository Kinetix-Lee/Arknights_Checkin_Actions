# 用户编辑内容开始
user = {
  'account': '18900000000',
  'password': 'edit me',
  'server': 'CN', # 目前暂未实现B服、外服功能
  'platform': 'iOS' # Android
}
# 用户编辑内容结束

servers = {
  # 国服
  'CN': {
    'auth': 'https://as.hypergryph.com',
    'game': 'https://ak-gs-gf.hypergryph.com',
    'conf': 'https://ak-conf.hypergryph.com',
    'ver':  'https://ak-conf.hypergryph.com/config/prod/official/' + user['platform'] + '/version'
  },

  # 日服
  'JP': {
    'passport': 'https://passport.arknights.jp',
    'auth': 'https://as.arknights.jp',
    'game': 'https://gs.arknights.jp:8443',
    'conf': 'https://ak-conf.arknights.jp',
    'ver': 'https://ark-jp-static-online.yo-star.com/assetbundle/official/Android/version',
    'id': '3'
  },

  # 美服
  'US': {
    'passport': 'https://passport.arknights.global',
    'auth': 'https://as.arknights.global',
    'game': 'https://gs.arknights.global:8443',
    'server': 'https://ak-conf.arknights.global',
    'ver': 'https://ark-us-static-online.yo-star.com/assetbundle/official/Android/version',
    'id': '3'
  }
}

user['server'] = servers[user['server']]
