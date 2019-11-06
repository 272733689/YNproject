import  React,{Component}from 'react';
import  ReactDOM from 'react-dom';
import {Select,Table,Row, Col,Button ,Tabs, Radio,DatePicker} from 'antd';
import locale from 'antd/lib/date-picker/locale/zh_CN';

import './auditing.less';
import './StationMap';
import moment from 'moment';
import 'moment/locale/zh-cn';
import YearPicker from "./YearPicker";//路径按照自己的来
moment.locale('zh-cn');
import reqwest from 'reqwest';
const pageSize=10;
const TabPane = Tabs.TabPane;
const { MonthPicker } = DatePicker; //MonthPicker 是月格式
class ManageEnergySaving  extends React.Component{
    state={
        pagination: {pageSize: pageSize,current:1}, // 设置分页
        yearVisible : {display:"none"},
        monthVisible : {display:"none"} ,
        dayVisible : {display:"block"} ,

        stationStatusList:[], //用能客户查询  下拉框
        selectcCeCustId : '' , // 用能客户下拉的值

        yearValue :'',
        monthValue :'',
        dayValue :'',
        ChangeTime:'1',
        timeValue :'',

        dataSource:[],//表格数据
        numEcEsMgmt :'', //管理节能量总计



}

    //   加载页面时 触发
    componentDidMount() {
          this.getData() //赋值data
    };

    getData =(value)=> {
            let isTimeValue  = this.isTimeValue();
            console.log("返回后台的日期参数是", isTimeValue);
            console.log("返回后台的时间参数是", this.state.ChangeTime);

        reqwest({
            url:'/console/esMgmtOutPlanEventStat/getOutPlanEventStat',
            method:"GET",
            credentials:'include',
            data:{
                // changeTime  : this.state.ChangeTime,
                TimeValue : isTimeValue,
                ceCustId : this.state.selectcCeCustId,
            }
        }).then((data)=>{
            var ds=eval('('+data+')');
            let arry =[<option key="null" checked >全部</option>,];
            if(ds[0].custVo !== null){
                for (var i=0;i<ds[0].CustVo.length;i++){
                    arry.push( <option key={ds[0].CustVo[i].key}>{ds[0].CustVo[i].value}</option>,)
                }
            }

            this.setState({
                dataSource:ds[0].result,
                numEcEsMgmt :ds[0].resultNum,
                stationStatusList :  arry,
            })
        })
    }


    getExport=()=>{
        let isTimeValue  = this.isTimeValue();

        window.location.href = '/console/esMgmtOutPlanEventStat/getExport? TimeValue ='+ isTimeValue+'ceCustId = '+this.state.selectcCeCustId


        // console.log("返回后台的日期参数是", isTimeValue);
        // console.log("返回后台的时间参数是", this.state.ChangeTime);
        // reqwest({
        //     url:'/console/esMgmtOutPlanEventStat/getExport',
        //     method:"GET",
        //     credentials:'include',
        //     data:{
        //         // changeTime  : this.state.ChangeTime,
        //         isExport : "1",
        //         TimeValue : isTimeValue,
        //         ceCustId : this.state.selectcCeCustId,
        //     }
        // }).then((data)=>{
        //     var ds=eval('('+data+')');
        // })
    }


    onChangeTime=(value)=> {
        // console.log("时间单位是", value.target.value);
        if(value.target.value ==="year"){
            this.setState({
                yearVisible : {display:"block"},
                monthVisible : {display:"none"} ,
                dayVisible : {display:"none"} ,
                ChangeTime:"3"

            });
        }else if(value.target.value ==="month"){
            this.setState({
                yearVisible : {display:"none"},
                monthVisible : {display:"block"} ,
                dayVisible : {display:"none"} ,
                ChangeTime:"2"
            });
        }else if(value.target.value ==="day"){
            this.setState({
                yearVisible : {display:"none"},
                monthVisible : {display:"none"} ,
                dayVisible : {display:"block"} ,
                ChangeTime:"1"
            });
        }

    };


    // 查询
    queryInfo=(value)=>{
        this.setState({
            selectcCeCustId:value,
        })
    }

    filterByYear=(value)=> {
        console.log("年是", value);
        this.setState({
            yearValue:value,
        });
    };

    onChangeMonth = (date, dateString) => {
        console.log("月是", date, dateString);
        console.log("月是===", dateString);
        this.setState({
            monthValue:dateString,
        });
    };
    onChangeDay= (date, dateString) => {
        console.log("天是", date, dateString);

        this.setState({
            dayValue:dateString,
        });
    };

    //获取当前选中的 日期至=值
    isTimeValue= () => {

        let isTimeValue ="";
        if(this.state.ChangeTime === "2"){
            isTimeValue = this.state.monthValue
        }else if(this.state.ChangeTime === "3"){
            isTimeValue = this.state.yearValue;
        }else{
            isTimeValue = this.state.dayValue
        }
        return isTimeValue;

    }


    //限制日期 取今天以前
    disabledEndDate = endValue => {
        console.log("限制是", endValue.valueOf());
        console.log("限制222是", moment().format('YYYY').valueOf());
        return endValue.valueOf() >= new Date().valueOf();
    };


    // getStationInfo=()=>{
    //     let isTimeValue  = this.isTimeValue();
    //     console.log("返回后台的日期参数是", isTimeValue);
    //     reqwest({
    //         url:'/console/mgmt_planning/',
    //         method:"GET",
    //         credentials:'include',
    //         data:{
    //
    //         }
    //
    //     }).then((data)=>{
    //         var ds=eval('('+data+')');
    //         this.setState({
    //             Data:ds[0].result,
    //         })
    //     })
    //
    // }



