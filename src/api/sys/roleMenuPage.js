import request from '@/core/request'

export function roleMenuPageListAll(data) {
    return request({
        url: '/sys/role/menu/page/list/all',
        method: 'get',
        params: data
    })
}