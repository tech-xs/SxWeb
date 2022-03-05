import {createRouter, createWebHashHistory} from 'vue-router'
import {staticRouter} from '@/core/router/xstech'

const router = createRouter({
    history: createWebHashHistory(),
    routes: staticRouter
})

router.beforeEach((to, from, next) => {
    to.last = from
    next()
})

export default router