/*
   光伏电站新增修改弹窗
 */
import React from 'react';
import {Divider, Row, Col,Tree,AutoComplete,Icon} from 'antd';
import '../component/record.css';
import myReqwest from '../common/myReqwest';
import SearchTreeComon from '../common/SearchTreeComon';
import jituan from '../image/jituan.png';
import factory from '../image/gongchang.png';
import build from '../image/Shape.png';
import eleStation from '../image/eleStation.png';
import gfDevice from '../image/gfDevice.png';
import reqwest from 'reqwest';
const { TreeNode } = Tree;
class TreeCommon extends React.Component {
    constructor(props) {
        super(props);
        this.getTopUnitInfo();
        // this.getSearchNameList();
        this.state = {
            delData:'0',
            dataFlag:'0',
            dataList:[],
            dataSource:[],
            searchTreeData:[],
            selectKey:'',
            expandedKeys: [],
            autoExpandParent: true,
            treeData:[],
            treeData1:[],
            autoExpandParent: false,
            treeNode:[],
            flags:0,
            treeNode1:[]
        }
    }

    componentWillReceiveProps(nextProps) {

        this.setState({

        });
    }

    render() {
        const options = this.state.dataSource.length>0?(
            this.state.dataSource.map(group => (
                <Option key={group.key} value={group.title} ceResClass={group.ceResClass}>
                    <span className="certain-search-item-count">{group.title}</span>
                </Option>
            ))
        ):undefined;

        return(
            <div className="left" style={{height:'100%'}}>
                <div className="certain-category-search-wrapper searchInput">
                    <AutoComplete
                        className="certain-category-search"
                        dropdownStyle={{ width:250 }}
                        size="middle"
                        style={{ width: '100%' }}
                        dataSource={options}
                        placeholder="请填写查询节点名称"
                        optionLabelProp="value"
                        onSelect={this.searchSelect}
                        onSearch={this.handles}
                    >
                    </AutoComplete>
                </div>
                <div className="treeScroll">
                    <Tree
                        showIcon
                        onExpand={this.onExpand.bind(this,this.state.flags)}
                        expandedKeys={this.state.expandedKeys}
                        autoExpandParent={this.state.autoExpandParent}
                        defaultCheckedKeys={this.state.expandedKeys}
                        checkStrictly={true}
                        loadData={this.onLoadData}
                        onSelect={this.onSelect}
                        switcherIcon={<Icon type="down" style={{color:'#1890ff',width:5,height:5}}/>}
                        className="ant-tree-switchers"
                    >
                        {this.renderTreeNodes(this.state.treeData,this.state.delData,this.state.dataFlag,"0")}
                    </Tree>
                </div>
            </div>
        )
    }
    //搜索这查询节点的所有上层节点
    searchSelect=(value,option)=>{
        console.log("option",option)
        let url='/console/treeController/getKnUpTreeList';

        let data={'id':option.key,'ceResClass':option.props.ceResClass};

        myReqwest.get(url,data,'GET').then((data)=>{
            console.log("data",data)
            var ds=eval('('+data+')');
            console.log("ds",ds);
            console.log("expandedKeys",this.state.expandedKeys)
            let expandedKeys=SearchTreeComon.getKeys(ds,this.state.expandedKeys);
            console.log("expandedKeys1",expandedKeys)
            this.setState({
                selectKey: option.key,
                expandedKeys
            })
        })

    }
    //树查询 模糊查询符合条件的数据
    handles=(value)=>{
        var data={"name":value};
        myReqwest.get("/console/treeController/getKnSearchNameList",data,"GET").then((data)=>{
            var ds=eval('('+data+')');
            var dataSource=myReqwest.getTree(value,ds)
            this.setState({
                dataSource
            },()=>{
                console.log("dataSource",this.state.dataSource)
            })
        })


    }
    // getSearchNameList=()=>{
    //     reqwest({
    //         url:'/console/treeController/getKnSearchNameList',
    //         method:'POST',
    //         credentials:'include'
    //     }).then((data)=>{
    //         var ds=eval('('+data+')');
    //         console.log("ds",ds);
    //         this.setState({
    //             dataList:ds
    //         })
    //     })
    // }
    //修改或者删除
    modify=(delData,dataFlag)=>{
        const{treeData}=this.state;
        console.log("treeData",treeData)
        console.log("delData",delData);
        console.log("dataFlag",dataFlag);
        this.setState({
            delData:delData,
            dataFlag:dataFlag,
        },()=>{
            this.renderTreeNodes(treeData,this.state.delData, this.state.dataFlag,"0");
        })
    }



