'use strict'

const fs = require('fs')
const YAML = require('yaml')

const Player = require('./class/Player')

const account = require('./utils/account')
const game = require('./utils/game')
const logger = require('./utils/logger')
const checkInfo = require('./utils/checkInfo')
const chaining = require('./utils/chaining')
const config = YAML.parse(fs.readFileSync('./config.yml', 'utf8'))

if (!checkInfo(config.user)) {
  logger.error('请检查账号信息是否正确填写！')
  return false
}

const player = new Player(config.user)

const actions = {
  ...account,
  ...game
}

// function executeList(player, list) {
//   let execution = actions[list[0]](player)
//   for (let i = 0; i < list.length; ++i) {
//     if (typeof list[i] === 'object' && player[list[i].condition])
//       list[i].then.forEach((actionIndex) => {
//         execution = execution.then(actions[actionIndex])
//       });
//     else
//       execution = execution.then(actions[list[i]])
//   }
// }

// executeList(player, config.actions)
actions[config.actions[0]](player, 0)
