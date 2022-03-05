export function deleteProxy(body,deleteApi){
    let idList = []
    for (let item of body.removeRecords){
        idList.push(item.id)
    }
    return new Promise((resolve,reject)=>{
        deleteApi({
            idList: idList
        }).then(res=>{
            if(res.code == 200){
                resolve()
            }else {
                reject(new Error(res.msg))
            }
        })
    })
}