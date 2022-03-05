import {checkAccessToken} from "@/api/sys/web";

const LOCAL_STORAGE_KEY_ACCESSTOKEN = 'auth:token:accessToken'

const global = {
    auth: {
        token: {
            accessToken: undefined,
            getAccessToken() {
                if (!this.accessToken) {
                    let accessToken = localStorage.getItem(LOCAL_STORAGE_KEY_ACCESSTOKEN)
                    if (accessToken == undefined) {
                        return this.accessToken
                    }
                    let tokenCheckResult = checkAccessToken(accessToken)
                    if (tokenCheckResult) {
                        this.accessToken = accessToken
                    } else {
                        this.accessToken = undefined
                        this.setAccessToken()
                    }
                }
                return this.accessToken
            },
            setAccessToken(token) {
                if (token == undefined || token == '') {
                    this.accessToken = undefined
                    localStorage.removeItem(LOCAL_STORAGE_KEY_ACCESSTOKEN)
                    return
                }
                this.accessToken = token
                localStorage.setItem(LOCAL_STORAGE_KEY_ACCESSTOKEN, token)
            },
        }
    },
    web: {
        name: '',
        icon: '',
        accountRegister: {
            enable: false,
            emailRegister: false,
            phoneRegister: false
        },
        resource: {
            root: undefined,
        },
    },
    user: {
        userName: '',
        nickName: '',
        phone: '',
        email: ''
    },
    // 当前登陆用户的角色信息,包含[code,和name属性]
    roles: [],
    logout() {
        this.auth.token.setAccessToken()
    },
    isLogin() {
        const token = this.auth.token.getAccessToken()
        if (token != undefined && token != '') {
            return true
        }
        return false
    }
}

export default global