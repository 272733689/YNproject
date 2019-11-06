import  React,{Component}from 'react';
import  ReactDOM from 'react-dom';
import moment from "moment";
import {Card,Row, Col,Radio,Progress ,AutoComplete,Button ,Input ,Modal,message  } from 'antd';
import './auditing.less';
import { Map,Markers } from 'react-amap';
import echarts from "echarts/lib/echarts";
import reqwest from 'reqwest';
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/dataZoom";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/legend";
// import day from '../src/images/day.png';
// import month from '../src/images/month.png';
// import year from '../src/images/year.png';

const { TextArea } = Input;
const Search = Input.Search;

//自定义外观
const styleB = {
    // background: '#000',
    // color: '#fff',
    // padding: '5px'

    background: `url('https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png')`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '30px',
    height: '40px',
    color: '#000',
    textAlign: 'center',
    lineHeight: '40px'
}
const styleC = {
    background: `url('http://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png')`,
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '30px',
    height: '40px',
    color: '#000',
    textAlign: 'center',
    lineHeight: '40px'
}


// import Geolocation from 'react-amap-plugin-geolocation'; //react-map 的地理位置插件
// class EnergyOverviewOperator  extends Component{
class EnergyOverviewOperator  extends React.Component{
    state={
        markers : [],   //地图标记点
        markers2 : [],   //地图标记点
        systemProcessedUser:[], //用能管控执行统计
        processed : '',  //用能管控执行统计 执行数量
        notProcessed : '',//用能管控执行统计 未执行数量
        modalTitle:'管理执行', //Modal 的标题
        footerValue: this.onOk, // Modal 的页脚
        // visible :  ,//Modal  显示隐藏
        // statusValue:1, // 使用这个字段判断弹出框 是编辑的还是新增的

        //用能管控执行 的属性变量
        orgNo :'',
        orgName :'',
        cePointName : '',
        cePointId : '',
        id : '',
        handleTimeValue :'',
        taskNo : '',     //任务单编号
        handle :'',
        siteExecutionRecord : '', //现场管理执行记录
        adviceValue : '' , //处理意见
        processeStatus : 1, //当前管理执行 展示的状态是 1 默认 2 未执行 3 已执行
        details : '', //在管理执行 和查看详情时  切换字段是否可编辑

        //页面展示
        resultDay :'',  //当天电量
        resultMonth :'', //当月电量
        resultyear :'', //当年电量
        PercentageDay :'', //当天百分比
        PercentageMonth :'', //当月百分比
        PercentageYear :'', //当年百分比
        carbonResultDay :'',  //当天碳排放
        carbonResultMonth :'',//当月碳排放
        carbonResultyear :'',//当年碳排放
        yesterday :'',  //昨天
        lastMonth :'',  //上月
        lastYear :'', //去年
        //负荷曲线
        dataDayNum1: ['00:00','00:15', '00:30','00:45'   ,'01:00','01:15', '01:30','01:45',   '02:00','02:15', '02:30','02:45',  '03:00' ,'00:15', '00:30','00:45',
            '04:00','04:15', '04:30','04:45',   '05:00','05:15', '05:30','05:45',   '06:00','06:15', '06:30','06:45',  '07:00','07:15', '07:30','07:45',
            '08:00','08:15', '08:30','08:45',   '09:00','09:15', '09:30','09:45',   '10:00','10:15', '10:30','10:45',  '11:00','11:15', '11:30','11:45',
            '12:00','12:15', '12:30','12:45',   '13:00','13:15', '13:30','13:45',   '14:00','14:15', '14:30','14:45',  '15:00','15:15', '15:30','15:45',
            '16:00','16:15', '16:30','16:45',   '17:00','17:15', '17:30','17:45',   '18:00','18:15', '18:30','18:45',  '19:00','19:15', '19:30','19:45',
            '20:00','20:15', '20:30','20:45',   '21:00','05:15', '21:30','21:45',   '22:00','22:15', '22:30','22:45',  '23:00','23:15', '23:30','23:45',
        ],
        dataDay:[],
        maxValue : '0',
        profitEsMgmt : '0.00',
        userNum:'',
        dataUserName : [],
        mapCenter : '',
        fontSizeS: "todayElectricity",
        loadPro :"1",


    }

