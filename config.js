const HMAC_KEY = '91240f70c09a08a6bc72af1a5c8d4670'

const COMMON_HEADER = array(
  'Content-Type: application/json',
  'X-Unity-Version: 2017.4.39f1',
  'User-Agent: Dalvik/2.1.0 (Linux; U; Android 6.0.1; X Build/V417IR)',
  'Connection: Keep-Alive'
)
const PASSPORT_HEADER = array(
  'Content-Type: application/x-www-form-urlencoded; charset=UTF-8',
  'User-Agent: Dalvik/2.1.0 (Linux; U; Android 6.0.1; X Build/V417IR)',
  'Connection: Keep-Alive'
)
const RES_VERSION = ''
const CLIENT_VERSION = ''
const NETWORK_VERSION = ''

const MODULES = 1631
const CHECKIN_ACTIVITY_ID = ''
const CHECKIN_ACTIVITY_ON = false

const APP_ID = '1'
const PLATFORM_ID = 'Android';//'IOS'
const PLATFORM = 1

const SERVERS = {
  // 国服
  CN: {
    AUTH: 'https://as.hypergryph.com',
    GAME: 'https://ak-gs-gf.hypergryph.com',
    CONF: 'https://ak-conf.hypergryph.com',
    VER:  `https://ak-conf.hypergryph.com/config/prod/official/${PLATFORM_ID}/version`
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