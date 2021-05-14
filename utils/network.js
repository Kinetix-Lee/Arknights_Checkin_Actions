const axios = require('axios')

module.exports = {
  get(url, params={}, headers={}) {
    return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'get',
        headers,
        params
      }).then(resolve).catch(reject)
    })
  },
  post(url, data={}, headers={}) {
    return new Promise((resolve, reject) => {
      axios({
        url,
        method: 'post',
        headers,
        data
      }).then(resolve).catch(reject)
    })
  }
}