    //   加载页面时 触发
    componentDidMount() {
        this.getUserMap(); //加载地图
        this.getUserScale(); //管控收益

        this.querySystemProcessedUser(null); //加载用能管控执行统计
        this.getEnergyDetails(); //加载用能概况
        this.getLoadCurve("1"); //负荷曲线
        this.getEnergyRatio(); // 分项能耗占比
        this.getEcharts("1");

        this.screenChange();
        this.resize();

    };

    screenChange= () =>  {
        window.addEventListener('resize', this.resize);

    }
    componentWillUnmount= () =>  {
        window.removeEventListener('resize',this.resize);
    }
    resize= () => {
        console.log("屏幕监听");
        console.log("屏幕的高度是", document.body.offsetHeight);
        console.log("屏幕的宽度是",  document.body.offsetWidth);
        // this.getLoadCurve(this.state.loadPro);  // 应为宽度设为100%  当屏幕宽度改变时  曲线图的宽度不会变化  所以重新加载一次



        if(document.body.offsetWidth<1830){
            if(document.body.offsetWidth>1506){
                this.setState({
                    fontSizeS :"todayElectricity2",
                })
            }else{
                this.setState({
                    fontSizeS :"todayElectricity3",
                })
            }
        }else{

            this.setState({
                fontSizeS :"todayElectricity",
            })
        }


    }


    查询地图上用户的点
    getUserMap= () => {
        reqwest({
            url:'/console/energyOverviewOperator/getUserMap',
            method:"GET",
            credentials:'include',
        }).then((data)=>{
            var ds=eval('('+data+')');

            let arry=[];
            let arry2=[];
            let arry1=[];
            if(ds[0].result !== null){
                if(ds[0].result > 0){
                    for (var i=0;i<ds[0].result.length;i++){
                        if(ds[0].result[i].valid === true){
                            arry.push( {position:{longitude: ds[0].result[i].longitude, latitude:ds[0].result[i].latitude ,username : ds[0].result[i].ceResName,id : ds[0].result[i].id,valid : ds[0].result[i].valid }} , )

                        }else{
                            arry2.push( {position:{longitude: ds[0].result[i].longitude, latitude:ds[0].result[i].latitude ,username : ds[0].result[i].ceResName,id : ds[0].result[i].id,valid : ds[0].result[i].valid }} , )

                        }
                        arry1.push( <option key={ds[0].result[i].longitude +","+ds[0].result[i].latitude+","+ds[0].result[i].ceResName+","+ds[0].result[i].id}>{ds[0].result[i].ceResName}</option>,)
                    }
                }


                this.setState({
                    dataUserName : arry1,
                    markers :arry,
                    markers2: arry2,
                    userNum : ds[0].resultNum
                })

            }
            // this.markers =[ {position:{longitude: 120.123126, latitude: 30.280719}} ,{position:{ longitude: 120.112483, latitude:35.2928}},
            //     {position:{longitude: 120.127975, latitude: 30.275382,}},{position:{longitude: 120.115444, latitude: 30.276605}}],
            //     this.mapCenter = {longitude: 120.123126, latitude: 30.280719};
        })


    }


