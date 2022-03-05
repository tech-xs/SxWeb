import request from '@/core/request'

export function mailTest(data) {
    return request({
        url: '/sys/notice/mail/test',
        method: 'post',
        data: data
    })
}