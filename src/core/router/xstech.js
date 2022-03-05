/**
 * 静态路由列表
 * @type {*[]}
 */
export const staticRouter = [
    {
        path: '/',
        redirect: '/home',
    },
    {
        path: '/home',
        component: () => import('@/views/Home')
    },
    {
        path: '/login',
        component: () => import('@/views/sys/user/login/Login')
    },
    {
        path: '/register',
        component: () => import('@/views/sys/user/register/Register')
    },
    {
        path: '/password/reset',
        component: () => import('@/views/sys/user/password/reset/ResetPassword')
    },
    {
        path: '/password/modify',
        component: () => import('@/views/sys/user/password/modify/ModifyPassword')
    },
    {
        path: '/user/info',
        component: () => import('@/views/sys/user/info/Info')
    },
    {
        path: '/system/config/mgr',
        component: () => import('@/views/sys/config/Config')
    },
    {
        path: '/system/user/mgr',
        component: () => import('@/views/sys/user/mgr/UserMgr')
    },
    {
        path: '/system/page/mgr',
        component: () => import('@/views/sys/page/PageMgr')
    },
    {
        path: '/system/page/permission/mgr',
        component: () => import('@/views/sys/page/permission/PagePermissionMgr')
    },
    {
        path: '/system/menu/mgr',
        component: () => import('@/views/sys/menu/MenuMgr')
    },
    {
        path: '/system/role/mgr',
        component: () => import('@/views/sys/role/RoleMgr')
    },
    {
        path: '/system/role/permission/mgr',
        component: () => import('@/views/sys/role/permission/RolePermissionMgr')
    },
    // 文档
    {
        path: '/doc/web',
        component: () => import('@/views/doc/web/WebDoc')
    },
    {
        path: '/doc/server',
        component: () => import('@/views/doc/server/ServerDoc')
    },
    {
        path: '/doc/api',
        component: () => import('@/views/doc/api/ApiDoc')
    }
]
/**
 * 动态路由列表
 * @type {*[]}
 */
export const dynamicRouter = []