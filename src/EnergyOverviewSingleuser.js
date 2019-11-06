import  React,{Component}from 'react';
//这样就可以实现组件在异步加载的时候显示loading
import  ReactDOM from 'react-dom';
import {Card,Row, Col,Radio,Progress,Modal,Input,message } from 'antd';
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
import './EnergyOverviewSingleuser.css';
import moment from "moment";

import  transformer from "./images/transformer.png";
import  adressName from "./images/adressName.png";
import  adressIndustry from "./images/adressIndustry.png";
import  tushengkeji from "./images/tushengkeji.png";
import  gongsimoren from "./images/gongsimoren.png";
import  adress from "./images/adress.png";
import  controlBenefits from "./images/controlBenefits.png";
const { TextArea } = Input;
class EnergyOverviewSingleuser  extends React.Component{
    state={
        id:'48263896638685189',  //用户id  用户是 sssss
        userName:'', // 用户名
        userType:'', // 用户类型
        userAddress:'', //用户地址
        controlBenefits:'', //管控收益
        transformerValue :'0.00', //用能容量 变压器容量
        //负荷曲线
        dataDayNum1: ['00:00','00:15', '00:30','00:45'   ,'01:00','01:15', '01:30','01:45',   '02:00','02:15', '02:30','02:45',  '03:00' ,'00:15', '00:30','00:45',
            '04:00','04:15', '04:30','04:45',   '05:00','05:15', '05:30','05:45',   '06:00','06:15', '06:30','06:45',  '07:00','07:15', '07:30','07:45',
            '08:00','08:15', '08:30','08:45',   '09:00','09:15', '09:30','09:45',   '10:00','10:15', '10:30','10:45',  '11:00','11:15', '11:30','11:45',
            '12:00','12:15', '12:30','12:45',   '13:00','13:15', '13:30','13:45',   '14:00','14:15', '14:30','14:45',  '15:00','15:15', '15:30','15:45',
            '16:00','16:15', '16:30','16:45',   '17:00','17:15', '17:30','17:45',   '18:00','18:15', '18:30','18:45',  '19:00','19:15', '19:30','19:45',
            '20:00','20:15', '20:30','20:45',   '21:00','05:15', '21:30','21:45',   '22:00','22:15', '22:30','22:45',  '23:00','23:15', '23:30','23:45',
        ],
        // 电量 及电费
        econsValue1 :'0' ,//尖
        econsValue2 :'0', //峰
        econsValue3 :'0' ,//平
        econsValue4 :'0' ,//谷

        //用能概况
        processed : '',  //用能管控执行统计 执行数量
        notProcessed : '',//用能管控执行统计 未执行数量

        PercentageDay: 0.00, //今日百分比
        PercentageMonth: 0.00,  //当月百分比
        PercentageYear: -0.00, //当年百分比
        carbonResultDay: 0.00 , // 当天碳排放
        carbonResultMonth: 0.00,  // 当月碳排放
        carbonResultyear: 0.00,  // 当年碳排放
        yesterday: 0.00, //昨天
        lastMonth: 0.00, // 上月
        lastYear: 0.00, //去年
        resultDay: 0.00,  //今日
        resultMonth: 0.00, //当月
        resultyear: 0.00, //当年

        //madal
        modalTitle: "查看详情",
        footerValue:null,
        visible: false,
        details : "false",
        orgNo :'',
        eventId:'',
        orgName : '',
        cePointName : '',
        cePointId : '',
        handleTimeValue :'',
        handle : '',
        siteExecutionRecord :'', // 现场管理记录
        adviceValue :  '', //建议
        taskNo : '', //工单号
        processeStatus:1,
        // 分项能耗
        HeatingValue : 0,
        lightingValue : 0,
        dynamicValue : 0,
        specialValue :0,

        //宽度变化时的量
        electricityStyle1: {display:"block"},  //控制统计年的显示和隐藏

        orgNoS:' ',

        span:"span",
        spanTitleRed : "spanTitleRed"

    }

    componentWillMount(){
        this.resize();
        // this.echart();
    }
    //   加载页面时 触发
    componentDidMount() {
        this.getInitState(); // 获得orgNo
        // this.getInitState(); //获取传入参数的id+
        this.getInitState1(); //获取传入参数的id
        this.getUserDetails();
        this.getEcharts("1");  //尖峰平谷 用电情况

        // this.getloadPro(); //负载曲线
        this.getLoadCurve("1");
        this.getCalorimetric("1") ;  //度电成本曲线图
        this.getIncomeControl("1"); // 收益管控趋势   柱状图
        // this.getEnergyRatio();
        this.getEnergyProfile(); // 获取用能概况
        this.querySystemProcessedUser(null); //加载用能管控执行统计
        this.getEnergyRatio("1"); // 分项能耗占比



        this.screenChange();
        this.resize();

    };


    //屏幕自适应  字体缩小
    screenChange= () =>  {
        window.addEventListener('resize', this.resize);
    }

    resize= () => {
        console.log("屏幕监听");
        console.log("屏幕的高度是", document.body.offsetHeight);
        console.log("屏幕的宽度是",  document.body.offsetWidth);
        // this.getLoadCurve(this.state.loadPro);  // 应为宽度设为100%  当屏幕宽度改变时  曲线图的宽度不会变化  所以重新加载一次

        if(document.body.offsetWidth<1830){
            if(document.body.offsetWidth<1355){
                this.setState({
                    span : "span2" ,
                    spanTitleRed : "spanTitleRed2"

                })
            }else{
                this.setState({
                    span : "span" ,
                    spanTitleRed : "spanTitleRed"

                })
            }
        }else{
            this.setState({
                span : "span1" ,
                spanTitleRed : "spanTitleRed1"
            })
        }
    }