    getUserScale= () => {
        reqwest({
            url:'/console/energyOverviewOperator/getUserScale',
            method:"GET",
            credentials:'include',
        }).then((data)=>{
            var ds=eval('('+data+')');
            if(ds[0].maxValue.length > 0 ){
                this.setState({
                    maxValue : ds[0].maxValue ,
                })
            }
            if(ds[0].profitEsMgmt > 0 ){
                this.setState({
                    profitEsMgmt : ds[0].profitEsMgmt,
                })
            }
            // this.setState({
            //     maxValue : ds[0].maxValue ,
            //     profitEsMgmt : ds[0].profitEsMgmt,
            // })

        })
    }
    getEnergyDetails = () => {


        reqwest({
            url:'/console/energyOverviewOperator/getEnergyDetails',
            method:"GET",
            credentials:'include',
        }).then((data)=>{
            var ds=eval('('+data+')');
            //当返回的某个值为null 时 显示0
            let resultDayValue='';
            if(ds[0].resultDay !== null && ds[0].resultDay !== undefined){
                resultDayValue =ds[0].resultDay; //当天电量
            }else {
                resultDayValue ="0"; //当天电量
            }
            let resultMonthValue;
            if(ds[0].resultMonth !== null && ds[0].resultMonth !== undefined){
                resultMonthValue =ds[0].resultMonth; //当月电量
            }else {
                resultMonthValue ="0"; //当月电量
            }
            let resultyearValue;
            if(ds[0].resultyear !== null  && ds[0].resultyear !== undefined){
                resultyearValue =ds[0].resultyear; //当年电量
            }else {
                resultyearValue ="0"; //当年电量
            }
            let PercentageDayValue;
            if(ds[0].PercentageDay !== null && ds[0].PercentageDay !== undefined){
                PercentageDayValue =ds[0].PercentageDay+"%"; //当天百分比
            }else {
                PercentageDayValue ="0%"; //当天百分比
            }
            let PercentageMonthValue;
            if(ds[0].PercentageMonth !== null && ds[0].PercentageMonth !== undefined){
                PercentageMonthValue =ds[0].PercentageMonth+"%"; //当月百分比
            }else {
                PercentageMonthValue ="0%"; //当月百分比
            }
            let PercentageYearValue;
            if(ds[0].PercentageYear !== null && ds[0].PercentageYear !== undefined ){
                PercentageYearValue =ds[0].PercentageYear+"%"; //当年百分比
            }else {
                PercentageYearValue ="0%"; //当年百分比
            }
            let carbonResultDayValue;
            if(ds[0].carbonResultDay !== null && ds[0].carbonResultDay !== undefined ){
                carbonResultDayValue =ds[0].PercentageYear; //当天碳排放
            }else {
                carbonResultDayValue ="0"; //当天碳排放
            }
            let carbonResultMonthValue;
            if(ds[0].carbonResultMonth !== null && ds[0].carbonResultMonth !== undefined  ){
                carbonResultMonthValue =ds[0].carbonResultMonth; //当月碳排放
            }else {
                carbonResultMonthValue ="0"; //当月碳排放
            }
            let carbonResultyearValue;
            if(ds[0].carbonResultyear !== null  && ds[0].carbonResultyear !== undefined){
                carbonResultyearValue =ds[0].carbonResultyear; //当年碳排放
            }else {
                carbonResultyearValue ="0"; //当年碳排放
            }
            let yesterdayValue;
            if(ds[0].yesterday !== null && ds[0].yesterday !== undefined){
                yesterdayValue =ds[0].yesterday; //昨天
            }else {
                yesterdayValue ="0"; //昨天
            }
            let lastMonthValue;
            if(ds[0].lastMonth !== null && ds[0].lastMonth !== undefined){
                lastMonthValue =ds[0].lastMonth; //上月
            }else {
                lastMonthValue ="0"; //上月
            }
            let lastYearValue;
            if(ds[0].lastYear !== null  && ds[0].lastYear !== undefined ){
                lastYearValue =ds[0].lastYear; //上月
            }else {
                lastYearValue ="0"; //上月
            }
            console.log('返回的数据是asdinasdnua ' );
            this.setState({
                resultDay :resultDayValue,  //当天电量
                resultMonth :resultMonthValue, //当月电量
                resultyear :resultyearValue, //当年电量
                PercentageDay :PercentageDayValue, //当天百分比
                PercentageMonth :PercentageMonthValue, //当月百分比
                PercentageYear :PercentageYearValue, //当年百分比
                carbonResultDay :carbonResultDayValue,  //当天碳排放
                carbonResultMonth :carbonResultMonthValue,//当月碳排放
                carbonResultyear :carbonResultyearValue,//当年碳排放
                yesterday :yesterdayValue,  //昨天
                lastMonth :lastMonthValue,  //上月
                lastYear :lastYearValue, //去年
                // resultDay :ds[0].resultDay,  //当天电量
                // resultMonth :ds[0].resultMonth, //当月电量
                // resultyear :ds[0].resultyear, //当年电量
                // PercentageDay :ds[0].PercentageDay+"%", //当天百分比
                // PercentageMonth :ds[0].PercentageMonth+"%", //当月百分比
                // PercentageYear :ds[0].PercentageYear+"%", //当年百分比
                // carbonResultDay :ds[0].carbonResultDay,  //当天碳排放
                // carbonResultMonth :ds[0].carbonResultMonth,//当月碳排放
                // carbonResultyear :ds[0].carbonResultyear,//当年碳排放
                // yesterday :ds[0].yesterday,  //昨天
                // lastMonth :ds[0].lastMonth,  //上月
                // lastYear :ds[0].lastYear, //去年
            })

        })
    }


