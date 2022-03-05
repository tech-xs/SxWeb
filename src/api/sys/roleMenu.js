import request from '@/core/request'

export function roleMenuListAll(data) {
    return request({
        url: '/sys/role/menu/list/all',
        method: 'get',
        params: data
    })
}