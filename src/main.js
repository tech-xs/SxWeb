import {createApp} from 'vue'
import Antd from 'ant-design-vue'
import groupComponent from "@/components/groupComponent"
import Application from './Application.vue'
import less from 'less'
import "@/assets/sys/css/theme.less"
import router from "@/core/router"
import 'xe-utils'
import vxeTable from 'vxe-table'

const app = createApp(Application)
app.config.productionTip = false


vxeTable.setup({
    table: {
        border: true,
        resizable: true,
        autoResize: true,
        showOverflow: true
    },
    grid: {
        proxyConfig: {
            props: {
                result: 'data',
                total: 'total'
            },
        },
        toolbarConfig: {
            zoom: true,
            custom: true,
            refresh: true
        },
    }

})

function useTable(app) {
    app.use(vxeTable)
}

app.use(less)
app.use(Antd)
app.use(groupComponent)
app.use(router)
app.use(useTable)
app.mount('#app')

