import  React,{Component}from 'react';
import  ReactDOM from 'react-dom';
import {Select,Table,Row, Col,Button ,Modal,Tabs,TimePicker ,Tree ,Tag ,Radio,Divider,Popconfirm, message,AutoComplete} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';
// import { hashHistory } from 'react-router'; ////安装   npm install react-router-dom --save-dev //这里可以使用cnpm代替npm命令
//  import './app';

import './auditing.less';
import './StationMap';
import user from './image/user.png';  // 用户
import jituan from './image/jituan.png';  // 楼幢
import storey from './image/storey.png';  //楼层
import room from './image/room.png';  // 房间
import energy from './image/energy.png';  // 用能点
import gfDevice from './image/gfDevice.png';  //楼层




import moment from 'moment';
import reqwest from 'reqwest';
const TabPane = Tabs.TabPane;
const CheckableTag = Tag.CheckableTag;
const tagsFromServer = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
const { TreeNode } = Tree;
const pageSize=10;
const RadioGroup = Radio.Group;




class PlanManage  extends React.Component{
    state={
        stationStatusList:[],
        onoffActionList:[<option key="null" checked >全部</option>,<option key="1">开启</option>,<option key="0">关闭</option>],
        pointNameList :[],
        statusValue:1, // 使用这个字段判断弹出框 是编辑的还是新增的
        idValue : '', //编辑时保存的ID
        UnplannedNum:'',
        visible: false,  //新增
        visibleEdit:false, // 编辑
        //树形控件
        expandedKeys: ['0-0-0', '0-0-1'], //默认展开的节点
        autoExpandParent: true,
        checkedKeys: ['17791697536679944'], //树的节点   这里有一个默认值  选中后更改
        selectedKeys: [],
        selectedTags: [], //工作日 选择的星期几
        //选择的时间  新增时选中的值和编辑时默认的值
        workStartTimeValue:'22:00',
        //弹出框标题
        tltle :"新增用能计划",

        widthValue : "900px" ,

        style1: {display:"block"},  //控制树显示和隐藏
        style2: {display:"block"},  //控制分割线显示和隐藏
        spanValue : 12,

        selectOnoffAction:'', //
        selectcCeResId:'',
        selectPointName: '',//用能点 查询

        fuzzyPointName: '', //模糊查询

        //星期几
        weekValue:"",
        Data:[],
        UserId:[],
        pagination: {pageSize: pageSize,current:1},

        value: 1, //开启或者关闭  默认为1



        treeData:[], //接收数组的值
        treeData2:[], //接收数组的值
        dataPointName:[],

        weekbutton1: "primary",
        weekbutton2: "primary",
        weekbutton3: "primary",
        weekbutton4: "primary",
        weekbutton5: "primary",
        weekbutton6: "",
        weekbutton7: "",

        weekbuttonValue1: "1",
        weekbuttonValue2: "1",
        weekbuttonValue3: "1",
        weekbuttonValue4: "1",
        weekbuttonValue5: "1",
        weekbuttonValue6: "0",
        weekbuttonValue7: "0",


        forbidden : false
    }

    //   加载页面时 触发
    componentDidMount() {
         this.getData() //赋值data


    };


    // 查询
    queryInfo=(value)=>{
        this.setState({
            selectcCeResId:value,
        })
    }

    //下拉表格 查询
    onChangeOnoffAction= (value) =>{
        console.log("选中的值是", value);
        this.setState({selectOnoffAction: value,});
    }
    // 查询用能点
    onChangePointName=(value)=>{
        console.log("输入框用能点的值是", value);
        this.setState({
            selectPointName:value,
        })
    }
    handleSearch=(value)=>{
        console.log("模糊搜索的", value);
        this.setState({
            fuzzyPointName:value,
            selectPointName:'',
        })
        console.log("handleSearch输入框用能点的值是", value);

    }


    deleteStation=(record,e)=>{
        var str = this.state.selectPointName.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
        var SearchPointName = this.state.fuzzyPointName.replace(/(^\s*)|(\s*$)/g, '');//手动模糊搜索
        var selectPointNameValue='';
        if (str === '' || str === undefined || str ===null) {
            console.log("str默认选中的为空啊");
            if (SearchPointName === '' || SearchPointName === undefined || SearchPointName ===null) {
                console.log("输入框什么也没有置空了");
            }else{

                selectPointNameValue=SearchPointName;
                console.log("赋值SearchPointName",SearchPointName,selectPointNameValue);
            }
        }else{
            selectPointNameValue=str;
            console.log("赋值str",str,str);
        }

        reqwest({
            url:'/console/mgmt_planning/deleteMgmtPlanning',
            method:"GET",
            credentials:'include',
            data:{
                id:record.id,
                onoffActionValue : this.state.selectOnoffAction, //查询条件
                ceResIdValue : this.state.selectcCeResId, //查询条件
                cePointIdValue :selectPointNameValue, //查询条件
            }
        }).then((data)=>{
            var ds=eval('('+data+')');
            this.setState({
                Data:ds[0].result2,
            })
            message.success('已删除');



            // window.location.reload();
            // this.getData();
        })


    }

