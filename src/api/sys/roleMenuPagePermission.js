import request from '@/core/request'

export function roleMenuPagePermissionListAll(data) {
    return request({
        url: '/sys/role/menu/page/permission/list/all',
        method: 'get',
        params: data
    })
}