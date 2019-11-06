import  React,{Component}from 'react';
import  ReactDOM from 'react-dom';
import {Select,Row, Col,Radio ,Input,Icon, Layout,Menu, Progress ,AutoComplete } from 'antd';
// import { Player } from 'video-react';
import ReactPlayer from 'react-player'
import './css/VideoMonitor.css';
import reqwest from 'reqwest';
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/dataZoom";
import "echarts/lib/component/markPoint";
import "echarts/lib/component/legend";
import { Map,Markers } from 'react-amap';
import './css/HomePage.css';
import Select1 from 'react-select';
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Search } = Input;
const { Option, OptGroup } = AutoComplete;
// const { Option } = Select;
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

const options = [
    { value: '1', label: '热' },
    { value: '2', label: '汽' },
    { value: '3', label: '电' },
    { value: '4', label: '水' },
    { value: '5', label: '气' },
];

class HomePage  extends Component{
    state = {
        markers : [ ],
         // markers : [ {position:{longitude: 120.123126, latitude: 30.280719}} ,{position:{ longitude: 120.112483, latitude:35.2928}},
         //     {position:{longitude: 120.127975, latitude: 30.275382,}},{position:{longitude: 120.115444, latitude: 30.276605}}],
        /*-------*/
        // UserSizeData=[
        //     ds[0].UserSizeMap.is_enable_heat,ds[0].UserSizeMap.is_enable_steam,
        //     ds[0].UserSizeMap.is_enable_elec,ds[0].UserSizeMap.is_enable_water
        //     ,ds[0].UserSizeMap.is_enable_gas
        // ]

        is_enable_heat : 0 , //用热用户数
        is_enable_steam : 0 , // 用汽用户数
        is_enable_elec : 0 , //用电用户数
        is_enable_water : 0 , //用水用户数
        is_enable_gas : 0 , //用气用户数
        UserNumber:0,  //用户总数
        translation : 0 , // 热力站 数量
        dataUserName : [],  // 地图搜索框
        mapCenter : '',  // 地图上的 定位

        ce_cust_type : '1', // 地图默认类型为1   全部用户
        EnergyData : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31],
        selectedOption: 1,  // 用能趋势  电 热  水 汽 气 选择的值
        selectDateEnergy : 1 , // 用能趋势 选择的月或年   默认显示月 1  年是2
        selectedOptionEnergy:1, //用能趋势

        RechargeUnit :   1, // 默认为3 返回的数据 全查询 1 是 查 月 2 是查询年   充值消费规模曲线


        resultNum: 0 , //未处理告警数
        resultMonthNum: 0 , //本月告警数
        rechargeNum: 0,   // 充值告警数
        arrearsNum:  0 , //欠费告警数
        LimitNum: 0,   //越限预警数
        newsletterNum: 0,  //通讯故障数

