/*
   光伏电站新增修改弹窗
 */
import React from 'react';
import {LocaleProvider, Select, Table, Row, Col, Button, DatePicker, Input, Tabs, Tree, Icon, Modal, message} from 'antd';
import reqwest from 'reqwest';
import {Map, Marker, Markers} from 'react-amap';
import msgCommon from '../common/msgCommon';
import myReqwest from '../common/myReqwest';
import UploadFile  from '../component/UploadFiles';
import SearchTreeComon from '../common/SearchTreeComon';
import moment from 'moment';
import '../component/record.css';
let geocoder;
let placeSearch;
const {TextArea} = Input;
const TabPane = Tabs.TabPane;
const pageSize=5;

class StationModel extends React.Component {

    constructor(props) {
        console.log("props",props.areaName)
        super(props);
        this.state = {
            treeNode: [],
            flags: 0,
            orgTitle: '',
            titles: '',
            ceResClass: props.ceResClass,
            visible: false,
            destoryd: '',
            modalName: '',
            position: [113.271596,35.158266],
            citycode: '',
            adcode: '',
            latitude: '',
            longitude: '',
            lnglat: '',
            contacter: '',
            contactPhone: '',
            addAddrs: '',
            buttonType: 1,
            areaFlag: '',
            version: props.version,


            insertOrModify:0,
            areaName:props.areaName,
            stationNo:'',
            stationName:'',
            installCapacity:'',
            finishDate:'',
            parallelDate:'',
            voltageClass:'380',
            voltageClassList:[<option key="380">380V</option>,<option key="10000">10KV</option>,<option key="20000">20KV</option>,<option key="35000">35KV</option>,<option key="110000">110KV</option>],
            manageUnit:'',
            InvestmentUnit:'',
            buildUnit:'',
            designUnit:'',
            owner:'',
            stationAddr:'',
            superiorId:props.superiorId,
            terminName:'',
            selectedRowKeys: [],
            selTermIds: '',
            selNames: '',
            termFlag:'',
            termAddr:'',
            termNames:'',
            termIds:'',
            pagination: {pageSize: pageSize,current:1},
            termData:[],
            fileList:[],
            attachment:'',
            stationType:'1',
            stationTypeList:[<option key="1">全额上网</option>,<option key="2">自发自用余额上网</option>,<option key="3">全额自用</option>]
        }

    }


    componentWillReceiveProps(nextProps) {
        //console.log('PicturesWall-componentWillReceiveProps(nextProps)');

        this.setState({
            ceResClass: nextProps.ceResClass,
            superiorId: nextProps.superiorId,
            version: nextProps.version,
            areaName:nextProps.areaName,
        });
    }

