import request from "@/core/request";
import global from "@/core/global";

export function getCurrentRoles() {
    return new Promise((resolve) => {
        request({
            url: '/auth/role/list/current',
            method: 'get',
        }).then(res => {
            if (res && res.code === 200) {
                const data = res.data
                global.roles.splice(0, global.roles.length)
                for (const item of data) {
                    const role = {
                        name: item.name,
                        code: item.code
                    }
                    global.roles.push(role)
                }
            }
            resolve()
        })
    })
}

export function listPage(data) {
    return request({
        url: '/sys/role/list/page',
        method: 'get',
        params: data
    })
}

export function listAll(data) {
    return request({
        url: '/sys/role/list/all',
        method: 'get',
        params: data
    })
}

export function addRole(data) {
    return request({
        url: '/sys/role/add',
        method: 'put',
        data: data
    })
}

export function deleteRoleDetails(data) {
    return request({
        url: '/sys/role/delete/details',
        method: 'post',
        data: data
    })
}

export function modifyRoleById(data) {
    return request({
        url: '/sys/role/modify/id',
        method: 'post',
        data: data
    })
}

export function modifyRoleAuthById(data) {
    return request({
        url: '/auth/role/modify/id',
        method: 'post',
        data: data
    })
}

export function getById(id) {
    return request({
        url: '/sys/role/id',
        method: 'get',
        params: {
            id: id
        }
    })
}