    render() {
        var pageSize1 = this.state.pagination.pageSize;
        var total = this.state.pagination.total;
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
            title: '值班人员 ',
            dataIndex: 'handler',
            key: 'handler',
            align: 'center',
            width: '10%',
        }, {
            title: '管理执行内容 ',
            dataIndex: 'handleDesc',
            key: 'handleDesc',
            align: 'center',
            width: '10%',
        }, {
            title: '处理时间 ',
            dataIndex: 'handleTime',
            key: 'handleTime',
            align: 'center',
            width: '10%',
            render: (text) => {
                if(text !== null){
                    let timeFormat = moment(text).format('YYYY-MM-DD HH:mm:ss');
                    return(<div><text>{timeFormat}</text></div>)
                }else{
                    return(<div><text>{}</text></div>)
                }

            }



        }, {
            title: '管理节能量 ',
            dataIndex: 'ecEsMgmt',
            key: 'ecEsMgmt',
            align: 'center',
            width: '10%',
        }, {
            title: '节标煤量 ',
            dataIndex: 'ceEsMgmt',
            key: 'ceEsMgmt',
            align: 'center',
            width: '10%',
        }, {
            title: '减少CO2排放量 ',
            dataIndex: 'ecrEsMgmt',
            key: 'ecrEsMgmt',
            align: 'center',
            width: '10%',
        }];

        // const dataSource = [{
        //     ceResName: '杭州数元',
        //     cePointName: '用能点1 号',
        //     repeatStrategy: 'admin',
        //     onoffTime: '启动时运行',
        //     gmtCreate: '2019-04-16 13:29:15',
        //     1: '32Kw',
        //     2: '211吨',
        //     2: '211吨',
        //
        // }, {
        //     ceResName: '杭州数元',
        //     cePointName: '用能点1 号',
        //     repeatStrategy: 'admin',
        //     onoffTime: '启动时运行',
        //     gmtCreate: '2019-04-16 13:29:15',
        //     1: '32Kw',
        //     2: '211吨',
        //     2: '211吨',
        // }];
        //



        return (
            <div className="div-body">
                <div className="div-page">
                    <div className="div_query">
                        <Tabs defaultActiveKey="1">
                            <TabPane tab={<span>管理节能展示</span>} key="1" style={{height:800 ,maxHeight:800}}>
                                <Row>
                                    <Col span={5}>
                                        <Row>
                                            <Col span={10} offset={2}>
                                                <span style={{lineHeight:'32px',}}>用能客户：</span>
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

                                    <Col span={7}>
                                        <Row>
                                            <Col span={10}>
                                                <span style={{lineHeight:'32px',float:'right'}}>时间间隔：</span>
                                            </Col>
                                            <Col span={14}>
                                                <span style={{marginLeft:5}}>
                                                            <Radio.Group    defaultValue="day"  onChange={this.onChangeTime}>
                                                              <Radio.Button value="year">年</Radio.Button>
                                                              <Radio.Button value="month">月</Radio.Button>
                                                              <Radio.Button value="day">日</Radio.Button>
                                                            </Radio.Group>
                                                </span>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col span={4}>
                                        <Row>
                                            <Col span={10}>
                                                <span style={{lineHeight:'32px',float:'right'}}>日期：</span>
                                            </Col>
                                            <Col span={14}>
                                                <span >
                                                     <span  style={this.state.yearVisible} className="postion">
                                                        <YearPicker
                                                            disabledDate={this.disabledEndDate}
                                                            operand={12}//点击左箭头或右箭头一次递增的数值，可以不写，默认为0
                                                            callback={this.filterByYear}//用于获取最后选择到的值
                                                        />
                                                     </span>
                                                    <span  style={this.state.monthVisible}>
                                                          <MonthPicker
                                                          // style={this.state.monthVisible}
                                                              disabledDate={this.disabledEndDate}
                                                          onChange={this.onChangeMonth}
                                                          placeholder="选择月份" />

                                                    </span>
                                                     <span  style={this.state.dayVisible}>
                                                            <DatePicker
                                                              disabledDate={this.disabledEndDate}
                                                             onChange={this.onChangeDay}
                                                             placeholder="选择天"/>

                                                     </span>
                                                </span>
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col span={4}>
                                        <Col span={24}>
                                            <Button type="primary"  style={{lineHeight:'32px',float:'right', marginTop:0}} onClick={this.getExport}>导出</Button>
                                        </Col>
                                    </Col>

                                    <Col span={4}>
                                        <Col span={24}>
                                            <Button type="primary"  style={{lineHeight:'32px',float:'right', marginTop:0}} onClick={this.getData}>查询</Button>
                                        </Col>
                                    </Col>
                                </Row>
                                <div className="div_content1" >
                                    <Table
                                        columns={columns}
                                        dataSource={this.state.dataSource}
                                        // scroll={{ x: 1300 }}  // 加了这个下面会有滚动条
                                        bordered
                                        // footer={() => 'Footer'}
                                        footer={() => '总计节能量：'+this.state.numEcEsMgmt+' kwh'}
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


            </div>





        )
    }


}


ReactDOM.render(
    <ManageEnergySaving locale={locale}/>,
    document.getElementById('root')
)