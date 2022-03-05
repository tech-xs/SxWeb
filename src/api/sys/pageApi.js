import request from '@/core/request'

export function listPage(data) {
    return request({
        url: '/sys/page/api/list/page',
        method: 'get',
        params: data
    })
}

export function addApi(data) {
    return request({
        url: '/sys/page/api/add',
        method: 'put',
        data: data
    })
}

export function deletePageApiDetails(data) {
    return request({
        url: '/sys/page/api/delete/details',
        method: 'post',
        data: data
    })
}

export function modifyPageApiById(data) {
    return request({
        url: '/sys/page/api/modify/id',
        method: 'post',
        data: data
    })
}