    /*
     constructor() {
     super();
     this.start = ()=>{
     this.resize.bind(this);
     }
     }


     screenChange= () =>  {
     window.addEventListener('resize',
     this.resize,
     );
     }
     componentWillUnmount= () =>  {
     window.removeEventListener('resize',this.resize);
     }
     resize= () => {

     console.log("屏幕监听");
     console.log("屏幕的高度是", document.body.offsetHeight);
     console.log("屏幕的宽度是",  document.body.offsetWidth);
     // this.getLoadCurve(this.state.loadPro);  // 应为宽度设为100%  当屏幕宽度改变时  曲线图的宽度不会变化  所以重新加载一次

     if(document.body.offsetWidth<1630){
     if(document.body.offsetWidth>1460){
     this.setState({
     fontSizeS :"todayElectricity2",
     electricityStyle1: {display:"block"},
     })
     }else{
     this.setState({
     electricityStyle1: {display:"none"},
     })

     }
     }else{
     this.setState({
     fontSizeS :"electricityTodayValue",
     electricityStyle1: {display:"block"},
     })
     }

     }*/

    getInitState = () => {
        const orgNoS=this.getUrlParam1("orgNo");
        const rrr=this.getUrlParam("orgNo");
        console.log("跳转页面时传入的参数orgNoS是"+orgNoS);
        console.log("跳转页面时传入的参数orgNoS是"+rrr);
        if(orgNoS !== null){
            this.setState({
                orgNoS:orgNoS,
            });
        }
    }

    getInitState1= () => {
        const id=this.getUrlParam("id");
        console.log("跳转页面时传入的参数是"+id);
        if(id !== null){
            this.setState({
                id: id,
            });
        }else{
            return '48263896638685189';
        }
        // return '20174508665077775';
        return id;
    }

    /*    getUrlParam=(name)=>{
     console.log('name',name);
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     console.log('r',r);
     if (r!=null) {
     return unescape(r[2]);
     }
     // return '20174508665077775';
     return null;
     }*/


    getUrlParam = (name) => {
        console.log('name', name);
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        console.log('reg', reg);
        var r = window.location.search.substr(1).match(reg);
        console.log('r', r);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }


    getUrlParam1(name){
        var reg=new RegExp('(^|&)'+name+'=([^&]*)(&|$)');
        var result=window.location.search.substr(1).match(reg);
        return result ? decodeURIComponent(result[2]):null;
    }



    getUserDetails=()=>{
        let id =  this.getInitState1(); //获取传入参数的id
        reqwest({
            url:'/console/energyOverviewSingleuser/getUserDetails',
            method:"GET",
            credentials:'include',
            data:{
                id:id,
            }
        }).then((data)=>{
            var ds=eval('('+data+')');
            let userAddressValue='';
            if( ds[0].CeGetCust.consElecSort==="A"){
                userAddressValue="大型专变用户";
            }else if(ds[0].CeGetCust.consElecSort==="B"){
                userAddressValue="中小型专变用户";
            }else if(ds[0].CeGetCust.consElecSort==="C"){
                userAddressValue="三相一般工商业用户";
            }else if(ds[0].CeGetCust.consElecSort==="D"){
                userAddressValue="单相一般工商业用户";
            }else if(ds[0].CeGetCust.consElecSort==="E"){
                userAddressValue="居民用户";
            }else if(ds[0].CeGetCust.consElecSort==="F"){
                userAddressValue="公用配变";
            }else{
                userAddressValue="用电用户";
            }
            this.setState({
                userName: userAddressValue,//  用户类型
                userType: ds[0].CeGetCust.ceCustIntro, // 用户名
                userAddress : ds[0].CeGetCust. ceCustAddr, //用户地址
                controlBenefits : ds[0].profitEsMgmt , //管控收益
                transformerValue:   ds[0].transformerValue ,     //用能容量 变压器容量
            });
        })

    }


    //
    // constructor(props, context) {
    //     super(props, context);
    //     console.log(props,props);
    //    let id = ""+ (props.id) ? props.id : null;
    //     console.log("跳转页面时传入的参数是"+id);
    // }



    // 获取用能概况
    getEnergyProfile= (value) => {
        let id =  this.getInitState1(); //获取传入参数的id
        reqwest({
            url:'/console/energyOverviewSingleuser/getEnergyProfile',
            method:"GET",
            credentials:'include',
            data:{
                id:id,
            }
        }).then((data)=>{
            var ds=eval('('+data+')');
            let PercentageDayValue;
            let PercentageMonthValue;
            let PercentageYearValue;

            if(ds[0].PercentageDay !== null  && ds[0].PercentageDay !== undefined){
                PercentageDayValue = ds[0].PercentageDay
            }else{
                PercentageDayValue = 0
            }
            if(ds[0].PercentageMonth !== null  && ds[0].PercentageMonth !== undefined){
                PercentageMonthValue = ds[0].PercentageMonth;
            }else{
                PercentageMonthValue = 0
            }

            if(ds[0].PercentageYear !== null  && ds[0].PercentageYear !== undefined){
                PercentageYearValue = ds[0].PercentageYear;
            }else{
                PercentageYearValue = 0
            }


            let  carbonResultDayValue;
            let  carbonResultMonthValue;
            let  carbonResultyearValue;
            if(ds[0].carbonResultDay !== null  && ds[0].carbonResultDay !== undefined){
                carbonResultDayValue = ds[0].carbonResultDay
            }else{
                carbonResultDayValue = 0
            }
            if(ds[0].carbonResultMonth !== null  && ds[0].carbonResultMonth !== undefined){
                carbonResultMonthValue = ds[0].carbonResultMonth
            }else{
                carbonResultMonthValue = 0
            }
            if(ds[0].carbonResultyear !== null  && ds[0].carbonResultyear !== undefined){
                carbonResultyearValue = ds[0].carbonResultyear
            }else{
                carbonResultyearValue = 0
            }


            this.setState({
                resultDay :ds[0].resultDay,  //当天电量
                resultMonth :ds[0].resultMonth, //当月电量
                resultyear :ds[0].resultyear, //当年电量
                PercentageDay :PercentageDayValue+"%", //当天百分比
                PercentageMonth : PercentageMonthValue+"%", //当月百分比
                PercentageYear :PercentageYearValue +"%", //当年百分比
                carbonResultDay :carbonResultDayValue,  //当天碳排放
                carbonResultMonth :carbonResultMonthValue,//当月碳排放
                carbonResultyear :carbonResultyearValue,//当年碳排放
                yesterday :ds[0].yesterday,  //昨天
                lastMonth :ds[0].lastMonth,  //上月
                lastYear :ds[0].lastYear, //去年
            })

        })


    }