    //加载负荷曲线
    getLoadCurve= (value) => {
        reqwest({
            url:'/console/energyOverviewOperator/getLoadCurve',
            method:"GET",
            credentials:'include',
            data:{
                LoadCurveUnit:value,
            }
        }).then((data)=>{

            var ds=eval('('+data+')');
            console.log('返回的数据是',value);
            let dataNum =[];
            let dataDay1=[];
            if( value==="1"){
                if(ds[0].EloadDay !== null){
                    console.log('判断',value);
                    dataNum = this.state.dataDayNum1;
                    dataDay1= [ds[0].EloadDay.eloadValue01, ds[0].EloadDay.eloadValue02, ds[0].EloadDay.eloadValue03, ds[0].EloadDay.eloadValue04, ds[0].EloadDay.eloadValue05, ds[0].EloadDay.eloadValue06, ds[0].EloadDay.eloadValue07, ds[0].EloadDay.eloadValue08, ds[0].EloadDay.eloadValue09, ds[0].EloadDay.eloadValue10,
                        ds[0].EloadDay.eloadValue11, ds[0].EloadDay.eloadValue12, ds[0].EloadDay.eloadValue13, ds[0].EloadDay.eloadValue14, ds[0].EloadDay.eloadValue15, ds[0].EloadDay.eloadValue16, ds[0].EloadDay.eloadValue17, ds[0].EloadDay.eloadValue18, ds[0].EloadDay.eloadValue19, ds[0].EloadDay.eloadValue20,
                        ds[0].EloadDay.eloadValue21, ds[0].EloadDay.eloadValue22, ds[0].EloadDay.eloadValue23, ds[0].EloadDay.eloadValue24, ds[0].EloadDay.eloadValue25, ds[0].EloadDay.eloadValue26, ds[0].EloadDay.eloadValue27, ds[0].EloadDay.eloadValue28, ds[0].EloadDay.eloadValue29, ds[0].EloadDay.eloadValue30,
                        ds[0].EloadDay.eloadValue31, ds[0].EloadDay.eloadValue32, ds[0].EloadDay.eloadValue33, ds[0].EloadDay.eloadValue34, ds[0].EloadDay.eloadValue35, ds[0].EloadDay.eloadValue36, ds[0].EloadDay.eloadValue37, ds[0].EloadDay.eloadValue38, ds[0].EloadDay.eloadValue39, ds[0].EloadDay.eloadValue40,
                        ds[0].EloadDay.eloadValue41, ds[0].EloadDay.eloadValue42, ds[0].EloadDay.eloadValue43, ds[0].EloadDay.eloadValue44, ds[0].EloadDay.eloadValue45, ds[0].EloadDay.eloadValue46, ds[0].EloadDay.eloadValue47, ds[0].EloadDay.eloadValue48, ds[0].EloadDay.eloadValue49, ds[0].EloadDay.eloadValue50,
                        ds[0].EloadDay.eloadValue51, ds[0].EloadDay.eloadValue52, ds[0].EloadDay.eloadValue53, ds[0].EloadDay.eloadValue54, ds[0].EloadDay.eloadValue55, ds[0].EloadDay.eloadValue56, ds[0].EloadDay.eloadValue57, ds[0].EloadDay.eloadValue58, ds[0].EloadDay.eloadValue59, ds[0].EloadDay.eloadValue60,
                        ds[0].EloadDay.eloadValue61, ds[0].EloadDay.eloadValue62, ds[0].EloadDay.eloadValue63, ds[0].EloadDay.eloadValue64, ds[0].EloadDay.eloadValue65, ds[0].EloadDay.eloadValue66, ds[0].EloadDay.eloadValue67, ds[0].EloadDay.eloadValue68, ds[0].EloadDay.eloadValue69, ds[0].EloadDay.eloadValue70,
                        ds[0].EloadDay.eloadValue71, ds[0].EloadDay.eloadValue72, ds[0].EloadDay.eloadValue73, ds[0].EloadDay.eloadValue74, ds[0].EloadDay.eloadValue75, ds[0].EloadDay.eloadValue76, ds[0].EloadDay.eloadValue77, ds[0].EloadDay.eloadValue78, ds[0].EloadDay.eloadValue79, ds[0].EloadDay.eloadValue80,
                        ds[0].EloadDay.eloadValue81, ds[0].EloadDay.eloadValue82, ds[0].EloadDay.eloadValue83, ds[0].EloadDay.eloadValue84, ds[0].EloadDay.eloadValue85, ds[0].EloadDay.eloadValue86, ds[0].EloadDay.eloadValue87, ds[0].EloadDay.eloadValue88, ds[0].EloadDay.eloadValue89, ds[0].EloadDay.eloadValue90,
                        ds[0].EloadDay.eloadValue91, ds[0].EloadDay.eloadValue92, ds[0].EloadDay.eloadValue93, ds[0].EloadDay.eloadValue94, ds[0].EloadDay.eloadValue95,ds[0].EloadDay.eloadValue96,
                    ];
                }else{
                    dataNum = this.state.dataDayNum1;
                    dataDay1=[ ];
                }
            }

            if( value==="2"){
                console.log('判断',value);
                console.log('判断1',ds[0].EloadMonth[0].avgValue);
                console.log('判断2',ds[0].EloadMonth[0].dateStat);
                for (var i=0;i<ds[0].EloadMonth.length;i++) {
                    dataDay1.push(
                        ds[0].EloadMonth[i].avgValue,
                    )

                    let time= ds[0].EloadMonth[i].dateStat
                    let timeFormat = moment(time).format('YYYY-MM-DD');
                    dataNum.push(
                        timeFormat
                    )
                }
            }

            if( value==="3"){
                console.log('判断',value);
                console.log('判断1',ds[0].EloadYear[0].avgValue);
                console.log('判断2',ds[0].EloadYear[0].monthStat);
                for (var i=0;i<ds[0].EloadYear.length;i++) {
                    dataDay1.push(
                        ds[0].EloadYear[i].avgValue,
                    )
                    // let time= ds[0].EloadYear[i].monthStat
                    // let timeFormat = moment(time).format('YYYY-MM');
                    dataNum.push(
                        ds[0].EloadYear[i].monthStat,
                        // timeFormat
                    )
                }
            }
            let  loadPro = echarts.init(document.getElementById('loadPro'));
            window.onresize = loadPro.resize;
            loadPro.setOption({
                xAxis: {
                    type: 'category',
                    data : dataNum
                    // data: ['00:00', '00:30', '01:00', '01:30', '02:00']

                },
                yAxis: {
                    type: 'value'
                },
                tooltip: {
                    trigger: 'axis'
                },
                series: [{
                    data : dataDay1,
                    // data: [70, 20, 90, 30,50],
                    type: 'line',
                    smooth: true
                }],

            })





        })

    }

