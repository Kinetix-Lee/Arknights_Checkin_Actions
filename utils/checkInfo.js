function inPhoneNumberForm(input) {
  const regex = /^((13[0-9])|(14[5-9])|(15([0-3]|[5-9]))|(16[6-7])|(17[1-8])|(18[0-9])|(19[1|3])|(19[5|6])|(19[8|9]))\\d{8}$/;
  return !(input.match(regex) === null)
}

module.exports = (user) => {
  if (typeof user.ACCOUNT !== 'string' || inPhoneNumberForm(user.ACCOUNT))
    return false
  
  if (typeof user.PASSWORD !== 'string')
    return false
  
  if (typeof user.SERVER !== 'object')
    return false
  
  if (typeof user.PLATFORM !== 'string' || (user.PLATFORM !== 'iOS' && user.PLATFORM !== 'Android'))
    return false
  
  return true
}