   //弹出新增框
    showModal = () => {
        reqwest({
            url:'/console/mgmt_planning/queryCeResClass',
            method:"GET",
            credentials:'include',
            data:{
                ceResClass:0, //层级
                id:0
            }

        }).then((data)=>{

            var ds=eval('('+data+')');
            let umn =[];
            for (var i=0;i<ds[0].result.length;i++){
                umn.push(
                    { title:ds[0].result[i].ceResName , key:ds[0].result[i].id ,ceResClass:ds[0].result[i].ceResClass  ,icon: <img src={user} width={10} height={10} style={{marginBottom:5}}/>}, //判断用能资源类别

                )
            }
            console.log("赋值之后",umn);
            this.setState({
                statusValue:1,
                visible: true,
                treeData : umn,
                selectedTags: ["星期一","星期二","星期三","星期四","星期五"],  //有数据再改
                tltle:"新增用能计划",
                widthValue : "900px" ,
                style1: {display:"block"},
                style2: {display:"block"},
                spanValue : 12,
            })

        })

        // this.setState({
        //     visible: true,
        // });
    }

    //数据展示
    getData=()=>{
        console.log("进来没有");
        reqwest({
            url:'/console/mgmt_planning/getMgmtPlaningData',
            method:"GET",
            credentials:'include',

        }).then((data)=>{
            var ds=eval('('+data+')');

                // 客户与用能点  有则显示
                let arry =[<option key="null" checked >全部</option>,];
                if(ds[0].CustVo !== null){
                    for (var i=0;i<ds[0].CustVo.length;i++){
                        arry.push( <option key={ds[0].CustVo[i].key}>{ds[0].CustVo[i].value}</option>,)
                    }
                }
                let arry1=[];
                let arryName=[];
                let arryName1=[];
                // let arry1 =[<option key="null" checked >全部</option>,];  //用能点去掉全部这一选项
/*                if(ds[0].cePoint !== null){
                    for (var i=0;i<ds[0].cePoint.length;i++){
                        // arry1.push( <option key={ds[0].cePointName}>{ds[0].cePoint[i].cePointName}</option>,)
                        arry1.push( <option key={ds[0].cePoint[i].id}>{ds[0].cePoint[i].cePointName}</option>,)
                    }
                }*/

            if(ds[0].result !== null){
                for (var i=0;i<ds[0].result.length;i++){
                    // cePointName":"B206-1#风机盘管用能点","cePointId":
                    if(ds[0].result[i].cePointId !== null && ds[0].result[i].cePointName !== null ){
                        // arry1.push( <option key={ds[0].result[i].cePointId}>{ds[0].result[i].cePointName}</option>,)
                        arry1.push(ds[0].result[i].cePointId);
                         }
                    }
                arryName =[...new Set(arry1 )];
                for (var j=0;j<arryName.length;j++){
                    for (var k=0;k<ds[0].result.length;k++){
                        if(arryName[j]===ds[0].result[k].cePointId){
                            arryName1.push( <option key={ds[0].result[k].cePointName}>{ds[0].result[k].cePointName}</option>,)
                            break;
                        }
                    }

                }



                }
                this.setState({
                    Data:ds[0].result,
                    UnplannedNum:ds[0].result2,
                    stationStatusList:arry,
                    dataPointName : arryName1,
                })
        })
    }
    //新增确定
    handleOk = (e) => {
        // alert("点击了确认..获得的树值是"+this.state.checkedKeys+"获得的星期值是"+this.state.selectedTags+"获得的时间参数是"+this.state.workStartTimeValue+"开关单选框是"+this.state.value);
        if(this.state.statusValue ===1){
            // let week =  this.state.selectedTags.join("-");
            let keys = this.state.checkedKeys.join("-");

            var str = this.state.selectPointName.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
            var SearchPointName = this.state.fuzzyPointName.replace(/(^\s*)|(\s*$)/g, '');//手动模糊搜索
            var selectPointNameValue='';
            if (str === '' || str === undefined || str ===null) {
                console.log("str默认选中的为空啊");
                if (SearchPointName === '' || SearchPointName === undefined || SearchPointName ===null) {
                    console.log("输入框什么也没有置空了");
                }else{

                    selectPointNameValue=SearchPointName;
                    console.log("赋值SearchPointName",SearchPointName,selectPointNameValue);
                }
            }else{
                selectPointNameValue=str;
                console.log("赋值str",str,str);
            }

            let week="";
            week =this.state.weekbuttonValue1+this.state.weekbuttonValue2+this.state.weekbuttonValue3+this.state.weekbuttonValue4+this.state.weekbuttonValue5+this.state.weekbuttonValue6+this.state.weekbuttonValue7+"";
            reqwest({
                url:'/console/mgmt_planning/insertMgmtPlanning',
                method:"GET",
                credentials:'include',
                data:{
                    checkedKeys:keys, //选中的树
                    week:week,  //星期
                    onoffTime:this.state.workStartTimeValue, // 启停时间
                    onoffAction : this.state.value ,// 启停动作 开启 或停用

                    onoffActionValue : this.state.selectOnoffAction, //查询条件
                    ceResIdValue : this.state.selectcCeResId, //查询条件
                    cePointIdValue :selectPointNameValue, //查询条件
                }
            }).then((data)=>{
                // console.log("data111====",data);
                var ds=eval('('+data+')');

                if(ds[0].result === 0){
                    // alert("请选择用能点");
                    message.warning('请选择用能点');
                }else if(ds[0].resultFlag !== 0){

                    message.warning('该用能点已有，请重新选择');
                }else{
                    this.setState({
                        visible: false,
                        //取消或确认   然编辑框类的默认值 归零
                        workStartTimeValue: "22:00",
                        selectedTags: [],  //工作日设空
                        weekbutton1: "primary",
                        weekbutton2: "primary",
                        weekbutton3: "primary",
                        weekbutton4: "primary",
                        weekbutton5: "primary",
                        weekbutton6: "",
                        weekbutton7: "",

                        weekbuttonValue1: "1",
                        weekbuttonValue2: "1",
                        weekbuttonValue3: "1",
                        weekbuttonValue4: "1",
                        weekbuttonValue5: "1",
                        weekbuttonValue6: "0",
                        weekbuttonValue7: "0",
                        checkedKeys : [],


                    });

                    var ds=eval('('+data+')');
                    this.setState({
                        Data:ds[0].result2,
                    })
                    // this.getData();
                    // window.location.reload();
                }

            })
        }

        if(this.state.statusValue ===2){
            // let week =  this.state.selectedTags.join("-");
            let week="";
            week =this.state.weekbuttonValue1+this.state.weekbuttonValue2+this.state.weekbuttonValue3+this.state.weekbuttonValue4+this.state.weekbuttonValue5+this.state.weekbuttonValue6+this.state.weekbuttonValue7+"";

            var str = this.state.selectPointName.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
            var SearchPointName = this.state.fuzzyPointName.replace(/(^\s*)|(\s*$)/g, '');//手动模糊搜索
            var selectPointNameValue='';
            if (str === '' || str === undefined || str ===null) {
                console.log("str默认选中的为空啊");
                if (SearchPointName === '' || SearchPointName === undefined || SearchPointName ===null) {
                    console.log("输入框什么也没有置空了");
                }else{

                    selectPointNameValue=SearchPointName;
                    console.log("赋值SearchPointName",SearchPointName,selectPointNameValue);
                }
            }else{
                selectPointNameValue=str;
                console.log("赋值str",str,str);
            }

            reqwest({
                url:'/console/mgmt_planning/updateMgmtPlanning',
                method:"GET",
                credentials:'include',
                data:{
                    week:week,  //星期
                    onoffTime:this.state.workStartTimeValue, // 启停时间
                    onoffAction : this.state.value, // 启停动作 开启 或停用
                    id: this.state.idValue , //需要id  根据id 修改

                    onoffActionValue : this.state.selectOnoffAction, //查询条件
                    ceResIdValue : this.state.selectcCeResId, //查询条件
                    cePointIdValue :selectPointNameValue, //查询条件
                }
            }).then((data)=>{
                var ds=eval('('+data+')');
                console.log("已处理data====",ds[0].result[0]);
                this.setState({
                    visible: false,
                    //取消或确认   然编辑框类的默认值 归零
                    workStartTimeValue: "22:00",
                    selectedTags: [],  //工作日设空
                    weekbutton1: "primary",
                    weekbutton2: "primary",
                    weekbutton3: "primary",
                    weekbutton4: "primary",
                    weekbutton5: "primary",
                    weekbutton6: "",
                    weekbutton7: "",

                    weekbuttonValue1: "1",
                    weekbuttonValue2: "1",
                    weekbuttonValue3: "1",
                    weekbuttonValue4: "1",
                    weekbuttonValue5: "1",
                    weekbuttonValue6: "0",
                    weekbuttonValue7: "0",

                    Data:ds[0].result2,

                });

                // window.location.reload();
                //  this.getData();
            })
        }


    }