    //分项能耗占比
    getEnergyRatio= (value) => {
        reqwest({
            url:'/console/energyOverviewOperator/getEnergyRatio',
            method:"GET",
            credentials:'include',
            data:{
                dateValue:value,
            }
        }).then((data)=>{
            var ds=eval('('+data+')');
            this.setState({
                HeatingValue : ds[0].Heating,
                lightingValue : ds[0].lighting,
                dynamicValue : ds[0].dynamic,
                specialValue :ds[0].special
            })

        })

    }




    //查询 当前登陆账号下 的 执行 和未执行
    querySystemProcessedUser= (event) => {
        reqwest({
            url:'/console/energyOverviewOperator/querySystemProcessedUser',
            method:"GET",
            credentials:'include',
            data:{
                eventStatus:event
            }
        }).then((data)=>{
            var ds=eval('('+data+')');

            let arry1=[];
            if(ds[0].result !== null){
                if(ds[0].result.length > 0 ){
                    for (var i=0;i<ds[0].result.length;i++){

                        if(ds[0].result[i].eventStatus === 10){

                            arry1.push(
                                <Col>
                                    <Col span={18}>
                                        <Col span={7} style={{marginLeft:20 ,marginTop:10 ,float:'left'}} >{ds[0].result[i].ceResName}</Col>
                                        <Col span={6} style={{marginLeft:10 ,marginTop:10 ,float:'left'}}>{ds[0].result[i].eventTimeDate}</Col>
                                        <Col span={5} style={{marginLeft:10 ,marginTop:10 ,float:'left'}}>{ds[0].result[i].eventTimeTime}</Col>
                                        <Col span={7} style={{marginLeft:20 ,marginTop:5 ,float:'left'}}>{ds[0].result[i].cePointName}</Col>
                                        <Col span={14} style={{marginLeft:10 ,marginTop:5 ,float:'left'}}>晚于停用时间运行</Col>
                                    </Col>
                                    <Col span={6}>
                                        <p  style={{height:'25px',width:'70px',marginTop: 15 ,cursor:"pointer"}} className="classColorRed"  onClick={this.editModal.bind(this, ds[0].result[i].orgNo+","+ds[0].result[i].orgName+","+ds[0].result[i].cePointName
                                            +","+ds[0].result[i].cePointId+","+ds[0].result[i].id+","+ds[0].result[i].handleTimeValue+","+ds[0].result[i].handler)} > &nbsp;&nbsp;&nbsp;未执行 </p>
                                    </Col>
                                </Col>
                            )

                        }else if(ds[0].result[i].eventStatus === 30){
                            arry1.push(
                                <Col>
                                    <Col span={18}>
                                        <Col span={7} style={{marginLeft:20 ,marginTop:10 ,float:'left'}} >{ds[0].result[i].ceResName}</Col>
                                        <Col span={6} style={{marginLeft:10 ,marginTop:10 ,float:'left'}}>{ds[0].result[i].eventTimeDate}</Col>
                                        <Col span={5} style={{marginLeft:10 ,marginTop:10 ,float:'left'}}>{ds[0].result[i].eventTimeTime}</Col>
                                        <Col span={7} style={{marginLeft:20 ,marginTop:5 ,float:'left'}}>{ds[0].result[i].cePointName}</Col>
                                        <Col span={14} style={{marginLeft:10 ,marginTop:5 ,float:'left'}}>晚于停用时间运行</Col>
                                    </Col>
                                    <Col span={6}>
                                        <p  style={{height:'25px',width:'70px',marginTop: 15  ,cursor:"pointer" }} className="classColorBlue" onClick={this.detailsModal.bind(this, ds[0].result[i].orgNo+","+ds[0].result[i].orgName+","+ds[0].result[i].cePointName
                                            +","+ds[0].result[i].cePointId+","+ds[0].result[i].id+","+ds[0].result[i].handleTimeValue+","+ds[0].result[i].handler+","+ds[0].result[i].handleDesc+","+ds[0].result[i].handleSugst+","+ds[0].result[i].handleWorkorderNo)}> &nbsp;&nbsp;&nbsp;已执行 </p>

                                    </Col>
                                </Col>
                            )
                        }

                    }
                }

                this.setState({
                    systemProcessedUser :arry1,
                    processed : ds[0].processed[0].processednum,
                    notProcessed : ds[0].processed[0].notProcessednum,
                })

            }
        })
    }

