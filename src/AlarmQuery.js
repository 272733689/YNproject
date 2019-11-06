import  React,{Component}from 'react';
import  ReactDOM from 'react-dom';
import {Select,Row, Col,Button ,Table,Popconfirm,Modal,Tabs ,DatePicker,Card,Input } from 'antd';

import reqwest from 'reqwest';
import locale from 'antd/es/date-picker/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './css/AlarmQuery.css';
import './component/record.css';
const confirm = Modal.confirm;
const pageSize=10;
moment.locale('zh-cn');
const { TabPane } = Tabs;
const {TextArea} = Input;
const { Option } = Select;
class AlarmQuery  extends Component{
    state = {

        pagination: {pageSize: pageSize,current:1},
        startValue: null, // 开始时间
        endValue: null,  // 结束时间
        endOpen: false,   //打开 ？
        activeKey : '1', // 默认打开的tab1  未处理的页面
        sortType  : '0',      //      充值预警，欠费报警，越限报警，通讯故障
        objectType: '0',   // 小区  热力站  企业
        startDate : null,  // 开始时间
        endDate : null, // 结束时间
        dataSouce  : [] , //表格数据
        visible: false, // 处理打开的编辑框

        id : null ,
        handleTime : null , //处理时间
        handler : null ,    //处理人
        telephone : null , // 联系电话
        handleDesc : null , //处理说明


        visible2 : false , //归档
        archiver : null, //归档人
        archiveTime : null ,// 归档时间
        archiveDesc : null ,//归档说明

        handlerOption : [], // 下拉选择处理人
        handlerOptionData : [] , //数据集合

    };
    //   加载页面时 触发
    componentDidMount() {
          this.getData();
    };

    //Tab  切换时
    callback = (key) => {
        console.log(key);
        this.setState({
            activeKey: key,  //
        },()=>{
            this.getData();
        });
    }

    // 告警类型 选择下拉
    SelectHandleChange  = (value) => {
        console.log(`selected ${value}`);
        {/*充值预警，欠费报警，越限报警，通讯故障*/}
        if(value===0){
            this.setState({
                sortType: null,  //
            });
        }else{
            this.setState({
                sortType: value,  //
            });
        }

    }

    //对象 选择下拉
    SelectObjectChange = (value) => {
        this.setState({
            objectType: value,  //
        });

    }



    //时间控件
    disabledStartDate = startValue => {
        const { endValue } = this.state;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    };