    //新增取消
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
            //取消或确认   然编辑框类的默认值 归零
            workStartTimeValue: "22:00",
            selectedTags: [],  //工作日设空

            weekbutton1: "primary",
            weekbutton2: "primary",
            weekbutton3: "primary",
            weekbutton4: "primary",
            weekbutton5: "primary",
            weekbutton6: "",
            weekbutton7: "",

            weekbuttonValue1: "1",
            weekbuttonValue2: "1",
            weekbuttonValue3: "1",
            weekbuttonValue4: "1",
            weekbuttonValue5: "1",
            weekbuttonValue6: "0",
            weekbuttonValue7: "0",
            checkedKeys : [],
        })
    }



    formatDate(dateVal) {
        var newDate = new Date(dateVal);
        var sMonth = this.padValue(newDate.getMonth() + 1);
        var sDay = this.padValue(newDate.getDate());
        var sYear = newDate.getFullYear();
        var sHour = newDate.getHours();
        var sMinute = this.padValue(newDate.getMinutes());
        var ss = newDate.getSeconds();
        var sAMPM = "AM";
        var iHourCheck = parseInt(sHour);
        if (iHourCheck > 12) {
            sAMPM = "PM";
            sHour = iHourCheck - 12;
        }
        else if (iHourCheck === 0) {
            sHour = "12";
        }
        sHour = this.padValue(sHour);
        // return sMonth + "-" + sDay + "-" + sYear + " " + sHour + ":" + sMinute + " " + sAMPM;
        return sYear + "-" + sMonth + "-" + sDay + " " + sHour + ":" + sMinute + ":"+ss ;

    }

    padValue(value) {
        return (value < 10) ? "0" + value : value;
    }


  //转数组
    toArrayaa=(s)=> {
        try{
            return Array.prototype.slice.call(s);
        } catch(e){
            var arr = [];
            for(var i = 0,len = s.length; i < len; i++){
                //arr.push(s[i]);
                arr[i] = s[i];     //据说这样比push快
            }
            return arr;
        }
    }
    // 编辑时转星期
    toweek=(arrweek)=> {
        // let weekss='';
        if(arrweek[0] ==="1"){
            arrweek.splice(0,1,'星期一');
            // weekss="星期一,"
        }else{
            arrweek.splice(0,1,null);
        }
        if(arrweek[1] ==="1"){
            arrweek.splice(1,1,'星期二');
            // weekss=weekss+"星期二,"
        }else{
            arrweek.splice(1,1,null);
        }
        if(arrweek[2] ==="1"){
            arrweek.splice(2,1,'星期三');
            // weekss=weekss+"星期三,"
        }else{
            arrweek.splice(2,1,null);
        }
        if(arrweek[3] ==="1"){
            arrweek.splice(3,1,'星期四');
            // weekss=weekss+"星期四,"
        }else{
            arrweek.splice(3,1,null);
        }
        if(arrweek[4] ==="1"){
            arrweek.splice(4,1,'星期五');
            // weekss=weekss+"星期五,"
        }else{
            arrweek.splice(4,1,null);
        }
        if(arrweek[5] ==="1"){
            arrweek.splice(5,1,'星期六');
            // weekss=weekss+"星期六,"
        }else{
            arrweek.splice(5,1,null);
        }
        if(arrweek[6] ==="1"){
            arrweek.splice(6,1,'星期日');
            // weekss=weekss+"星期日,"
        }else{
            arrweek.splice(6,1,null);
        }

     return  arrweek;
    }


    // 修改成button 的形式了
    toweek1=(arrweek)=> {
        // let weekss='';
        if(arrweek[0] ==="1"){
            this.setState({
                weekbutton1: "primary",
                weekbuttonValue1: "1",
            });
        }else{
            this.setState({
                weekbutton1: "",
                weekbuttonValue1: "0",
            });
        }
        if(arrweek[1] ==="1"){
            this.setState({
                weekbutton2: "primary",
                weekbuttonValue2: "1",
            });
        }else{
            this.setState({
                weekbutton2: "",
                weekbuttonValue2: "0",
            });
        }
        if(arrweek[2] ==="1"){
            this.setState({
                weekbutton3: "primary",
                weekbuttonValue3: "1",
            });
        }else{
            this.setState({
                weekbutton3: "",
                weekbuttonValue3: "0",
            });
        }
        if(arrweek[3] ==="1"){
            this.setState({
                weekbutton4: "primary",
                weekbuttonValue4: "1",
            });
        }else{
            this.setState({
                weekbutton4: "",
                weekbuttonValue4: "0",
            });
        }
        if(arrweek[4] ==="1"){
            this.setState({
                weekbutton5: "primary",
                weekbuttonValue5: "1",
            });
        }else{
            this.setState({
                weekbutton5: "",
                weekbuttonValue5: "0",
            });
        }
        if(arrweek[5] ==="1"){
            this.setState({
                weekbutton6: "primary",
                weekbuttonValue6: "1",
            });
        }else{
            this.setState({
                weekbutton6: "",
                weekbuttonValue6: "0",
            });
        }
        if(arrweek[6] ==="1"){
            this.setState({
                weekbutton7: "primary",
                weekbuttonValue7: "1",
            });
        }else{
            this.setState({
                weekbutton7: "",
                weekbuttonValue7: "1",
            });
        }

        return  arrweek;
    }


    //去重 逗号
    uniquek=(arr)=>{
    var result = [], hash = {};
    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
        if (!hash[elem]) {
            result.push(elem);
            hash[elem] = true;
        }
    }
    return result;
}

    // //去掉显示的日期逗号
    // toweek=(arrweek)=> {
    //     arrweekstr.replace('a', 'o');
    //
    // }





    //弹出编辑框
    showModalEdit = (record,e) => {
        //把1111100 转成个星期
        let arrweek=[];
        arrweek=this.toArrayaa(record.repeatStrategy);
        let weekss='';
         weekss = this.toweek1(arrweek);
        console.log("转的星期是  ====="+weekss);
        reqwest({
            url:'/console/mgmt_planning/queryCeResClass',
            method:"GET",
            credentials:'include',
            data:{
                ceResClass:0, //层级
                id:0
            }
        }).then((data)=>{

            var ds=eval('('+data+')');
            let umn =[];
            // for (var i=0;i<ds[0].result.length;i++){
            //     umn.push(
            //         { title:ds[0].result[i].ceResName , key:ds[0].result[i].id ,ceResClass:ds[0].result[i].ceResClass }, //判断用能资源类别
            //     )
            // }
            this.setState({
                statusValue:2,
                visible: true,
                // treeData : umn,
                workStartTimeValue: record.onoffTime+":00",
                value:record.onoffAction,
                selectedTags: weekss,  //有数据再改
                idValue:record.id,
                tltle : "编辑用能计划",
                widthValue : "500px",
                style1: {display:"none"},
                style2: {display:"none"},
                spanValue : 23,

            })
        })

    }


    handleChange = (checked) => {
        this.setState({ checked });
    }

    // 选中工作日  星期几的时候触发的
    handleChangeTag(tag, checked) {
        const { selectedTags } = this.state;
        const nextSelectedTags = checked
            ? [...selectedTags, tag]
            : selectedTags.filter(t => t !== tag);
        console.log('You are interested in: ', nextSelectedTags);
        this.setState({ selectedTags: nextSelectedTags });
    }
    //时间 控件
    onChangeWorkStartTime= (date, dateString) =>{
        console.log(date, dateString);
        this.setState({workStartTimeValue: dateString,});
    }






    //树形控件
    onExpand = (expandedKeys) => {
        // 如果 一个点击没返回 下次就不让点击了

        console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    }

    onCheck = (checkedKeys) => {
        console.log('onCheck', checkedKeys);
        // console.log('onCheck2222', checkedKeys.checked);
        this.setState({checkedKeys :checkedKeys})
    }

    onSelect = (selectedKeys, info) => {
        console.log('onSelect', info);
        this.setState({ selectedKeys });
    }

    renderTreeNodes = data => data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} />;
    })


    //计划外事件的跳转
    Unplanned= (date, dateString) =>{
        window.location.href = '/console/outPlanEvent/init'
    }

