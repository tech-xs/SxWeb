import request from '@/core/request'

export function listPage(data) {
    return request({
        url: '/sys/page/permission/list/page',
        method: 'get',
        params: data
    })
}

export function listAll(data) {
    if (!data) {
        data = {}
    }
    return request({
        url: '/sys/page/permission/list/all',
        method: 'get',
        params: data
    })
}

export function addPermission(data) {
    return request({
        url: '/sys/page/permission/add',
        method: 'put',
        data: data
    })
}

export function deletePagePermissionDetails(data) {
    return request({
        url: '/sys/page/permission/delete/details',
        method: 'post',
        data: data
    })
}

export function modifyPagePermissionById(data) {
    return request({
        url: '/sys/page/permission/modify/id',
        method: 'post',
        data: data
    })
}