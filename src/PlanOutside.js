import  React,{Component}from 'react';
import  ReactDOM from 'react-dom';
import {Select,Table,Row, Col,Button,Input,Modal,Tabs,message,Icon,Card,AutoComplete } from 'antd';
const { TextArea } = Input;
import './auditing.less';
import reqwest from 'reqwest';
import './StationMap';
const pageSize=10;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
class PlanOutside  extends React.Component{

    state={
        stationStatusList:[],
        visibleEdit:false, // 编辑
        selectedRowKeys: [],
        // planoutData:[],
        notProcessed :[],
        processed :[],
        orgName:'',

        activeKey : '1', //选中的面板

        statusValue:1, // 使用这个字段判断弹出框 是编辑的还是新增的

        eventId : '',  //用能计划外事件标识
        orgNoValue : '', // 用电单位
        ceResIdValue :'' , // 对象
        ceResIdValueid :'' , // 对象
        taskNo : '',     //任务单编号
        planOutsidetext : '' , //计划外事件内容
        watchMen : '',//值班人员
        handleTimeValue : '',  // 处理时间
        eventStatusValue : '未处理', //事件状态
        siteExecutionRecord : '' , // 现场管理执行记录
        adviceValue : '',  // 建议
        details : '', //在管理执行 和查看详情时  切换字段是否可编辑
        modalTitle:'管理执行',

        pagination: {pageSize: pageSize,current:1},

        nummm :'',

        selectCuseValue :'',
        selectPointName: '',//用能点
        fuzzyPointName :'' , //支持模糊查询的用能点
        dataPointName: [],


        footerValue: this.onOk,

    }
    getInitState=()=>{
        this.getStationInfo();
    }




    //   加载页面时 触发
    componentDidMount() {
        this.getData() //赋值data

    };


    callback = (key)=> {
        console.log("====",key);
        if(key === "1"){
            this.getData();
        }
        if(key === "2"){
            this.processed();
        }

    }



    //弹出编辑框
    ManagementImplementation = (record,e) => {

        var myDate =this.getmyDate();
        this.setState({
            statusValue:1,
            visible: true,
            orgNoValue : record.orgNo  , // 用电单位
            ceResIdValue : record.cePointName, //对象
            ceResIdValueid : record.cePointId,
            eventId : record.id , // 用能计划外ID
            handleTimeValue : myDate,
            orgName :record.orgName,
            details : '',


        });
        console.log("弹出编辑框"+record);

    }
    // 查看详情
    workOrdersDetails= (record,e) => {
        // 根据当前行的handleWorkorderId 查询关联的计划外事件处理工单表
        console.log(record);
        this.setState({
            statusValue:2,
            // visible: true,
            orgNoValue : record.orgNo  , // 用电单位
            ceResIdValue : record.cePointName, //对象
            // eventId : record.id , // 用能计划外ID
            orgName :record.orgName,

            statusValue:2,
            visible: true,
            siteExecutionRecord : record.handleDesc , // 现场管理记录
            adviceValue :   record.handleSugst, //建议
            taskNo : record.handleWorkorderNo , //工单号
            handleTimeValue : record.handleTime, //处理时间
            eventStatusValue : '已处理',
            details : "false",

        });

    }


    //新增确定
    handleOk = (e) => {
        console.log(e);
        //点击新增跳转到后台 数据新增
        this.planManageExecute();


    }

    //新增取消
    handleCancel = (e) => {
        console.log(e);
        this.setState({
            siteExecutionRecord : '', // 现场管理记录
            adviceValue :   '', //建议
            taskNo : '' , //工单号
            handleTimeValue : '', //处理时间
            eventStatusValue : '未处理',
            // details : '',
            visible: false,
        });

    }