    //  点击已执行
    onClickProcessed= () => {
        this.querySystemProcessedUser(30);
        this.setState({
            processeStatus : 3
        })
    }
    //  点击未执行
    onClickNotProcessed= () => {
        this.querySystemProcessedUser(10);
        this.setState({
            processeStatus : 2
        })
    }


    editModal= (valueClik) => {
        console.log('editModal',valueClik);
        var  Str = valueClik.split(",");
        this.setState({
            orgNo :Str[0],
            orgName : Str[1],
            cePointName : Str[2],
            cePointId : Str[3],
            id : Str[4],
            handleTimeValue : Str[5],
            handle : Str[6],
            visible: true,
            footerValue: this.onOk,
            details : '',

            siteExecutionRecord : '', // 现场管理记录
            adviceValue :   '', //建议
            taskNo : '' , //工单号

        })
        console.log('打开编辑页面',Str[0],Str[1],Str[2],Str[3],Str[4],Str[5],Str[6] );

    }

    detailsModal= (valueClik) => {

        console.log('editModal',valueClik);
        var  Str = valueClik.split(",");
        console.log('detailsModal',Str);
        this.setState({
            modalTitle: "查看详情",
            footerValue:null,
            visible: true,
            details : "false",
            orgNo :Str[0],
            orgName : Str[1],
            cePointName : Str[2],
            cePointId : Str[3],
            id : Str[4],
            handleTimeValue : Str[5],
            handle : Str[6],
            siteExecutionRecord : Str[7], // 现场管理记录
            adviceValue :   Str[8], //建议
            taskNo :  Str[9], //工单号

        })

    }

    //获取任务单编号
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


