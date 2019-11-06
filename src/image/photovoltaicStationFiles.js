import  React from 'react';
import  ReactDOM from 'react-dom';
import { LocaleProvider,Select,Table,Row, Col,Button,Divider,Input,Tabs,Tree,Icon,Modal,message,DatePicker,Dropdown,Menu,AutoComplete} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import reqwest from 'reqwest';
import {Map, Marker, Markers} from 'react-amap';
import  StationModel from './component/StationModel';
import './component/record.css';
import jituan from './image/jituan.png';
import factory from './image/gongchang.png';
import build from './image/Shape.png';
import eleStation from './image/eleStation.png';
import gfDevice from './image/gfDevice.png';
import msgCommon from './msgCommon';
import myReqwest from './myReqwest';
import SearchTreeComon from './SearchTreeComon';
let placeSearch;
const { TextArea } = Input;
const pageSize=10;
const pageSize1=5;
const { TreeNode } = Tree;
const TabPane = Tabs.TabPane;
const Search = Input.Search;


class RegionalFiles  extends React.Component{
    componentWillMount(){
        this.getInitState();
    }
    state={
        dataList:[],
        dataSource:[],
        searchTreeData:[],
        selectKey:'',

        expandedKeys: [],
        autoExpandParent: true,
        treeData:[],
        treeData1:[],
        autoExpandParent: false,
        treeNode:[],
        flags:0,

        titles:'',
        ceResClass:1,
        visible:false,
        destoryd:'',
        modalName:'新增区县档案',
        areaName:'',
        position:[113.271596,35.158266],
        citycode:'',
        adcode:'',
        latitude:'',
        longitude:'',
        lnglat:'',

        addAddrs:'',
        maxInfo:[],
        //dataFlag 与delData 分别是判断修改和删除的标志 delData 是要删除的数据
        delData:'0',
        dataFlag:'0',
        ceResFlag:'',
        version:'',
        contacter:'',
        contactPhone:'',
        detailLatitude:'',
        detailLongitude:'',
        orgTitle:'',
        buildingName:'',
        buildingId:'',
        unitCount:'',
        treeNode1:[],
        superiorId:'',
        lowerData:[],
        stationAddr:'',
        stationName:'',
        ceResSortNo:'',

        //设备新增修改
        mdrCode:'',
        modalName:'',
        modelCode:'',
        moduleType:'',
        moduleArea:'',
        moduleCount:'',
        sortNo:'',
        deviceSpec:'',
        operationDate:'',
        commAddr:'',
        terminName:'',
        terminalId:'',
        branchCount:'',
        schemeName:'',
        schemeId:'',
        CT:'',
        PT:'',
        eleMeter:'1',
        eleMeterList:[<option key="1">发电电表</option>,<option key="2">上网电表</option>,<option key="3">自发自用电表</option>]



    }
    getInitState=()=>{
        this.getTopUnitInfo();
    }
    render(){
        const markerEvents = {};
        const zoom=17;
        const plugins = [
            // 'MapType',
            'Scale',
            // 'OverView',
            {
                name: 'ToolBar',
                options: {
                    visible: true,  // 不设置该属性默认就是 true
                    onCreated(ins){
                        console.log(ins);
                    },
                },
            }
        ]
        const events = {
            created(instance){
                AMap.plugin('AMap.Geocoder',() => {
                    geocoder = new AMap.Geocoder({
                        city: "010"//城市，默认：“全国”
                    });
                })
                AMap.service(["AMap.PlaceSearch"], function() {
                    if(!placeSearch){
                        placeSearch = new AMap.PlaceSearch({ //构造地点查询类
                            pageSize: 5,
                            pageIndex: 1
                        });
                    }

                });
            },
            click: (e) => {
                console.log("lnglat", e.lnglat)
                const lnglat = e.lnglat;
                geocoder&&geocoder.getAddress(lnglat, (status, result) => {
                    console.log(result);
                    if (status === 'complete'){
                        if (result.regeocode){
                            this.setState({
                                position: lnglat,
                                citycode:result.regeocode.addressComponent.citycode,
                                adcode:result.regeocode.addressComponent.adcode,
                                latitude:e.lnglat.getLat(),
                                longitude:e.lnglat.getLng(),
                                lnglat:e.lnglat.getLng()+','+e.lnglat.getLat(),
                            },()=>{
                                console.log("lat",this.state.latitude)
                                console.log("longitude",this.state.longitude)
                            });
                        } else {
                            // _this.setState({
                            //     currentLocation: '未知地点'
                            // });
                        }
                    } else {
                        // _this.setState({
                        //     currentLocation: '未知地点'
                        // });
                    }
                })
            }
        }

        const options = this.state.dataSource.length>0?(
            this.state.dataSource.map(group => (
                <Option key={group.key} value={group.title} ceResClass={group.ceResClass}>
                    <span className="certain-search-item-count">{group.title}</span>
                </Option>
            ))
        ):undefined;

        const containerMenu=
            <Menu onClick={this.handleContainerClick}>
                {/*{*/}
                    {/*this.state.lowerData.map((items,i) =>*/}
                        {/*<Menu.Item key={items.ceResSortNo}>{items.ceResSortName}</Menu.Item>*/}
                    {/*)*/}
                {/*}*/}
                <Menu.Item key="1">新增光伏组件</Menu.Item>
                <Menu.Item key="2">新增逆变器</Menu.Item>
                <Menu.Item key="3">新增汇流箱</Menu.Item>
                <Menu.Item key="4">新增微气象站</Menu.Item>
                <Menu.Item key="5">新增电表</Menu.Item>
            </Menu>;

        //根据层级显示操作按钮
        let userButton=this.state.ceResClass===2?(
            <StationModel  superiorId={this.state.superiorId} ceResClass={this.state.ceResClass}
                         fn={this.maxCustomInfo} func={this.modifyAreas} version={this.state.version}/>
        ):(
            this.state.ceResClass===3?(
                <StationModel  superiorId={this.state.superiorId} ceResClass={this.state.ceResClass}
                               fn={this.maxCustomInfo} func={this.modifyAreas} version={this.state.version}/>
            ):(this.state.ceResClass===4?(
                <div>
                    <div style={{float:'left'}}>
                        <Dropdown overlay={containerMenu}>
                            <Button style={{ marginLeft:16}} type="primary">
                                新建设备 <Icon type="down" />
                            </Button>
                        </Dropdown>
                    </div>
                   <div style={{float:'left'}}>
                       <StationModel  superiorId={this.state.superiorId} ceResClass={this.state.ceResClass}
                                   fn={this.maxCustomInfo} func={this.modifyAreas} version={this.state.version}/>
                   </div>
                </div>
            ):undefined)
        );

        //根据层级显示详细信息
        let detailInfo=this.state.ceResClass===3?(
            <Row className="detailCss">
                    <Row style={{marginBottom:10,lineHeight:'32px'}}>
                        <Col span={7} >
                            <span style={{float:'left'}}>电站名称：</span>
                            <span style={{marginLeft:5}}>
                            {this.state.stationName}
                         </span>
                        </Col>
                        <Col span={7}>
                            <span style={{float:'left'}}>电站地址：</span>
                            <span style={{marginLeft:5}}>
                            {this.state.stationAddr}
                         </span>
                        </Col>
                    </Row>
                    <Row style={{marginBottom:10,lineHeight:'32px'}}>

                        <Col span={7}>
                            <span style={{float:'left'}}>&emsp;联系人：</span>
                            <span style={{marginLeft:5}}>
                            {this.state.contacter}
                         </span>
                        </Col>
                        <Col span={7}>
                            <span style={{float:'left'}}>联系电话：</span>
                            <span style={{marginLeft:5}}>
                            {this.state.contactPhone}
                         </span>
                        </Col>
                    </Row>
                    <Divider style={{marginTop:0}}/>
                    <Row style={{marginBottom:10,lineHeight:'32px'}}>
                        <Col span={12}>
                            <span style={{float:'left'}}>坐标信息：</span>
                            <span style={{marginLeft:5}}>
                            {this.state.detailLatitude+","+this.state.detailLongitude}
                         </span>
                        </Col>
                    </Row>
                    <Row style={{height: 300, marginTop: 10}}>
                        <Col span={12} >
                            <div style={{position: 'absolute', width: '100%', height: 300}}>
                                <Map center={this.state.position} events={events} plugins={plugins} zoom={zoom}>
                                    <Marker position={this.state.position} events={markerEvents}/>
                                </Map>
                            </div>
                        </Col>
                    </Row>
                </Row>

        ):(this.state.ceResClass===5?(
            <Row className="detailCss">
                <Row style={{marginBottom:10,lineHeight:'32px'}}>
                    <Col span={7}>
                        <span style={{float:'left'}}>楼栋号：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.buildingName}
                         </span>
                    </Col>
                    <Col span={7}>
                        <span style={{float:'left'}}>单元数：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.unitCount}
                         </span>
                    </Col>
                </Row>
                <Row style={{marginBottom:10,lineHeight:'32px'}}>
                    <Col span={7}>
                        <span style={{float:'left'}}>&emsp;户数：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.householdCount}
                         </span>
                    </Col>
                </Row>
            </Row>
        ):(
            <Row className="detailCss">
                <Row style={{marginBottom:10,lineHeight:'32px'}}>
                    <Col span={7}>
                        <span style={{float:'left'}}>名称：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.orgTitle}
                         </span>
                    </Col>
                </Row>
            </Row>
        ));

        var modal=this.state.ceResSortNo==='2'?(
                <Row style={{marginTop: 8}}>
                    <Col span={3}>
                        <span style={{lineHeight: '32px',color:'red'}}>&emsp;组串数：</span>
                    </Col>
                    <Col span={9}>
                        <Input value={this.state.moduleCount}
                               onChange={e => this.setState({'moduleCount': e.target.value})}
                               style={{width: '98%'}}/>
                    </Col>
                    <Col span={3}>
                        <span style={{lineHeight: '32px'}}>投运日期：</span>
                    </Col>
                    <Col span={9}>
                        <Input value={this.state.owner}
                               onChange={e => this.setState({'owner': e.target.value})}
                               style={{width: '98%'}}/>
                    </Col>
                </Row>
            ):(
            <Row style={{marginTop: 8}}>
                <Col span={3}>
                    <span style={{lineHeight: '32px',color:'red'}}>&emsp;支路数：</span>
                </Col>
                <Col span={9}>
                    <Input value={this.state.branchCount}
                           onChange={e => this.setState({'branchCount': e.target.value})}
                           style={{width: '98%'}}/>
                </Col>
                <Col span={3}>
                    <span style={{lineHeight: '32px'}}>投运日期：</span>
                </Col>
                <Col span={9}>
                    <DatePicker onChange={this.bwonChange} style={{width: '98%'}}/>
                </Col>
            </Row>
        )
        let modalInput=this.state.ceResSortNo==='1'?(
            <Row>
                <Row style={{marginTop: 8}}>
                    <Col span={3}>
                        <span style={{lineHeight: '32px'}}>生产厂家：</span>
                    </Col>
                    <Col span={9}>
                        <Input value={this.state.mdrCode}
                               onChange={e => this.setState({'mdrCode': e.target.value})}
                               style={{width: '98%'}}/>
                    </Col>

                    <Col span={3}>
                        <span style={{lineHeight: '32px'}}>组件规格：</span>
                    </Col>
                    <Col span={9}>
                        <Input value={this.state.moduleType}
                               onChange={e => this.setState({'moduleType': e.target.value})}
                               style={{width: '98%'}}/>
                    </Col>
                </Row>
                <Row style={{marginTop: 8}}>
                    <Col span={3}>
                        <span style={{lineHeight: '32px',color:'red'}}>组件面积：</span>
                    </Col>
                    <Col span={9}>
                        <Input value={this.state.moduleArea}
                               onChange={e => this.setState({'moduleArea': e.target.value})}
                               style={{width: '98%'}}/>
                    </Col>
                    <Col span={3}>
                        <span style={{lineHeight: '32px',color:'red'}}>组件数量：</span>
                    </Col>
                    <Col span={9}>
                        <Input value={this.state.moduleCount}
                               onChange={e => this.setState({'moduleCount': e.target.value})}
                               style={{width: '98%'}}/>
                    </Col>
                </Row>
            </Row>
        ):(this.state.ceResSortNo==='2'||this.state.ceResSortNo==='3'?(
            <Row>
                <Row style={{marginTop: 8}}>
                    <Col span={3}>
                        <span style={{lineHeight: '32px',color:'red'}}>生产厂家：</span>
                    </Col>
                    <Col span={9}>
                        <Input value={this.state.mdrCode}
                               onChange={e => this.setState({'mdrCode': e.target.value})}
                               style={{width: '98%'}}/>
                    </Col>

                    <Col span={3}>
                        <span style={{lineHeight: '32px',color:'red'}}>&emsp;&emsp;型号：</span>
                    </Col>
                    <Col span={9}>
                        <Input value={this.state.modelCode}
                               onChange={e => this.setState({'modelCode': e.target.value})}
                               style={{width: '98%'}}/>
                    </Col>
                </Row>
                <Row style={{marginTop: 8}}>
                    <Col span={3}>
                        <span style={{lineHeight: '32px'}}>&emsp;&emsp;编号：</span>
                    </Col>
                    <Col span={9}>
                        <Input value={this.state.sortNo}
                               onChange={e => this.setState({'sortNo': e.target.value})}
                               style={{width: '98%'}}/>
                    </Col>
                    <Col span={3}>
                        <span style={{lineHeight: '32px',color:'red'}}>&emsp;&emsp;规格：</span>
                    </Col>
                    <Col span={9}>
                        <Input value={this.state.deviceSpec}
                               onChange={e => this.setState({'deviceSpec': e.target.value})}
                               style={{width: '98%'}}/>
                    </Col>
                </Row>
                {modal}
                <Row style={{marginTop: 8}}>
                    <Col span={3}>
                        <span style={{lineHeight: '32px',color:'red'}}>通讯地址：</span>
                    </Col>
                    <Col span={9}>
                        <Input value={this.state.commAddr}
                               onChange={e => this.setState({'commAddr': e.target.value})}
                               style={{width: '98%'}}/>
                    </Col>
                </Row>
                <Row style={{marginTop: 8}}>
                    <Col span={3}>
                        <span style={{lineHeight: '32px',color:'red'}}>关联终端：</span>
                    </Col>
                    <Col span={9}>
                        <Input value={this.state.terminName}
                               onChange={e => this.setState({'terminName': e.target.value})}
                               style={{width: '98%'}}/>
                    </Col>
                </Row>
            </Row>
        ):(this.state.ceResSortNo==='4'?(
                <Row>
                    <Row style={{marginTop: 8}}>
                        <Col span={3}>
                            <span style={{lineHeight: '32px',color:'red'}}>生产厂家：</span>
                        </Col>
                        <Col span={9}>
                            <Input value={this.state.mdrCode}
                                   onChange={e => this.setState({'mdrCode': e.target.value})}
                                   style={{width: '98%'}}/>
                        </Col>

                        <Col span={3}>
                            <span style={{lineHeight: '32px',color:'red'}}>&emsp;&emsp;型号：</span>
                        </Col>
                        <Col span={9}>
                            <Input value={this.state.modelCode}
                                   onChange={e => this.setState({'modelCode': e.target.value})}
                                   style={{width: '98%'}}/>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 8}}>
                        <Col span={3}>
                            <span style={{lineHeight: '32px'}}>&emsp;&emsp;编号：</span>
                        </Col>
                        <Col span={9}>
                            <Input value={this.state.sortNo}
                                   onChange={e => this.setState({'sortNo': e.target.value})}
                                   style={{width: '98%'}}/>
                        </Col>
                        <Col span={3}>
                            <span style={{lineHeight: '32px'}}>投运日期：</span>
                        </Col>
                        <Col span={9}>
                            <DatePicker onChange={this.bwonChange} style={{width: '98%'}}/>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 8}}>
                        <Col span={3}>
                            <span style={{lineHeight: '32px',color:'red'}}>通讯地址：</span>
                        </Col>
                        <Col span={9}>
                            <Input value={this.state.commAddr}
                                   onChange={e => this.setState({'commAddr': e.target.value})}
                                   style={{width: '98%'}}/>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 8}}>
                        <Col span={3}>
                            <span style={{lineHeight: '32px',color:'red'}}>关联终端：</span>
                        </Col>
                        <Col span={9}>
                            <Input value={this.state.terminName}
                                   onChange={e => this.setState({'terminName': e.target.value})}
                                   style={{width: '98%'}}/>
                        </Col>
                    </Row>
                </Row>
            ):(
                <Row>

                    <Row style={{marginTop: 8}}>
                        <Col span={3}>
                            <span style={{lineHeight: '32px',color:'red'}}>生产厂家：</span>
                        </Col>
                        <Col span={9}>
                            <Input value={this.state.mdrCode}
                                   onChange={e => this.setState({'mdrCode': e.target.value})}
                                   style={{width: '98%'}}/>
                        </Col>

                        <Col span={3}>
                            <span style={{lineHeight: '32px',color:'red'}}>电表类型：</span>
                        </Col>
                        <Col span={9}>
                            <Select value={this.state.eleMeter}
                                    onChange={value => this.setState({'eleMeter': value})}
                                    style={{width: '98%'}}
                            >
                                {this.state.eleMeterList}
                            </Select>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 8}}>
                        <Col span={3}>
                            <span style={{lineHeight: '32px'}}>&emsp;&emsp;型号：</span>
                        </Col>
                        <Col span={9}>
                            <Input value={this.state.modelCode}
                                   onChange={e => this.setState({'modelCode': e.target.value})}
                                   style={{width: '98%'}}/>
                        </Col>
                        <Col span={3}>
                            <span style={{lineHeight: '32px'}}>&emsp;&emsp;编号：</span>
                        </Col>
                        <Col span={9}>
                            <Input value={this.state.sortNo}
                                   onChange={e => this.setState({'sortNo': e.target.value})}
                                   style={{width: '98%'}}/>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 8}}>
                        <Col span={3}>
                            <span style={{lineHeight: '32px',color:'red'}}>&emsp;&emsp;CT：</span>
                        </Col>
                        <Col span={9}>
                            <Input value={this.state.CT}
                                   onChange={e => this.setState({'CT': e.target.value})}
                                   style={{width: '98%'}}/>
                        </Col>
                        <Col span={3}>
                            <span style={{lineHeight: '32px',color:'red'}}>&emsp;&emsp;PT：</span>
                        </Col>
                        <Col span={9}>
                            <Input value={this.state.PT}
                                   onChange={e => this.setState({'PT': e.target.value})}
                                   style={{width: '98%'}}/>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 8}}>
                        <Col span={3}>
                            <span style={{lineHeight: '32px'}}>投运日期：</span>
                        </Col>
                        <Col span={9}>
                            <DatePicker onChange={this.bwonChange} style={{width: '98%'}}/>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 8}}>
                        <Col span={3}>
                            <span style={{lineHeight: '32px',color:'red'}}>通讯地址：</span>
                        </Col>
                        <Col span={9}>
                            <Input value={this.state.commAddr}
                                   onChange={e => this.setState({'commAddr': e.target.value})}
                                   style={{width: '98%'}}/>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 8}}>
                        <Col span={3}>
                            <span style={{lineHeight: '32px',color:'red'}}>关联终端：</span>
                        </Col>
                        <Col span={9}>
                            <Input value={this.state.terminName}
                                   onChange={e => this.setState({'terminName': e.target.value})}
                                   style={{width: '98%'}}/>
                        </Col>
                    </Row>
                    <Row style={{marginTop: 8}}>
                        <Col span={3}>
                            <span style={{lineHeight: '32px',color:'red'}}>电价模板：</span>
                        </Col>
                        <Col span={9}>
                            <Input value={this.state.schemeName}
                                   onChange={e => this.setState({'schemeName': e.target.value})}
                                   style={{width: '98%'}}/>
                        </Col>
                    </Row>
                </Row>
            ))
        )
        return(
            <div className="div-bodys">
                <div className="div-pages">
                    <div className="div_querys">
                        <div className="div_titles1 rightClass"><span><span>信息维护&nbsp;</span>&nbsp;<span className="dayuClass">电站档案维护</span></span></div>
                        <div className="div_titles">电站档案维护</div>
                        {/*<Tabs type="card">*/}
                        {/*<TabPane tab={<span></span>} key="1">*/}
                        <Row className="maxRow1">
                            <div className="container">
                                <div className="left" style={{height:'100%'}}>
                                    <div className="certain-category-search-wrapper searchInput">
                                        <AutoComplete
                                            className="certain-category-search"
                                            dropdownStyle={{ width:250 }}
                                            size="middle"
                                            style={{ width: '100%' }}
                                            dataSource={options}
                                            placeholder="请填写查询节点名称"
                                            optionLabelProp="value"
                                            onSelect={this.searchSelect}
                                            onSearch={this.handles}
                                        >
                                        </AutoComplete>
                                    </div>
                                    <div className="treeScroll">
                                        <Tree
                                            showIcon
                                            onExpand={this.onExpand.bind(this,this.state.flags)}
                                            expandedKeys={this.state.expandedKeys}
                                            autoExpandParent={this.state.autoExpandParent}
                                            defaultCheckedKeys={this.state.expandedKeys}
                                            checkStrictly={true}
                                            loadData={this.onLoadData}
                                            onSelect={this.onSelect}
                                            switcherIcon={<Icon type="down" style={{color:'#1890ff',width:5,height:5}}/>}
                                            className="ant-tree-switchers"
                                        >
                                            {this.renderTreeNodes(this.state.treeData,this.state.delData,this.state.dataFlag)}
                                        </Tree>
                                    </div>
                                </div>
                                <div  className="right">
                                    <Row style={{marginTop:21}}>
                                        {userButton}
                                    </Row>
                                    {/*<Divider/>*/}
                                    <Row className="jzRightTable" style={{marginTop:12}}>
                                        {/*<div className="" style={{marginTop:25,borderTop:'1px solid #e8e8e8'}}>*/}
                                        <Tabs defaultActiveKey="1">
                                            <TabPane tab={this.state.titles} key="1">
                                                {detailInfo}
                                            </TabPane>
                                        </Tabs>
                                    </Row>
                                    {/*</div>*/}
                                </div>
                            </div>
                        </Row>
                    </div>
                    <Modal title={this.state.modalName} visible={this.state.visible} width={800} height={700}
                           onCancel={this.addCancels} maskClosable={false} destroyOnClose={this.state.destoryd}
                           footer={[

                               <Button onClick={this.addCancels} style={{height: 35, width: 90}}>取消</Button>
                           ]}
                    >
                        <Row>
                            <Row style={{marginTop: 8}}>
                                <Col span={3}>
                                    <span style={{lineHeight: '32px',color:'red'}}>&emsp;&emsp;名称：</span>
                                </Col>
                                <Col span={9}>
                                <span><Input value={this.state.manageUnit}
                                             onChange={e => this.setState({'manageUnit': e.target.value})}
                                             style={{width: '98%'}}/></span>
                                </Col>
                            </Row>
                            {modalInput}

                        </Row>

                    </Modal>
                </div>
            </div>
        )
    }
    addCancels=()=>{
        this.setState({
            mdrCode:'',
            modalName:'',
            modelCode:'',
            moduleType:'',
            moduleArea:'',
            moduleCount:'',
            sortNo:'',
            deviceSpec:'',
            operationDate:'',
            commAddr:'',
            terminName:'',
            terminalId:'',
            branchCount:'',
            schemeName:'',
            schemeId:'',
            CT:'',
            PT:'',
            eleMeter:'1',
            visible:false,



        })
    }
    //并网时间时间改变
    bwonChange=(date,dateString)=>{
        this.setState({
            operationDate:dateString
        })
    }
    handleContainerClick=(e)=>{
        console.log("e",e)
        this.setState({
            visible:true,
            modalName:e.item.props.children,
            ceResSortNo:e.key,
        })

    }
    //获取树资源
    getLowerClass=(ceResClass,ceResNo)=>{
        console.log("ceReClass",ceResClass);
        console.log("ceResNo",ceResNo);
        reqwest({
            url: '/console/cust/getLowerClass',
            method: 'GET',
            credentials: 'include',
            data:{
                ceResClass:ceResClass,
                ceResNo:ceResNo,
            }
        }).then((data)=>{
            var ds=eval('('+data+')');
            console.log("lowerData",ds)
            this.setState({
                lowerData:ds,
            })
        })
    }
    //子组件修改或者删除后回调
    modifyAreas=(ceResName,flag)=> {
        console.log("dsadas",ceResName);
        const {treeNode, ceResClass} = this.state;
        treeNode.props.dataRef.title = ceResName;
        //flag等于2 说明是修改 为1说明是删除
        if (flag === "2") {
            this.setState({
                delData: treeNode.props.dataRef,
                dataFlag: flag,
                orgTitle: ceResName
            }, () => {
                this.renderTreeNodes(this.state.treeData, this.state.delData, this.state.dataFlag);

                //如果ceResclass 等于3 需要 查一下最新的详细信息展示出来
                if (ceResClass === 3) {
                    this.getOrgInfoDetail(treeNode.props.dataRef.key, ceResClass);
                }
                //this.getPartInfoById(partId);
            })
        } else {
            this.setState({
                delData: treeNode.props.dataRef,
                dataFlag: flag
            }, () => {
                // this.clearDetail();
                // this.getTopUnitInfos();
                this.renderTreeNodes(this.state.treeData, this.state.delData, this.state.dataFlag);
                //this.getPartInfoById(partId);
            })
        }
    }
    // getSearchNameList=()=>{
    //     reqwest({
    //         url:'/console/treeController/getNameList',
    //         method:'POST',
    //         credentials:'include'
    //     }).then((data)=>{
    //         var ds=eval('('+data+')');
    //         this.setState({
    //             dataList:ds
    //         })
    //     })
    // }
    handles=(value)=>{
        var dataSource=myReqwest.getTree(value,this.state.dataList)
        this.setState({
            dataSource
        },()=>{
            console.log("dataSource",this.state.dataSource)
        })

    }
    searchSelect=(value,option)=>{
        console.log("option",option)
        let url='/console/treeController/getSearchTreeList';

        let data={'id':option.key,'ceResClass':option.props.ceResClass};

        myReqwest.get(url,data,'GET').then((data)=>{
            console.log("data",data)
            var ds=eval('('+data+')');

            let expandedKeys=SearchTreeComon.getKeys(ds,this.state.expandedKeys);
            this.setState({
                selectKey: option.key,
                expandedKeys
            })
        })

    }
    //获取小区或企业信息
    getOrgInfoDetail=(key,ceResClass)=>{
        reqwest({
            url: '/console/heatingUserFiles/getUserInfoDetailById',
            method: 'GET',
            credentials: 'include',
            data: {
                userId: key,
                ceResClass: ceResClass
            }
        }).then((data) => {
            var ds = eval('(' + data + ')');
            this.setState({
                stationName:ds.ceResName,
                stationAddr:ds.ceCustAddr,
                contacter:ds.contacter,
                contactPhone:ds.contactPhone,
                detailLatitude:ds.latitude,
                detailLongitude:ds.longitude,
                position:[ds.longitude,ds.latitude],

            }, () => {

            })
        })
    }
    //新增区域成功后再此节点下自动生成子节点
    maxCustomInfo=()=>{
        //treeNode 为树的节点数据
        const{treeNode}=this.state;
        reqwest({
            url: '/console/kngfStationFiles/maxCustomInfo',
            method: 'GET',
            credentials: 'include',
            data:{
                id: treeNode.props.dataRef.key,
                ceResClass:treeNode.props.dataRef.ceResClass
            }
        }).then((data)=>{
            var ds=eval('('+data+')');
            console.log("dsa",ds[0])
            console.log("dsa",ds)
            this.setState({
                maxInfo:ds[0],
            },()=>{
                setTimeout(() => {
                    //查询出最新添加的一条 将他塞进此节点树数据的children里面 好进行动态添加
                    treeNode.props.dataRef.children.push(this.state.maxInfo);
                    this.setState({
                        treeData: [...this.state.treeData],
                    });

                }, 1000);
            })
        })
        console.log("getUserByOrg",this.state.treeData)
    }

    //初始化 获取顶层节点
    getTopUnitInfo=()=>{
        reqwest({
            url: '/console/kngfStationFiles/getOrgInfo',
            method: 'GET',
            credentials: 'include',
        }).then((data)=>{
            var ds=eval('('+data+')');
            var expandedKeys=[];
            expandedKeys.push(ds[0].key)
            var titles="坤能集团";
            if(ds[0].ceResClass===2)
            {
                titles="分公司";
            }
            this.setState({
                treeData:ds,
                //ceResClass:1,
                expandedKeys,
                orgTitle:ds[0].title,
                ceResClass:ds[0].ceResClass,
                superiorId:ds[0].key,
                titles
            },()=>{
                console.log("expandedKeys",this.state.expandedKeys)
                console.log("expandedKeys1",this.state.treeData)
            })
        })
    }

    //点击加号加载子节点时调用的方法
    onLoadData = treeNode => new Promise((resolve) => {
        console.log("treeNode",treeNode)
        if(treeNode.props.dataRef.ceResClass===1)
        {
            console.log("进来")
            this.setState({
                treeNode:treeNode,
                treeNode1:treeNode
            })
        }
        //如果树节点的层级是4的话那么 就不进行加载了
        if(treeNode.props.dataRef.ceResClass===5)
        {
            resolve();
            return;
        }
        reqwest({
            url: '/console/kngfStationFiles/getTreeInfos',
            method: 'GET',
            credentials: 'include',
            data: {
                id: treeNode.props.dataRef.key,
                ceResClass: treeNode.props.dataRef.ceResClass
            }
        }).then((data) => {
            var ds = eval('(' + data + ')');
            this.setState({
                treeData1: ds[0].result,
            }, () => {

            })
        })
        setTimeout(() => {
            console.log("ttreeData321",treeNode)
            //将获取到的子节点数据塞进父节点的children里面
            treeNode.props.dataRef.children = this.state.treeData1
            this.setState({
                treeData: [...this.state.treeData],
            }, () => {
            });
            resolve();
        }, 1000);
    })
    //展开时触发
    onExpand = (flag,expandedKeys,treeNode) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
            treeNode:treeNode,
            // flags:0
        },()=>{
            console.log("treeNodess",this.state.expandedKeys)
            console.log(this.truncate(this.state.expandedKeys))
        });
    }

    //删除数组的最后一个数据并返回 删除后的数据
    truncate=(arr)=> {
        var m = arr.slice(0);
        m.splice(m.length-1,1);
        return m;
    }

    //树节点选中时触发的方法 会将此节点的信息都显示在info里面
    onSelect = (selectedKeys, info) => {
        console.log("info.node.props.dataRef.ceResClass",info.node.props.dataRef.ceResClass)
        //通过判断此树节点的层级来显示 按钮 以及此节点的详细信息 和标题
        if(info.node.props.dataRef.ceResClass===1)
        {
            console.log("info.node.props.dataRef",info)
            this.setState({
                // userId:info.node.props.dataRef.key,
                ceResClass:info.node.props.dataRef.ceResClass,
                selectedKeys,
                treeNode:info.node,
                treeNode1:info.node,
                superiorId:info.node.props.dataRef.key,
                orgTitle:info.node.props.dataRef.title,
                titles:'坤能集团',
                // version:info.node.props.dataRef.version
            },()=>{
                // this.getOrgInfoDetail(info.node.props.dataRef.key);
            })
        }else if(info.node.props.dataRef.ceResClass===2)
        {
            this.setState({
                modalName:'新增小区档案',
                ceResClass:info.node.props.dataRef.ceResClass,
                treeNode:info.node,
                superiorId:info.node.props.dataRef.key,
                orgTitle:info.node.props.dataRef.title,
                titles:'分公司',
            },()=>{
                // this.getPartInfoById(info.node.props.dataRef.key);
                // this.getLowerClass(info.node.props.dataRef.ceResClass,info.node.props.dataRef.ceResSortNo);
            })
        }else if(info.node.props.dataRef.ceResClass===3)
        {
            console.log("info.node.props.dataRef.ceResClass",info.node.props.dataRef.ceResClass)
            this.setState({
                ceResClass:info.node.props.dataRef.ceResClass,
                treeNode:info.node,
                version:info.node.props.dataRef.version,
                superiorId:info.node.props.dataRef.key,
                titles:'光伏电站',
            },()=>{
                 this.getOrgInfoDetail(info.node.props.dataRef.key,info.node.props.dataRef.ceResClass);
            })

        }else if(info.node.props.dataRef.ceResClass===4) {
            this.setState({
                titles:'楼栋',
                ceResClass:info.node.props.dataRef.ceResClass,
                treeNode:info.node,
                version:info.node.props.dataRef.version,
                superiorId:info.node.props.dataRef.key,
                orgTitle:info.node.props.dataRef.title,
                titles:'空间区域',
            }, () => {
                // this.getBuildDetailInfo(info.node.props.dataRef.key,info.node.props.dataRef.ceResClass);
            })
        }
    }
    //这个吊东西就是用来循环树信息的 树的所有节点信息都是一层一层组合在一起的
    renderTreeNodes =(data,delData,dataFlag)=>data.map((item,i) => {
        //delData 是要删除和修改后的数据 如果delData 为0  说明没有修改和删除的数据 那么正常循环就好
        //如果不为0  dataFlag 如果为1 说名是删除数据 如果是2 为修改
        let {selectKey} = this.state;

        //title 算是一个拼接 将查询值所在位置 之前字符串 + 查询的值+查询值所在位置后的字符串 拼接起来  给 查询出来的值一个颜色标记
        const title =item.key===selectKey ?(
            <span style={{color: '#f50'}}>{item.title}</span>

        ) : <span>{item.title}</span>;

        console.log("data",data)
        if(delData!=="0") {
            if (dataFlag === "1") {
                if (item.key === delData.key) {

                    console.log("sadas", delData);
                    //从数组中/删除项目，然后返回被删除的项目
                    data.splice(i, 1);
                    this.setState({
                        delData: '0',
                        dataFlag:'0'
                    })
                    console.log('树形菜单数据源13', i);
                }
            } else if (dataFlag === "2") {
                if (item.key === delData.key) {
                    //如果循环出的key和修改数据的key相等
                    //如果修改了 数据的title 那么将修改后的title 赋值给循环出的树节点title
                    console.log("data[i].title", data[i].title)
                    item.title = delData.title;
                    data[i].title = delData.title;
                    this.setState({
                        delData: '0',
                        dataFlag:'0'

                    })
                }
            }
        }
        var img="";
        if (item.ceResClass === 1)
        {
            img=jituan;
        }else if(item.ceResClass === 2)
        {
            img=build;
        }else if(item.ceResClass === 3)
        {
            img=eleStation;
        }else if(item.ceResClass === 4)
        {
            img=factory;
        }else{
            img=gfDevice;
        }
        if (!item.children) {
            return (
                <TreeNode title={title} key={item.key} dataRef={item} icon={<img src={img} width={16} height={16} style={{marginBottom:14}}/>}/>
            )
        } else {
            return (
                <TreeNode title={title} key={item.key} dataRef={item} icon={<img src={img} width={16} height={16} style={{marginBottom:14}}/>}>
                    {this.renderTreeNodes(item.children,this.state.delData,this.state.dataFlag)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} dataRef={item} />;
    })
}
ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <RegionalFiles/>
    </LocaleProvider>,
    document.getElementById('root')
)