    //浏览
    getData=(e)=>{
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

        let CuseValue  = this.state.selectCuseValue;
        let PointNameValue =selectPointNameValue;
        if (e === '' || e === undefined || e ===null) {
            CuseValue =null;
            PointNameValue =null;
        }


        reqwest({
            url:'/console/outPlanEvent/getOutPlanEventInfo',
            method:"GET",
            credentials:'include',
            data:{
                eventStatus:10,
                ceResId : CuseValue, //查询条件
                cePointId :PointNameValue, //查询条件
            }
        }).then((data)=>{
            // console.log("data111====",data);
            var ds=eval('('+data+')');

            let arry =[<option key="null">全部</option>,];
            if(ds[0].CustVo !== null){
                for (var i=0;i<ds[0].CustVo.length;i++){
                    arry.push( <option key={ds[0].CustVo[i].key}>{ds[0].CustVo[i].value}</option>,)
                }
            }
            let arry1 =[];

/*            //将pointName  放入数组中
            let arryPointName = [];
            for (var i=0;i<ds[0].cePoint.length;i++){
                arryPointName.push(
                    ds[0].cePoint[i].cePointName,
                )
            }
            //将pointName  去重
            let arryName =[...new Set(arryPointName )];
            if(ds[0].cePoint !== null){
                for (var i=0;i<arryName.length;i++) {
                    if (arryName[i].length > 0)
                    {
                        arry1.push(
                            <option value= {arryName[i]} >{arryName[i]}</option>
                        )
                    }

                }
            }*/

            let arry2=[];
            let arryName=[];
            let arryName1=[];
            if(ds[0].result !== null){
                for (var i=0;i<ds[0].result.length;i++){
                    // cePointName":"B206-1#风机盘管用能点","cePointId":
                    if(ds[0].result[i].cePointId !== null && ds[0].result[i].cePointName !== null ){
                        // arry1.push( <option key={ds[0].result[i].cePointId}>{ds[0].result[i].cePointName}</option>,)
                        arry2.push(ds[0].result[i].cePointId);
                    }
                }
                arryName =[...new Set(arry2 )];
                for (var j=0;j<arryName.length;j++){
                    for (var k=0;k<ds[0].result.length;k++){
                        if(arryName[j]===ds[0].result[k].cePointId){
                            arryName1.push( <option key={ds[0].result[k].cePointName}>{ds[0].result[k].cePointName}</option>,)
                            break;
                        }
                    }

                }



            }





            //
            this.setState({
                notProcessed: ds[0].result,
                modalTitle: "管理执行",
                stationStatusList :arry,
                nummm:10,
                dataPointName : arryName1,
                watchMen:ds[0].handler,
                activeKey :'1',
                footerValue: this.onOk,

            })

        })
    }


    unique1=(arr)=>{
        var hash=[];
        for (var i = 0; i < arr.length; i++) {
            if(hash.indexOf(arr[i])==-1){
                hash.push(arr[i]);
            }
        }
        return hash;
    }

    //查询已处理事件
    processed=()=>{
        reqwest({
            url:'/console/outPlanEvent/getOutPlanEventInfo',
            method:"GET",
            credentials:'include',
            data:{
                eventStatus:30,

            }
        }).then((data)=>{
            // console.log("data111====",data);
            var ds=eval('('+data+')');
            console.log("已处理data====",ds[0].result[0]);
            this.setState({
                processed: ds[0].result,
                modalTitle: "查看详情",
                nummm:30,
                activeKey :'2',
                footerValue:null,

            })
        })
    }

    selectqueryInfo=(value)=>{
        var str = this.state.selectPointName.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
        var SearchPointName = this.state.fuzzyPointName.replace(/(^\s*)|(\s*$)/g, '');//手动模糊搜索
        var selectPointNameValue='';
        if (str === '' || str === undefined || str ===null) {
            console.log("str默认选中的为空啊");
            if (SearchPointName === '' || SearchPointName === undefined || SearchPointName ===null) {
            }else{

                selectPointNameValue=SearchPointName;
            }
        }else{
            selectPointNameValue=str;
        }


        reqwest({
            url:'/console/outPlanEvent/getOutPlanEventInfo',
            method:"GET",
            credentials:'include',
            data:{
                eventStatus:this.state.nummm,
                ceResId : this.state.selectCuseValue,
                cePointId : selectPointNameValue,
                // cePointId : this.state.selectPointName,
            }
        }).then((data)=>{
            // console.log("data111====",data);
            var ds=eval('('+data+')');
            if(this.state.nummm ===10){
                console.log("data111==== 10 ");
                this.setState({
                    notProcessed: ds[0].result,
                })
            }
            if(this.state.nummm ===30){
                console.log("data111==== 30 ");
                this.setState({
                    processed : ds[0].result,
                })
            }
        })

    }


// 查询
    queryInfo=(value)=>{
        this.setState({
            selectCuseValue: value,
        });
    }