    // Modal 新增确定
    handleOk = (e) => {
        console.log(e);
        //点击新增跳转到后台 数据新增
        console.log(" 确定");

        var str = this.state.taskNo.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
        if (str === '' || str === undefined || str ===null) {
            message.warning('请填写任务单号');
        }else{
            reqwest({
                url:'/console/outPlanEvent/processedOutPlanEvent',
                method:"GET",
                credentials:'include',
                data:{
                    eventId:this.state.id,
                    orgNo: this.state.orgNo, //用电单位
                    ceResId : this.state.cePointId,// 对象
                    handleWorkorderNo:this.state.taskNo,//任务单编号/处理工单编号
                    handler : this.state.handle,  //值班人员
                    handleTime : this.state.handleTimeValue, //处理时间
                    handleDesc : this.state.siteExecutionRecord, //执行记录
                    handleSugst:this.state.adviceValue, // 建议
                }
            }).then((data)=>{
                var ds=eval('('+data+')');
                var returnValue= ds[0].result
                if(returnValue===true){
                    this.setState({
                        visible: false,
                    });
                    message.success('执行成功');
                    //执行成功后 显示的内容不能变 若在已执行 未执行的筛选条件下
                    if(this.state.processeStatus ===1){
                        this.querySystemProcessedUser(null);
                    }
                    if(this.state.processeStatus ===2){
                        this.querySystemProcessedUser(10);
                    }
                    if(this.state.processeStatus ===3){
                        this.querySystemProcessedUser(30);
                    }

                    // this.showConfirm();
                }else{
                    message.error('执行失败');
                }

            })
        }
    }

    //Modal 新增取消
    handleCancel = (e) => {
        console.log(e);
        console.log("取消");
        this.setState({
            visible: false,
        });

    }




    //饼装 用户数
    getEcharts= () => {
        let userScale = echarts.init(document.getElementById('userScaleS'));
        userScale.setOption({
            color:['#827FFFFF','#66CBFFFF','#73E6D0FF','#FF9966FF','#FF7F95FF','#F4D650FF','#3090FFFF','#2EE699FF' ,'#D8BAF0FF'],

            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                // x: 'right',
                itemWidth :14,
                itemHeight : 7,

                x: '60%',
                y: '8%',
                itemGap:3, //图例之间的间距
                bottom:"25%",
                selectedMode:false,


                // // 设置内边距为 5
                // padding: 5
                //     // 设置上下的内边距为 5，左右的内边距为 10
                // padding: [5, 10]
                //     // 分别设置四个方向的内边距
                // padding: [
                //     5,  // 上
                //     10, // 右
                //     5,  // 下
                //     10, // 左
                // ]
                data:['综合体','办公建筑','商场建筑','宾馆酒店','学校建筑','文化建筑','体育建筑','医院建筑','通信建筑',]
            },
            series: [
                {
                    name:'访问来源',
                    type:'pie',
                    radius: ['70%', '30%'], //这连个参数是 内心空白园大小   和圈的大小
                    center: ['30%', '40%'],  // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置

                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'left',
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '15',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:[
                        {value:335, name:'综合体'},
                        {value:310, name:'办公建筑'},
                        {value:1548, name:'商场建筑'},
                        {value:335, name:'宾馆酒店'},
                        {value:310, name:'学校建筑'},
                        {value:1548, name:'文化建筑'},
                        {value:335, name:'体育建筑'},
                        {value:310, name:'医院建筑'},
                        {value:1548, name:'通信建筑'}
                    ]
                }
            ]

        })
    }

    // 负荷曲线图


    // getLoadPro= () => {
    //     let  loadPro = echarts.init(document.getElementById('loadPro'));
    //     loadPro.setOption({
    //         xAxis: {
    //             type: 'category',
    //             data : this.state.dataDayNum
    //             // data: ['00:00', '00:30', '01:00', '01:30', '02:00']
    //
    //         },
    //         yAxis: {
    //             type: 'value'
    //         },
    //         tooltip: {
    //             trigger: 'axis'
    //         },
    //         series: [{
    //             data : this.state.dataDay,
    //             // data: [70, 20, 90, 30,50],
    //             type: 'line',
    //             smooth: true
    //         }],
    //
    //     })
    //
    // }

    // 负荷曲线  日月年
    onChangeTimeloadPro=(value)=> {
        console.log("负荷曲线时间单位是", value.target.value);

        this.getLoadCurve(value.target.value);
        this.setState({
            loadPro: value.target.value,
        });

    };

    // 分项能耗  日月年
    onChangeTimeEnergyCost=(value)=> {
        console.log("分项能耗时间单位是", value.target.value);
        this.getEnergyRatio(value.target.value);
    };