    render() {
        const bcolumns=[
            {title: <div style={{fontWeight:'bold'}}>终端地址</div>, dataIndex: 'devTermCommAddr', width:'34%',align:'center'},
            {title: <div className="tableFontCss">终端型号</div>, dataIndex: 'modelCode',width:'33%',align:'center',className:'titleClass'},
            {title: <div className="tableFontCss">生产厂家</div>, dataIndex: 'mfrCode',width:'33%',align:'center',className:'titleClass'}
        ];
        const markerEvents = {};
        const zoom = 17;
        const plugins = [
            // 'MapType',
            'Scale',
            // 'OverView',
            {
                name: 'ToolBar',
                options: {
                    visible: true,  // 不设置该属性默认就是 true
                    onCreated(ins) {
                        console.log(ins);
                    },
                },
            }
        ]
        const events = {
            created(instance) {
                AMap.plugin('AMap.Geocoder', () => {
                    geocoder = new AMap.Geocoder({
                        city: "010"//城市，默认：“全国”
                    });
                })
                AMap.service(["AMap.PlaceSearch"], function () {
                    if (!placeSearch) {
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
                geocoder && geocoder.getAddress(lnglat, (status, result) => {
                    console.log(result);
                    if (status === 'complete') {
                        if (result.regeocode) {
                            this.setState({
                                position: lnglat,
                                citycode: result.regeocode.addressComponent.citycode,
                                adcode: result.regeocode.addressComponent.adcode,
                                latitude: e.lnglat.getLat(),
                                longitude: e.lnglat.getLng(),
                                lnglat: e.lnglat.getLng() + ',' + e.lnglat.getLat(),
                            }, () => {
                                console.log("lat", this.state.latitude)
                                console.log("longitude", this.state.longitude)
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
        let custButton = this.state.buttonType === 1 ? (
            <Button style={{marginLeft: 5, height: 35, width: 90}} type="primary" onClick={this.addConfirm}>
                确定
            </Button>
        ) : (
            <Button style={{marginLeft: 5, height: 35, width: 90}} type="primary" onClick={this.modifyConfirm}>
                确定
            </Button>
        );
        let modalValue =
            <Tabs defaultActiveKey="1">
                <TabPane tab="基本信息" key="1">
                    <Row>
                        <Row>
                            <Col span={3}>
                                <label  className="labelCss">电站名称：</label>
                            </Col>
                            <Col span={21}>
                                <Input value={this.state.stationName}
                                       onChange={e => this.setState({'stationName': e.target.value})}
                                       style={{width: '98%'}}/>
                            </Col>
                        </Row>
                        {/*<Row style={{marginTop: 8}}>*/}
                            {/*<Col span={3}>*/}
                                {/*<span style={{lineHeight: '32px',color:'red'}}>电站地址：</span>*/}
                            {/*</Col>*/}
                            {/*<Col span={21}>*/}
                                {/*<Input value={this.state.stationAddr}*/}
                                       {/*onChange={e => this.setState({'stationAddr': e.target.value})}*/}
                                       {/*style={{width: '98%'}}/>*/}
                            {/*</Col>*/}
                        {/*</Row>*/}
                        <Row style={{marginTop: 8}}>
                            <Col span={3}>
                                <label  className="labelCss">电站编号：</label>
                            </Col>
                            <Col span={9}>
                                <span><Input value={this.state.stationNo}
                                             onChange={e => this.setState({'stationNo': e.target.value})}
                                             style={{width: '98%'}}/></span>
                            </Col>

                            <Col span={3}>
                                <label  className="labelCss">装机容量：</label>
                            </Col>
                            <Col span={9}>
                                <span><Input value={this.state.installCapacity}
                                       onChange={e => this.setState({'installCapacity': e.target.value})}
                                       style={{width: '83%'}}/><span style={{color:'red'}}>  (kWp)</span></span>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 8}}>
                            <Col span={3}>
                                <label  className="labelCss1">完成日期：</label>
                            </Col>
                            <Col span={9}>
                                <DatePicker onChange={this.onChange} style={{width: '98%'}} defaultValue={moment(this.state.finishDate,"YYYY-MM-DD")}/>
                            </Col>

                            <Col span={3}>
                                <label  className="labelCss1">并网日期：</label>
                            </Col>
                            <Col span={9}>
                                <DatePicker onChange={this.bwonChange} style={{width: '98%'}} defaultValue={moment(this.state.parallelDate,"YYYY-MM-DD")}/>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 8}}>
                            <Col span={3}>
                                <label  className="labelCss1">电压等级：</label>
                            </Col>
                            <Col span={9}>
                                <Select value={this.state.voltageClass}
                                        onChange={value => this.setState({'voltageClass': value})}
                                        style={{width: '98%'}}
                                >
                                    {this.state.voltageClassList}
                                </Select>
                            </Col>
                            <Col span={3}>
                                <label  className="labelCss">电站形式：</label>
                            </Col>
                            <Col span={9}>
                                <Select value={this.state.stationType}
                                        onChange={value => this.setState({'stationType': value})}
                                        style={{width: '98%'}}
                                >
                                    {this.state.stationTypeList}
                                </Select>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 8}}>
                            <Col span={3}>
                                <label  className="labelCss1">&emsp;联系人：</label>
                            </Col>
                            <Col span={9}>
                                <Input value={this.state.contacter}
                                       onChange={e => this.setState({'contacter': e.target.value})}
                                       style={{width: '98%'}}/>
                            </Col>
                            <Col span={3}>
                                <label  className="labelCss1">联系电话：</label>
                            </Col>
                            <Col span={9}>
                                <Input value={this.state.contactPhone}
                                       onChange={e => this.setState({'contactPhone': e.target.value})}
                                       style={{width: '98%'}}/>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 8}}>
                            <Col span={3}>
                                <label  className="labelCss">关联终端：</label>
                            </Col>
                            <Col span={21}>
                                <a href="#" onClick={this.openTermModal}>
                                <TextArea placeholder="请点击选择要关联的采集终端" rows={2} value={this.state.termNames}
                                          style={{width:'99%'}} readOnly/>
                                </a>
                            </Col>
                        </Row>
                    </Row>
                </TabPane>
                <TabPane tab="电站相关方" key="2">
                    <Row>
                        <Row style={{marginTop: 8}}>
                            <Col span={3}>
                                <label  className="labelCss">管理单位：</label>
                            </Col>
                            <Col span={21}>
                                <span><Input value={this.state.manageUnit}
                                             onChange={e => this.setState({'manageUnit': e.target.value})}
                                             style={{width: '99%'}}/></span>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 8}}>
                            <Col span={3}>
                                <label  className="labelCss">投资单位：</label>
                            </Col>
                            <Col span={9}>
                                <Input value={this.state.InvestmentUnit}
                                       onChange={e => this.setState({'InvestmentUnit': e.target.value})}
                                       style={{width: '98%'}}/>
                            </Col>

                            <Col span={3}>
                                <label  className="labelCss1">设计单位：</label>
                            </Col>
                            <Col span={9}>
                                <Input value={this.state.designUnit}
                                       onChange={e => this.setState({'designUnit': e.target.value})}
                                       style={{width: '98%'}}/>
                            </Col>
                        </Row>
                        <Row style={{marginTop: 8}}>
                            <Col span={3}>
                                <label  className="labelCss1">施工单位：</label>
                            </Col>
                            <Col span={9}>
                                <Input value={this.state.buildUnit}
                                       onChange={e => this.setState({'buildUnit': e.target.value})}
                                       style={{width: '98%'}}/>
                            </Col>
                            <Col span={3}>
                                <label  className="labelCss1">屋顶业主：</label>
                            </Col>
                            <Col span={9}>
                                <Input value={this.state.owner}
                                       onChange={e => this.setState({'owner': e.target.value})}
                                       style={{width: '98%'}}/>
                            </Col>
                        </Row>
                    </Row>
                </TabPane>
                <TabPane tab="地理位置" key="3">
                    <Row style={{marginTop: 5}}>
                        <Col span={2} style={{lineHeight: '32px'}}>
                            <span>地图搜索</span>
                        </Col>
                        <Col span={20}>
                            <Input value={this.state.addAddrs}
                                   onChange={e => this.setState({'addAddrs': e.target.value})}
                                   style={{width: '98%'}}/>
                        </Col>
                        <Col span={2} style={{lineHeight: '32px'}}>
                            <Button type="primary" onClick={this.searchMap} htmlType="submit"
                                    style={{marginLeft: -5}}>搜索</Button>
                        </Col>
                    </Row>
                    <Row style={{height: 400, marginTop: 10}}>
                        <div style={{position: 'absolute', width: '100%', height: 400}}>
                            <Map center={this.state.position} events={events} plugins={plugins} zoom={zoom}>
                                <Marker position={this.state.position} events={markerEvents}/>
                            </Map>
                        </div>
                    </Row>
                    <Row style={{marginTop: 5}}>
                        <Col span={2} style={{lineHeight: '32px'}}>
                            <span>坐标信息</span>
                        </Col>
                        <Col span={22}>
                            <Input value={this.state.lnglat} style={{width: '100%'}} disabled/>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tab="附件信息" key="4">
                    <UploadFile  fileList={this.state.fileList}  fn={this.setUserProp} change={this.changes}/>
                </TabPane>
            </Tabs>;
        let operButton = this.state.ceResClass === 2 ? (
            <Row>
              <span>
                <Button style={{marginLeft: 16}} type="primary" onClick={this.openCommunity.bind(this, 1, 1)}>
                     新增电站
               </Button>
              </span>
            </Row>
        ) : (
            this.state.ceResClass===3?(
                <Row>
                   <span>
                    <Button style={{marginLeft:16}} type="primary"
                            onClick={this.openAreaModals.bind(this,1)}>
                          新增空间
                    </Button>
                   </span>
                    <span>
                      <Button style={{marginLeft:16}} type="primary" onClick={this.deleteStation}>
                         删除
                      </Button>
                   </span>
                    <span>
                      <Button style={{marginLeft:16}} type="primary" onClick={this.openCommunity.bind(this, 1, 2)}>
                         修改
                      </Button>
                   </span>
                </Row>
            ):(
                <span>
                      <Button style={{marginLeft:16}} type="primary" onClick={this.deleteArea}>
                         删除
                      </Button>

                      <Button style={{marginLeft:16}} type="primary" onClick={this.openAreaModals.bind(this,2)}>
                         修改
                      </Button>
                </span>

            )
        );
         const{selectedRowKeys}=this.state;
        const rowSelections = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                console.log('selectedRowKeys changed: ', selectedRows);
                var termIds = "";
                var termNames = "";
                console.log('schemeId', selectedRows);
                console.log('selectedRowKeys', selectedRowKeys);
                if (selectedRowKeys.length > 0) {
                    for (var i = 0; i < selectedRowKeys.length; i++) {
                        termIds = termIds + selectedRowKeys[i] + ',';
                        //stationNames=stationNames+ selectedRows[i].stationName+',';
                        //rselectedRowKeys.push(selectedRows[i].key);
                    }
                }
                if (selectedRows.length > 0) {
                    for (var i = 0; i < selectedRows.length; i++) {
                        termNames = termNames + selectedRows[i].devTermName + ',';
                        //stationNames=stationNames+ selectedRows[i].stationName+',';
                        //rselectedRowKeys.push(selectedRows[i].key);
                    }
                }
                console.log("termName", termNames)
                console.log('schemeId', selectedRowKeys);
                this.setState({
                    selectedRowKeys: selectedRowKeys,
                    selTermIds: termIds.substring(0, termIds.length - 1),
                    selNames: termNames.substring(0, termNames.length - 1)
                });
            },
        };
        var pageSize=this.state.pagination.pageSize;
        var total=this.state.pagination.total;
        return (
            <Row>
                {operButton}
                <Row>
                    <Modal title={this.state.modalName} visible={this.state.visible} width={800} height={700}
                           onCancel={this.addCancels} maskClosable={false} destroyOnClose={this.state.destoryd}
                           footer={[
                               custButton,
                               <Button onClick={this.addCancels} style={{height: 35, width: 90}}>取消</Button>
                           ]}
                    >
                        {modalValue}
                    </Modal>

                    <Modal title={this.state.modalName} visible={this.state.areaFlag === '1' ? true : false} width={600}
                           height={700}
                           onCancel={this.areaCancels} maskClosable={false} destroyOnClose={this.state.destoryd}
                           footer={[
                               <Button style={{marginLeft: 5, height: 35, width: 90}} type="primary"
                                       onClick={this.operConfirm}>
                                   确定
                               </Button>,

                               <Button onClick={this.areaCancels} style={{height: 35, width: 90}}>取消</Button>
                           ]}
                    >
                        <Row>
                            <Col span={4}>
                                <label  className="labelCss">空间名称：</label>
                            </Col>
                            <Col span={12}>
                                <Input value={this.state.areaName}
                                       onChange={e => this.setState({'areaName': e.target.value})}
                                       style={{width: '98%'}}/>
                            </Col>
                        </Row>
                    </Modal>

                    <Modal
                        title="关联终端" visible={this.state.termFlag==='1'?true:false} width={600} height={300}
                        onCancel={this.termCancel}   maskClosable={false}
                        footer={[
                            <Button type="primary" onClick={this.termConfirm} style={{width:90,height:32}}>确定</Button>,
                            <Button  onClick={this.termCancel} style={{width:90,height:32}}>取消</Button>
                        ]}
                    >

                        <Row style={{marginTop:0}}>
                            <Col span={20}>
                                <Row>
                                    <span style={{lineHeight:'32px',float:'left'}}>终端地址：</span>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span style={{marginLeft:5}}>
                                        <Input value={this.state.termAddr} onChange={(e)=>this.setState({'termAddr':e.target.value})} style={{width:'57%'}}/>
                                    </span>
                                </Row>
                            </Col>
                            <Col span={3}>
                                <Button type="primary" onClick={this.getTermInfo} style={{marginTop:0}}>查询</Button>
                            </Col>
                        </Row>
                        <Row style={{border:'1px solid #e8e8e8',marginTop:12}} >
                            <div style={{paddingLeft: '10px',paddingRight:'10px',paddingTop:'10px',paddingBottom:'10px'}}>
                                <Row className="RegSecondDiv">
                                    <Table
                                        className="components-table-demo-nested"
                                        columns={bcolumns}
                                        dataSource={this.state.termData}
                                        pagination={{
                                            total:total,
                                            pageSize:pageSize,
                                            current:this.state.currents,
                                            showTotal:function () {
                                                return <div style={{marginRight:10,marginTop:5}}> 共计  {total}  条数据</div>
                                            }
                                        }}
                                        rowSelection={rowSelections}
                                        // onChange={this._BhandleTableChange}
                                    />
                                </Row>
                            </div>
                        </Row>
                    </Modal>
                </Row>
            </Row>
        )
    }

    changes=(file,fileLists)=>{
        const{fileList}=this.state;
        console.log("file",file)
        var data={"uid":file.uid,"name":file.response[0].name,"type":file.response[0].type,"url":file.response[0].url};
        fileList.push(data);
        console.log("changes",fileList)
        this.setState({
            // file:file,
            fileList,
        },()=>{
            console.log("fileList",this.state.fileList)
        })
    }

     //子组件调用父组件方法
    //上传图片
    setUserProp=(url)=>{
        //查看是否存在图片
        if(this.state.attachment.length>0) {

            var checkPhoto = this.state.attachment.split(',');
            var newAttachment="";
            var flag=0;
            checkPhoto.map(item => {
                if (item !== url) {
                    console.log('irem',item)
                    newAttachment=item+','+newAttachment;
                }else{
                    flag=1;
                }
            })
            if(flag===0)
            {
                newAttachment=newAttachment+url;
            }
            if(newAttachment===",")
            {
                newAttachment="";
            }
            this.setState({
                attachment: newAttachment
            }, () => {
                console.log('attachment', this.state.attachment);
            })
        }else{
            var attachment = this.state.attachment + url;
            this.setState({
                attachment: attachment
            }, () => {
                console.log('attachment', this.state.attachment);
            })
        }

    }
    //加载终端列表
    getTermInfo=()=>{
        var pagination={...this.state.pagination};
        pagination.current=1;
        this.setState({
            currents:1,
            pagination
        },()=>{
            this.termFetch();
        })
    }
    termFetch=()=>{
        const{termAddr,superiorId}=this.state;
        console.log("superiorId",superiorId)
        reqwest({
            url:'/console/heatStationFiles/getTermListInfo',
            method:'GET',
            credentials:'include',
            data:{
                termStatus:'',
                termAddr:termAddr,
                superiorId:superiorId,
                start:0,
                ceResClass:1,
            }
        }).then((data)=>{
            console.log("data",data);
            var ds=eval('('+data+')');
            var pagination={...this.state.pagination};
            pagination.total=ds[0].total;
            this.setState({
                pagination,
                termData:ds[0].result
            })
        })
    }
    openTermModal=()=>{
        this.setState({
            termFlag:'1'
        },()=>{
            this.getTermInfo();
        })
    }
    //关联终端弹框 关闭
    termCancel=()=>{
        this.setState({
            termFlag:'',
            termAddr:'',
            // selTermIds:'',
            // selNames:''
        })
    }

    //选择终端
    termConfirm=()=>{
        const{selTermIds,selNames}=this.state;
        console.log("selNames",selNames)
        var selectedRowKeys=[];

        var termIds=selTermIds.split(",");
        for(var i=0;i<termIds.length;i++)
        {
            selectedRowKeys.push(termIds[i]);
        }
        this.setState({
            termFlag:'',
            termNames:selNames,
            termIds:selTermIds,
            selectedRowKeys,
            termAddr:''
        },()=>{
            // console.log("stationIds :",this.state.stationIds);
            // console.log("rselectedRowKeys :",this.state.rselectedRowKeys);
        })
    }

    //完成时间时间改变
    onChange=(date,dateString)=>{
        this.setState({
            finishDate:dateString
        })
    }
    //并网时间时间改变
    bwonChange=(date,dateString)=>{
        this.setState({
            parallelDate:dateString
        })
    }
    operConfirm=()=>{
        const{insertOrModify,areaName}=this.state;
        if(areaName==="")
        {
            msgCommon.get("空间名称不能为空","error");
            return;
        }
        if(insertOrModify===1)
        {
            this.addArea();
        }else{
            this.modifyArea();
        }
    }

    addArea=()=>{
        const{areaName,superiorId}=this.state;
        var data={"areaName":areaName,'superiorId':superiorId};
        var url='/console/kngfStationFiles/addArea';
        myReqwest.get(url,data,"POST").then((data)=>{
             var ds=eval('('+data+')');
             if(ds.result)
             {
                 msgCommon.get("空间新增成功","success");
                 this.addTree();
                 this.areaCancels();
             }
        })
    }
    //删除区域 但是首先要查看下面是否有子节点
    deleteArea=()=> {
        const {superiorId} = this.state;
        console.log("superiorId", superiorId)
        reqwest({
            url: '/console/kngfStationFiles/deleteArea',
            method: 'POST',
            data: {
                id: superiorId,
            },
            credentials: 'include',
        }).then((data) => {
            var ds = eval('(' + data + ')');
            if (ds[0].status === "0") {
                message.success(ds[0].message)
                this.deleteOrModify("", "1");

            } else if (ds[0].status === "-1") {
                message.error(ds[0].message);
            } else {
                message.error(ds[0].message);
            }
        })
    }
    //空间修改
    modifyArea = () => {
        const {areaName, superiorId, version} = this.state;
        reqwest({
            url: '/console/kngfStationFiles/modifyArea',
            method: 'POST',
            data: {
                areaName: areaName,
                superiorId: superiorId,
                version:version
            },
            credentials: 'include',
        }).then((data) => {
            var ds = eval('(' + data + ')');
            console.log(ds)
            if (ds[0].status === "0") {
                message.success(ds[0].message);
                this.deleteOrModify(areaName, "2");//调用父节点的方法 控制树的展示
                this.areaCancels();
            } else if (ds[0].status === "1") {
                message.error(ds[0].message);
            } else {
                message.error(ds[0].message);
            }
        })
    }

    //删除光伏电站 但是首先要查看下面是否有子节点
    deleteStation=()=>{
        const{superiorId}=this.state;
        console.log("superiorId",superiorId)
        reqwest({
            url: '/console/kngfStationFiles/deleteStation',
            method: 'POST',
            data: {
                id: superiorId,
            },
            credentials: 'include',
        }).then((data) => {
            var ds = eval('(' + data + ')');
            if (ds[0].status==="0") {
                message.success(ds[0].message)
                this.deleteOrModify("","1");

            }else if(ds[0].status==="-1")
            {
                message.error(ds[0].message);
            }else{
                message.error(ds[0].message);
            }
        })
    }

    //关闭区县弹窗
    areaCancels = () => {
        this.setState({
            areaName: '',
            areaFlag: '',
            modalName: ''
        })
    }

    //打开建筑区域弹窗
    openAreaModals = (flag) => {
        const {areaName} = this.state;
        var modalName="修改空间";
        var insertOrModify=0;
        var areaNames="";
        if(flag===1)
        {
            modalName="新增空间";
            insertOrModify=1;
        }else{
            areaNames=areaName;
        }
        this.setState({
            areaName: areaNames,
            areaFlag: '1',
            modalName,
            insertOrModify
        },()=>{
            console.log("insertOrModify",insertOrModify)
        })
    }
    //修改电站
    modifyConfirm=()=>{
        var reg = /^\d+$|^\d*\.\d+$/g;
        var regx = /^[0-9]*[1-9][0-9]*$/;
        //正整数
        var regss=/^[1-9]\d*$/;
        var regxx = /^1[3|5|8|7][0-9]\d{4,8}$/;

        var stationNos="";
        const {
            citycode, adcode, latitude, longitude, lnglat, stationNo,
            stationName, installCapacity, termIds,voltageClass, fileList,stationType,manageUnit,attachment,
            stationAddr,superiorId,InvestmentUnit, buildUnit,version, contacter, contactPhone,owner,designUnit,finishDate,parallelDate
            } = this.state;
        if (stationName === "") {
            message.error("请输入电站名称");
            return;
        }

        //校验1到9999的数字
        var reghh=/^([0-1][0-9][0-9][0-9])|(2[0-4][0-9][0-9])|(9999)$/;
        console.log("reghh",reghh.test("25jgjh0"))
        if (stationNo === ""||!reghh.test(stationNo)||stationNo.length>4) {
            message.error("电站编号只能是正整数且不能超过4位");
            return;
        }
        // if (contacter === "") {
        //     message.error("请填写联系人信息");
        //     return;
        // }
        // if (finishDate === "") {
        //     message.error("完成时间不能为空");
        //     return;
        // }
        // if (parallelDate === "") {
        //     message.error("并网时间不能为空");
        //     return;
        // }
        if (installCapacity === "") {
            message.error("装接容量不能为空");
            return;
        }

        if(termIds==="")
        {
            message.error("请选择关联终端");
            return;
        }
        /**
         * 投资单位不能 为空 但是现在还没有做这个功能
         */
        // if(InvestmentUnit==="")
        // {
        //     message.error("投资单位不能为空");
        //     return;
        // }

        if (contactPhone !== ""&&(!regxx.test(contactPhone) || contactPhone.length < 11)) {
            message.error("请填写正确的手机号码");
            return;
        }
        if (lnglat === "") {
            message.error("请点击选择电站的坐标信息");
            return;
        }
        stationNos=myReqwest.getNo(stationNo);
        reqwest({
            url: '/console/kngfStationFiles/modifyStation',
            method: 'POST',
            data: {
                citycode: citycode,
                adcode: adcode,
                latitude: latitude,
                longitude: longitude,
                stationNo: stationNos,
                contacter: contacter,
                contactPhone: contactPhone,
                voltageClass:voltageClass,
                stationName:stationName,
                userAddr:stationAddr,
                superiorId:superiorId,
                termId:termIds,
                attachment:attachment,
                finishDate:finishDate,
                parallelDate:parallelDate,
                installCapacity:installCapacity,
                stationType:stationType,
                fileList:JSON.stringify(fileList),
                version:version

            },
            credentials: 'include',
        }).then((data) => {
            var ds = eval('(' + data + ')');
            if (ds[0].status === "0") {
                message.success("电站信息修改成功");
                this.deleteOrModify(stationName,"2");
                this.addCancels();

                // this.props.fns(neighborHoodName, "2");
            } else {
                message.error(ds[0].message);
            }
        })
    }
    //新增光伏电站
    addConfirm = () => {
        var reg = /^\d+$|^\d*\.\d+$/g;
        var regx = /^[0-9]*[1-9][0-9]*$/;
        //正整数
        var regss=/^[1-9]\d*$/;
        var regxx = /^1[3|5|8|7][0-9]\d{4,8}$/;

        var stationNos="";
        const {citycode, adcode, latitude, longitude, lnglat, stationNo,
            stationName, installCapacity, termIds,voltageClass, fileList,stationType,manageUnit,attachment,
            stationAddr,superiorId,InvestmentUnit, buildUnit, contacter, contactPhone,owner,designUnit,finishDate,parallelDate} = this.state;
        console.log("fileList",fileList)
        if (stationName === "") {
            message.error("请输入电站名称");
            return;
        }
        //校验1到9999的数字
        var reghh=/^([0-1][0-9][0-9][0-9])|(2[0-4][0-9][0-9])|(9999)$/;
        if (stationNo === ""||!reghh.test(stationNo)||stationNo.length>4) {
            message.error("电站编号只能是正整数且不能超过4位");
            return;
        }
        // if (contacter === "") {
        //     message.error("请填写联系人信息");
        //     return;
        // }
        // if (finishDate === "") {
        //     message.error("完成时间不能为空");
        //     return;
        // }
        if (installCapacity === "") {
            message.error("装接容量不能为空");
            return;
        }
        // if (parallelDate === "") {
        //     message.error("并网时间不能为空");
        //     return;
        // }
        if (contactPhone !== "" && (!regxx.test(contactPhone) || contactPhone.length < 11)) {
            message.error("请填写正确的手机号码");
            return;
        }
        if (lnglat === "") {
            message.error("请点击选择电站的坐标信息");
            return;
        }
       if(termIds==="")
       {
           message.error("请选择关联终端");
           return;
       }
        /**
         * 投资单位不能 为空 但是现在还没有做这个功能
         */
        // if(InvestmentUnit==="")
        // {
        //     message.error("投资单位不能为空");
        //     return;
        // }

        stationNos=myReqwest.getNo(stationNo);
        reqwest({
            url: '/console/kngfStationFiles/addStation',
            method: 'POST',
            data: {
                citycode: citycode,
                adcode: adcode,
                latitude: latitude,
                longitude: longitude,
                stationNo: stationNos,
                contacter: contacter,
                contactPhone: contactPhone,
                voltageClass:voltageClass,
                stationName:stationName,
                userAddr:stationAddr,
                superiorId:superiorId,
                termId:termIds,
                attachment:attachment,
                finishDate:finishDate,
                parallelDate:parallelDate,
                installCapacity:installCapacity,
                stationType:stationType,
                fileList:JSON.stringify(fileList)


            },
            credentials: 'include',
        }).then((data) => {
            var ds = eval('(' + data + ')');
            if (ds[0].status==='0') {
                message.success("电站新增成功");
                this.addTree();
                this.addCancels();
            } else {
                message.error(ds[0].message);
            }
        })
    }
    //打开小区弹窗 flag 是区分小区和企业的  buttonType是区分新增和修改的
    openCommunity = (flag, buttonType) => {
        console.log("进入openCommunity")
        const{superiorId,ceResClass,treeNode}=this.state;
        if(buttonType===2)
        {
            this.setState({
                buttonType: buttonType,

            },()=>{
                this.getOrgInfoDetail(superiorId,ceResClass);
                // this.getVoltageClass();
            })
        }else{
            this.setState({
                visible: true,
                neighborhoodType: flag,
                buttonType: buttonType,
                finishDate:moment().format("YYYY-MM-DD"),
                parallelDate:moment().format("YYYY-MM-DD"),
                manageUnit:this.props.areaName
            },()=>{
                // this.getVoltageClass();
            })
        }
    }
    // //获取电压等级
    // getVoltageClass=()=> {
    //     reqwest({
    //         url: '/console/cust/getVoltageClass',
    //         method: 'GET',
    //         credentials: 'include',
    //     }).then((data) => {
    //         var ds = eval('(' + data + ')');
    //         this.setState({voltageClassList:ds.map(option=><Option key={option.codeValue}>{option.codeName}</Option>),voltageClass:ds[0].codeValue},()=>{
    //
    //         });
    //     })
    // }

    //修改时获取电站详情
    getOrgInfoDetail=(key,ceResClass)=> {
        console.log("asdasd",key)
        reqwest({
            url: '/console/kngfStationFiles/getStationDetailById',
            method: 'GET',
            credentials: 'include',
            data: {
                id: key,
                ceResClass: ceResClass
            }
        }).then((data) => {
            var ds = eval('(' + data + ')');

            var ds1=eval('('+ds.ceCustProps+')');
            console.log("finishDate",moment(ds1.finishDate))
            console.log("ds",ds);
            this.setState({
                visible:true,
                superiorId:ds.id,
                contacter: ds.contacter,
                contactPhone: ds.contactPhone,
                latitude: ds.latitude,
                longitude: ds.longitude,
                citycode: ds.citycode,
                adcode: ds.adcode,
                lnglat:ds.longitude.toString()+","+ds.latitude.toString(),
                position:[ds.longitude,ds.latitude],
                version:ds.version,
                stationNo:ds.ceResNo,
                stationName:ds.ceResName,
                installCapacity:ds1.installCapacity,
                finishDate:ds1.finishDate,
                parallelDate:ds1.parallelDate,
                voltageClass:ds.voltageClass,
                manageUnit:'',
                InvestmentUnit:'',
                buildUnit:'',
                designUnit:'',
                owner:'',
                stationAddr:ds.ceCustAddr,
                stationType:ds1.stationType,

            }, () => {
                this.getTermInfoByStationId();
                this.getAttachByUserId();
            })
        })
    }

    /**
     * 通过电站Id获取终端信息
     */
    getTermInfoByStationId=()=>{
        const{superiorId}=this.state;
        var data={"id":superiorId};
        myReqwest.get("/console/kngfStationFiles/getTermInfoByResId",data,"POST").then((data)=>{
            var ds=eval('('+data+')');
            var  termNames="";

            var   termIds="";

            var selectedRowKeys=[];

            for(var i=0;i<ds.length;i++)
            {
                termNames=termNames+ds[i].devTermName+",";
                termIds=termIds+ds[i].key+",";
                selectedRowKeys.push(ds[i].key);
            }
            this.setState({
                termNames:termNames.substring(0,termNames.length-1),
                termIds:termIds.substring(0,termIds.length-1),
                selectedRowKeys
            })
        })
    }
    //获取上传文件信息
    getAttachByUserId=()=>{
        const{superiorId}=this.state;
        reqwest({
            url: '/console/kngfStationFiles/getResourceAttachDoByResId',
            method: 'GET',
            credentials: 'include',
            data: {
                id: superiorId,
            }
        }).then((data) => {
            var ds = eval('(' + data + ')');
            console.log(ds);
            this.setState({
                fileList:ds
            }, () => {
                console.log("fileList",this.state.fileList)
            })
        })
    }
    //根据地址搜索
    searchMap = () => {
        const {addAddrs} = this.state;
        console.log("searchMap", addAddrs)
        let v = addAddrs;
        let _this = this;
        if (placeSearch) {
            placeSearch.search(v, function (status, result) {
                if (status == 'complete') {
                    var list = result.poiList;
                    var pois = list.pois;
                    console.log("ceCustAddr", pois[0])
                    if (pois.length > 0) {
                        _this.setState({
                            position: pois[0].location,
                        }, () => {
                            // console.log("position",this.state.position)
                            _this.searchMapByLn(pois[0].location)
                        })
                    }

                }
            });
        }
    }

    //根据经纬度搜索
    searchMapByLn(lnglat){
        console.log("lnglat",lnglat)
        geocoder&&geocoder.getAddress(lnglat, (status, result) => {
            console.log("111",result);
            if (status === 'complete'){
                if (result.regeocode){
                    this.setState({
                        position: lnglat,
                        citycode:result.regeocode.addressComponent.citycode,
                        adcode:result.regeocode.addressComponent.adcode,
                        latitude:lnglat.getLat(),
                        longitude:lnglat.getLng(),
                        lnglat:lnglat.getLng()+','+lnglat.getLat(),
                    },()=>{
                    });
                } else {

                }
            } else {
            }
        })
    }

    addCancels = () => {
        this.setState({
            visible: false,
            destoryd: true,
            citycode: '',
            adcode: '',
            latitude: '',
            longitude: '',
            lnglat: '',
            contacter: '',
            contactPhone: '',
            addAddrs: '',
            stationNo:'',
            stationName:'',
            installCapacity:'',
            finishDate:'',
            parallelDate:'',
            voltageClass:'380',
            // voltageClassList:[],
            manageUnit:'',
            InvestmentUnit:'',
            buildUnit:'',
            designUnit:'',
            owner:'',
            stationAddr:'',
            terminName:'',
            selectedRowKeys: [],
            selTermIds: '',
            selNames: '',
            termFlag:'',
            termAddr:'',
            termNames:'',
            termIds:'',
            termData:[],
            fileList:[],
            attachment:'',
            stationType:'1',
            position:[113.271596,35.158266]
        }, () => {

        })
    }

    //新增时调用父节点的方法  在树的该子节点的下面新增一条
    addTree = () => {
        console.log("dsasdas");
        this.props.fns();
    }

    deleteOrModify=(name,flag)=>{
        this.props.func(name, flag);
    }
}

export default StationModel;