        TerminalOnlineNum: 0 , //终端总数
        onLineNum: 0    ,     //终端在线数
        percentage : 0 ,   //终端在线百分比

    };
    //   加载页面时 触发
    componentDidMount() {
         // this.getVideoMonitorList();
        this.getUserSizeEcharts();  //用户规模
        this.getEnergyUseTrendsEcharts(); //用能趋势 曲线图
        //充值与结算 曲线
        this.getRechargeScale();  //充值规模
        this.getSettlementScale();//结算规模
        this.getWarningSituationEcharts()  //告警情况
        this.getUserMap();  //地图点
        this.Terminal(); //终端在线情况




    };


    //查询地图上用户的点
    getUserMap= () => {
        reqwest({
            url:'/console/homePage/queryMapRegion',
            method:"GET",
            credentials:'include',
        }).then((data)=>{
            var ds=eval('('+data+')');

            let arry=[];
            let arry1=[];
            if(ds[0].result !== null){
                for (var i=0;i<ds[0].result.length;i++){
                    if(this.state.ce_cust_type === '1'){
                        arry.push( {position:{longitude: ds[0].result[i].longitude, latitude:ds[0].result[i].latitude ,num : ds[0].result[i].num,id : ds[0].result[i].id ,username : ds[0].result[i].neighborhoodName}} , )
                        arry1.push( <option key={ds[0].result[i].longitude +","+ds[0].result[i].latitude}>{ds[0].result[i].neighborhoodName}</option>,)
                    }

                    if(this.state.ce_cust_type === '2'){
                        if(ds[0].result[i].enableElec === true ||  ds[0].result[i].enableGas === true ||  ds[0].result[i].enableHeat === true ||
                            ds[0].result[i].enableSteam === true || ds[0].result[i].enableWater === true
                        ){
                            arry.push( {position:{longitude: ds[0].result[i].longitude, latitude:ds[0].result[i].latitude ,num : ds[0].result[i].num,id : ds[0].result[i].id ,username : ds[0].result[i].neighborhoodName}} , )
                            arry1.push( <option key={ds[0].result[i].longitude +","+ds[0].result[i].latitude}>{ds[0].result[i].neighborhoodName}</option>,)
                        }
                    }
                    if(this.state.ce_cust_type === '3'){
                        if(ds[0].result[i].ce_cust_type === 41){
                            arry.push( {position:{longitude: ds[0].result[i].longitude, latitude:ds[0].result[i].latitude ,num : ds[0].result[i].num,id : ds[0].result[i].id ,username : ds[0].result[i].neighborhoodName}} , )
                            arry1.push( <option key={ds[0].result[i].longitude +","+ds[0].result[i].latitude}>{ds[0].result[i].neighborhoodName}</option>,)
                        }

                    }
                }

                this.setState({
                    // mapCenter : {longitude: ds[0].result[i].longitude, latitude: ds[0].result[i].latitude},  // 地图上的 定位
                    dataUserName : arry1,
                    markers :arry,
                })

            }
            // this.markers =[ {position:{longitude: 120.123126, latitude: 30.280719}} ,{position:{ longitude: 120.112483, latitude:35.2928}},
            //     {position:{longitude: 120.127975, latitude: 30.275382,}},{position:{longitude: 120.115444, latitude: 30.276605}}],
            //     this.mapCenter = {longitude: 120.123126, latitude: 30.280719};
        })
    }



    handleChangeHead=(value)=>{

        this.setState({
            ce_cust_type :  value ,
        })

        this.getUserMap();

}

    /**
     * 地图搜索
     * @param value
     */
    handleSearch=(value)=>{
        this.setState({
            fuzzyPointName:value,
            selectPointName:'',
        })

    }

    onSelect=(value)=>{
        let jwd = value.split(",");
        let longitude = jwd[0];
        let latitude = jwd[1];
        console.log("近卫笃是", longitude,latitude );
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




    // 组件文档 https://elemefe.github.io/react-amap/components/about
    constructor(props) {
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
                // this.resize.bind(this);
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
                marker.render(this.renderMarker);
            }
        }
    }


    //点击了地图上的标记跳转页面
    jumpPage=(marker)=>{
        const extData = marker.getExtData().position;
        console.log("点击了图标的经纬度是 哈哈哈哈哈哈哈哈哈哈哈哈哈哈",extData.username);



    }


    //鼠标移入时触发的 显示的
    renderMarkerHover(extData){

        console.log("传入的参数是"+extData,extData );
        return <div style={styleB}><div style={{width: 200, height: 5,float:'left',fontSize:20,color:"red" }}><p>用户数：{extData.num}</p></div></div>;

    }
    //鼠标移出时触发的 显示的
    renderMarker(extData){

        return <div style={styleB}></div>
    }



    //自定义地图标记点图标 红色
    renderMarkerLayout(){
        return <div style={styleB}> </div>
    }

    //饼装 用户数
    getUserSizeEcharts= () => {
        let  UserSizeData= [];
        reqwest({
            url:'/console/homePage/queryUserSizeMap',
            method:'GET',
            credentials:'include',
            data:{
                // userName:userName,
                // userAddr:userAddr,
            }
        }).then((data)=> {
            var ds = eval('(' + data + ')');
            if (ds[0].UserSizeMap.size !== null) {
                // UserSizeData=[
                //     ds[0].UserSizeMap.is_enable_heat,ds[0].UserSizeMap.is_enable_steam,
                //     ds[0].UserSizeMap.is_enable_elec,ds[0].UserSizeMap.is_enable_water
                //     ,ds[0].UserSizeMap.is_enable_gas
                // ]
                UserSizeData=[
                    {value:ds[0].UserSizeMap.is_enable_heat,name:'供热' },
                    {value:ds[0].UserSizeMap.is_enable_steam,name:'供汽' },
                    {value:ds[0].UserSizeMap.is_enable_elec,name:'供电' },
                    {value:ds[0].UserSizeMap.is_enable_water,name:'供水' },
                    {value:ds[0].UserSizeMap.is_enable_gas,name:'供气' },
                    ]
                let NumSum =0;
                // if(){}
                this.setState({
                    is_enable_heat : ds[0].UserSizeMap.is_enable_heat , //用热用户数
                    is_enable_steam : ds[0].UserSizeMap.is_enable_steam , // 用汽用户数
                    is_enable_elec : ds[0].UserSizeMap.is_enable_elec , //用电用户数
                    is_enable_water : ds[0].UserSizeMap.is_enable_water , //用水用户数
                    is_enable_gas : ds[0].UserSizeMap.is_enable_gas , //用气用户数

                    // UserNumber : ds[0].UserSizeMap.is_enable_heat+ds[0].UserSizeMap.is_enable_steam+ds[0].UserSizeMap.is_enable_elec+
                    //     ds[0].UserSizeMap.is_enable_water+ds[0].UserSizeMap.is_enable_gas ,
                    UserNumber : ds[0].UserSizeMap.num,
                    translation : ds[0].UserSizeMap.translation  // 热力站
                })
            }
            /*开始*/
            let UserSizeEcharts = echarts.init(document.getElementById('UserSizeEcharts'));
            window.addEventListener("resize",function(){
                UserSizeEcharts.resize();
            });
            UserSizeEcharts.setOption({
                tooltip: {
                    show:false
                },
                // tooltip: {
                //     trigger: 'item',
                //     formatter: "{a} <br/>{b}: {c} ({d}%)"
                // },
                color:['#FF5E32','#FF9966','#4086FF','#3FE5FF','#54FF35'],
                legend: {
                    orient: 'vertical',
                    x: '80%',
                    y: '25%',
                    itemWidth :24,
                    itemHeight : 16,
                    itemGap:15, //图例之间的间距
                    bottom:"25%",
                    selectedMode:false,

                    // x : 100,  //图例的位置
                    // y : 100,  //图例的位置

                    // 设置内边距为 5
                    // padding: 5,
                    //     // 设置上下的内边距为 5，左右的内边距为 10
                    // padding: [5, 10]
                    //     // 分别设置四个方向的内边距
                    // padding: [
                    //     5,  // 上
                    //     10, // 右
                    //     5,  // 下
                    //     10, // 左
                    // ]
                    data:['供热','供汽','供电','供水','供气'],
                },

                series: [
                    {


                        name:'访问来源',
                        type:'pie',
                        radius: ['70%', '80%'], //设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
                        center: ['35%', '50%'],  // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置

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
                        data:UserSizeData

                        // data:[
                        //     {value:250, name:'供热'},
                        //     {value:200, name:'供汽'},
                        //     {value:250, name:'供电'},
                        //     {value:150, name:'供水'},
                        //     {value:50, name:'供气'},
                        // ]
                    }
                ]
            })
            /*结束*/

        })

    }



    // 用能趋势 曲线图
    getEnergyUseTrendsEcharts= () => {
        let  EnergyDataArry =[]

        reqwest({
            url:'/console/homePage/queryEnergyUseTrend',
            method:'GET',
            credentials:'include',
            data:{
                selectDateEnergy:this.state.selectDateEnergy,
                selectedOption:this.state.selectedOptionEnergy
            }
        }).then((data)=> {
            var ds = eval('(' + data + ')');

            if(ds[0].result !== 0){
                if( this.state.selectDateEnergy === 1 ){
                    for (var i=0;i< ds[0].result.length;i++){
                        if (this.state.selectedOptionEnergy ===1 ){
                            EnergyDataArry.push(
                                ds[0].result[i].hconsValueDay
                            )
                        }
                        if (this.state.selectedOptionEnergy ===2 ){
                            EnergyDataArry.push(
                                ds[0].result[i].sconsValueDay
                            )
                        }
                        if (this.state.selectedOptionEnergy ===3 ){
                            EnergyDataArry.push(
                                ds[0].result[i].econsValueDay
                            )
                        }
                        if (this.state.selectedOptionEnergy ===4){
                            EnergyDataArry.push(
                                ds[0].result[i].wconsValueDay
                            )
                        }
                        if (this.state.selectedOptionEnergy===5){
                            EnergyDataArry.push(
                                ds[0].result[i].gconsValueDay
                            )
                        }

                    }

                }

                if( this.state.selectDateEnergy === 2 ){
                    for (var i=0;i< ds[0].result.length;i++){
                        if (this.state.selectedOptionEnergy ===1 ){
                            EnergyDataArry.push(
                                ds[0].result[i].hconsValueMonth
                            )
                        }
                        if (this.state.selectedOptionEnergy ===2 ){
                            EnergyDataArry.push(
                                ds[0].result[i].sconsValueMonth
                            )
                        }
                        if (this.state.selectedOptionEnergy ===3 ){
                            EnergyDataArry.push(
                                ds[0].result[i].econsValueMonth
                            )
                        }
                        if (this.state.selectedOptionEnergy ===4){
                            EnergyDataArry.push(
                                ds[0].result[i].wconsValueMonth
                            )
                        }
                        if (this.state.selectedOptionEnergy===5){
                            EnergyDataArry.push(
                                ds[0].result[i].gconsValueMonth
                            )
                        }

                    }
                }


            }
            //开始
            let  EnergyUseTrendsEcharts = echarts.init(document.getElementById('EnergyUseTrendsEcharts'));
            // window.onresize = EnergyUseTrendsEcharts.resize;
            window.addEventListener("resize",function(){
                EnergyUseTrendsEcharts.resize();
            });
            EnergyUseTrendsEcharts.setOption({
                color:['#0099FF'],
                xAxis: {
                    type: 'category',
                    // data:this.state.dataDayNum
                    data: this.state.EnergyData

                },
                yAxis: {
                    type: 'value'
                },
                tooltip: {
                    trigger: 'axis'
                },
                series: [{

                    data: EnergyDataArry,
                    type: 'line',
                    smooth: true
                }],
                // grid:{
                //     x:25,
                //     y:45,
                //     x2:5,
                //     y2:20,
                //     borderWidth:1
                // },
                grid:{
                    // x:15,  //上
                    // y:10,   //右
                    // x2:30,   //下
                    // y2:10,  //左
                    // borderWidth:1
                    top: '16%',   // 等价于 y: '16%'
                    left: '3%',
                    right: '8%',
                    bottom: '3%',
                    containLabel: true
                },
            })




            //结束
        })

    }



    // 终端在线情况
    Terminal = () => {
        reqwest({
            url:'/console/homePage/queryTerminalOnline',
            method:'GET',
            credentials:'include',
            data:{
                // selectDateEnergy:this.state.RechargeUnit,
            }
        }).then((data)=> {
            var ds = eval('(' + data + ')');
            if(ds[0].TerminalOnlineNum !== null  && ds[0].TerminalOnlineNum !== undefined){
                this.setState({
                    TerminalOnlineNum: ds[0].TerminalOnlineNum,  //终端总数
                });
            }
            if(ds[0].onLineNum !== null  && ds[0].onLineNum !== undefined){
                this.setState({
                    onLineNum: ds[0].onLineNum,  //终端在线数
                });
            }
            if(ds[0].percentage !== null  && ds[0].percentage !== undefined){
                this.setState({
                    percentage: ds[0].percentage,  //终端在线百分比
                });
            }


        });


    }




    // 充值规模
    getRechargeScale= () => {
        let data1 = [];
        let data2 = [];
        // if( this.state.RechargeUnit ==="3"){
        //     data2 =this.state.EnergyData;

            reqwest({
                url:'/console/homePage/queryRechargeSettlement',
                method:'GET',
                credentials:'include',
                data:{
                    selectDateEnergy:this.state.RechargeUnit,
                    type : 1,
                }
            }).then((data)=> {
                var ds = eval('(' + data + ')');

/*                if(ds[0].result !== 0){
                    for (var i=0;i< ds[0].result.length;i++){
                            data1.push(
                                ds[0].result[i].rechargeMoney
                            )
                    }

                }*/
                data1 = ds[0].list
             /*   开始*/
                if(this.state.RechargeUnit ===1){
                    data2 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
                }
                if(this.state.RechargeUnit ===2){
                    data2 = [1,2,3,4,5,6,7,8,9,10,11,12];
                }

                let  RechargeScale = echarts.init(document.getElementById('RechargeScale'));
                window.addEventListener("resize",function(){
                    RechargeScale.resize();
                });
                RechargeScale.setOption({
                    color:['#3FE5FF'],
                    xAxis: {
                        type: 'category',
                        // data:this.state.dataDayNum
                        // data: ['00:00', '00:30', '01:00', '01:30', '02:00']
                        data: data2,

                    },
                    yAxis: {
                        type: 'value'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    series: [{

                        data : data1,
                        type: 'line',
                        smooth: true
                    }],
                    grid:{
                        top: '16%',   // 等价于 y: '16%'
                        left: '3%',
                        right: '8%',
                        bottom: '3%',
                        containLabel: true
                    },
                })

             /* 结束 */

            })


        // }

    }

    //Settlement scale  结算规模

    getSettlementScale= () => {
        let data1 = [];
        let data2 = [];
        // if( this.state.RechargeUnit ==="3"){
        //     data2 =this.state.EnergyData;
        reqwest({
            url:'/console/homePage/queryRechargeSettlement',
            method:'GET',
            credentials:'include',
            data:{
                selectDateEnergy:this.state.RechargeUnit,
                type : 2,
            }
        }).then((data)=> {
            var ds = eval('(' + data + ')');
            console.log("返回的数据是",ds);
/*            if(ds[0].result !== 0){
                for (var i=0;i< ds[0].result.length;i++){
                        data1.push(
                            ds[0].result[i].consumeMoney

                        )
                }

            }*/
            data1 = ds[0].list
            /*   开始*/
            console.log("展示的数组是",data1);
            if(this.state.RechargeUnit ===1){
                data2 = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
            }
            if(this.state.RechargeUnit ===2){
                data2 = [1,2,3,4,5,6,7,8,9,10,11,12];
            }

            let  SettlementScale = echarts.init(document.getElementById('SettlementScale'));
            window.addEventListener("resize",function(){
                SettlementScale.resize();
            });
            SettlementScale.setOption({
                color:['#3FE5FF'],
                xAxis: {
                    type: 'category',
                    // data:this.state.dataDayNum
                    // data: ['00:00', '00:30', '01:00', '01:30', '02:00']
                    data: data2,

                },
                yAxis: {
                    type: 'value'
                },
                tooltip: {
                    trigger: 'axis'
                },
                series: [{

                    data : data1,
                    type: 'line',
                    smooth: true
                }],
                grid:{
                    top: '16%',   // 等价于 y: '16%'
                    left: '3%',
                    right: '8%',
                    bottom: '3%',
                    containLabel: true
                },
            })

            /* 结束 */

        })

    }

    //告警情况  WarningSituation

    getWarningSituationEcharts= () => {
        reqwest({
            url:'/console/homePage/queryAlarmQueryNum',
            method:'GET',
            credentials:'include',
            data:{
            }
        }).then((data)=> {
            var ds = eval('(' + data + ')');
            console.log("返回的数据是=========", ds);

                let  rechargeNum=  0;   // 充值告警数
               let  arrearsNum = 0 ;//欠费告警数
                let  LimitNum = 0;  //越限预警数
                let newsletterNum= 0;  //通讯故障数

            if(ds[0].resultNum !== null  && ds[0].resultNum !== undefined){
                this.setState({
                    resultNum: ds[0].resultNum  //未处理告警
                });
            }
            if(ds[0].resultMonthNum !== null  && ds[0].resultMonthNum !== undefined){
                this.setState({
                    resultMonthNum: ds[0].resultMonthNum  //本月告警
                });
            }

            if(ds[0].rechargeNum !== null  && ds[0].rechargeNum !== undefined){
               /* this.setState({
                    rechargeNum: ds[0].rechargeNum   // 充值预警
                });
                */
                rechargeNum =ds[0].rechargeNum
            }
            if(ds[0].arrearsNum !== null  && ds[0].arrearsNum !== undefined){
/*                this.setState({
                    arrearsNum: ds[0].arrearsNum  //欠费预警
                });*/
                arrearsNum = ds[0].arrearsNum;
            }

            if(ds[0].LimitNum !== null  && ds[0].LimitNum !== undefined){
    /*            this.setState({
                    LimitNum: ds[0].LimitNum   //越限预警
                });*/
                LimitNum = ds[0].LimitNum ;
            }
            if(ds[0].newsletterNum !== null  && ds[0].newsletterNum !== undefined){
    /*            this.setState({
                    newsletterNum: ds[0].newsletterNum   //通讯故障
                });*/
                newsletterNum =ds[0].newsletterNum ;
            }
            //echar 开始
            let WarningSituationEcharts = echarts.init(document.getElementById('WarningSituationEcharts'));
            window.addEventListener("resize",function(){
                WarningSituationEcharts.resize();
            });
            WarningSituationEcharts.setOption({
                tooltip: {
                    show:true,
                },
                // tooltip: {
                //     trigger: 'item',
                //     formatter: "{a} <br/>{b}: {c} ({d}%)"
                // },
                color:['#FF9966','#4086FF','#3FE5FF','#FF5E32'],
                legend: {
                    orient: 'vertical',
                    x: '60%',
                    y: '15%',
                    itemWidth :24,
                    itemHeight : 16,
                    itemGap:15, //图例之间的间距
                    bottom:"25%",
                    selectedMode:false,

                    // x : 100,  //图例的位置
                    // y : 100,  //图例的位置

                    // 设置内边距为 5
                    // padding: 5,
                    //     // 设置上下的内边距为 5，左右的内边距为 10
                    // padding: [5, 10]
                    //     // 分别设置四个方向的内边距
                    // padding: [
                    //     5,  // 上
                    //     10, // 右
                    //     5,  // 下
                    //     10, // 左
                    // ]
                    data:['充值预警','欠费预警','越限告警','通讯故障'],
                },

                series: [
                    {


                        name:'访问来源',
                        type:'pie',
                        radius: ['45%', '65%'], //设置环形饼状图， 第一个百分数设置内圈大小，第二个百分数设置外圈大小
                        center: ['35%', '42%'],  // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置

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
                        data:[
                            {value:rechargeNum, name:'充值预警'},
                            {value:arrearsNum, name:'欠费预警'},
                            {value:LimitNum, name:'越限告警'},
                            {value:newsletterNum, name:'通讯故障'},
                        ]
                    }
                ]
            })

            //echarts 结束

        });

    }



    //用能趋势
    onChangeElectricityBill=(value)=> {
        this.setState({
            selectDateEnergy: parseInt(value.target.value) ,  // 用能趋势  电 热  水 汽 气 选择的值
        },()=>{
            this.getEnergyUseTrendsEcharts()
        });

    };

    handleChange = selectedOption => {
        this.setState({
            selectedOption: selectedOption,  // 用能趋势  电 热  水 汽 气 选择的值
            selectedOptionEnergy : parseInt(selectedOption.value)
        },()=>{
            this.getEnergyUseTrendsEcharts()
        });
    };

    //充值曲线  选择的值
    onChangeRechargeScale =(value)=> {
        this.setState({
            RechargeUnit: parseInt(value.target.value) ,  // 充值选择的时间值  月 年
        },()=>{
            this.getRechargeScale()
        });
    }

    onChangeSettlementScale=(value)=> {
        this.setState({
            RechargeUnit: parseInt(value.target.value) ,  // 充值选择的时间值  月 年
        },()=>{
            this.getSettlementScale()
        });
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
                                <Row>
                                    <Col span={18}>
                                        {/*<div  className=" unitFamliy" style={{ marginRight: 300}}>单位（家）</div>*/}
                                        <div id="UserSizeEcharts"   style={{ width:"100%" ,height:230}}> </div>
                                    </Col>
                                    <Col span={6}>
                                        <Row className=" unitFamliy" style={{ marginRight: 300}} >单位（家） </Row>
                                        <Row className="UserSizeEchartsValue">{this.state.is_enable_heat} </Row>
                                        <Row className="UserSizeEchartsValue1">{this.state. is_enable_steam}</Row>
                                        <Row className="UserSizeEchartsValue1">{this.state.is_enable_elec} </Row>
                                        <Row className="UserSizeEchartsValue1">{this.state.is_enable_water}</Row>
                                        <Row className="UserSizeEchartsValue1">{this.state.is_enable_gas}</Row>
                                        <div className = {this.state.UserNumber.toString().length >2?"UserSizeNum1":"UserSizeNum"}  > {this.state.UserNumber}</div>
                                        <div className ="UserSizefont" > 总用户数（家）</div>
                                    </Col>
                                </Row>

                            </Row>
                        </Row>
                        <Row style={{ height: 300  }}>
                            <Row className="div-back">
                                <Row >
                                    <Col span={5} className="row-title">
                                        用能趋势
                                    </Col>

                                    <Col span={17}  className="row-title-date" >
                                        <div className="row-title-dateDIv" style={{ float:'left',marginLeft: "30%"}}>
                                            <Select1
                                                className="select-select"
                                                placeholder="热"
                                                style={{ height:30 , lineHeight:30}}
                                                value={this.state.selectedOption}
                                                onChange={this.handleChange}
                                                options={options}
                                            />

                                        </div>
                                        <div className="row-title-dateDIv" style={{ float:'right',marginRight: 10}}>
                                            <Radio.Group   defaultValue="1"  onChange={this.onChangeElectricityBill}  buttonStyle="solid" >
                                                <Radio.Button value="1">月</Radio.Button>
                                                <Radio.Button value="2">年</Radio.Button>
                                            </Radio.Group>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <div id="EnergyUseTrendsEcharts"   style={{ width:"100%" ,height:230}}> </div>
                                </Row>

                            </Row>
                        </Row>
                        <Row style={{ height: 300  }}>
                            <Row className="div-back">
                                <Row span={24}  className="row-title1">终端在线情况</Row>
                                <Row span ={24} className="Progress-Class"  >
                                    <Col span={12}>
                                        <Progress
                                            gapPosition = "right"
                                            strokeWidth	= {6}   //圆形进度条线的宽度，单位是进度条画布宽度的百分比
                                            // width	={180}      //圆形进度条画布宽度，单位 px
                                             width	={180}            //圆形进度条画布宽度，单位 px
                                            // Color
                                            type="circle"
                                            strokeColor={{
                                                '0%': '#0099FF',
                                                '50%': '#3FE5FF',
                                                '100%': '#54FF35',
                                            }}
                                              percent={this.state.percentage}
                                            // percent={90} format={percent => `${percent}% 在线率`}

                                        />
                                    </Col>
                                    <Col span={12} className="Terminal">
                                        <Row> <div className="TerminalFontUtil"  >单位（个）</div></Row>
                                        <Row>
                                            <Row className="TerminalRow">
                                                <Col span={5}> <div className="TerminalImage1">  </div></Col>
                                                <Col span={5}> <div className="TerminalFont"> 终端</div></Col>
                                                <Col span={5}> <div className="TerminalFont1"> {this.state.TerminalOnlineNum}</div></Col>
                                            </Row>
                                            <Row className="TerminalRow">
                                                <Col span={5}><div className="TerminalImage2">  </div></Col>
                                                <Col span={5}><div className="TerminalFont"> 在线</div></Col>
                                                <Col span={5}><div className="TerminalFont2"> {this.state.onLineNum}</div> </Col>
                                            </Row>
                                        </Row>
                                    </Col>
                                </Row>
                            </Row>


                        </Row>
                    </Col>
                    <Col span={8}>
                        <Row style={{ height: 900  }} >
                            <Row className="div-map_back">
                                <Row span ={24}>
                                <div  style={{ height: 40}}>
{/*                                    <Search className="search-class"
                                            placeholder="input search text"
                                            onSearch={value => console.log(value)}
                                        // style={{ width: 540 , height: 40}}
                                             style={{  height: 40}}
                                    />*/}


                                    <Select className="Select-class"  defaultValue="1"  onChange={this. handleChangeHead}>
                                        <Option value="1">全部</Option>
                                        <Option value="2">水电气热汽用户</Option>
                                        <Option value="3">热力站</Option>
                                    </Select>

                                    <AutoComplete
                                         className="search-class"
                                        dataSource={this.state.dataUserName}
                                        // style={{  lineHeight:'50px', height: 50}}
                                       /* style={{ width: 400 }}*/
                                        onSelect={this.onSelect}
                                        onSearch={this.handleSearch}
                                        placeholder="输入搜索 "
                                        filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                                   >
                                    <Input
                                        suffix={<Icon type="search" className="certain-category-icon" />}
                                    />
                                    </AutoComplete>
                                </div>
                                </Row>

                                <div  className="map-class" style={{width: '100%', height: 890, padding:10 }}>

                                    <Map   center={this.state.mapCenter} zoom={15}>
                                        <Markers
                                            markers={this.state.markers}
                                            events={this.markerEvents}
                                            useCluster={true}  //是否启用聚合插件   //plugins={['ToolBar']}
                                            /*useCluster={this.state.useCluster} true*/
                                            render={this.renderMarkerLayout} //设定坐标的外观
                                        />
                                    </Map>


                                </div>


                                <div className="search-class1"style={{ height: 40}}>
                                    <Row span ={24} className="search-class1" style={{ height: 40,marginLeft:27,marginRight:27 }}>
                                        <Col span={4} className= "search-class1-fontKeyq" style={{ marginLeft:30 ,marginTop:8}}>供热单位</Col>
                                        <Col span={4} className="search-class1-fontValue" style={{ marginTop:8}}>{this.state.is_enable_heat}</Col>
                                        <Col span={4} className= "search-class1-fontKey" style={{ marginTop:8}}>供气单位</Col>
                                        <Col span={4} className="search-class1-fontValue" style={{ marginTop:8}}>{this.state.is_enable_gas}</Col>
                                        <Col span={4} className= "search-class1-fontKey" style={{ marginTop:8}}>热力站</Col>
                                        <Col span={2} className="search-class1-fontValue" style={{ marginTop:8}}>{this.state.translation}</Col>
                                    </Row>

                                </div>
                            </Row>
                        </Row>
                    </Col>
                    <Col span={8}>
                        <Row style={{ height: 300  }} >
                            <Row className="div-back">
                              {/*  <Row  className="row-title">充值规模</Row>*/}

                                <Row >
                                    <Col span={10} className="row-title">
                                        充值规模
                                    </Col>

                                    <Col span={12}  className="row-title-date" >
                                        <div className="row-title-dateDIv" style={{ float:'right',marginRight: 10}}>
                                            <Radio.Group   defaultValue="1"  onChange={this.onChangeRechargeScale}  buttonStyle="solid" >
                                                <Radio.Button value="1">月</Radio.Button>
                                                <Radio.Button value="2">年</Radio.Button>
                                            </Radio.Group>
                                        </div>
                                    </Col>
                                </Row>


                                <Row>
                                    <div id="RechargeScale"   style={{ width:"100%" ,height:230}}> </div>
                                </Row>
                            </Row>
                        </Row>
                        <Row style={{ height: 300  }}>
                            <Row className="div-back">
                                <Row >
                                    <Col span={10} className="row-title">
                                        结算规模
                                    </Col>

                                    <Col span={12}  className="row-title-date" >
                                        <div className="row-title-dateDIv" style={{ float:'right',marginRight: 10}}>
                                            <Radio.Group   defaultValue="1"  onChange={this.onChangeSettlementScale}  buttonStyle="solid" >
                                                <Radio.Button value="1">月</Radio.Button>
                                                <Radio.Button value="2">年</Radio.Button>
                                            </Radio.Group>
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <div id="SettlementScale"   style={{ width:"100%" ,height:230}}> </div>
                                </Row>
                            </Row>
                        </Row>
                        <Row style={{ height: 300  }}>
                            <Row className="div-back">
                                <Row  className="row-title">告警情况</Row>
                                <Row><div id="WarningSituationEcharts"   style={{ width:"100%" ,height:230}}> </div></Row>
                                <Row className="Warningfont">
                                    <Col className="WarningPosition">
                                    <Col span={3} > <div  className="WarningMonthFont" style={{float:'right'}}> 本月累计</div></Col>
                                    <Col span={5}><div className="WarningFontValue"> {this.state.resultMonthNum}  个 </div></Col>
                                    <Col span={3}><div className="WarningMonthFont" style={{float:'right'}} >本月新增 </div> </Col>
                                    <Col span={5}><div className="WarningFontValue"> {this.state.resultMonthNum} 个 </div> </Col>
                                    <Col span={3}> <div className="WarningMonthFont1" style={{float:'right'}}> 未处理</div></Col>
                                    <Col span={5}><div className="WarningFontValue"> {this.state.resultNum}个 </div> </Col>
                                    </Col>
                                </Row>
                            </Row>
                        </Row>
                    </Col>
                </Row>


            </div>

        )
    }


}

export default HomePage;

ReactDOM.render(<HomePage/>, document.getElementById("root"));


// ReactDOM.render(
//     <EnergyOverviewOperator />,
//     document.getElementById('root')
// )

// ReactDOM.render(
//     <LocaleProvider locale={zhCN}>
//         <videoMonitor/>
//     </LocaleProvider>,
//     document.getElementById('root')
// )