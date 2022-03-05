/**
 * 校验是否是邮箱
 * @type {RegExp}
 */
const emailReg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$");

export function isEmail(str) {
  return emailReg.test(str)
}

const phoneReg = /^1\d{10}$/

export function isPhone(str) {
  if (str == '') {
    return false
  }
  return phoneReg.test(str)
}