// 组件文档 https://elemefe.github.io/react-amap/components/about
    constructor() {
        super();
        // this.markers =[ {position:{longitude: 120.123126, latitude: 30.280719}} ,{position:{ longitude: 120.112483, latitude:35.2928}},
        //     {position:{longitude: 120.127975, latitude: 30.275382,}},{position:{longitude: 120.115444, latitude: 30.276605}}],
        //     this.mapCenter = {longitude: 120.123126, latitude: 30.280719};

        this.amapEvents = {
            created: (mapInstance) => {
                console.log('高德地图 Map 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：');
                console.log(mapInstance.getZoom());

            }
        };

        this.markerEvents = {
            created: (markerInstance) => {
                console.log('高德地图 Marker 实例创建成功；如果你要亲自对实例进行操作，可以从这里开始。比如：');
                // console.log(markerInstance.getPosition());
                console.log(markerInstance);
                this.resize.bind(this);
            },

            click: (MapsOption, marker) => {
                console.log(MapsOption);
                console.log(marker);
                const extData = marker.getExtData().position;
                console.log("点击了图标的经纬度是"+extData.longitude +"和"+ extData.latitude);
                this.jumpPage(marker);


            },
            dragend: (MapsOption, marker) => { /* ... */ },


            mouseover:(e) => {
                const marker = e.target;
                const extData = marker.getExtData().position;
                marker.render(this.renderMarkerHover(extData));
            },
            mouseout:(e) => {
                const marker = e.target;
                const extData = marker.getExtData().position;
                marker.render(this.renderMarker(extData));
            }


        }

    }

    //点击了地图上的标记跳转页面
    jumpPage=(marker)=>{
        const extData = marker.getExtData().position;
        console.log("点击了图标的经纬度是"+extData.longitude +"和"+ extData.latitude+"id是"+extData.id);
        window.location.href = '/console/energyOverviewOperator/jumpPage?id='+ extData.id ;
    }

    //自定义图标红色
    renderMarkerLayout(extData){
        return <div style={styleB}></div>
    }
    renderMarkerLayout2(extData){
        return <div style={styleC}></div>
    }

    //鼠标移入时触发的 显示的
    renderMarkerHover(extData){
        console.log("传入的参数是"+extData,extData );
        if(extData.valid === true){
            return <div style={styleB}><div style={{width: 200, height: 5,float:'left',fontSize:20,color:"blue" }}><p>{extData.username}</p></div></div>;
        }
        if(extData.valid === false){
            return <div style={styleC}><div style={{width: 200, height: 5,float:'left',fontSize:20,color:"blue" }}><p>{extData.username}</p></div></div>;
        }

        // return <div style={styleB}><div style={{width: 200, height: 5,float:'left',fontSize:20,color:"blue" }}><p>{extData.username}</p></div></div>;

    }
    //鼠标移出时触发的 显示的
    renderMarker(extData){
        console.log("传入的参数是"+extData,extData );
        if(extData.valid === true){
            return <div style={styleB}></div>        }
        if(extData.valid === false){
            return <div style={styleC}></div>
        }
        // return <div style={styleB}></div>
    }


    onSelect=(value)=>{
        console.log("模糊搜索的", value);
        let jwd = value.split(",");
        let longitude = jwd[0];
        let latitude = jwd[1];
        let userName = jwd[2];
        let userId = jwd[3];
        console.log("近卫笃是", longitude,latitude);
        // latitude: 29.999778
        // longitude: 119.999228

        // let arry=[];
        // arry.push( {position:{longitude: longitude, latitude:latitude ,username : userName,id : userId}} , )
        //     console.log("组合的数据是", arry);
        this.setState({
            // markers :arry,
            mapCenter :{longitude: longitude, latitude: latitude}
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

    render() {

        return (
            <div>
                <Row span={24} style={{ height: 900  }}>
                    <Col span={8}>
                        <Row style={{ height: 300  }} >
                            <Row className="div-back">
                                <Row className="row-title">
                                    客户规模
                                </Row>
                            </Row>
                        </Row>
                    </Col>
                </Row>
            </div>

        )
    }


}

// export default EnergyOverviewOperator;
//
// ReactDOM.render(<EnergyOverviewOperator/>, document.getElementById("root"));


ReactDOM.render(
    <EnergyOverviewOperator />,
    document.getElementById('root')
)