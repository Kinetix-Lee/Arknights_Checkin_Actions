module.exports = {
  out(message) {
    console.log(message);
  },
  error(message) {
    console.error(message)
  },
  halt(message='出现错误') {
    console.error(message)
    process.exit(1)
  }
}