    //饼装 用户数
    getEcharts= (value) => {
        let id =  this.getInitState1(); //获取传入参数的id
        reqwest({
            url:'/console/energyOverviewSingleuser/getElectricityBill',
            method:"GET",
            credentials:'include',
            data:{
                billUnit:value,
                id:id,
            }
        }).then((data)=>{
            var ds=eval('('+data+')');
            console.log('ds 大苏打实打实',ds);
            let dataBill=[];
            if(ds[0].result !== null && ds[0].result !=="null" ){
                if(value === "1" && ds[0].result.econsValueDr1 !== null && ds[0].result.econsValueDr1 !== "null" ){

                    dataBill.push(
                        {value:ds[0].result.econsValueDr1, name:'尖'},
                        {value:ds[0].result.econsValueDr2, name:'峰'},
                        {value:ds[0].result.econsValueDr3, name:'平'},
                        {value:ds[0].result.econsValueDr4, name:'谷'},
                    )
                    this.setState({
                        econsValue1 :ds[0].result.econsValueDr1 ,//尖
                        econsValue2 :ds[0].result.econsValueDr2, //峰
                        econsValue3 :ds[0].result.econsValueDr3 ,//平
                        econsValue4 :ds[0].result.econsValueDr4 ,//谷
                    });

                }else if( value === "2" && ds[0].result.econsValueDr1 !== null && ds[0].result.econsValueDr1 !== "null" ){

                    dataBill.push(
                        {value:ds[0].result.econsValueMr1, name:'尖'},
                        {value:ds[0].result.econsValueMr2, name:'峰'},
                        {value:ds[0].result.econsValueMr3, name:'平'},
                        {value:ds[0].result.econsValueMr4, name:'谷'},
                    )
                    this.setState({
                        econsValue1 :ds[0].result.econsValueMr1 ,//尖
                        econsValue2 :ds[0].result.econsValueMr2, //峰
                        econsValue3 :ds[0].result.econsValueMr3 ,//平
                        econsValue4 :ds[0].result.econsValueMr4 ,//谷
                    });
                }else if( value ==="3" && ds[0].result.econsValueDr1 !== null && ds[0].result.econsValueDr1 !== "null" ){

                    dataBill.push(
                        {value:ds[0].result.econsValueYr1, name:'尖'},
                        {value:ds[0].result.econsValueYr2, name:'峰'},
                        {value:ds[0].result.econsValueYr3, name:'平'},
                        {value:ds[0].result.econsValueYr4, name:'谷'},
                    )
                    this.setState({
                        econsValue1 :ds[0].result.econsValueYr1 ,//尖
                        econsValue2 :ds[0].result.econsValueYr2, //峰
                        econsValue3 :ds[0].result.econsValueYr3 ,//平
                        econsValue4 :ds[0].result.econsValueYr4 ,//谷
                    });
                }else{
                    dataBill.push(
                        {value:0, name:'尖'},
                        {value:0, name:'峰'},
                        {value:0, name:'平'},
                        {value:0, name:'谷'},
                    )
                    this.setState({
                        econsValue1 :0 ,//尖
                        econsValue2 :0, //峰
                        econsValue3 :0 ,//平
                        econsValue4 :0,//谷
                    });
                }
            }else{
                dataBill.push(
                    {value:0, name:'尖'},
                    {value:0, name:'峰'},
                    {value:0, name:'平'},
                    {value:0, name:'谷'},
                )
                this.setState({
                    econsValue1 :0 ,//尖
                    econsValue2 :0, //峰
                    econsValue3 :0 ,//平
                    econsValue4 :0,//谷
                });
            }

            console.log('来卡  没有数据  会不会',);
            let ElectricityBill = echarts.init(document.getElementById('ElectricityBill'));
            window.addEventListener("resize",function(){
                ElectricityBill.resize();
            });

            ElectricityBill.setOption({
                tooltip: {
                    show:false
                },
                // tooltip: {
                //     trigger: 'item',
                //     formatter: "{a} <br/>{b}: {c} ({d}%)"
                // },
                color:['#61F2F2','#6191F2','#61C1F2','#9161F2'],
                legend: {
                    orient: 'vertical',
                    x: '60%',
                    y: '-2%',
                    itemWidth :14,
                    itemHeight : 14,
                    itemGap:25, //图例之间的间距
                    bottom:"15%",
                    selectedMode:false,

                    data:['尖','峰','平','谷'],
                },
                series: [
                    {
                        legend: {
                            itemWidth :14,
                            itemHeight :14,},
                        name:'访问来源',
                        type:'pie',
                        radius: ['0%', '60%'], //这连个参数是 内心空白园大小   和圈的大小
                        center: ['30%', '30%'],  // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'null'
                            },
                            emphasis: {
                                show: true, // 鼠标移上去时 显示名称
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
                        data :dataBill,
                        // data:[
                        //     {value:250, name:'尖'},
                        //     {value:250, name:'峰'},
                        //     {value:250, name:'平'},
                        //     {value:250, name:'谷'},
                        // ]

                    }
                ]
            })


        })
    }



