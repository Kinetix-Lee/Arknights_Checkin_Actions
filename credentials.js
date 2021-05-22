
// 用户编辑内容开始
let user = {
  account: '18900000000',
  password: 'edit me',
  server: 'CN', // 目前暂时没有实现外服功能
  platform: 'iOS' // 安卓服填写 Android
}
// 用户编辑内容结束

const SERVERS = {
  // 国服
  CN: {
    AUTH: 'https://as.hypergryph.com',
    GAME: 'https://ak-gs-gf.hypergryph.com',
    CONF: 'https://ak-conf.hypergryph.com',
    VER:  `https://ak-conf.hypergryph.com/config/prod/official/${user.platform}/version`
  },

  // 日服
  JP: {
    PASSPORT: 'https://passport.arknights.jp',
    AUTH: 'https://as.arknights.jp',
    GAME: 'https://gs.arknights.jp:8443',
    CONF: 'https://ak-conf.arknights.jp',
    VER: 'https://ark-jp-static-online.yo-star.com/assetbundle/official/Android/version',
    ID: '3'
  },

  // 美服
  US: {
    PASSPORT: 'https://passport.arknights.global',
    AUTH: 'https://as.arknights.global',
    GAME: 'https://gs.arknights.global:8443',
    SERVER: 'https://ak-conf.arknights.global',
    VER: 'https://ark-us-static-online.yo-star.com/assetbundle/official/Android/version',
    ID: '3'
  }
}

switch (user.server) {
  case 'CN':
    user.server = SERVERS.CN
    break
  case 'JP':
    user.server = SERVERS.JP
    break
  case 'US':
    user.server = SERVERS.US
    break
  default:
    user.server = SERVERS.CN
    break
}

module.exports = user
