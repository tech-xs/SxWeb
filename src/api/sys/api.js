import request from '@/core/request'

export function listAll() {
    return request({
        url: '/sys/api/list/all',
        method: 'get',
    })
}