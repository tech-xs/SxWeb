import axios from 'axios'
import global from "@/core/global";
import router from "@/core/router";
import AuthConstant from '@/constant/auth'
import qs from "qs";

const httpRequest = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    timeout: 10000,
    withCredentials: true
})

/**
 * 请求拦截器
 */
httpRequest.interceptors.request.use(config => {
    const token = global.auth.token.getAccessToken()
    if (token) {
        config.headers[AuthConstant.HEADER_TOKEN_NAME] = token
    }
    if (config.method == 'get' || config.method == 'delete') {
        config.paramsSerializer = params => {
            return qs.stringify(params, {indices: false})
        }
    }
    return config
})

httpRequest.interceptors.response.use((response) => {
        if (response.data && response.data.code) {
            if (response.data.code === 401 || response.data.code === 402) {
                global.logout()
                router.push('/home')
                return
            }
        }
        return response.data
    },
    error => {
        return Promise.reject(error);
    })

export default httpRequest