    //加载负荷曲线
    getLoadCurve= (value) => {
        let id=  this.getInitState1(); //获取传入参数的id
        reqwest({
            url:'/console/energyOverviewSingleuser/getLoadCurve',
            method:"GET",
            credentials:'include',
            data:{
                LoadCurveUnit:value,
                id : id,
            }
        }).then((data)=>{
            var ds=eval('('+data+')');
            console.log('返回的数据是========',ds[0].size);
            let dataNum =[];
            let dataDay1=[];
            if( value==="1"){
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
            var  loadPro = echarts.init(document.getElementById('loadPro'));
            window.addEventListener("resize",function(){
                loadPro.resize();
            });
            // window.onresize = loadPro.resize;
            loadPro.setOption({
                xAxis: {
                    type: 'category',
                    data : dataNum
                    // data: ['00:00', '00:30', '01:00', '01:30', '02:00']

                },
                yAxis: {
                    type: 'value',
                    splitLine:{
                        show:true,
                        lineStyle:{
                            type:'dashed'
                        }
                    }

                },
                tooltip: {
                    trigger: 'axis'
                },
                series: [{
                    data : dataDay1,
                    // data: [70, 20, 90, 30,50],
                    type: 'line',
                    smooth: true,
                    itemStyle : {
                        normal : {
                            lineStyle:{
                                color:'#3090FF'
                            }
                        }
                    },
                }],

            })

        })

    }


    getCalorimetric= (value) => {
        // getElectricalPowerCost
        let id=  this.getInitState1(); //获取传入参数的id
        reqwest({
            url:'/console/energyOverviewSingleuser/getElectricalPowerCost',
            method:"GET",
            credentials:'include',
            data:{
                dateValue : value,
                id :id,
            }
        }).then((data)=> {
            var ds = eval('(' + data + ')');
            console.log('返回的数据是', value);
            let dataNum =[];
            let dataDay1=[];
            if( value==="1"){
                for (var i=0;i<ds[0].result.length;i++) {
                    dataDay1.push(
                        ds[0].result[i].num,
                    )
                }
                dataNum =[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
            }
            if( value==="2"){
                for (var i=0;i<ds[0].result.length;i++) {
                    dataDay1.push(
                        ds[0].result[i].num,
                    )
                }
                dataNum =[1,2,3,4,5,6,7,8,9,10,11,12];
            }


            var  Calorimetric = echarts.init(document.getElementById('Calorimetric'));
            window.addEventListener("resize",function(){
                Calorimetric.resize();
            });
            // window.onresize = Calorimetric.resize;
            Calorimetric.setOption({
                xAxis: {
                    type: 'category',
                    data : dataNum

                    // data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

                },
                yAxis: {
                    type: 'value',
                    splitLine:{
                        show:true,
                        lineStyle:{
                            type:'dashed'
                        }
                    }
                },
                tooltip: {
                    trigger: 'axis'
                },
                series: [{
                    // data : dataDay1,
                    data :  [ ],
                    // data: [20, 30,50, 90,50,20,5,58,80,99],

                    type: 'line',
                    smooth: true,
                    itemStyle : {
                        normal : {
                            lineStyle:{
                                color:'#FF9E66'
                            }
                        }
                    },
                }],
            })



        })



    }



    getIncomeControl(value){
        let id=  this.getInitState1(); //获取传入参数的id
        reqwest({
            url:'/console/energyOverviewSingleuser/getIncomeControl',
            method:"GET",
            credentials:'include',
            data:{
                IncomeUnit:value,
                id : id,
            }
        }).then((data)=> {
            var ds = eval('(' + data + ')');
            console.log('返回的数据是aaa', value);
            let dataNum =[];
            let dataDay1=[];
            if( value==="1"){
                console.log('判断aaa',value);
                for (var i=0;i<ds[0].result.length;i++) {
                    dataDay1.push(
                        ds[0].result[i].profitEsMgmt,
                    )
                }
                dataNum =[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
            }
            if( value==="2"){
                for (var i=0;i<ds[0].result.length;i++) {
                    dataDay1.push(
                        ds[0].result[i].profitEsMgmt,
                    )
                }
                dataNum =[1,2,3,4,5,6,7,8,9,10,11,12];
            }

            var  IncomeControl = echarts.init(document.getElementById('IncomeControl'));
            // window.onresize = IncomeControl.resize;
            window.addEventListener("resize",function(){
                IncomeControl.resize();
            });
            IncomeControl.setOption({
                color: ['#3398DB'],
                // tooltip : {
                //     trigger: 'axis',
                //     // axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                //     //     type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                //     // }
                // },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        data : dataNum,
                        // data : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        axisTick: {
                            alignWithLabel: true
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        splitLine:{
                            show:true,
                            lineStyle:{
                                type:'dashed'
                            }
                        }
                    }
                ],
                series : [
                    {
                        name:'直接访问',
                        type:'bar',
                        barWidth: '60%',
                        data :dataDay1,
                        // data:[10, 52, 200, 334, 390, 330, 220,10, 52, 200, 334, 390, 330, 220]
                    }
                ]
            })

        })

    }



    //分项能耗占比
    getEnergyRatio= (value) => {
        let id =  this.getInitState1(); //获取传入参数的id
        reqwest({
            url:'/console/energyOverviewSingleuser/getEnergyRatio',
            method:"GET",
            credentials:'include',
            data:{
                dateValue:value,
                id: id,
            }
        }).then((data)=>{
            var ds=eval('('+data+')');
            this.setState({
                HeatingValue : 0,
                lightingValue : 0,
                dynamicValue : 0,
                specialValue :0,

                // HeatingValue : ds[0].Heating,
                // lightingValue : ds[0].lighting,
                // dynamicValue : ds[0].dynamic,
                // specialValue :ds[0].special
            })

        })

    }


    //电量及电费 尖峰平谷 年月日
    onChangeElectricityBill=(value)=> {
        console.log("电量及电费时间单位是", value.target.value);
        this.getEcharts(value.target.value);
    };



    // 负荷曲线  日月年
    onChangeTimeloadPro=(value)=> {
        console.log("负荷曲线时间单位是", value.target.value);
        this.getLoadCurve(value.target.value);
    };
    // 管控收益 曲线
    onChangeIncomeControl=(value)=> {
        console.log("负荷曲线时间单位是", value.target.value);
        this.getIncomeControl(value.target.value);
    }
    //度电成本 曲线
    onChangeGetElectricalPowerCost=(value)=> {
        console.log("度电成本时间单位是", value.target.value);
        this.getCalorimetric(value.target.value)
    }

    // 分项能耗  日月年
    onChangeTimeEnergyCost=(value)=> {
        console.log("分项能耗时间单位是", value.target.value);
        this.getEnergyRatio(value.target.value);
    };




    //查询 当前登陆账号下 的 执行 和未执行
    querySystemProcessedUser= (event) => {
        let id =  this.getInitState1(); //获取传入参数的id
        reqwest({
            url:'/console/energyOverviewSingleuser/querySystemProcessedUser',
            method:"GET",
            credentials:'include',
            data:{
                eventStatus:event,
                id: id,
            }
        }).then((data)=>{
            var ds=eval('('+data+')');


            let arry1=[];
            if(ds[0].result !== null){
                for (var i=0;i<ds[0].result.length;i++){

                    if(ds[0].result[i].eventStatus === 10){

                        arry1.push(
                            <Col span={4} >
                                    <span style={{ marginTop: "4%" ,marginLeft:"12%" ,float:'left'}} className="span">
                                        <p className="spanTitleRed"><p className="spanfirstTitle "  style={{marginLeft:10 ,marginTop:0 }}> {ds[0].result[i].ceResName}</p> </p>
                                        <p className=" spanTime" style={{marginLeft:10 ,marginTop:-10 }}>{ds[0].result[i].eventTimeDate} &nbsp;&nbsp;&nbsp;{ds[0].result[i].eventTimeTime}</p>
                                        <p className="spanDetailed" style={{marginLeft:10,marginRight:10 ,marginTop:-10}}>
                                            {ds[0].result[i].cePointName}晚于停用时间运行
                                        </p>
                                        <p className="spanProRed" style={{marginLeft:80,marginTop:-5 ,cursor:"pointer"}}> </p>

                                        <p className="spanProRedFont" style={{marginLeft:92,marginTop:-42 ,cursor:"pointer"}} onClick={this.editModal.bind(this, ds[0].result[i].orgNo+","+ds[0].result[i].orgName+","+ds[0].result[i].cePointName
                                            +","+ds[0].result[i].cePointId+","+ds[0].result[i].id+","+ds[0].result[i].handleTimeValue+","+ds[0].result[i].handler)} >未执行</p>

                                       </span>
                            </Col>
                        )

                    }else if(ds[0].result[i].eventStatus === 30){
                        arry1.push(
                            <Col span={4}>
                                      <span style={{ marginTop: "4%" ,marginLeft:"12%" ,float:'left'}} className="span">
                                        <p className="spanTitleGreen "> <p className="spanfirstTitle "  style={{marginLeft:10 ,marginTop:0 }}> {ds[0].result[i].ceResName}</p> </p>
                                         <p className=" spanTime" style={{marginLeft:10 ,marginTop:-10}}>{ds[0].result[i].eventTimeDate} &nbsp;&nbsp;&nbsp;{ds[0].result[i].eventTimeTime}</p>
                                        <p className="spanDetailed" style={{marginLeft:10,marginRight:10 ,marginTop:-10 }}>
                                           {ds[0].result[i].cePointName}&nbsp;&nbsp;&nbsp;晚于停用时间运行
                                        </p>
                                        <p className="spanProGreen"  style={{marginLeft:80,marginTop:-5 ,cursor:"pointer" }} ></p>
                                          <p className="spanProRedFont" style={{marginLeft:92,marginTop:-42, cursor:"pointer"}}  onClick={this.detailsModal.bind(this, ds[0].result[i].orgNo+","+ds[0].result[i].orgName+","+ds[0].result[i].cePointName
                                              +","+ds[0].result[i].cePointId+","+ds[0].result[i].id+","+ds[0].result[i].handleTimeValue+","+ds[0].result[i].handler+","+ds[0].result[i].handleDesc+","+ds[0].result[i].handleSugst+","+ds[0].result[i].handleWorkorderNo)}>已执行</p>

                                        </span>
                            </Col>

                        )
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
            eventId : Str[4],
            handleTimeValue : Str[5],
            handle : Str[6],
            siteExecutionRecord : Str[7], // 现场管理记录
            adviceValue :   Str[8], //建议
            taskNo :  Str[9], //工单号

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
            eventId : Str[4],
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
                    eventId:this.state.eventId,
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
                        console.log(" 确定1111");

                        this.querySystemProcessedUser(null);
                    }
                    if(this.state.processeStatus ===2){
                        console.log(" 确定2222");
                        this.querySystemProcessedUser(10);
                    }
                    if(this.state.processeStatus ===3){
                        console.log(" 确定3333");
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


    render() {


        return (
            <div className="div-body" >
                <div className="div-page" >
                    <Row>
                        <Col span={8} >
                            <Card style={{marginLeft:24 ,height: 430 ,marginTop: 10 }} bodyStyle={{padding: "0"}}>
                                <p className="madalFont" style={{marginLeft:10,marginTop: 11 }}>基本信息</p>
                                <Row>
                                    <Col span={12} ><img  src={ this.state.orgNoS ==="1200000007"? tushengkeji : gongsimoren  } style={{marginLeft:20 ,width:"90%",height:200,marginTop: -10}}  alt="" /></Col>
                                    <Col span={12} >
                                        <Col span={6}>
                                            <span ><img src={transformer} style={{marginLeft:20 ,width:"90%",height:"90%",marginTop: 16}}  alt="" /> </span>
                                        </Col>
                                        <Col span={18} style={{marginTop: 26}}>
                                            <span style={{marginLeft:'15%',}} className="transformerFont">{this.state.transformerValue}</span>
                                            <span style={{marginLeft:'1%',marginTop: -5}}>（kVA）</span>
                                        </Col>
                                        <Col span={24} style={{marginLeft:25 ,marginTop: 5}}>
                                            <span style={{marginTop: 5}} >变压器容量</span>
                                        </Col>
                                    </Col>
                                </Row>

                                {/* style={{height:"140px"}}
                                 */}
                                <Row>
                                    <Col span={12}>

                                        <Col ><span ><img src={adressName} style={{marginLeft:20 ,width:"16px",height:"16px",marginTop: 26}}  alt="" /> </span>
                                            <span><p className="addressFont" style={{marginLeft:46 ,marginTop: -20 }}>{this.state.userName}</p></span>
                                        </Col>


                                        <Col><span ><img src={adressIndustry} style={{marginLeft:20 ,width:"16px",height:"16px",marginTop: 10}}  alt="" /> </span>
                                            <span><p className="addressFont" style={{marginLeft:46 ,marginTop: -20}}>{this.state.userType}</p></span>
                                        </Col>

                                        <Col><span ><img src={adress} style={{marginLeft:20 ,width:"16px",height:"16px",marginTop: 10}}  alt="" /> </span>
                                            <span><p  className="addressFont" style={{marginLeft:46 ,marginTop: -20 }}>{this.state.userAddress}</p></span>

                                        </Col>


                                    </Col>
                                    <Col span={12}>
                                        <Col span={6}>
                                            <span ><img src={controlBenefits} style={{marginLeft:20 ,width:"100%",height:"100%",marginTop: "0%"}}  alt="" /> </span>
                                        </Col>
                                        <Col span={18} style={{marginTop: 36}}>
                                            <span style={{marginLeft:35,}} className="transformerFont">{this.state.controlBenefits}</span>
                                            <span style={{marginLeft:10,marginTop: -5}}>（元）</span>
                                        </Col>
                                        <Col span={24} style={{marginLeft:25 ,marginTop: 5}} >
                                            <span style={{marginTop: 5}} >管控收益</span>
                                        </Col>
                                    </Col>
                                </Row>
                            </Card>
                        </Col>
                        <Col span={16}>
                            <Col span={24}>

                                <Card  style={{marginLeft:10 ,marginRight:24 ,height: 160 ,marginTop: 10 }} bodyStyle={{padding: "0"}}>
                                    <p className="madalFont" style={{marginLeft:10,marginTop: 11 }}>用能概况</p>
                                    <Col span={7} style ={{ marginLeft:"1%",marginTop: -10}}>
                                        <Row >
                                            <Col span={12}><p className="electricityTodayFont">今日用电</p></Col>
                                            <Col span={12}><p className="electricityTodayFont">碳排放</p></Col>
                                        </Row>
                                        <Row >
                                            <Col span={10}><p style={{float:'left',marginTop: -10}} className={this.state.fontSizeS}>{this.state.resultDay}</p> <p style={{float:'left',marginLeft:"10%",marginTop: "-5%"}} className="electricityTodayFont">kWh</p></Col>
                                            <Col span={10}><p style={{float:'left',marginTop: -10 ,marginLeft:'25%'}} className={this.state.fontSizeS}>{this.state.carbonResultDay}</p> <p style={{float:'left',marginLeft:"15%",marginTop: "-5%"}} className="electricityTodayFont">吨</p></Col>
                                            <Col span={4}> <Col  style={{float:'left',marginTop: -10}} className="percentage"> <p adjustsFontSizeToFit={true}  style={{marginTop:'10%',textAlign: 'center'  }} className="percentageFont">{this.state.PercentageDay}</p></Col></Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}><p style={{float:'left',marginTop: "-2%" }} className="electricityTodayFont">昨日同期用电：</p>
                                                <p style={{float:'left',marginTop:  "-3%"}} className="electricityYesTodayValue">{this.state.yesterday}</p> <p style={{float:'left',marginLeft:10,marginTop: "-1.5%"}} className="electricityTodayFont">kWh</p>
                                            </Col>
                                        </Row>
                                    </Col>


                                    {/*               <Col>
                                     <div style={{float:'left',width: '2px',height: '140px',marginTop: -58, background: '#000',}}></div>

                                     </Col>*/}

                                    <Col span={7} style ={{ marginLeft:"2%",marginTop: -10}}>
                                        <Row >
                                            <Col span={12}><p className="electricityTodayFont">当月用电</p></Col>
                                            <Col span={12}><p className="electricityTodayFont">碳排放</p></Col>
                                        </Row>
                                        <Row >
                                            <Col span={10}><p style={{float:'left',marginTop: -10}} className={this.state.fontSizeS}>{this.state.resultMonth}</p> <p style={{float:'left',marginLeft:"10%",marginTop: "-5%"}} className="electricityTodayFont">kWh</p></Col>
                                            <Col span={10}><p style={{float:'left',marginTop: -10 ,marginLeft:'25%'}} className={this.state.fontSizeS}>{this.state.carbonResultMonth}</p> <p style={{float:'left',marginLeft:"15%",marginTop:"-5%"}} className="electricityTodayFont">吨</p></Col>
                                            <Col span={4}> <Col  style={{float:'left',marginTop: -10}} className="percentage"> <p style={{marginTop:'10%',textAlign: 'center' }} className="percentageFont">{this.state.PercentageMonth}</p></Col></Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}><p style={{float:'left',marginTop: "-2%"}} className="electricityTodayFont">上月同期用电：</p>
                                                <p style={{float:'left',marginTop:  "-3%"}} className="electricityYesTodayValue">{this.state.lastMonth}</p> <p style={{float:'left',marginLeft:10,marginTop: "-1.5%"}} className="electricityTodayFont">kWh</p>
                                            </Col>
                                        </Row>

                                    </Col>


                                    <Col span={7} style ={{ marginLeft:"2%",marginTop: -10}}>
                                        <Row >
                                            <Col span={12}><p className="electricityTodayFont">当年用电</p></Col>
                                            <Col span={12}><p className="electricityTodayFont">碳排放</p></Col>
                                        </Row>
                                        <Row >
                                            <Col span={10}><p style={{float:'left',marginTop: -10}} className={this.state.fontSizeS}>{this.state.resultyear}</p> <p style={{float:'left',marginLeft:"10%",marginTop:"-5%"}} className="electricityTodayFont">kWh</p></Col>
                                            <Col span={10}><p style={{float:'left',marginTop: -10 ,marginLeft:'25%'}} className={this.state.fontSizeS}>{this.state.carbonResultyear}</p> <p style={{float:'left',marginLeft:"15%",marginTop: "-5%"}} className="electricityTodayFont">吨</p></Col>
                                            <Col span={4}> <Col  style={{float:'left',marginTop: -10}} className="percentage"> <p style={{marginTop:'10%',textAlign: 'center' }} className="percentageFont">{this.state.PercentageYear}</p></Col></Col>
                                        </Row>
                                        <Row>
                                            <Col span={24}><p style={{float:'left',marginTop:  "-2%"}} className="electricityTodayFont">去年同期用电：</p>
                                                <p style={{float:'left',marginTop:  "-3%"}} className="electricityYesTodayValue">{this.state.lastYear}</p> <p style={{float:'left',marginLeft:10,marginTop: "-1.5%"}} className="electricityTodayFont">kWh</p>
                                            </Col>
                                        </Row>

                                    </Col>

                                </Card>
                            </Col>
                            <Col span={12}>
                                <Card  style={{height: 260 ,marginLeft:12,marginTop: 10 }} bodyStyle={{padding: "0"}}>
                                    <Row>

                                        <Col span={ 13} style={{float:'left',marginLeft:10,marginTop: 11 }}>
                                            <p  className="madalFont" >电量及电费情况</p>
                                        </Col>
                                        <Col span={ 9} style={{float:'right',marginTop: 11}}>
                                            <p style={{float:'right',marginRight: 20}}>
                                                <Radio.Group defaultValue="1"  onChange={this.onChangeElectricityBill}  size="small" >
                                                    <Radio.Button value="1">日</Radio.Button>
                                                    <Radio.Button value="2">月</Radio.Button>
                                                    <Radio.Button value="3">年</Radio.Button>
                                                </Radio.Group>
                                            </p>

                                        </Col>
                                    </Row>

                                    <Col span={12}>
                                        <div  id="ElectricityBill" style={{ float:'left',width:"100%",height:200 }}  >  </div>
                                    </Col>
                                    <Col span={12} style={{ float:'left',marginTop: "-2%", marginLeft:"-5%"}}  >
                                        <Row><Col span={12}> <p className="ElectricityBillFont"style={{marginTop: 7 }}>{this.state.econsValue1}（kWh）</p>  </Col>
                                            <Col span={12} style={{marginTop: 7 }} > 0.00（元） </Col>
                                        </Row>
                                        <Row><Col span={12}> <p className="ElectricityBillFont" style={{marginTop: -5 }}>{this.state.econsValue2}（kWh）</p>  </Col>
                                            <Col span={12} style={{marginTop: -5 }}> 0.00（元） </Col>
                                        </Row>
                                        <Row><Col span={12}> <p className="ElectricityBillFont" style={{marginTop: -7 }}> {this.state.econsValue3}（kWh）</p>  </Col>
                                            <Col span={12} style={{marginTop: -7 }}>0.00（元） </Col>
                                        </Row>
                                        <Row><Col span={12}> <p className="ElectricityBillFont"  style={{marginTop: -5 }}> {this.state.econsValue4}（kWh）</p>  </Col>
                                            <Col span={12} style={{marginTop: -5 }}>0.00（元）  </Col>
                                        </Row>
                                    </Col>

                                </Card>
                            </Col>

                            <Col span={12}>
                                <Card  style={{marginRight:24 ,height: 260 ,marginLeft:12,marginTop: 10 }} bodyStyle={{padding: "0"}}>
                                    <Row>
                                        <Col span={ 13} style={{float:'left',marginLeft:10,marginTop: 11 }}>
                                            <p className="madalFont" >分项能耗占比</p>
                                        </Col>
                                        <Col span={9} style={{float:'right',marginTop: 11}}>
                                            <p style={{float:'right' ,marginRight :20 }}>
                                                <Radio.Group  defaultValue="1"  onChange={this.onChangeTimeEnergyCost}   size="small" >
                                                    <Radio.Button value="1">日</Radio.Button>
                                                    <Radio.Button value="2">月</Radio.Button>
                                                    <Radio.Button value="3">年</Radio.Button>
                                                </Radio.Group>
                                            </p>

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={5} style={{float:'left',marginLeft:"8%",marginTop: 0 }}>
                                            <p className="progressFont" >暖通用电</p>
                                        </Col>
                                        <Col span={15} style={{float:'left',marginTop: 0}}>
                                            <Progress
                                                strokeColor={{
                                                    '0%': '#0fe90b',
                                                    '100%': '#d00a20',
                                                }}
                                                percent={this.state.HeatingValue}
                                            />
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col span={5} style={{float:'left',marginLeft:"8%",marginTop: 0 }}>
                                            <p className="progressFont" >照明插座</p>
                                        </Col>
                                        <Col span={15} style={{float:'left',marginTop: 0}}>
                                            <Progress
                                                strokeColor={{
                                                    '0%': '#0fe90b',
                                                    '100%': '#d00a20',
                                                }}
                                                percent={this.state.lightingValue}
                                            />
                                        </Col>
                                    </Row>

                                    <Row style={this.state.electricityStyle1}>
                                        <Col span={5} style={{float:'left',marginLeft:"8%",marginTop: 0 }}>
                                            <p className="progressFont" >动力用电</p>
                                        </Col>
                                        <Col span={15} style={{float:'left',marginTop: 0}}>
                                            <Progress
                                                strokeColor={{
                                                    '0%': '#0fe90b',
                                                    '100%': '#d00a20',
                                                }}
                                                percent={this.state.dynamicValue}
                                            />
                                        </Col>
                                    </Row>

                                    <Row style={this.state.electricityStyle1}>
                                        <Col span={5} style={{float:'left',marginLeft:"8%",marginTop: 0 }}>
                                            <p className="progressFont" >特殊用电</p>
                                        </Col>
                                        <Col span={15} style={{float:'left',marginTop: 0}}>
                                            <Progress
                                                strokeColor={{
                                                    '0%': '#0fe90b',
                                                    '100%': '#d00a20',
                                                }}
                                                percent={this.state.specialValue}
                                            />
                                        </Col>
                                    </Row>
                                </Card>
                            </Col>

                        </Col>
                    </Row>
                    <Row>
                        <Col span={8}>
                            <Card  style={{ marginLeft:24 , height: 245 ,marginTop: 12 }} bodyStyle={{padding: "0"}}>
                                <Row>
                                    <Col span={ 13} style={{float:'left',marginLeft:10,marginTop: 11 }}>
                                        <p className="madalFont" >负荷曲线</p>
                                    </Col>

                                    <Col span={ 9} style={{float:'right',marginTop: 11}} className="position">
                                        <p  style={{float:'right' ,marginRight :20 }}>
                                            <Radio.Group  defaultValue="1"  onChange={this.onChangeTimeloadPro} size="small">
                                                <Radio.Button value="1">日</Radio.Button>
                                                <Radio.Button value="2">月</Radio.Button>
                                                <Radio.Button value="3">年</Radio.Button>
                                            </Radio.Group>
                                        </p>

                                    </Col>

                                </Row>
                                <Row>
                                    <Col span={ 24}>
                                        <div span={ 24}  id="loadPro" style={{width:"100%",height:250,marginTop: -50 }}  >  </div>
                                    </Col>
                                </Row>

                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card  style={{height: 245 ,marginLeft:12,marginTop: 12}} bodyStyle={{padding: "0"}}>

                                <Row>
                                    <Col span={ 15} style={{float:'left',marginLeft:10,marginTop: 11 }}>
                                        <p className="madalFont" >度电成本</p>
                                    </Col>
                                    <Col span={7} style={{float:'right',marginTop: 11}} className="position">
                                        <p style={{float:'right' ,marginRight :20 }}>
                                            <Radio.Group defaultValue="1"   onChange={this.onChangeGetElectricalPowerCost}  size="small">
                                                <Radio.Button value="1">月</Radio.Button>
                                                <Radio.Button value="2">年</Radio.Button>
                                            </Radio.Group>
                                        </p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={ 24}>
                                        <div span={ 24}  id="Calorimetric" style={{width:"100%",height:250,marginTop: -50 }}  >  </div>
                                    </Col>
                                </Row>


                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card  style={{marginRight:24 ,height: 245 ,marginLeft:12,marginTop: 12 }} bodyStyle={{padding: "0"}}>

                                <Row>
                                    <Col span={ 15} style={{float:'left',marginLeft:10,marginTop: 11 }}>
                                        <p className="madalFont" >管控收益趋势</p>
                                    </Col>
                                    <Col span={7} style={{float:'right',marginTop: 11}} className="position">
                                        <p style={{float:'right' ,marginRight :20 }}>
                                            <Radio.Group  defaultValue="1"   onChange={this.onChangeIncomeControl}  size="small" >
                                                <Radio.Button value="1">月</Radio.Button>
                                                <Radio.Button value="2">年</Radio.Button>
                                            </Radio.Group>
                                        </p>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={ 24}>
                                        <div span={ 24}  id="IncomeControl" style={{width:"100%",height:250,marginTop: -65 }}  >  </div>
                                    </Col>
                                </Row>

                            </Card>
                        </Col>
                    </Row>

                    <Col span={24} style={this.state.electricityStyle1}>
                        <Card  style={{ marginLeft:24 , height: 245 ,marginRight:24 }} bodyStyle={{padding: "0"}} >
                            <Row>
                                <Col span={12}>
                                    <Col span={8} style={{ marginTop: 10 ,marginLeft:10 ,float:'left'}}>
                                       <span className="madalFont">
                                           用能管控执行统计
                                       </span>
                                    </Col>
                                    <Col span={1} style={{marginTop: 13 ,marginLeft:10 ,float:'left'}}>
                                        <p  style={{height:'16px',width:'16px'}} className=" classColorGreen" > </p>
                                    </Col>
                                    <Col span={2} style={{marginTop:10 ,float:'left' ,cursor:"pointer"}} onClick={this.onClickProcessed}>已执行 </Col>
                                    <Col  span={4} style={{marginTop:10 ,float:'left' ,fontSize:16}} className="greenFont"> {this.state.processed}</Col>
                                    <Col span={1} style={{marginTop: 13 ,marginLeft:10 ,float:'left'}}>
                                        <p  style={{height:'16px',width:'16px'}} className=" classColorRed" > </p>
                                    </Col>
                                    <Col span={2} style={{marginTop:10 ,float:'left', cursor:"pointer" }} onClick={this.onClickNotProcessed}>未执行</Col>
                                    <Col span={4} style={{marginTop:10 ,float:'left',fontSize:16}} className="redFont"  > {this.state.notProcessed}</Col>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    {this.state.systemProcessedUser}

                                </Col>
                            </Row>

                        </Card>
                    </Col>

                    <Modal
                        className = "position1"
                        style={{top: 26, height:800 }}
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
                                            <span style={{marginLeft:"10%",lineHeight:'34px',float:'left'}}><Input placeholder="Basic usage" defaultValue={this.state.cePointName} disabled="false"/></span></Col>
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
                                    <TextArea placeholder="请填写现场管理的执行记录"  autosize={{ minRows: 2, maxRows: 6 }}  onChange={this.handle_siteExecutionRecord.bind(this)} defaultValue={this.state.siteExecutionRecord} disabled= {this.state.details} />

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
                                    <TextArea placeholder="填写你的建议" autosize={{ minRows: 2, maxRows: 6 }}  onChange={this.handle_sugst.bind(this)}  defaultValue={this.state.adviceValue} disabled= {this.state.details}/>

                                </span></Col>
                                    </Col>
                                </Row>

                            </Card>

                        </div>
                    </Modal>

                </div>
            </div>

        )
    }


}

// export default EnergyOverviewSingleuser;
//
// ReactDOM.render(<EnergyOverviewSingleuser/>, document.getElementById("root"));


ReactDOM.render(
    <EnergyOverviewSingleuser />,
    document.getElementById('root')
)