import  React,{Component}from 'react';
import  ReactDOM from 'react-dom';
import {Card,Row, Col,Radio ,Input,Button, Layout,Menu, Icon} from 'antd';
// import { Player } from 'video-react';
import ReactPlayer from 'react-player'
import './css/VideoMonitor.css';
import reqwest from 'reqwest';
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
class VideoMonitor  extends Component{
    state = {
        openKeys: ['sub1'],
        menu :[],
    };


    //   加载页面时 触发
    componentDidMount() {
         this.getVideoMonitorList();

    };


    getVideoMonitorList=()=>{


        reqwest({
            url:'/console/VideoMonitor/queryPowerStationList',
            method:'GET',
            credentials:'include',
            data:{
                // userName:userName,
                // userAddr:userAddr,
            }
        }).then((data)=>{
            console.log("返回的数据data是",data);
            var ds=eval('('+data+')');

            console.log("返回的数据data",ds[0].result.length);

            console.log("摄像头是",ds[0].result[0].mapVideoList[1].title);



            if( ds[0].result.length >0 ){

                let Vu =[];
                let Mu = [];
                    for (var i=0;i<ds[0].result.length;i++){
                        console.log("有几个摄像头",ds[0].result[i].mapVideoList.length)
                        if(ds[0].result[i].mapVideoList.length > 0){
                            for (var j=0;j<ds[0].result[i].mapVideoList.length;j++){
                                let onDragStartValue =   ds[0].result[i].mapVideoList[j].title;
                                Vu.push(
                                    <Menu.Item key= {ds[0].result[i].mapVideoList[j].title}
                                     draggable={true}
                                     onDragStart={(e)=>this.dragStart(e, onDragStartValue )}>
                                        {ds[0].result[i].mapVideoList[j].title}
                                     </Menu.Item>
                                )
                            }
                        }


                    Mu.push(
                        console.log("xuhuan ",ds[0].result[i].mapVideoList[0].title),

                        <SubMenu
                         key= {i}
                         title={
                         <span>
                         <Icon type="mail" />
                         <span>{ds[0].result[i].title}</span>
                         </span>
                         }
                         >
                            {Vu}
                         {/*<Menu.Item key="1">{ds[0].result[i].mapVideoList[0].title}</Menu.Item>*/}

                         </SubMenu> ,

                    )
                        Vu =[];


                }
                console.log("qw 时间",Mu);
                this.setState({
                    menu:Mu
                })

                console.log("时间",this.state.menu);

            }


/*            this.setState({
                pagination,
                userData:ds[0].result
            })*/
        })


    }


    rootSubmenuKeys = ['sub1', 'sub2', 'sub4'];



    onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };



    // 拖拽开始
    dragStart=(e,item)=>{
        // console.log("item",item);
        e.dataTransfer.setData('item',item);// 拖拽元素携带的数据
    }

    // 拖拽元素经过放置元素时
    dragOver=(e)=>{
        e.preventDefault();// 此处的代码是必须的  不然无法拖拽
        // console.log('拖拽中',e)
    }

    // 拖拽元素放到放置元素时
    drop1=(e)=>{
        console.log('kaishi ')
        e.preventDefault();
        // 放置之后的后续操作
        console.log("drop111111111",e.dataTransfer.getData('item'));
        console.log('jiehsu  ')
    }
    drop2=(e)=>{
        e.preventDefault();
        // 放置之后的后续操作
        console.log("drop222222",e.dataTransfer.getData('item'));
    }
    drop3=(e)=>{
        e.preventDefault();
        // 放置之后的后续操作
        console.log("drop3333333333333",e.dataTransfer.getData('item'));
    }
    drop4=(e)=>{
        e.preventDefault();
        // 放置之后的后续操作
        console.log("drop44444444",e.dataTransfer.getData('item'));
    }
    drop5=(e)=>{
        e.preventDefault();
        // 放置之后的后续操作
        console.log("drop55555555",e.dataTransfer.getData('item'));
    }
    drop6=(e)=>{
        e.preventDefault();
        // 放置之后的后续操作
        console.log("drop6666666666",e.dataTransfer.getData('item'));
    }
    drop7=(e)=>{
        e.preventDefault();
        // 放置之后的后续操作
        console.log("drop7777777",e.dataTransfer.getData('item'));
    }
    drop8=(e)=>{
        e.preventDefault();
        // 放置之后的后续操作
        console.log("drop88888888",e.dataTransfer.getData('item'));
    }
    drop9=(e)=>{
        e.preventDefault();
        // 放置之后的后续操作
        console.log("drop9999999",e.dataTransfer.getData('item'));
    }




    render() {
        return (
            <div>

                <Layout  className="video-back" >
                    <Sider className="video-Layout" >

                        {/*<font color="red">Sider </font> */}
                        <Menu
                            mode="inline"
                            openKeys={this.state.openKeys}
                            onOpenChange={this.onOpenChange}
                            // style={{ width: 30% }}
                           /* style={{ height: 900  }}*/
                            theme="dark"
                        >

                            {this.state.menu}
{/*                            <SubMenu
                                key="sub1"
                                title={
                                    <span>
              <Icon type="mail" />
              <span>Navigation One</span>
            </span>
                                }
                            >
                                <Menu.Item key="1">Option 1</Menu.Item>
                                <Menu.Item key="2">Option 2</Menu.Item>
                                <Menu.Item key="3">Option 3</Menu.Item>
                                <Menu.Item key="4">Option 4</Menu.Item>

                            </SubMenu>*/}


                        </Menu>


                    </Sider>
                    <Layout className="video-content" >

                            <Row span={24}>
                                <Col  span ={ 8}> <div className="video-borde"  onDrop={(e)=>this.drop1(e)} onDragOver={(e)=>this.dragOver(e)} > a1 </div>   </Col>
                                <Col  span ={ 8}> <div className="video-borde"  onDrop={(e)=>this.drop2(e)} onDragOver={(e)=>this.dragOver(e)}> a2 </div></Col>
                                <Col  span ={ 8}> <div className="video-borde"  onDrop={(e)=>this.drop3(e)} onDragOver={(e)=>this.dragOver(e)}> a3 </div></Col>
                            </Row>

                            <Row span={24}>
                                <Col  span ={ 8}> <div className="video-borde"  onDrop={(e)=>this.drop4(e)} onDragOver={(e)=>this.dragOver(e)}> b1 </div>   </Col>
                                <Col  span ={ 8}> <div className="video-borde"  onDrop={(e)=>this.drop5(e)} onDragOver={(e)=>this.dragOver(e)}> b2 </div></Col>
                                <Col  span ={ 8}> <div className="video-borde"  onDrop={(e)=>this.drop6(e)} onDragOver={(e)=>this.dragOver(e)}> b3 </div></Col>
                            </Row>

                            <Row span={24}>
                                <Col  span ={ 8}> <div className="video-borde"  onDrop={(e)=>this.drop7(e)} onDragOver={(e)=>this.dragOver(e)}> c1 </div>   </Col>
                                <Col  span ={ 8}> <div className="video-borde"  onDrop={(e)=>this.drop8(e)} onDragOver={(e)=>this.dragOver(e)}> c2 </div></Col>
                                <Col  span ={ 8}> <div className="video-borde"  onDrop={(e)=>this.drop9(e)} onDragOver={(e)=>this.dragOver(e)}> c3 </div></Col>
                            </Row>
                    </Layout>
                </Layout>


{/*                <Button   type="primary"  onClick={this.onClick}>打开播放器</Button>
                <Button   type="primary"  onClick={this.onClose}>关闭播放器</Button>
                <ReactPlayer url='http://hls01open.ys7.com/openlive/7a949fd6e8b84bdaae7e3dae3655fd26.hd.m3u8' playing />
                <ReactPlayer
                    controls="true"
                    url={this.state.urlAdrress} playing
                    width='35%'
                    height='35%'
                />*/}

            </div>

        )
    }


}

export default VideoMonitor;

ReactDOM.render(<VideoMonitor/>, document.getElementById("root"));


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