const logger = require('./logger')
module.exports = (status, index, actions, config, player) => {
  if (!status)
    logger.halt()
  else
    config.actions[actions[++index]](player)
}