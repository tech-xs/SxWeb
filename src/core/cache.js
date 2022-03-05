import {getDetails} from "@/api/sys/dict";

const cache = {
    menu: {
        // 菜单树
        menuTree: undefined,
        // 展开的菜单列表
        openMenus: []
    },
    dict: {
        // 获取字典
        getByCode(...codes) {
            return new Promise(async (resolve) => {
                let dictMap = {}
                for (let code of codes) {
                    if (this[code]) {
                        dictMap[code] = this[code]
                        continue
                    }
                    await getDetails({
                        code: code
                    }).then(res => {
                        if (res.code == 200) {
                            this[code] = res.data
                            this[code]['valueMap'] = {}
                            if (res.data.valueList) {
                                for (let item of this[code].valueList) {
                                    switch (res.data.valueType) {
                                        case 1: {
                                            // 字符串类型
                                            this[code]['valueMap'][item.value] = item
                                            break
                                        }
                                        case 2: {
                                            // 数值类型
                                            item.value = parseInt(item.value)
                                            this[code]['valueMap'][item.value] = item
                                            break
                                        }
                                        default : {
                                            this[code]['valueMap'][item.value] = item
                                            break
                                        }
                                    }

                                }
                            }
                            dictMap[code] = res.data
                        }
                    })
                }
                resolve(dictMap)
            })
        }
    },
    clear() {
        this.menu.menuTree = undefined
        this.menu.openMenus = []
    }
}

export default cache