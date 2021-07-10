const logger = require('./logger')
module.exports = {
  next(status, index, actions, config, player) {
    if (!status)
      logger.halt()
    else
      config.actions[actions[++index]](player)
  },
  messenger(info, func, player) {
    func(player, info)
  }
}