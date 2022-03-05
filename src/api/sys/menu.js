import request from '@/core/request'

/**
 * 获取当前用户的菜单
 * @returns {AxiosPromise}
 */
export function treeCurrMenu() {
    return request({
        url: '/auth/menu/web/tree/current',
        method: 'get',
    })
}

export function listAll() {
    return request({
        url: '/sys/menu/list/all',
        method: 'get',
    })
}

export function addMenu(data) {
    return request({
        url: '/sys/menu/add',
        method: 'put',
        data: data
    })
}

export function deleteDetails(data) {
    return request({
        url: '/sys/menu/delete/details',
        method: 'post',
        data: data
    })
}

export function modifyMenuById(data) {
    return request({
        url: '/sys/menu/modify/id',
        method: 'post',
        data: data
    })
}