    // 查询用能点
    onChangePointName=(value)=>{
        this.setState({
            selectPointName:value,
        })
    }

    onSelect=(value)=>{
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




    // 管理执行确认
    planManageExecute=()=>{
        if(this.state.statusValue ===1){
            console.log("建议是",this.state.adviceValue+"获得的时间是"+this.state.handleTimeValue);
            console.log("处理人是",this.state.watchMen+"对象"+this.state.ceResIdValue);
            console.log("处理工单编号",this.state.taskNo+"用电单位"+this.state.orgNoValue);
            console.log("现场管理执行记录",this.state.siteExecutionRecord+"任务单编号"+this.state.taskNo);

            var str = this.state.taskNo.replace(/(^\s*)|(\s*$)/g, '');//去除空格;

            if (str === '' || str === undefined || str ===null) {
                message.warning('请填写任务单号');

            }else{
                reqwest({
                    url:'/console/outPlanEvent/processedOutPlanEvent',
                    method:"GET",
                    credentials:'include',
                    data:{
                        eventId:this.state.eventId,
                        orgNo: this.state.orgNoValue, //用电单位
                        ceResId : this.state.ceResIdValueid,// 对象
                        handleWorkorderNo:this.state.taskNo,//任务单编号/处理工单编号
                        handler : this.state.watchMen,  //值班人员
                        handleTime : this.state.handleTimeValue, //处理时间
                        handleDesc : this.state.siteExecutionRecord, //执行记录
                        handleSugst:this.state.adviceValue, // 建议
                    }
                }).then((data)=>{
                    console.log("data111====",data);
                    var ds=eval('('+data+')');
                    var returnValue= ds[0].result
                    if(returnValue===true){
                        this.setState({
                            visible: false,
                            siteExecutionRecord : '', // 现场管理记录
                            adviceValue :   '', //建议
                            taskNo : '' , //工单号
                            handleTimeValue : '', // 处理时间
                            eventStatusValue : '未处理',
                            // details : " ",
                            // activeKey :'2',
                        });

                        // this.processed();
                        this.showConfirm();
                        // message.success('执行成功');
                        // alert("执行成功");
                        /* window.location.reload();*/
                    }else{
                        message.error('执行失败');
                    }

                })

            }



        }

        if(this.state.statusValue === 2){
            this.setState({
                visible: false,
            });
        }

    }


    onChangetaskNo= (e)=> {
        this.setState({
            taskNo:e.target.value
        })
    }

    //获取现场管理执行记录
    handle_siteExecutionRecord(e){
        this.setState({
            siteExecutionRecord:e.target.value
        })
    }

    //获取处理意见的值
    handle_sugst(e){
        this.setState({
            adviceValue:e.target.value
        })
    }
    // //获取处理人
    // onChangewatchMen= (e)=> {
    //     this.setState({
    //         watchMen:e.target.value
    //     })
    // }

    getmyDate= ()=>{
        var date = new Date();
        var year = date.getFullYear().toString();
        var month = (date.getMonth()+1).toString();
        var day = date.getDate().toString();
        var hour =  date.getHours().toString();
        var minute = date.getMinutes().toString();
        var seconds = date.getSeconds().toString();
        return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+seconds;
        //格式：2019-04-17 00:05:00
    };

    // 执行完成时弹出提示框
    showConfirm= ()=>{
        let that = this;

        confirm({
            title: '提示',
            content: '是否跳转到已处理页面?',
            okText:"是",
            cancelText:"否",
            onOk() {
                console.log('是');
                that.setState({
                    visible: false,
                    siteExecutionRecord : '', // 现场管理记录
                    adviceValue :   '', //建议
                    taskNo : '' , //工单号
                    handleTimeValue : '', // 处理时间
                    eventStatusValue : '未处理',
                    // details : " ",
                    activeKey :'2',
                });
                that.processed();

            },
            onCancel() {
                console.log('否');
                that.setState({
                    visible: false,
                    siteExecutionRecord : '', // 现场管理记录
                    adviceValue :   '', //建议
                    taskNo : '' , //工单号
                    handleTimeValue : '', // 处理时间
                    eventStatusValue : '未处理',
                    // details : '',
                    activeKey :'1',
                });
                that.getData();

            },
        });
    }


    // 表格导出调用方法
    downloadExcel = () => {
        // currentPro 是列表数据
        const { currentPro } = this.props;
        var option={};
        let dataTable = [];
        if (currentPro) {
            for (let i in currentPro.data) {
                if(currentPro.data){
                    let obj = {
                        '项目名称': currentPro.data[i].name,
                        '项目地址': currentPro.data[i].address,
                        '考勤范围': currentPro.data[i].radius,
                    }
                    // dataTable.push(obj);
                    //columns={columns1} dataSource={this.state.notProcessed}
                    dataTable.push(this.state.notProcessed) ;

                }
            }
        }
        option.fileName = '项目统计'
        option.datas=[
            {
                sheetData:dataTable,
                sheetName:'sheet',
                sheetFilter:['id','orgNo','ceResId'],
                sheetHeader:['编号','单位','对象','事件内容','时间'], //    第一行
            }
        ];

        var toExcel = new ExportJsonExcel(option); //new
        toExcel.saveExcel();
    }


    formatDate(dateVal) {
        var newDate = new Date(dateVal);
        var sMonth = this.padValue(newDate.getMonth() + 1);
        var sDay = this.padValue(newDate.getDate());
        var sYear = newDate.getFullYear();
        var sHour = newDate.getHours();
        var sMinute = this.padValue(newDate.getMinutes());
        var ss = newDate.getSeconds();
        if(ss.toString().length === 1 ){
           ss=  ss+"0"
        }
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



    render() {

        var pageSize1 = this.state.pagination.pageSize;
        var total = this.state.pagination.total;

        const { dataPointName } = this.state;
        //未处理事件
        const columns1 = [{
            title: '用能客户',
            dataIndex: 'ceResName',
            key: 'ceResName',
            className: 'column-center',
            align: 'center',
            width: '20%',

        }, {
            title: '用能点 ',
            dataIndex: 'cePointName',
            key: 'cePointName',
            align: 'center',
            width: '20%',
        }, {
            title: '事件内容 ',
            dataIndex: 'eventType',
            key: 'eventType',
            align: 'center',
            width: '20%',
            render: (text) => {
                var val = "";
                if(text=="1"){
                    val = "停用期间开启运行";
                }
                return(<div><text>{val}</text></div>)
            }
        }, {
            title: '发生时间 ',
            dataIndex: 'eventTime',
            key: 'eventTime',
            align: 'center',
            width: '20%',
            render: (text, record, index) => {
                var eventTime = this.formatDate(text);
                return(
                    <div>
                        <text>{eventTime }</text>
                    </div>
                )
            },

        }, {
            title: '操作 ',
            dataIndex: 'caozuo',
            key: 'caozuo',
            align: 'center',
            width: '20%',
            render: (text, record) => (
                <span><span><a href="#" onClick={this.ManagementImplementation.bind(this, record)}>管理执行</a></span>&nbsp;&nbsp;&nbsp;
                </span>
            )
        }];

        const columns2 = [{
            title: '用能客户',
            dataIndex: 'ceResName',
            key: 'ceResName',
            className: 'column-center',
            align: 'center',
            width: '20%',

        }, {
            title: '用能点 ',
            dataIndex: 'cePointName',
            key: 'cePointName',
            align: 'center',
            width: '20%',
        }, {
            title: '事件内容 ',
            dataIndex: 'eventType',
            key: 'eventType',
            align: 'center',
            width: '10%',
            render: (text) => {
                var val = "";
                if(text=="1"){
                    val = "停用期间开启运行";
                }
                return(<div><text>{val}</text></div>)
            }
        }, {
            title: '任务单编号 ',
            dataIndex: 'handleWorkorderNo',
            key: 'handleWorkorderNo',
            align: 'center',
            width: '15%',

        }, {
            title: '值班人员 ',
            dataIndex: 'handler',
            key: 'handler',
            align: 'center',
            width: '10%',

        }, {
            title: '处理时间 ',
            dataIndex: 'handleTime',
            key: 'handleTime',
            align: 'center',
            width: '10%',
            render: (text, record, index) => {
                var handleTime = this.formatDate(text);
                return(
                    <div>
                        <text>{handleTime }</text>
                    </div>
                )
            },

        }, {
            title: '操作 ',
            dataIndex: 'caozuo',
            key: 'caozuo',
            align: 'center',
            width: '15%',
            render: (text, record) => (
                <span><span><a href="#" onClick={this.workOrdersDetails.bind(this, record)}>工单详情</a></span>&nbsp;&nbsp;&nbsp;
                </span>
            )
        }];




        return (
            <div className="div-body">
                <div className="div-page">
                    <div className="div_query">
                        <Tabs  activeKey ={this.state.activeKey} onChange={this.callback}>
                            <TabPane tab={<span>未处理事件</span>} key="1">
                                <Row>
                                    <Col span={4}>
                                        <Row>
                                            <Col span={10} offset={-2}>
                                                <span style={{lineHeight:'32px',float:'right'}}>用能客户：</span>
                                            </Col>
                                            <Col span={12}>
                                                <span style={{marginLeft:5}}>

                                                   <Select
                                                       defaultValue="全部"
                                                       onChange={this.queryInfo}
                                                        style={{width: '100%'}}
                                                        >
                                                       {this.state.stationStatusList}
                                                    </Select>

                                                </span>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col span={4}>
                                        <Row>
                                            <Col span={9} offset={2}>
                                                <span style={{lineHeight:'32px',float:'right'}}>用能点：</span>
                                            </Col>
                                            <Col span={13}>
                                                <span style={{marginLeft:5}}>
                                                     <AutoComplete
                                                         dataSource={dataPointName}
                                                         /*style={{ width: 200 }}*/
                                                         onSelect={this.onSelect}
                                                         onSearch={this.handleSearch}
                                                         placeholder="输入搜索 "
                                                         filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                                     />
                                                </span>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={4}>
                                        <span style={{lineHeight:'32px',float:'right'}}>
                                             <Button type="primary"  style={{marginTop:0}} onClick={this.selectqueryInfo}>查询</Button>
                                        </span>
                                    </Col>


                                </Row>
                                <div className="div_content">
                                    <Table
                                        columns={columns1}
                                        dataSource={this.state.notProcessed}
                                        bordered
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
                            <TabPane tab={<span>已处理事件</span>} key="2">
                                <Row>
                                    <Col span={4}>
                                        <Row>
                                            <Col span={9} offset={1}>
                                                <span style={{lineHeight:'32px',float:'right'}}>用能客户：</span>
                                            </Col>
                                            <Col span={13}>
                                                <span style={{marginLeft:5}}>
                                                    <Select
                                                        defaultValue="全部"
                                                        onChange={this.queryInfo}
                                                        style={{width: '90%'}}
                                                        >
                                                       {this.state.stationStatusList}
                                                    </Select>
                                                </span>

                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={4}>
                                        <Row>
                                            <Col span={9} offset={2}>
                                                <span style={{lineHeight:'32px',float:'right'}}>用能点：</span>
                                            </Col>
                                            <Col span={13}>
                                                <span style={{marginLeft:5}}>
{/*                                                    <Select
 defaultValue="全部"
 onChange={this.onChangePointName}
 style={{width: '90%'}}>
 {this.state.pointNameList}
 </Select>*/}
                                                    <AutoComplete
                                                        dataSource={dataPointName}
                                                        style={{ width: 200 }}
                                                        onSelect={this.onSelect}
                                                        onSearch={this.handleSearch}
                                                        placeholder="输入搜索 "
                                                        filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                                    />

                                                </span>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={4}>
                                        <span style={{lineHeight:'32px',float:'right'}}>
                                             <Button type="primary"  style={{marginTop:0}} onClick={this.selectqueryInfo}>查询</Button>
                                        </span>
                                    </Col>
                                </Row>
                                <div className="div_content" >
                                    <Table
                                        columns={columns2}
                                        dataSource={this.state.processed}
                                        bordered

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

                    style={{top: 26, height:800}}
                    width="800px"
                    //  style={{height:800}}
                    title={this.state.modalTitle}
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={this.state.footerValue}
                    //  footer={this.onOk}
                    okText="确认"
                    cancelText="取消"
                    destroyOnClose ="true" //窗口关闭时  销毁内容y
                    maskClosable={false}

                >

                    <div>
                        <Card >
                            <Row>
                                <Col span={24}>
                                    <Col span={8}>
                                        <span style={{ lineHeight:'32px',float:'left'}}>用电单位</span></Col>
                                    <Col span={8}>
                                        <span style={{marginLeft:"10%",lineHeight:'32px',float:'left'}}>用能点</span></Col>
                                    <Col span={8}>
                                        <span  style={{marginLeft:"18%",lineHeight:'32px',float:'left'}}>任务单编号</span></Col>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} >
                                    <Col span={8}>
                                        <span style={{lineHeight:'34px',float:'left'}}><Input placeholder="Basic usage" defaultValue={this.state.orgName} disabled="false" /></span></Col>
                                    <Col span={8} >
                                        <span style={{marginLeft:"10%",lineHeight:'34px',float:'left'}}><Input placeholder="Basic usage" defaultValue={this.state.ceResIdValue} disabled="false"/></span></Col>
                                    <Col span={8}>
                                        <span style={{ lineHeight:'34px',float:'right'}}><Input placeholder="处理工单编号" defaultValue={this.state.taskNo} onChange={this.onChangetaskNo} disabled= {this.state.details}/></span></Col>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col span={24} >
                                    <Col span={24}>
                                        <span style={{lineHeight:'32px',float:'left'}}>计划外事件内容</span></Col>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Col span={24}>
                                <span style={{lineHeight:'32px'}}>
                                    <TextArea placeholder="请填写计划事件的内容" autosize={{ minRows: 2, maxRows: 6 }} defaultValue="停用期间开启运行" disabled="false" />
                                </span></Col>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col span={24} >
                                    <Col span={24}>
                                        <span style={{lineHeight:'32px',float:'left'}}>现场管理执行记录</span></Col>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} >
                                    <Col span={24}>
                                <span style={{lineHeight:'32px'}}>
                                    <TextArea placeholder="请填写现场管理的执行记录" onChange={this.handle_siteExecutionRecord.bind(this)} autosize={{ minRows: 2, maxRows: 6 }} defaultValue={this.state.siteExecutionRecord} disabled= {this.state.details} />
                                </span></Col>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col span={24} >
                                    <Col span={24}>
                                        <span style={{lineHeight:'32px',float:'left'}}>建议</span></Col>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} >
                                    <Col span={24}>
                                <span style={{lineHeight:'32px'}}>
                                    <TextArea placeholder="填写你的建议" autosize={{ minRows: 2, maxRows: 6 }} onChange={this.handle_sugst.bind(this)} defaultValue={this.state.adviceValue} disabled= {this.state.details}/>
                                </span></Col>
                                </Col>
                            </Row>

                        </Card>

                    </div>
                </Modal>

            </div>
        )
    }

}
ReactDOM.render(
    <PlanOutside/>,
    document.getElementById('root')
)