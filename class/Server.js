const network = require('../utils/network')

class Server {

  resVersion = ''
  clientVersion = ''
  networkVersion = ''

  modules = 1631
  checkinActivityId = ''
  checkinActivityOn = false

  appId = '1'
  platformId = 'Android';//'IOS'
  platform = 1

  updateConfig() {
    network.getConfig('/config/prod/official/network_config')
      .then((result) => {
        this.networkVersion = result.toString().match(/(?<=")\d+/)
        this.resVersion = result.resVersion
        this.clientVersion = result.clientVersion
        return true
      })
      .catch((error) => {
        logger.error(error)
        return false
      })
  }
  
}

module.exports = Server
