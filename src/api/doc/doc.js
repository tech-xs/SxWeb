import request from '@/core/request'

let rootPath = document.location.origin;

export function getDocContent(resource) {
    return request({
        url: rootPath + '/doc' + resource,
        method: 'get',
        withCredentials: false
    })
}