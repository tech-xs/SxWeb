import request from '@/core/request'
import md5 from 'md5'
import {JSEncrypt} from 'jsencrypt'
import global from "@/core/global";
import cache from "@/core/cache";
import {isEmail, isPhone} from "@/utils/RegExpUtil";


/**
 * 登陆账号进行加密
 * 先进行md5加盐加密
 * 然后将加密后的密码进行RSA加密传输
 * @param password
 * @returns {string | false}
 */
function encodePassword(password) {
    // 先进行MD5加密
    const encodePassword = md5(password + process.env.VUE_APP_LOGIN_PASSWORD_MD5_SALT)
    // 进行RSA加密
    const jse = new JSEncrypt()
    jse.setPublicKey("-----BEGIN PUBLIC KEY-----\n"+
        "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAinqysXbQ6Us5JysXhKzq\n"+
        "Xs6TncFOkT9yRvArDcqi7E2L9vD9L9ydXYYAmPAzQnaOxAzvx4RHNMGnccU55bhg\n"+
        "Wvgem5Vs9pjjSqm1y/9ysIoqVMbrwBi6JnSl7yjY3JAe8cWcPH88MsuU8Y0fvTEb\n"+
        "Qk4z2Kh+gjEeOr/7xPdxjUd+GM1illqV/raxmsGHQ7RukNom9Pujt4japQ4PdVYY\n"+
        "CPIfjLDLafI9EQol6Ol4E39RBpQQdg3IvlYtnSF9+lh3RocEP/2ZQC6eUvjGHVnJ\n"+
        "hm9oqMD+T1mIcuJ0uu1fHbriXZc79fIm4bLH41lFFu+mKpJF3UjCjZ9/JpKJqZ1D\n"+
        "LwIDAQAB\n"+
        "-----END PUBLIC KEY-----")
    return jse.encrypt(encodePassword)
}

export function login(data) {
    let accountType = 1;
    if (isPhone(data.account)) {
        accountType = 2
    } else if (isEmail(data.account)) {
        accountType = 3
    }
    return new Promise((resolve, reject) => {
        request({
            url: '/auth/login',
            method: 'post',
            data: {
                grantType: 1,
                clientTypeId: 1,
                accountType: accountType,
                account: data.account,
                password: encodePassword(data.password)
            }
        }).then(data => {
            if (data.code == 200) {
                global.auth.token.setAccessToken(data.data.accessToken)
            }
            resolve(data)
        }).catch(error => {
            reject(error)
        })
    })
}

export function logout() {
    return new Promise((resolve) => {
        request({
            url: '/auth/logout',
            method: 'post',
        })
        global.logout()
        cache.clear()
        resolve()
    })
}

export function getRegisterEmailVerificationCode(email) {
    return request({
        url: '/sys/user/register/get/email/code',
        method: 'post',
        data: {
            email: email
        }
    })
}

export function registerEmail(data) {
    data.password = encodePassword(data.password)
    return request({
        url: '/sys/user/register/email',
        method: 'post',
        data: data
    })
}

export function getResetPasswordEmailVerificationCode(email) {
    return request({
        url: '/sys/user/password/reset/get/email/code',
        method: 'post',
        data: {
            email: email
        }
    })
}

export function resetPasswordEmail(data) {
    data.password = encodePassword(data.password)
    return request({
        url: '/sys/user/password/reset/email',
        method: 'post',
        data: data
    })
}

/**
 * 用户登陆后,通过原密码修改密码
 * @param data
 * @returns {*}
 */
export function modifyPasswordByOldPassword(data) {
    data.oldPassword = encodePassword(data.oldPassword)
    data.newPassword = encodePassword(data.newPassword)
    return request({
        url: '/sys/user/current/modify/password',
        method: 'post',
        data: data
    })
}

/**
 * 根据用户ID修改用户密码
 * @param data
 * @returns {*}
 */
export function modifyPasswordById(data) {
    data.password = encodePassword(data.password)
    return request({
        url: '/sys/user/modify/password/id',
        method: 'post',
        data: data
    })
}

export function modifyUserById(data) {
    return request({
        url: '/sys/user/modify/id',
        method: 'post',
        data: data
    })
}

export function deleteUserDetails(data) {
    return request({
        url: '/sys/user/delete/details',
        method: 'post',
        data: data
    })
}

export function addUser(data) {
    return request({
        url: '/sys/user/add',
        method: 'put',
        data: data
    })
}

export function getCurrentUser() {
    return new Promise((resolve) => {
        request({
            url: '/sys/user/current',
            method: 'get',
        }).then(res => {
            if (res && res.code === 200) {
                const data = res.data
                global.user.nickName = data.nickName
                global.user.userName = data.userName
                global.user.phone = data.phone
                global.user.email = data.email
            }
            resolve()
        })
    })
}

export function listPage(data) {
    return request({
        url: '/sys/user/list/page',
        method: 'get',
        params: data
    })
}