import request from '@/core/request'

export function addPage(data) {
    return request({
        url: '/sys/page/add',
        method: 'put',
        data: data
    })
}

export function deletePageDetails(data) {
    return request({
        url: '/sys/page/delete/details',
        method: 'post',
        data: data
    })
}

export function modifyPageById(data) {
    return request({
        url: '/sys/page/modify/id',
        method: 'post',
        data: data
    })
}

export function listPage(data) {
    return request({
        url: '/sys/page/list/page',
        method: 'get',
        params: data
    })
}

export function listAll() {
    return request({
        url: '/sys/page/list/all',
        method: 'get',
    })
}

export function listAllRoot() {
    return request({
        url: '/sys/page/list/all/root',
        method: 'get',
    })
}

export function listByIds(ids) {
    return request({
        url: '/sys/page/list/ids',
        method: 'get',
        params: {
            ids: ids
        },
    })
}


export function getById(id) {
    return request({
        url: '/sys/page/id',
        method: 'get',
        params: {
            id: id
        }
    })
}