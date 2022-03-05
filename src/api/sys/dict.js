import request from '@/core/request'

export function getDetails(data) {
    return request({
        url: '/sys/dict/details',
        method: 'get',
        params: data
    })
}