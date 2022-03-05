import global from "@/core/global";
import {getCurrentUser} from "@/api/sys/user";
import {getCurrentRoles} from "@/api/sys/role"

export function loginInit() {
    return new Promise(async (resolve) => {
        if (!global.isLogin()) {
            resolve()
        }
        await getCurrentUser()
        await getCurrentRoles()
        resolve()
    })
}

export function checkAccessToken(token) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", process.env.VUE_APP_BASE_URL + '/auth/check/accessToken', false);
    xhr.setRequestHeader('content-type', 'application/json');
    xhr.send(JSON.stringify({
        accessToken: token
    }));
    if (xhr.status === 200) {//200状态码表示正常
        const body = JSON.parse(xhr.responseText)
        if (body.code == 200) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}
