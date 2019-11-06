/**
 * 树查询公共
 */
import {message} from 'antd';
let expand=[];
var methods={
    getKeys(ds,expandedKeys){
        console.log("dasda",ds)
        this.getParentKey(ds);//获取父节点的key值
        console.log("expandedKeys",expand)
        this.truncate(expand).map(item=>{
            if(item!==expandedKeys[0])
            {
                expandedKeys.push(item)
            }
        })
        return expandedKeys;
     },
     getParentKey(tree){
        let parentKey;
        console.log("sadasd")
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            /**
             *  方法用于检测数组中的元素是否满足指定条件（函数提供）。

             some() 方法会依次执行数组的每个元素：

             如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测。

             如果没有满足条件的元素，则返回false。
             *
             *
             */
            //判断该节点的字节点下面是否有跟 包含输入值的树节点的key相等  如相等  那么将值赋给parentKey aa
            //如果不能与在检查字节点下面的字节点存不存在 并进行重复性工作
            if (!node.children) {
                parentKey =node.key;
                expand.push(parentKey);
            } else{
                console.log("node",node.key)
                parentKey =node.key;
                expand.push(parentKey);
                this.getParentKey(node.children);
            }
        }

    },
    //删除数组的最后一个数据并返回 删除后的数据
    truncate(arr){
        var m = arr.slice(0);
        m.splice(m.length-1,1);
        return m;
    }

}

export default methods;