    //展开时触发
    onExpand = (flag,expandedKeys,treeNode) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
            treeNode:treeNode,
            // flags:0
        },()=>{
            console.log("treeNodess",this.state.expandedKeys)
            console.log(this.truncate(this.state.expandedKeys))
        });
    }

    //删除数组的最后一个数据并返回 删除后的数据
    truncate=(arr)=> {
        var m = arr.slice(0);
        m.splice(m.length-1,1);
        return m;
    }

    //树节点选中时触发的方法 会将此节点的信息都显示在info里面
    onSelect = (selectedKeys, info) => {
        console.log("onSelect",info.node.props.dataRef.ceResSortNo)
         //将选中的值传给父组件
        this.props.fn(info.node);

    }

    //点击加号加载子节点时调用的方法
    onLoadData = treeNode => new Promise((resolve) => {
        console.log("treeNode",treeNode)
        if(treeNode.props.dataRef.ceResClass===2)
        {
            console.log("进来")
            this.setState({
                treeNode:treeNode,
                treeNode1:treeNode
            },()=>{
                this.props.fn(treeNode);
            })
        }
        //如果树节点的层级是5的话那么 就不进行加载了
        if(treeNode.props.dataRef.ceResClass===5)
        {
            resolve();
            return;
        }
        reqwest({
            url: '/console/kngfStationFiles/getTreeInfos',
            method: 'GET',
            credentials: 'include',
            data: {
                id: treeNode.props.dataRef.key,
                ceResClass: treeNode.props.dataRef.ceResClass
            }
        }).then((data) => {
            var ds = eval('(' + data + ')');
            console.log("treeD1ata1",ds)
            this.setState({
                treeData1: ds[0].result,
            }, () => {

            })
        })
        setTimeout(() => {
            console.log("ttreeData321",treeNode)
            //将获取到的子节点数据塞进父节点的children里面
            treeNode.props.dataRef.children = this.state.treeData1
            this.setState({
                treeData: [...this.state.treeData],
            }, () => {
            });
            resolve();
        }, 1000);
    })

    //新增区域成功后再此节点下自动生成子节点
    maxCustomInfo=(id,ceResClass)=>{
        //treeNode 为树的节点数据
        // const{treeNode}=this.state;
        reqwest({
            url: '/console/kngfStationFiles/maxCustomInfo',
            method: 'GET',
            credentials: 'include',
            data:{
                id: id,
                ceResClass:ceResClass
            }
        }).then((data)=>{
            var ds=eval('('+data+')');
            console.log("dsas",ds[0])
            console.log("dsaa",ds)
            this.renderTreeNodes(this.state.treeData,"0","0",ds[0]);
        })
    }

    //初始化 获取顶层节点
    getTopUnitInfo=()=>{
        reqwest({
            url: '/console/kngfStationFiles/getOrgInfo',
            method: 'GET',
            credentials: 'include',
        }).then((data)=>{
            var ds=eval('('+data+')');
            var expandedKeys=[];
            expandedKeys.push(ds[0].key)
            var titles="坤能集团";
            if(ds[0].ceResClass===2)
            {
                titles="分公司";
            }
            this.setState({
                treeData:ds,
                //ceResClass:1,
                expandedKeys,
                orgTitle:ds[0].title,
                ceResClass:ds[0].ceResClass,
                superiorId:ds[0].key,
                titles
            },()=>{
                console.log("expandedKeys",this.state.expandedKeys)
                console.log("expandedKeys1",this.state.treeData)
            })
        })
    }
    //这个吊东西就是用来循环树信息的 树的所有节点信息都是一层一层组合在一起的
    renderTreeNodes =(data,delData,dataFlag,maxInfo)=>data.map((item,i) => {
        // console.log("renderTreeNodes",item)
        //delData 是要删除和修改后的数据 如果delData 为0  说明没有修改和删除的数据 那么正常循环就好
        //如果不为0  dataFlag 如果为1 说名是删除数据 如果是2 为修改
        let {selectKey} = this.state;

        //title 算是一个拼接 将查询值所在位置 之前字符串 + 查询的值+查询值所在位置后的字符串 拼接起来  给 查询出来的值一个颜色标记
        const title =item.key===selectKey ?(
            <span style={{color: '#f50'}}>{item.title}</span>

        ) : <span>{item.title}</span>;

        /**
         * maxInfo 为了应对新增时候用的  将新增的一条数据 放到他上层节点的children里面
         */

        if(maxInfo!==null&&maxInfo!=="0")
        {
            console.log("maxInfo",item)
            if((maxInfo.ceResClass-1)===item.ceResClass&&maxInfo.superiorIds===item.key)
            {
                console.log("renderTreeNodes",maxInfo)
                item.children.push(maxInfo);
                this.setState({
                    maxInfo:'0'
                })
            }
        }
        /**
         * dataFlag 为1  说明是删除  2 说明是修改  如果是删除  那么久将item 里面将这条数据删除
         * 如果是修改 那么就将 这条数据的 title  修改
         */
        if(delData!=="0") {
            if (dataFlag === "1") {
                if (item.key === delData.key) {

                    console.log("sadas", delData);
                    //从数组中/删除项目，然后返回被删除的项目
                    data.splice(i, 1);
                    this.setState({
                        delData: '0',
                        dataFlag:'0',
                    })
                    console.log('树形菜单数据源13', i);
                }
            } else if (dataFlag === "2") {
                if (item.key === delData.key) {
                    //如果循环出的key和修改数据的key相等
                    //如果修改了 数据的title 那么将修改后的title 赋值给循环出的树节点title
                    console.log("data[i].title", data[i].title)
                    item.title = delData.title;
                    data[i].title = delData.title;
                    this.setState({
                        delData: '0',
                        dataFlag:'0',
                    })
                }
            }
        }
        var img="";
        if (item.ceResClass === 1)
        {
            img=jituan;
        }else if(item.ceResClass === 2)
        {
            img=build;
        }else if(item.ceResClass === 3)
        {
            img=eleStation;
        }else if(item.ceResClass === 4)
        {
            img=factory;
        }else{
            img=gfDevice;
        }
        if (!item.children) {
            return (
                <TreeNode title={title} key={item.key} dataRef={item} icon={<img src={img} width={16} height={16} style={{marginBottom:5}}/>}/>
            )
        } else {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item} icon={<img src={img} width={16} height={16} style={{marginBottom:5}}/>}>
                    {this.renderTreeNodes(item.children,this.state.delData,this.state.dataFlag,maxInfo)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} dataRef={item} />;
    })
}

export default TreeCommon;