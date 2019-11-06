/**
 * Created by Administrator on 2019/8/21.
 */
import  React,{Component}from 'react';
import  ReactDOM from 'react-dom';
import {Select,Table,Row, Col,Button,Input,Modal,Tabs,message,Icon,LocaleProvider,Tag,Card} from 'antd';
import {Map,Marker,Markers} from 'react-amap';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './auditing.less';
import './component/webSocket.js';

import Socket from  './component/webSocket.js';
import reqwest from 'reqwest';
const pageSize=10;
const TabPane = Tabs.TabPane;
class Test  extends React.Component{
    constructor() {
        super();
        this.taskRemindInterval = null;
    }
    getInitState=()=>{
        this.getUserInfo();
    }


    componentDidMount () {
        this.aa();
        //    判断专家是否登录
/*        this.socket = new Socket({
            // socketUrl: 'ws://123.207.167.163:9010/ajaxchattest',
            // socketUrl: 'http://localhost:60221/console/socket/accept1',
            socketUrl: 'ws://127.0.0.1:60221/console/socket/accept2',
            ///console/homePage/queryUserSizeMap
            // socketUrl: 'ws://localhost:60221/AlarmQuery',
            timeout: 5000,
            socketMessage: (receive) => {
                console.log(receive);  //后端返回的数据，渲染页面
            },
            socketClose: (msg) => {
                console.log(msg);
            },
            socketError: () => {
                console.log(this.state.taskStage + '连接建立失败');
            },
            socketOpen: () => {
                console.log('连接建立成功');

                // 心跳机制 定时向后端发数据
                this.taskRemindInterval = setInterval(() => {
                    this.socket.sendMessage({ "msgType": 0 })
                }, 30000)
            }
        });
        // 重试创建socket连接
        try {
            this.socket.connection();
        } catch (e) {
            // 捕获异常，防止js error
            // donothing
        }*/
    }



    aa(){
            var socket;
            if(typeof(WebSocket) == "undefined") {
            console.log("您的浏览器不支持WebSocket");
        }else{
            console.log("您的浏览器支持WebSocket");
            //实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接
            //等同于socket = new WebSocket("ws://localhost:8083/checkcentersys/websocket/20");
            // socket = new WebSocket("${basePath}websocket/${cid}".replace("http","ws"));
                socket = new WebSocket("ws://localhost:60221/console/websocket/1001");

            //打开事件
            socket.onopen = function() {
            console.log("Socket 已打开");
            //socket.send("这是来自客户端的消息" + location.href + new Date());
        };
            //获得消息事件
            socket.onmessage = function(msg) {
            console.log(msg.data);
            //发现消息进入    开始处理前端触发逻辑
        };
            //关闭事件
            socket.onclose = function() {
            console.log("Socket已关闭");
        };
            //发生了错误事件
            socket.onerror = function() {
            alert("Socket发生了错  误");
            //此时可以尝试刷新页面
        }
            //离开页面时，关闭socket
            //jquery1.8中已经被废弃，3.0中已经移除
            // $(window).unload(function(){
            //     socket.close();
            //});
        }
    }


    render() {


        return (
        <Row>
            <Tag
                draggable={true}
                onDragStart={(e)=>this.dragStart(e,"1")}
                closable
                onClose={e=>this.delNode(e)}
            >
                标签内容
            </Tag>
            <Card>
                <Card.Grid
                    onDrop={(e)=>this.drop(e)}
                    onDragOver={(e)=>this.dragOver(e)}
                >
                    放置元素内容
                </Card.Grid>
            </Card>
            <Card>
                <Card.Grid
                    onDrop={(e)=>this.drop(e)}
                    onDragOver={(e)=>this.dragOver(e)}
                >
                    放置元素内容2
                </Card.Grid>
            </Card>
            <Card>
                <Card.Grid
                    onDrop={(e)=>this.drop(e,
                    )}
                    onDragOver={(e)=>this.dragOver(e)}
                >
                    放置元素内容3
                </Card.Grid>
            </Card>

        </Row>


        )
    }

   // 拖拽开始
    dragStart=(e,item)=>{
        console.log("item",item);
        e.dataTransfer.setData('item',item);// 拖拽元素携带的数据
    }

// 拖拽元素经过放置元素时
    dragOver=(e)=>{
    e.preventDefault();// 此处的代码是必须的  不然无法拖拽
    console.log('拖拽中',e)
}

// 拖拽元素放到放置元素时
drop=(e)=>{
    e.preventDefault();

    // 放置之后的后续操作
   console.log("drop",e.dataTransfer.getData('item'));
}

}
ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <Test/>
    </LocaleProvider>,
    document.getElementById('root')
)