// 选择开启或者关闭
    onChange = (e) => {
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    }

    //异步加载的树
    onLoadData = treeNode => new Promise((resolve) => {
        console.log('选择的树的节点是', treeNode.props.dataRef.key);  //id
        console.log('选择的树的节点主要', treeNode.props.dataRef.ceResClass); //层级
        console.log('选择的树的节点主要', treeNode); //层级

            reqwest({
                url:'/console/mgmt_planning/queryCeResClass',
                method:"GET",
                credentials:'include',
                data:{
                    ceResClass:treeNode.props.dataRef.ceResClass, //层级
                    id:treeNode.props.dataRef.key
                }
            }).then((data)=>{
                // console.log("data111====",data);
                var ds=eval('('+data+')');
                console.log("已处理data====",ds[0].result);
                let umn1 =[];
                if(ds[0].result === null ){
                    console.log("返回为空啊啊啊");
                    this.setState({
                        treeData2:umn1
                    });
                }else{

                    for (var i=0;i<ds[0].result.length;i++){
                        /* { title: 'Expand to load', key: '0' },*/
                        if(ds[0].result[i].ceResClass === 4){
                            umn1.push(
                                { title:ds[0].result[i].ceResName , key:ds[0].result[i].id ,ceResClass:ds[0].result[i].ceResClass,icon:<img style={{width:"10px",height:"10px"}} src={gfDevice}/> }, //判断用能资源类别
                            )
                        }else if(ds[0].result[i].ceResClass=== 5){
                            umn1.push(
                                { title:ds[0].result[i].ceResName , key:ds[0].result[i].id ,ceResClass:ds[0].result[i].ceResClass,isLeaf: true,icon:<img style={{width:"10px",height:"10px"}} src={energy}/>}, //判断用能资源类别
                            )
                        }else if(ds[0].result[i].ceResClass=== 3) {
                            umn1.push(
                                { title:ds[0].result[i].ceResName , key:ds[0].result[i].id ,ceResClass:ds[0].result[i].ceResClass ,icon:<img style={{width:"10px",height:"10px"}} src={room}/>}, //判断用能资源类别
                            )
                        }else if(ds[0].result[i].ceResClass=== 2) {
                            umn1.push(
                                { title:ds[0].result[i].ceResName , key:ds[0].result[i].id ,ceResClass:ds[0].result[i].ceResClass ,icon:<img style={{width:"10px",height:"10px"}} src={jituan}/>}, //判断用能资源类别
                            )
                        }else if(ds[0].result[i].ceResClass=== 1) {
                            umn1.push(
                                { title:ds[0].result[i].ceResName , key:ds[0].result[i].id ,ceResClass:ds[0].result[i].ceResClass ,icon:<img style={{width:"10px",height:"10px"}} src={user}/>}, //判断用能资源类别
                            )
                        }
                    }
                    this.setState({
                        treeData2:umn1
                    });

                }

            })



        setTimeout(() => {
            treeNode.props.dataRef.children = this.state.treeData2;

            // treeNode.props.dataRef.children = [
            //     { title: 'Child Node', key: `${treeNode.props.eventKey}-0` },
            //     { title: 'Child Node', key: `${treeNode.props.eventKey}-1` },
            // ];
            this.setState({
                treeData: [...this.state.treeData],
            });
            resolve();
        }, 1000);
    })

    renderTreeNodes = data => data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={item.title} key={item.key} dataRef={item} icon={item.icon}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} dataRef={item} />;
    })


     cancel=(e) =>{
    console.log(e);
    // message.error('Click on No');
    }


    getStationInfo=()=>{
        var str = this.state.selectPointName.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
        var SearchPointName = this.state.fuzzyPointName.replace(/(^\s*)|(\s*$)/g, '');//手动模糊搜索
        var selectPointNameValue='';
        if (str === '' || str === undefined || str ===null) {
            console.log("str默认选中的为空啊");
            if (SearchPointName === '' || SearchPointName === undefined || SearchPointName ===null) {
                console.log("输入框什么也没有置空了");
            }else{

                selectPointNameValue=SearchPointName;
                console.log("赋值SearchPointName",SearchPointName,selectPointNameValue);
            }
        }else{
            selectPointNameValue=str;
            console.log("赋值str",str,str);
        }

        console.log("查询的是"+this.state.selectcCeResId);
        reqwest({
            url:'/console/mgmt_planning/getMgmtPlaningData',
            method:"GET",
            credentials:'include',
            data:{
                onoffAction : this.state.selectOnoffAction,
                ceResId : this.state.selectcCeResId,
                cePointId : selectPointNameValue,

                // cePointId : this.state.selectPointName,
            }

        }).then((data)=>{
            var ds=eval('('+data+')');
                this.setState({
                    Data:ds[0].result,
                })
        })

    }

    weekbutton1 =(value)=>{

        if(value ==="1"){
            if(this.state.weekbutton1 ==="primary"){
                this.setState({
                    weekbutton1:"",
                    weekbuttonValue1:"0",
                })
            }else{
                this.setState({
                    weekbutton1:"primary",
                    weekbuttonValue1:"1",
                })
            }

        }else if(value ==="2"){
            if(this.state.weekbutton2 ==="primary"){
                this.setState({
                    weekbutton2:"",
                    weekbuttonValue2:"0",
                })
            }else{
                this.setState({
                    weekbutton2:"primary",
                    weekbuttonValue2:"1",
                })
            }

        }else if(value ==="3"){
            if(this.state.weekbutton3 ==="primary"){
                this.setState({
                    weekbutton3:"",
                    weekbuttonValue3:"0",
                })
            }else{
                this.setState({
                    weekbutton3:"primary",
                    weekbuttonValue3:"1",
                })
            }

        }else if(value ==="4"){
            if(this.state.weekbutton4 ==="primary"){
                this.setState({
                    weekbutton4:"",
                    weekbuttonValue4:"0",
                })
            }else{
                this.setState({
                    weekbutton4:"primary",
                    weekbuttonValue4:"1",
                })
            }

        }else if(value ==="5"){
            if(this.state.weekbutton5 ==="primary"){
                this.setState({
                    weekbutton5:"",
                    weekbuttonValue5:"0",
                })
            }else{
                this.setState({
                    weekbutton5:"primary",
                    weekbuttonValue5:"1",
                })
            }

        }else if(value ==="6"){
            if(this.state.weekbutton6 ==="primary"){
                this.setState({
                    weekbutton6:"",
                    weekbuttonValue6:"0",
                })
            }else{
                this.setState({
                    weekbutton6:"primary",
                    weekbuttonValue6:"1",
                })
            }

        }else if(value ==="7"){
            if(this.state.weekbutton7 ==="primary"){
                this.setState({
                    weekbutton7:"",
                    weekbuttonValue7:"0",
                })
            }else{
                this.setState({
                    weekbutton7:"primary",
                    weekbuttonValue7:"1",
                })
            }

        }
    }




    render() {
        var pageSize1 = this.state.pagination.pageSize;
        var total = this.state.pagination.total;
        const { dataPointName } = this.state;
        const { selectedTags } = this.state;
        const format = 'HH:mm';
        //用能计划表
        const columns = [, {
            title: '用能客户 ',
            dataIndex: 'ceResName',
            key: 'ceResName',
            align: 'center',
            // width: 200,
            width: '15%',
        }, {
            title: '用能点',
            dataIndex: 'cePointName',
            key: 'cePointName',
            align: 'center',
            // width: 200,
            width: '15%',
        }, {
            title: '每周重复 ',
            dataIndex: 'repeatStrategy',
            key: 'repeatStrategy',
            align: 'center',
            // width: 400,
            width: '30%',
            render: (text) => {
                let arrweek=[];
                arrweek=this.toArrayaa(text);
                arrweek = this.toweek(arrweek);
                 let weekssValue='';
                weekssValue =arrweek.toString().replace(/,,,,,,/g, ',').replace(/,,,,,/g, ',').replace(/,,,,/g, ',').replace(/,,,/g, ',').replace(/,,/g, ',');
                let strnum='';
                strnum=(weekssValue.substring(weekssValue.length-1)==',')?weekssValue.substring(0,weekssValue.length-1):weekssValue;
                let strnu1='';
                strnu1=(strnum.substring(0, 1)==',')?strnum.substring(1,strnum.length):strnum;
                strnu1=strnu1.replace(/,/g,"，");
                return(<div><text>{strnu1}</text></div>)
            }
        },{
            title: '开关状态 ',
            dataIndex: 'onoffAction',
            key: 'onoffAction',
            className: 'column-center',
            align: 'center',
            // width: 150,
            width: '10%',
            render: (text) => {
            var varValue='';
            if(text === 1){
                varValue ="开启"
            }else{
                varValue ="关闭"
            }
                return(<div><text>{varValue}</text></div>)
            }

        }, {
            title: '计划时间 ',
            dataIndex: 'onoffTime',
            key: 'onoffTime',
            align: 'center',
            // width: 150,
            width: '10%',
        }, {
            title: '创建时间 ',
            dataIndex: 'gmtCreate',
            key: 'gmtCreate',
            align: 'center',
            // width: 150,
            width: '10%',
            // defaultSortOrder: 'descend',
            // sorter: (a, b) => a.gmtCreate - b.gmtCreate,
            render: (text, record, index) => {
                var gmtCreateValue = this.formatDate(text);
                return(
                    <div>
                        <text>{gmtCreateValue }</text>
                    </div>
                )
            },


        },{
            title: '操作 ',
            dataIndex: 'caozuo',
            key: 'caozuo',
            align: 'center',
            // width: 200,
            width: '10%',
            render: (text, record) => (
                <span><span><a href="#" onClick={this.showModalEdit.bind(this, record)}>编辑</a></span>&nbsp;&nbsp;&nbsp;
                    <Popconfirm title="是否确认删除？" onConfirm={this.deleteStation.bind(this, record)} onCancel={this.cancel} okText="是" cancelText="否">
                        <a href="#">删除</a>
                    </Popconfirm>
                </span>
            )
        }];



        return (
            <div className="div-body">
                <div className="div-page">
                    <div className="div_query">
                        <Tabs defaultActiveKey="1">
                            <TabPane tab={<span>用能计划管理</span>} key="1">
                                <Row>
                                    <Col span={4}>
                                        <Row>
                                            <Col span={12} offset={0}>
                                                <span style={{lineHeight:'32px',marginLeft:'17%'}}>用能客户：</span>
                                            </Col>
                                            <Col span={12}>
                                                <span style={{marginLeft:5}}>

                                                   <Select
                                                       defaultValue="全部"
                                                       onChange={this.queryInfo}
                                                       style={{width: '90%'}}>
                                                       {this.state.stationStatusList}
                                                    </Select>
                                                </span>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col span={4}>
                                        <Row>
                                            <Col span={8}>
                                                <span style={{lineHeight:'32px',float:'right'}}>用能点：</span>
                                            </Col>
                                            <Col span={15}>
                                                <span style={{marginLeft:5}}>
                                                    <AutoComplete
                                                        dataSource={dataPointName}
                                                        // style={{ width: 80% }}
                                                        onSelect={this.onChangePointName}
                                                        onSearch={this.handleSearch}
                                                        placeholder="输入搜索 "
                                                        filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                                    />
                                                </span>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col span={4}>
                                        <Row>
                                            <Col span={10}>
                                                <span style={{lineHeight:'32px',float:'right'}}>开关：</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                            </Col>
                                            <Col span={14}>
                                                <span style={{marginLeft:5}}>
                                                    <Select
                                                            defaultValue="全部"
                                                            onChange={this.onChangeOnoffAction}
                                                            style={{width: '90%'}}>
                                                       {this.state.onoffActionList}
                                                    </Select>
                                                </span>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col span={4}>
                                        <Col span={24}>
                                            <Button type="primary"  style={{lineHeight:'32px',float:'right', marginTop:0}} onClick={this.getStationInfo}>查询</Button>
                                        </Col>
                                    </Col>
                                    <Col span={4}>
                                        <Col span={24} offset={2}>
                                            <Button type="primary"  style={{lineHeight:'32px',float:'left'}}  onClick={this.showModal}>新增</Button>
                                        </Col>
                                    </Col>
                                    <Col span={3} >
                                            <span style={{lineHeight:'32px',float:'right'}} >
                                                <Button type="primary"  onClick={this.Unplanned}>计划外事件（{this.state.UnplannedNum}）</Button>
                                            </span>
                                    </Col>
                                </Row>
                                <div className="div_content" >
                                    <Table
                                        columns={columns}
                                        dataSource={this.state.Data}
                                        // scroll={{ x: 1300 }}  // 加了这个下面会有滚动条
                                        bordered
                                        // footer={() => 'Footer'}
                                        pagination={{
                                            total: total,
                                            pageSize: pageSize1,
                                            showTotal: function () {
                                                return <div style={{marginRight: 10, marginTop: 5}}> 共计 {this.total} 条数据</div>
                                            }
                                        }}
                                    />
                                </div>
                            </TabPane>
                        </Tabs>
                    </div>

                </div>

                <Modal

                    // style={{center: 26, top: 200,height:800 ,maxHeight:800}}
                    width={this.state.widthValue}
                    //  style={{height:800}}
                    title={this.state.tltle}
                    visible={this.state.visible}
                     onOk={this.handleOk}
                     onCancel={this.handleCancel}
                     okText="确认"
                     cancelText="取消"
                    destroyOnClose ="true" //窗口关闭时  销毁内容
                    // maskClosable="false"
                    maskClosable={false}

                >
                    <div>
                        <Row>

                                <Col span={10}   style={this.state.style1}>
                                    <div style={{ height:250 ,maxHeight:250 ,overflow:"auto" } } >
                                            对象选择
                                            <Tree
                                                maskClosable="false"
                                                // checkStrictly="true"   //f
                                                checkedKeys={this.state.checkedKeys} //选中的值  这可以用作默认
                                                showIcon="true"
                                                 showLine="true"
                                                checkable      //节点前添加 Checkbox 复选框
                                                onCheck={this.onCheck} //点击勾选
                                                loadData={this.onLoadData}>

                                                {this.renderTreeNodes(this.state.treeData)}
                                            </Tree>
                                    </div>


                                </Col>

                            <Col span={1} style={this.state.style2} >
                                <Divider style={{width:"10px",height:"250px"}} type="vertical" />
                               {/* <img style={{width:"10px",height:"800px"}} src="https://www.baidu.com/img/bd_logo1.png"/>*/}
                            </Col>

                            <Col span={this.state.spanValue}  >
                                <Row>
                                    <Col span={6} offset={9}>
                                         计划时间设置
                                    </Col>
                                </Row>
                                <br/>   <br/>
                                <Row>
                                    <Col span={5}>
                                        <span  >
                                            计划时间：
                                        </span>

                                    </Col>
                                    <Col span={4} offset={4}>
                                        <TimePicker   onChange={this.onChangeWorkStartTime} defaultValue={moment(this.state.workStartTimeValue, format)} format={format} />

                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    <Col span={5}>
                                          开关状态：
                                    </Col>
                                    <Col span={9} offset={4}>
                                        <RadioGroup onChange={this.onChange} value={this.state.value}>
                                            <Radio value={1}>开启</Radio>
                                            <Radio value={0}>关闭</Radio>
                                        </RadioGroup>
                                    </Col>

                                </Row>
                                <br/>
                                <Row>
                                    <Col span={5}>
                                        重复 | 每周
                                    </Col>
                                </Row>
                                <br/>
{/*                                <Row>
                                    {tagsFromServer.map(tag => (
                                        <CheckableTag
                                            visible= "true"
                                            key={tag}
                                            checked={selectedTags.indexOf(tag) > -1}
                                            onChange={checked => this.handleChangeTag(tag, checked)}
                                        >
                                            {tag}
                                        </CheckableTag>
                                    ))}
                                </Row>*/}

                                <Row>
                                    <Col >

                                        <Button type={this.state.weekbutton1}  onClick ={this.weekbutton1.bind(this,"1")} size ="small" >星期一</Button>&nbsp;

                                        <Button type={this.state.weekbutton2} onClick ={this.weekbutton1.bind(this,"2")} size ="small" >星期二</Button>&nbsp;

                                        <Button type={this.state.weekbutton3}  onClick ={this.weekbutton1.bind(this,"3")} size ="small"  >星期三</Button>&nbsp;

                                        <Button type={this.state.weekbutton4}  onClick ={this.weekbutton1.bind(this,"4")} size ="small"  >星期四</Button>&nbsp;

                                        <Button type={this.state.weekbutton5}  onClick ={this.weekbutton1.bind(this,"5")} size ="small" >星期五</Button>&nbsp;

                                        <Button type={this.state.weekbutton6} onClick ={this.weekbutton1.bind(this,"6")} size ="small" >星期六</Button>&nbsp;

                                        <Button type={this.state.weekbutton7} onClick ={this.weekbutton1.bind(this,"7")} size ="small"  >星期日</Button>&nbsp;

                                    </Col>
                                </Row>
                                <br/>

                            </Col>
                        </Row>
                    </div>
                </Modal>



            </div>





        )
    }


}


ReactDOM.render(
    <PlanManage/>,
    document.getElementById('root')
)