const { md5, sha256 } = require('CryptoJS')
module.exports = {
  randomDigits(length) {
    const max = 9
    const min = 0
    let output = ''

    for (i = 1; i < length; ++i) {
      random = ~(Math.random() * (max + 1 - min)) + min
      output += str(random)
    }

    return output
  },
  randomString(length) {
    if (length > 64) return false // sha256 算法限制
    return sha256(new Date().toString).slice(0, length)
  },
  randomDeviceID = () => md5(this.randomString(12)),
  randomDeviceID2 = () => '86' + this.randomDigits(13),
  randomDeviceID3 = () => md5(this.randomString(12))
}