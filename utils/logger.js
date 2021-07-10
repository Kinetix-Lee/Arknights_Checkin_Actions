module.exports = {
  out(message) {
    console.log(message);
  },
  error(message) {
    console.error(message)
  },
  halt(message) {
    console.error(message)
    process.exit(1)
  }
}