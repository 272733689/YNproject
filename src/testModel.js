import  React,{Component}from 'react';
import  ReactDOM from 'react-dom';
import {Select,Table,Row, Col,Button,Input,Modal,Tabs,message,Icon,LocaleProvider} from 'antd';
import {Map,Marker,Markers} from 'react-amap';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './auditing.less';
import reqwest from 'reqwest';
const pageSize=10;
const TabPane = Tabs.TabPane;
class TestModel  extends React.Component{
    componentWillMount(){
        this.getInitState();
    }
    state={
        pagination: {pageSize: pageSize,current:1},
        //列
        selectedRowKeys:[],
        visible:false,
        typeFlag:0,

        //查询条件
        userName:'',
        userAddr:'',
        userStatus:'全部',
        userStatusList:[<option key="全部">全部</option>,<option key="10">初始化</option>,<option key="20">运行</option>,<option key="40">销户</option>],
        currents:1,
        userData:[],

    }
    getInitState=()=>{
        this.getUserInfo();
    }
    render() {
    
        var pageSize1 = this.state.pagination.pageSize;
        var total = this.state.pagination.total;
        const bcolumns=[
            {title: <div className="tableFontCss">户号</div>, dataIndex: 'ceResNo', width:'20%',align:'center',className:'titleClass'},
            {title: <div className="tableFontCss">户名</div>, dataIndex: 'ceResName',width:'30%',align:'center',className:'titleClass'},
            {title: <div className="tableFontCss">用户地址</div>, dataIndex: 'ceCustAddr',width:'30%',align:'center',className:'titleClass'},
            {title: <div className="tableFontCss">用户状态</div>, dataIndex: 'ceResStatus',width:'20%',align:'center',className:'titleClass'},
        ];
    
        return (
            <div className="div-bodys">
                <div className="div-pages">
                    <div className="div_querys">
                        <div className="div_titles rightClass"><span><span>投运管理&nbsp;</span>&nbsp;<span className="dayuClass">电站维护</span></span></div>
                        <div className="div_titles">电站维护</div>
                        <div className="card-container" style={{background:'#FFFFFF',borderRadius:5}}>
                            <Tabs type="card">
                                <TabPane tab={<span></span>} key="1">
                                    <Row style={{marginTop:-5}}>
                                        <Col span={5}>
                                            <Row>
                                                <span style={{lineHeight:'32px',float:'left'}}>用户名称：</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                                <span style={{marginLeft:5}}>
                                                <Input value={this.state.userName}
                                                       onChange={e => this.setState({'userName': e.target.value})}
                                                       className="inputWidth"/>
                                            </span>
                                            </Row>
                                        </Col>
                                        <Col span={5}>
                                            <Row>
                                                <span style={{lineHeight:'32px',float:'left'}}>用户地址：</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                                <span style={{marginLeft:5}}>
                                               <Input value={this.state.userAddr}
                                                      onChange={e => this.setState({'userAddr': e.target.value})}
                                                      className="inputWidth"/>
                                            </span>
                                            </Row>
                                        </Col>
                                        <Col span={5}>
                                            <Row>

                                                <span style={{lineHeight:'32px',float:'left'}}>用户状态：</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                                <span style={{marginLeft:5}}>
                                                    <Select value={this.state.userStatus}
                                                            onChange={value => this.setState({'userStatus': value})}
                                                            className="inputWidth">
                                                       {this.state.userStatusList}
                                                    </Select>
                                                </span>
                                            </Row>
                                        </Col>
                                        <Col span={6}>
                                            <Button type="primary"  style={{marginTop:0}} onClick={this.getUserInfo}>查询</Button>
                                        </Col>
                                    </Row>
                                    <Row style={{border:'1px solid #e8e8e8',marginTop:12}} >
                                        <Row style={{height:50,lineHeight:'50px',fontFamily:'Microsoft YaHei',fontSize:16}}>
                                            <Col span={24}>
                                                <span style={{marginRight:20,float:'right'}}>
                                                    <Button type="primary" style={{marginTop:14}} onClick={this.addStation}>电站新增</Button>

                                                     <Button type="primary" style={{marginTop:14,marginLeft:8}} onClick={this.exportUser}>导出</Button>
                                                </span></Col>
                                        </Row>
                                        <div style={{paddingLeft: '10px',paddingRight:'10px',paddingTop:'10px',paddingBottom:'10px'}}>
                                            <Row className="RegSecondDiv">
                                                <Table
                                                    columns={bcolumns}
                                                    dataSource={this.state.userData}
                                                    pagination={{
                                                        total: total,
                                                        pageSize: pageSize1,
                                                        current:this.state.currents,
                                                        showTotal: function () {
                                                            return <div style={{marginRight: 10, marginTop: 5}}> 共计 {total} 条数据</div>
                                                        }
                                                    }}
                                                    onChange={this._BhandleTableChange}
                                                />
                                            </Row>
                                        </div>
                                    </Row>
                                </TabPane>
                            </Tabs>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    /**
     * 导出方法
     */
    exportUser=()=>{
        const{userName,userAddr,userStatus}=this.state;

        var status=userStatus==="全部"?'':userStatus;
        window.location.href='/console/heatingUser/exportCeCustInfo?userName='+userName+"&userAddr="+userAddr+"&userStatus="+status;
    }
    getUserInfo=()=>{
        var pagination={...this.state.pagination};
        pagination.current=1;
        this.setState({
            currents:1,
            pagination
        },()=>{
            this.userFetch();
    })
    }
    userFetch=()=>{
        const{userName,userAddr,userStatus}=this.state;
        reqwest({
            url:'/console/heatingUser/getUserInfo',
            method:'GET',
            credentials:'include',
            data:{
                userName:userName,
                userAddr:userAddr,
                userStatus:userStatus==="全部"?'':userStatus,
                start:this.state.pagination.current,
            }
        }).then((data)=>{
            console.log("data",data);
        var ds=eval('('+data+')');
        var pagination={...this.state.pagination};
        pagination.total=ds[0].total;
        this.setState({
            pagination,
            userData:ds[0].result
        })
    })
    }
    //分页 我们现在是每次加载十条数据 此方法是用于翻页之后加载数据的
    _BhandleTableChange = (pagination, filters, sorter) => {

        const pager = { ...this.state.pagination };
        // pagination.current 获取当前是第几页
        pager.current = pagination.current;
        console.log('pager',pagination.current)
        this.setState({
            pagination: pager,//将获取的当前页面赋值给分页的属性pagination
            currents:pagination.current//将当前页赋值给 currents 用于后台分页查询
        },()=>{
            console.log("pagination",this.state.pagination)
            this.userFetch();
        });

    }

}
ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <TestModel/>
    </LocaleProvider>,
    document.getElementById('root')
)