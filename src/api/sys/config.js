import request from '@/core/request'

export function getPublicInitWebConfig() {
    return request({
        url: '/sys/config/public/init/web',
        method: 'get',
    })
}

export function modifyWebName(data) {
    return request({
        url: '/sys/config/modify/web/name',
        method: 'post',
        data: data
    })
}

export function modifyMailConfig(data) {
    return request({
        url: '/sys/config/modify/mail',
        method: 'post',
        data: data
    })
}

export function getMailConfig() {
    return request({
        url: '/sys/config/mail',
        method: 'get',
    })
}