    disabledEndDate = endValue => {
        const { startValue } = this.state;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    };

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        });
    };

    onStartChange = value => {
        this.onChange('startValue', value);
        /*var formatDate = moment(12345678977).format('YYYY-MM-DD HH:mm:ss'); /!*格式化时间*!/*/
        console.log("当选择一个日期时 1",value.format('YYYY-MM-DD HH:mm:ss'));
        this.setState({
            startDate: value.format('YYYY-MM-DD HH:mm:ss'),  //
        });
    };

    onEndChange = value => {
        this.onChange('endValue', value);
        console.log("当选择一个日期时2" ,value.format('YYYY-MM-DD HH:mm:ss'));
        this.setState({
            endDate: value.format('YYYY-MM-DD HH:mm:ss'),  //
        });
    };

    handleStartOpenChange = open => {
        if (!open) {
            this.setState({ endOpen: true });
        }
        console.log("打开 或者 关闭时1");



    };

    handleEndOpenChange = open => {
        this.setState({ endOpen: open });
        console.log("打开 或者 关闭时2");

    };


    getData = () => {
        reqwest({
            url: '/console/alarmQuery/queryAlarmQuery',
            method: 'GET',
            credentials: 'include',
            data: {
                 activeKey:this.state.activeKey,
            }
        }).then((data) => {
            var ds = eval('(' + data + ')');
            console.log("返回的数据结果是", ds[0].result);
            console.log("返回的数据结果是呃呃呃呃呃呃", ds[0].resultHand[0].user_fullname);


           let optionValue=[];
            if(ds[0].resultHand !== null){
                for (var i=0;i<ds[0].resultHand.length;i++){
                    optionValue .push( <Option key={ ds[0].resultHand[i].user_fullname }>{ds[0].resultHand[i].user_fullname}</Option>,)
                }
            }

            this.setState({
                dataSouce: ds[0].result ,
                handlerOption : optionValue,
                handlerOptionData : ds[0].resultHand,
            });
        })
    }


    // 点击查询按钮时 出发的方法
    selectqueryInfo=(value)=>{
        console.log("tab 页是 ："+this.state.activeKey);
        console.log("告警类型是："+this.state.sortType );
        console.log("开始时间是："+this.state.startDate);
        console.log("结束时间是："+this.state.endDate);
        console.log("对象是："+this.state.objectType);

        if(this.state.sortType ==="0"){
            reqwest({
                url: '/console/alarmQuery/queryAlarmQuery',
                method: 'GET',
                credentials: 'include',
                data: {
                    activeKey:this.state.activeKey,
                    startDate :this.state.startDate,
                    endDate :this.state.endDate,
                    objectType : this.state.objectType
                }
            }).then((data) => {
                var ds = eval('(' + data + ')');
                console.log("返回的数据结果是", ds[0].result);

                this.setState({
                    dataSouce: ds[0].result ,
                });
            })
        }else{
            reqwest({
                url: '/console/alarmQuery/queryAlarmQuery',
                method: 'GET',
                credentials: 'include',
                data: {
                    activeKey:this.state.activeKey,
                    sortType :this.state.sortType,
                    startDate :this.state.startDate,
                    endDate :this.state.endDate,
                    objectType : this.state.objectType
                }
            }).then((data) => {
                var ds = eval('(' + data + ')');
                console.log("返回的数据结果是", ds[0].result);

                this.setState({
                    dataSouce: ds[0].result ,
                });
            })
        }


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



    //弹出处理编辑框
    showModalEdit = (record,e) => {
        this.setState({
            visible: true ,
             id:record.id ,
            handleTime : null , //处理时间
            handler : null,    //处理人
            telephone : null, // 联系电话
            handleDesc : null, //处理说明
        });

    }

    //处理编辑框的确定
    handleOk = (e) => {

        reqwest({
            url: '/console/alarmQuery/processing',
            method: 'GET',
            credentials: 'include',
            data: {
                id : this.state.id,
                handleTime : this.state.handleTime , //处理时间
                handler : this.state.handler ,    //处理人
                telephone : this.state.telephone , // 联系电话
                handleDesc : this.state.handleDesc, //处理说明
            }
        }).then((data) => {
            var ds = eval('(' + data + ')');
            console.log("返回的数据结果是", ds[0].result);

            this.setState({
                activeKey: "3",  //
                visible: false ,
                handlerOption : [], // 下拉选择处理人
                handlerOptionData : [] , //数据集合
            },()=>{
                this.getData();
            });
        })

    }
    //处理编辑框的取消
    handleCancel= (e) => {
        this.setState({
            visible: false ,
        });

    }
    cancel=(e) =>{
        console.log("关闭归档的提示框",e);
        // message.error('Click on No');
    }

    //归档
    placeOnFile=  (record,e) => {
        this.setState({
            visible2: true ,
            id:record.id ,
            archiver : null, //归档人
            archiveTime : null ,// 归档时间
            archiveDesc : null  //归档说明
        });

    }


    onChangeDate=(value, dateString) =>{
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
        this.setState({
            handleTime: dateString ,
        });
    }

    onOkDate =(value) =>{
        this.setState({
            handleTime: value.format('YYYY-MM-DD HH:mm:ss'),
        });
    console.log('onOk: ', value);
    }


    onChangeDate2=(value, dateString) =>{
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
        this.setState({
            archiveTime: dateString ,
        });
    }

    onOkDate2 =(value) =>{
        this.setState({
            archiveTime: value.format('YYYY-MM-DD HH:mm:ss') ,
        });
        console.log('onOk: ', value);
    }


    //处理人
    onChangeHandler=(e) =>{
        console.log('下拉的处理人是: ', e);
        const { handlerOptionData } = this.state;

        if(handlerOptionData !== null){
            for (var i=0;i<handlerOptionData.length;i++){
                if(handlerOptionData[i].user_fullname ===e){
                    this.setState({
                        telephone:  handlerOptionData[i].user_mobile,
                        //    telephone:  'asda',
                    });

                }
            }
        }

        this.setState({
            handler:  e,
        })
    }

    // 联系电话
    onChangeTelephone =(e) =>{
        this.setState({
            telephone:  e.target.value,
         });
    }
    //处理说明
    onChangehandleDesc  =(e) =>{
        this.setState({
            handleDesc:  e.target.value,
        });
    }




    //归档编辑框的确定
    handleOk2 = (e) => {

        reqwest({
            url: '/console/alarmQuery/placeOnFile',
            method: 'GET',
            credentials: 'include',
            data: {
                id : this.state.id,
                archiver : this.state.archiver, //归档人
                archiveTime : this.state.archiveTime ,// 归档时间
                archiveDesc : this.state.archiveDesc  //归档说明
            }
        }).then((data) => {
            var ds = eval('(' + data + ')');
            console.log("返回的数据结果是", ds[0].result);

            this.setState({
                activeKey: "4",  //
                visible2: false ,
            },()=>{
                this.getData();
            });
        })

    }
    //归档的取消
    handleCancel2= (e) => {
        this.setState({
            visible2: false ,
        });

    }



    //归档人
    onChangeHandler2=(e) =>{
        this.setState({
            archiver:  e.target.value,
        });
    }

    //归档说明
    onChangehandleDesc2  =(e) =>{
        this.setState({
            archiveDesc:  e.target.value,
        });
    }


    render() {
        var pageSize1 = this.state.pagination.pageSize;
        var total = this.state.pagination.total;
        const { startValue, endValue, endOpen ,dataPointName} = this.state;

        const columns = [, {
            title: '序号 ',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '告警类型',
            dataIndex: 'soeSortAlias',
            key: 'soeSortAlias',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '对象',
            dataIndex: 'soeObjectName',
            key: 'soeObjectName',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '名称',
            dataIndex: 'contacter',
            key: 'contacter',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '告警内容',
            dataIndex: 'soeSortDesc',
            key: 'soeSortDesc',
            align: 'center',
            // width: 200,
            width: '15%',
        }, {
            title: '告警时间',
            dataIndex: 'soeGenTime',
            key: 'soeGenTime',
            align: 'center',
            // width: 200,
            width: '15%',
            render: (text, record, index) => {
                var gmtCreateValue = this.formatDate(text);
                return(
                    <div>
                        <text>{gmtCreateValue }</text>
                    </div>
                )
            },

        }, {
            title: '地址',
            dataIndex: 'ceCustAddr',
            key: 'ceCustAddr',
            align: 'center',
            // width: 200,
            width: '15%',
        }, {
            title: '操作',
            dataIndex: 'cePointName6',
            key: 'cePointName6',
            align: 'center',
            // width: 200,
            width: '15%',
            render: (text, record) => (
                <span><span><a href="#" onClick={this.showModalEdit.bind(this, record)}>处理</a></span>&nbsp;&nbsp;&nbsp;
            {/*        <Popconfirm title="是否确认归档？" onConfirm={this.placeOnFile.bind(this, record)} onCancel={this.cancel} okText="是" cancelText="否">
                        <a href="#">归档</a>
                    </Popconfirm>*/}
                    <span><a href="#" onClick={this.placeOnFile.bind(this, record)}>归档</a></span>
                </span>
            )

        }];

        const columns2 = [, {
            title: '序号 ',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '告警类型',
            dataIndex: 'soeSortAlias',
            key: 'soeSortAlias',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '对象',
            dataIndex: 'soeObjectName',
            key: 'soeObjectName',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '名称',
            dataIndex: 'contacter',
            key: 'contacter',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '告警内容',
            dataIndex: 'soeSortDesc',
            key: 'soeSortDesc',
            align: 'center',
            // width: 200,
            width: '15%',
        }, {
            title: '告警时间',
            dataIndex: 'soeGenTime',
            key: 'soeGenTime',
            align: 'center',
            // width: 200,
            width: '15%',
            render: (text, record, index) => {
                var gmtCreateValue = this.formatDate(text);
                return(
                    <div>
                        <text>{gmtCreateValue }</text>
                    </div>
                )
            },

        }, {
            title: '地址',
            dataIndex: 'ceCustAddr',
            key: 'ceCustAddr',
            align: 'center',
            // width: 200,
            width: '15%',
        }, {
            title: '操作',
            dataIndex: 'cePointName6',
            key: 'cePointName6',
            align: 'center',
            // width: 200,
            width: '15%',
            render: (text, record) => (
                <span>&nbsp;&nbsp;&nbsp;
                    <span><a href="#" onClick={this.placeOnFile.bind(this, record)}>归档</a></span>
                </span>
            )

        }];


        const columns3 = [, {
            title: '序号 ',
            dataIndex: 'id',
            key: 'id',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '告警类型',
            dataIndex: 'soeSortAlias',
            key: 'soeSortAlias',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '对象',
            dataIndex: 'soeObjectName',
            key: 'soeObjectName',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '名称',
            dataIndex: 'contacter',
            key: 'contacter',
            align: 'center',
            // width: 200,
            width: '10%',
        }, {
            title: '告警内容',
            dataIndex: 'soeSortDesc',
            key: 'soeSortDesc',
            align: 'center',
            // width: 200,
            width: '15%',
        }, {
            title: '告警时间',
            dataIndex: 'soeGenTime',
            key: 'soeGenTime',
            align: 'center',
            // width: 200,
            width: '15%',
            render: (text, record, index) => {
                var gmtCreateValue = this.formatDate(text);
                return(
                    <div>
                        <text>{gmtCreateValue }</text>
                    </div>
                )
            },

        }, {
            title: '地址',
            dataIndex: 'ceCustAddr',
            key: 'ceCustAddr',
            align: 'center',
            // width: 200,
            width: '15%',
        }];

        return (
            <div className="div-bodys">
            <div  className="div-back" style={{ height: '100%' }}>

                <div className="div_titles1 rightClass"><span><span>告警管理&nbsp;</span>&nbsp;<span className="dayuClass">告警查询</span></span></div>
                <div className="div_titles">告警查询</div>
                <Row className="maxRow1">
                <Row span={24} >
{/*
                    <Tabs defaultActiveKey={this.state.activeKey} onChange={this.callback}>
*/}
                    <Tabs activeKey ={this.state.activeKey} onChange={this.callback}>

                        <TabPane tab="未处理告警" key="1">

                            <Col span={2}><div style={{ float:'right',  marginRight: "45%"}}> 告警类型：</div></Col>
                            <Col span={2}>
                                <Select defaultValue="0"  onChange={this.SelectHandleChange}  style={{width: '80%'}} >
                                    <Option value="0">全部</Option>
                                    <Option value="SOE_CUST_RECHARGE_WARN">充值预警</Option>
                                    <Option value="SOE_CUST_ARREAR_ALARM">欠费报警</Option>
                                    <Option value="SOE_TERM_COMM_FAILURE">通讯故障</Option>
                                </Select>
                            </Col>
                            <Col span={2}>告警日期：</Col>
                            <Col span={2}>
                                <DatePicker
                                    locale={locale}
                                    disabledDate={this.disabledStartDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={startValue}
                                    placeholder="Start"
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                />
                            </Col>
                            <Col span={2}><div style={{ float:'right',  marginRight: "30%"}}> 至</div></Col>
                            <Col span={4}>
                                <DatePicker
                                    locale={locale}
                                    disabledDate={this.disabledEndDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={endValue}
                                    placeholder="End"
                                    onChange={this.onEndChange}
                                    open={endOpen}
                                    onOpenChange={this.handleEndOpenChange}
                                />
                            </Col>

                            <Col span={1}>对象：</Col>
                            <Col span={7}>
                                <Select defaultValue="0"  onChange={this.SelectObjectChange} style={{width: '30%'}}>
                                    <Option value="0">全部</Option>
                                    <Option value="1">小区</Option>
                                    <Option value="2">热力站</Option>
                                    <Option value="3">企业</Option>
                                </Select>
                            </Col>
                            <Col span={2}>
                                <div style={{ float:'right',  marginRight: "20%"}}>
                                    <Button type="primary"  style={{marginTop:0}} onClick={this.selectqueryInfo}>查询</Button>
                                </div>
                            </Col>

                            <Table
                                style={{ marginTop: "2.5%"}}
                                columns={columns}
                                dataSource={this.state.dataSouce}
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


                        </TabPane>
                        <TabPane tab="处理中告警" key="4">

                            <Col span={2}><div style={{ float:'right',  marginRight: "45%"}}> 告警类型：</div></Col>
                            <Col span={2}>
                                <Select defaultValue="0"  onChange={this.SelectHandleChange}>
                                    <Option value="0">全部</Option>
                                    <Option value="充值预警">充值预警</Option>
                                    <Option value="欠费报警">欠费报警</Option>
                                    <Option value="越限报警">越限报警</Option>
                                    <Option value="通讯故障">通讯故障</Option>
                                </Select>
                            </Col>
                            <Col span={2}>告警日期：</Col>
                            <Col span={2}>
                                <DatePicker
                                    locale={locale}
                                    disabledDate={this.disabledStartDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={startValue}
                                    placeholder="Start"
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                />
                            </Col>
                            <Col span={2}><div style={{ float:'right',  marginRight: "30%"}}> 至</div></Col>
                            <Col span={4}>
                                <DatePicker
                                    locale={locale}
                                    disabledDate={this.disabledEndDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={endValue}
                                    placeholder="End"
                                    onChange={this.onEndChange}
                                    open={endOpen}
                                    onOpenChange={this.handleEndOpenChange}
                                />
                            </Col>

                            <Col span={1}>对象：</Col>
                            <Col span={7}>
                                <Select defaultValue="0"  onChange={this.SelectObjectChange}>
                                    <Option value="0">全部</Option>
                                    <Option value="1">小区</Option>
                                    <Option value="2">热力站</Option>
                                    <Option value="3">企业</Option>
                                </Select>
                            </Col>
                            <Col span={2}>
                                <div style={{ float:'right',  marginRight: "20%"}}>
                                    <Button type="primary"  style={{marginTop:0}} onClick={this.selectqueryInfo}>查询</Button>
                                </div>
                            </Col>

                            <Table
                                style={{ marginTop: "2.5%"}}
                                columns={columns2}
                                dataSource={this.state.dataSouce}
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


                        </TabPane>
                        <TabPane tab="已归档告警" key="9">

                            <Col span={2}><div style={{ float:'right',  marginRight: "45%"}}> 告警类型：</div></Col>
                            <Col span={2}>
                                <Select defaultValue="0"  onChange={this.SelectHandleChange}>
                                    <Option value="0">全部</Option>
                                    <Option value="充值预警">充值预警</Option>
                                    <Option value="欠费报警">欠费报警</Option>
                                    <Option value="越限报警">越限报警</Option>
                                    <Option value="通讯故障">通讯故障</Option>
                                </Select>
                            </Col>
                            <Col span={2}>告警日期：</Col>
                            <Col span={2}>
                                <DatePicker
                                    locale={locale}
                                    disabledDate={this.disabledStartDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={startValue}
                                    placeholder="Start"
                                    onChange={this.onStartChange}
                                    onOpenChange={this.handleStartOpenChange}
                                />
                            </Col>
                            <Col span={2}><div style={{ float:'right',  marginRight: "30%"}}> 至</div></Col>
                            <Col span={4}>
                                <DatePicker
                                    locale={locale}
                                    disabledDate={this.disabledEndDate}
                                    showTime
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={endValue}
                                    placeholder="End"
                                    onChange={this.onEndChange}
                                    open={endOpen}
                                    onOpenChange={this.handleEndOpenChange}
                                />
                            </Col>

                            <Col span={1}>对象：</Col>
                            <Col span={7}>
                                <Select defaultValue="0"  onChange={this.SelectObjectChange}>
                                    <Option value="0">全部</Option>
                                    <Option value="1">小区</Option>
                                    <Option value="2">热力站</Option>
                                    <Option value="3">企业</Option>
                                </Select>
                            </Col>
                            <Col span={2}>
                                <div style={{ float:'right',  marginRight: "20%"}}>
                                    <Button type="primary"  style={{marginTop:0}} onClick={this.selectqueryInfo}>查询</Button>
                                </div>
                            </Col>

                            <Table
                                style={{ marginTop: "2.5%"}}
                                columns={columns3}
                                dataSource={this.state.dataSouce}
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


                        </TabPane>
                    </Tabs>,
                </Row>

               {/* 开始*/}
                <Modal
                    style={{top: 26, height:800}}
                    width="800px"
                    //  style={{height:800}}
                    title="处理编辑框"
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
                        <Card >
                            <Row>
                                <Col span={24}>
                                    <Col span={8}>
                                        <span style={{ lineHeight:'32px',float:'left'}}>处理人</span></Col>
                                    <Col span={8}>
                                        <span style={{marginLeft:"10%",lineHeight:'32px',float:'left'}}>联系电话</span></Col>
                                    <Col span={8}>
                                        <span  style={{marginLeft:"18%",lineHeight:'32px',float:'left'}}>处理时间</span></Col>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} >
                                    <Col span={8}>
                                        <span style={{lineHeight:'34px',float:'left'}}>
                                           {/* <Input placeholder="处理人" defaultValue={this.state.handler} onChange={this.onChangeHandler} />*/}
                                                        <Select style={{ width: 200}}   onChange={this. onChangeHandler}>
                                                            {this.state.handlerOption}
                                                        </Select>

                                        </span></Col>
                                    <Col span={8} >
                                        <span style={{marginLeft:"10%",lineHeight:'34px',float:'left'}}><Input placeholder="联系电话" defaultValue={this.state.telephone}  value={this.state.telephone} onChange={this.onChangeTelephone}  disabled="false" /></span></Col>
                                    <Col span={8}>
                                        <span style={{ lineHeight:'34px',float:'right'}}>     <DatePicker locale={locale} showTime placeholder="处理时间" onChange={this.onChangeDate} onOk={this.onOkDate} format="YYYY-MM-DD HH:mm:ss"/></span></Col>
                                   {/*  disabled= {this.state.details}*/}
                                </Col>
                            </Row>
                            <br/>

                            <Row>
                                <Col span={24} >
                                    <Col span={24}>
                                        <span style={{lineHeight:'32px',float:'left'}}>处理说明</span></Col>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} >
                                    <Col span={24}>
                                <span style={{lineHeight:'32px'}}>
                                    <TextArea placeholder="填写处理说明" autosize={{ minRows: 2, maxRows: 6 }}  onChange={this.onChangehandleDesc.bind(this)} />
                                    {/*onChange={this.handle_sugst.bind(this)} defaultValue={this.state.adviceValue} disabled= {this.state.details}*/}
                                </span></Col>
                                </Col>
                            </Row>

                        </Card>

                    </div>
                </Modal>

               {/*  结束*/}


               {/*归档开始*/}
                <Modal
                    style={{top: 26, height:800}}
                    width="800px"
                    //  style={{height:800}}
                    title="归档编辑框"
                    visible={this.state.visible2}
                    onOk={this.handleOk2}
                    onCancel={this.handleCancel2}
                    okText="确认"
                    cancelText="取消"
                    destroyOnClose ="true" //窗口关闭时  销毁内容
                    // maskClosable="false"
                    maskClosable={false}

                >

                    <div>
                        <Card >
                            <Row>
                                <Col span={24}>
                                    <Col span={8}>
                                        <span style={{ lineHeight:'32px',float:'left'}}>归档人</span></Col>
                                    <Col span={8}>
                                        {/*<span style={{marginLeft:"10%",lineHeight:'32px',float:'left'}}>联系电话</span>*/}</Col>
                                    <Col span={8}>
                                        <span  style={{marginLeft:"18%",lineHeight:'32px',float:'left'}}>归档时间</span></Col>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} >
                                    <Col span={8}>
                                        <span style={{lineHeight:'34px',float:'left'}}><Input placeholder="归档人" defaultValue={this.state.handler} onChange={this.onChangeHandler2} /></span></Col>
                                    <Col span={8} >{/*
                                        <span style={{marginLeft:"10%",lineHeight:'34px',float:'left'}}><Input placeholder="联系电话" defaultValue={this.state.telephone}  onChange={this.onChangeTelephone} /></span>*/}</Col>
                                    <Col span={8}>
                                        <span style={{ lineHeight:'34px',float:'right'}}>     <DatePicker locale={locale} showTime placeholder="归档时间" onChange={this.onChangeDate2} onOk={this.onOkDate2} /></span></Col>
                                    {/*  disabled= {this.state.details}*/}
                                </Col>
                            </Row>
                            <br/>

                            <Row>
                                <Col span={24} >
                                    <Col span={24}>
                                        <span style={{lineHeight:'32px',float:'left'}}>归档说明</span></Col>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} >
                                    <Col span={24}>
                                <span style={{lineHeight:'32px'}}>
                                    <TextArea placeholder="填写处理说明" autosize={{ minRows: 2, maxRows: 6 }}  onChange={this.onChangehandleDesc2.bind(this)} />
                                    {/*onChange={this.handle_sugst.bind(this)} defaultValue={this.state.adviceValue} disabled= {this.state.details}*/}
                                </span></Col>
                                </Col>
                            </Row>

                        </Card>

                    </div>
                </Modal>
               {/*归档结束*/}


            </Row>
            </div>
            </div>
        )
    }


}
export default AlarmQuery;
ReactDOM.render(<AlarmQuery/>, document.getElementById("root"));