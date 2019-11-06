/**
 * 公共请求方法
 */

import reqwest from 'reqwest';

var methods={
    get(url,data,method){
        return new Promise((resolve, reject) => {
                reqwest({
                    url:url,
                    method:method,
                    data:data,
                    credentials:'include'
                }).then((data)=>{
                    return data;
                })
                .then(json => {
                    resolve(json);
                })
                .catch(err => {
                    reject(err);
                });
        });

    },
    getTree(value,dataList){
        //如果 dataList 里存在你要索索的字段  那么久拿出来 放到dataSource 里面返回给父组件
        var dataSource=[];
        console.log("items",value)

        if(value==="")
        {
            dataSource=[];
        }else{
            dataList.map(item=>{
                if(item.title.indexOf(value)>=0){
                    console.log("items",item.title)
                    dataSource.push(item)
                }
            })
        }

        return dataSource;

    },
    getNo(value){
        var No="";
        if(value.length===3)
        {
            No="0"+value;
        }else if(value.length===2)
        {
            No="00"+value;
        }else if(value.length===1)
        {
            No="000"+value;
        }else{
            No=value;
        }
        return No;
    }
}

export  default  methods;
