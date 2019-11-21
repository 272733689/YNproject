import { LocaleProvider, Select, Table, Row, Switch, Card, Col, Divider, Button, Input, Pagination , Modal, message, List ,TreeSelect} from 'antd';
import React from 'react';
import ReactDOM from 'react-dom';
import './auditing1.less';
import img from './img/xianlu.png';
import edit from './img/edit.png';
import reqwest from 'reqwest';
import zhCN from 'antd/lib/locale-provider/zh_CN';
const { Meta } = Card;
const count = 3;
const Option = Select.Option;

var status=false;
class JalaSmartLineTable extends React.Component {

    componentWillMount() {
        this.getInitState();
        this.timerID = setInterval(
            () => this.deviceChange(this.state.gateWayId),
            15000
        );
    }
    getInitState = () => {
        this.getDeviceInfo();
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    componentDidMount() {
        // this.getTree();
    };



    onChangePagination = page => {
        // 传入的当前第几页。 返回data 的数据
        this.setState({
            current: page,
        }, () => {
            this.getLineInfo();
        });

    };


    state = {
        total :'',
        current: 1,
        tasktimer : true,
        device: '',
        deviceList: [],
        lineData: [],
        online: '',
        devAccessDetail: '',
        visible: false,
        visible2: false,
        RegSecondDivs: '',
        measPointId: '',
        measPointName: '',
        gateWayId: '',
        lineFlag: 1,

        maxCurrent : ' ',   //额定电流值
        maxVoltage : ' ',   // 过压值
        minVoltage  : ' ',   // 欠压值
        leakValue  : ' ',    // 漏电预警值
        LineId  :  "",
        switchLineParameter :'', //打开设置时 根据这个属性 确认数据库是否有记录

        verification:false, //验证
        password :'',
        WhichPassword:1,
        switchs:'',
        switchsChecked : '',
        isEnableGas  : '' ,
        delcount:0,
        treeData :[] , // 树的数据 啊

        /*        treeData : [
         {
         title: 'Node1',
         value: '0-0',
         key: '0-0',
         children: [
         {
         title: 'Child Node1',
         value: '0-0-1',
         key: '0-0-1',

         },
         {
         title: 'Child Node2',
         value: '0-0-2',
         key: '0-0-2',
         },
         ],
         },
         {
         title: 'Node2',
         value: '0-1',
         key: '0-1',
         },
         ],*/

    }
    render() {
        const data = [
            {
                title: 'Ant Design Title 1',
            },
            {
                title: 'Ant Design Title 2',
            },
            {
                title: 'Ant Design Title 3',
            },
            {
                title: 'Ant Design Title 4',
            },
        ];

        let lineChose = this.state.lineFlag === 1 ? (
            <List
                size="large"
                dataSource={this.state.lineData}
                renderItem={item => (
                    <div style={{ background: 'white', padding: '1px' }}>
                        <Row>
                            <List.Item
                                style={{ paddingTop: 8, paddingBottom: 8 }}
                                actions={[
                                ]}>
                                <List.Item.Meta
                                    title={
                                        <Row>
                                            <div style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '0px', paddingBottom: '10px;' }}>
                                                <Row className="RegSecondDiv">
                                                    <Col span={24} className="borderTest">
                                                        <Card
                                                            style={{ borderRadius: '5px solid', background: this.state.RegSecondDivs }}
                                                            className={item.swtchStatus === true ? 'RegSecondDiv11' : 'RegSecondDiv111'}
                                                        >
                                                            <Meta
                                                                title={
                                                                    <div style={{ fontFamily: 'Microsoft YaHei', fontSize: '10px' }}>
                                                                        <Row>
                                                                            <a href="#" onClick={this.getDetailInfo.bind(this, item)}>
                                                                                <Col span={4}>
                                                                                    <Row>
                                                                                        <Row style={{ textAlign: 'center' }}>
                                                                                            <Col span={24}><img style={{ width: 60, height: 70, marginTop: '1%' }} alt="" src={img} /></Col>
                                                                                        </Row>
                                                                                        <Row style={{ textAlign: 'center' }}>
                                                                                            <Col span={24}><span style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>{item.accessMeasureName}</span></Col>
                                                                                        </Row>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col span={1}>
                                                                                    <Divider type="vertical" style={{ height: 100 }} />
                                                                                </Col>
                                                                                <Col span={12}>
                                                                                    <Col span={8}>
                                                                                        <Row span={6} style={{ lineHeight: '50px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>电流：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.ia}&nbsp;&nbsp;A</span></Col>
                                                                                        </Row>
                                                                                        <Row span={6} style={{ lineHeight: '50px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>电压：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.ua}&nbsp;&nbsp;V</span></Col>
                                                                                        </Row>
                                                                                    </Col>
                                                                                    <Col span={8}>
                                                                                        <Row span={6} style={{ lineHeight: '50px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>温度：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.tempa}&nbsp;&nbsp;℃</span></Col>
                                                                                        </Row>
                                                                                        <Row span={6} style={{ lineHeight: '50px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>漏电电流：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }} ><span style={{float: 'left', marginLeft: 18 }}>{item.il}&nbsp;&nbsp;mA</span></Col>
                                                                                        </Row>
                                                                                    </Col>
                                                                                    <Col span={8}>
                                                                                        <Row span={6} style={{ lineHeight: '50px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>功率：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.acpt}&nbsp;&nbsp;kW</span></Col>
                                                                                        </Row>
                                                                                        <Row span={6} style={{ lineHeight: '50px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>电量：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.paet}&nbsp;&nbsp;kWh</span></Col>
                                                                                        </Row>
                                                                                    </Col>
                                                                                </Col>
                                                                            </a>
                                                                            <Col span={1}>
                                                                                <Divider type="vertical" style={{ height: 100 }} />
                                                                            </Col>
                                                                            <Col span={4} style={{ marginLeft: '3%', textAlign: 'center', lineHeight: '50px' }}>
                                                                                <Col span={12}>
                                                                                    <Row style={{ lineHeight: '50px', textAlign: 'center' }}>


                                                                                        <Col span={12}><Switch
                                                                                            checkedChildren="开"
                                                                                            unCheckedChildren="关"
                                                                                            checked={item.swtchStatus}
                                                                                            onChange={this.switchChange.bind(this, item.id)}/></Col>


                                                                                    </Row>
                                                                                    <Row span={6} style={{ textAlign: 'center' }}>
                                                                                        <Col span={12} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>开关</Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col span={6}>
                                                                                    <Row style={{ lineHeight: '50px', textAlign: 'center' }}>
                                                                                        <a href="#" onClick={this.openDeit.bind(this, item)}><Col span={12}><img src={edit} /></Col></a>
                                                                                    </Row>
                                                                                    <Row span={6} style={{ textAlign: 'center' }}>
                                                                                        <Col span={12} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>编辑</Col>
                                                                                    </Row>
                                                                                </Col>

                                                                                <Col span={6}>
                                                                                    <Row style={{ lineHeight: '50px', textAlign: 'center' }}>
                                                                                        <a href="#" onClick={this.openDeit2.bind(this, item)}><Col span={12}><img src={edit} /></Col></a>
                                                                                    </Row>
                                                                                    <Row span={6} style={{ textAlign: 'center' }}>
                                                                                        <Col span={12} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>设置</Col>
                                                                                    </Row>
                                                                                </Col>
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                }
                                                            />
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Row>
                                    }
                                />
                            </List.Item>

                        </Row>




                        <Modal title="线路编辑" visible={this.state.visible} onOk={this.handleOk} maskClosable={false} onCancel={this.handleCancel} width={500}>
                            <Row style={{ marginTop: '0.8%' }}>
                                <Col span={4} style={{ lineHeight: '32px' }}>
                                    <span >线路名称:</span>
                                </Col>
                                <Col span={8} style={{ lineHeight: '32px' }}>
                                    <Input value={this.state.measPointName} onChange={e => this.setState({ 'measPointName': e.target.value })}
                                           style={{ width: '65%' }} />
                                </Col>
                            </Row>
                        </Modal>

                        <Modal title="密码验证" visible={this.state.verification}  onOk={this.handleOkverification}  maskStyle={{ position : 'fixed',
                            top: '0',
                            right: '0',
                            left: '0',
                            zIndex: '1000',
                            height: '100%',
                            backgroundColor: '#000000a8',
                        }}  maskClosable={false} onCancel={this.handleCancel} width={500}>
                            <Row style={{ marginTop: '0.8%' }}>
                                <Col span={8} style={{ lineHeight: '32px' }}>
                                    <span >输入网点密码:</span>
                                </Col>
                                <Col span={8} style={{ lineHeight: '32px' }}>
                                    <Input value={this.state.password} onChange={e => this.setState({ 'password': e.target.value })}
                                           style={{ width: '65%' }} />
                                </Col>
                            </Row>
                        </Modal>

                        <Modal title="修改阈值" visible={this.state.visible2} onOk={this.handleOk2} maskClosable={false} onCancel={this.handleCancel2} width={500}>
                            <Row style={{ marginTop: '0.8%' }}>
                                <Col span={6} style={{ lineHeight: '32px' }}>
                                    <span >额定电流值:</span>
                                </Col>
                                <Col span={18} style={{ lineHeight: '32px' }}>
                                    <Input value={this.state.maxCurrent} onChange={e => this.setState({ 'maxCurrent': e.target.value })}
                                           style={{ width: '40%' }} /> <font color="#FF0000">* 范围1-63，默认63。</font>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '0.8%' }}>
                                <Col span={6} style={{ lineHeight: '32px' }}>
                                    <span >过压值(V):</span>
                                </Col>
                                <Col span={18} style={{ lineHeight: '32px' }}>
                                    <Input value={this.state.maxVoltage} onChange={e => this.setState({ 'maxVoltage': e.target.value })}
                                           style={{ width: '40%' }} /> <font color="#FF0000">* 范围235-265，默认265</font>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '0.8%' }}>
                                <Col span={6} style={{ lineHeight: '32px' }}>
                                    <span >欠压值(V):</span>
                                </Col>
                                <Col span={18} style={{ lineHeight: '32px' }}>
                                    <Input value={this.state.minVoltage} onChange={e => this.setState({ 'minVoltage': e.target.value })}
                                           style={{ width: '40%' }} /> <font color="#FF0000"> * 范围175-205，默认175</font>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '0.8%' }}>
                                <Col span={6} style={{ lineHeight: '32px' }}>
                                    <span >漏电预警值(mA):</span>
                                </Col>
                                <Col span={18} style={{ lineHeight: '32px' }}>
                                    <Input value={this.state.leakValue} onChange={e => this.setState({ 'leakValue': e.target.value })}
                                           style={{ width: '40%' }} /> <font color="#FF0000"> * 范围1-1800</font>
                                </Col>
                            </Row>

                        </Modal>

                    </div>
                )}
            />

        ) : (this.state.lineFlag === 3 ? (
            <List
                size="large"
                dataSource={this.state.lineData}
                renderItem={item => (
                    <div style={{ background: 'white', padding: '1px' }}>
                        <Row>
                            <List.Item
                                style={{ paddingTop: 8, paddingBottom: 8 }}
                                actions={[
                                ]}>
                                <List.Item.Meta
                                    title={
                                        <Row>
                                            <div style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '0px', paddingBottom: '10px;' }}>
                                                <Row className="RegSecondDiv">
                                                    <Col span={24} className="borderTest">
                                                        <Card
                                                            style={{ borderRadius: '5px solid', background: this.state.RegSecondDivs }}
                                                            className={item.swtchStatus === true ? 'RegSecondDiv11' : 'RegSecondDiv111'}
                                                        >
                                                            <Meta
                                                                title={
                                                                    <div style={{ fontFamily: 'Microsoft YaHei', fontSize: '10px' }}>
                                                                        <Row>
                                                                            <a href="#" onClick={this.getDetailInfo.bind(this, item)}>
                                                                                <Col span={4}>
                                                                                    <Row>
                                                                                        <Row style={{ textAlign: 'center' }}>
                                                                                            <Col span={24}><img style={{ width: 60, height: 70, marginTop: '6%' }} alt="" src={img} /></Col>
                                                                                        </Row>
                                                                                        <Row style={{ textAlign: 'center' }}>
                                                                                            <Col span={24}><span style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>{item.accessMeasureName}</span></Col>
                                                                                        </Row>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col span={1}>
                                                                                    <Divider type="vertical" style={{ height: 127 }} />
                                                                                </Col>
                                                                                <Col span={12}>
                                                                                    <Col span={8}>
                                                                                        <Row span={5} style={{ lineHeight: '25px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>总功率：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.acpt}&nbsp;&nbsp;kW</span></Col>
                                                                                        </Row>
                                                                                        <Row span={5} style={{ lineHeight: '25px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>A相电压：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.ua}&nbsp;&nbsp;V</span></Col>
                                                                                        </Row>
                                                                                        <Row span={5} style={{ lineHeight: '25px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>A相电流：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.ia}&nbsp;&nbsp;A</span></Col>
                                                                                        </Row>
                                                                                        <Row span={5} style={{ lineHeight: '25px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>A相温度：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.tempa}&nbsp;&nbsp;℃</span></Col>
                                                                                        </Row>
                                                                                        <Row span={4} style={{ lineHeight: '25px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>零线温度：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.tempn}&nbsp;&nbsp;℃</span></Col>
                                                                                        </Row>
                                                                                    </Col>
                                                                                    <Col span={8}>
                                                                                        <Row span={5} style={{ lineHeight: '25px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>总功率因数：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.pft}</span></Col>
                                                                                        </Row>
                                                                                        <Row span={5} style={{ lineHeight: '25px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>B相电压：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.ub}&nbsp;&nbsp;V</span></Col>
                                                                                        </Row>
                                                                                        <Row span={5} style={{ lineHeight: '25px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>B相电流：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.ib}&nbsp;&nbsp;A</span></Col>
                                                                                        </Row>
                                                                                        <Row span={5} style={{ lineHeight: '25px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>B相温度：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.tempb}&nbsp;&nbsp;℃</span></Col>
                                                                                        </Row>
                                                                                        <Row span={4} style={{ lineHeight: '25px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>电量：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.paet}&nbsp;&nbsp;kWh</span></Col>
                                                                                        </Row>
                                                                                    </Col>
                                                                                    <Col span={8}>
                                                                                        <Row span={4} style={{ lineHeight: '25px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>漏电电流：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{float: 'left', marginLeft: 18 }}>{item.il}&nbsp;&nbsp;mA</span></Col>
                                                                                        </Row>
                                                                                        <Row span={5} style={{ lineHeight: '25px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>C相电压：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.uc}&nbsp;&nbsp;V</span></Col>
                                                                                        </Row>
                                                                                        <Row span={5} style={{ lineHeight: '25px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>C相电流：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.ic}&nbsp;&nbsp;A</span></Col>
                                                                                        </Row>
                                                                                        <Row span={5} style={{ lineHeight: '25px' }}>
                                                                                            <Col span={8} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>C相温度：</Col>
                                                                                            <Col span={14} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}><span style={{ float: 'left', marginLeft: 6 }}>{item.tempc}&nbsp;&nbsp;℃</span></Col>
                                                                                        </Row>
                                                                                    </Col>
                                                                                </Col>
                                                                            </a>
                                                                            <Col span={1}>
                                                                                <Divider type="vertical" style={{ height: 127 }} />
                                                                            </Col>
                                                                            <Col span={4} style={{ marginLeft: '3%', textAlign: 'center', lineHeight: '50px', marginTop: '15px' }}>
                                                                                <Col span={12}>
                                                                                    <Row style={{ lineHeight: '50px', textAlign: 'center' }}>

                                                                                        <Col span={12}><Switch checkedChildren="开" unCheckedChildren="关"   checked={item.swtchStatus}
                                                                                                               onChange={this.switchChange.bind(this, item.id)} /></Col>
                                                                                    </Row>
                                                                                    <Row span={6} style={{ textAlign: 'center' }}>
                                                                                        <Col span={12} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>开关</Col>
                                                                                    </Row>
                                                                                </Col>
                                                                                <Col span={6}>
                                                                                    <Row style={{ lineHeight: '50px', textAlign: 'center' }}>
                                                                                        <a href="#" onClick={this.openDeit.bind(this, item)}><Col span={12}><img src={edit} /></Col></a>
                                                                                    </Row>
                                                                                    <Row span={6} style={{ textAlign: 'center' }}>
                                                                                        <Col span={12} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>编辑</Col>
                                                                                    </Row>
                                                                                </Col>

                                                                                <Col span={6}>
                                                                                    <Row style={{ lineHeight: '50px', textAlign: 'center' }}>
                                                                                        <a href="#" onClick={this.openDeit2.bind(this, item)}><Col span={12}><img src={edit} /></Col></a>
                                                                                    </Row>
                                                                                    <Row span={6} style={{ textAlign: 'center' }}>
                                                                                        <Col span={12} style={{ fontSize: 16, fontFamily: 'Microsoft YaHei' }}>设置</Col>
                                                                                    </Row>
                                                                                </Col>

                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                }
                                                            />
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Row>
                                    }
                                />
                            </List.Item>

                        </Row>

                        <Modal title="线路编辑" visible={this.state.visible} onOk={this.handleOk} maskClosable={false} onCancel={this.handleCancel} width={500}>
                            <Row style={{ marginTop: '0.8%' }}>
                                <Col span={4} style={{ lineHeight: '32px' }}>
                                    <span >线路名称:</span>
                                </Col>
                                <Col span={8} style={{ lineHeight: '32px' }}>
                                    <Input value={this.state.measPointName} onChange={e => this.setState({ 'measPointName': e.target.value })}
                                           style={{ width: '65%' }} />
                                </Col>
                            </Row>
                        </Modal>

                        <Modal title="密码验证" visible={this.state.verification} onOk={this.handleOkverification}   maskStyle={{ position : 'fixed',
                            top: '0',
                            right: '0',
                            left: '0',
                            zIndex: '1000',
                            height: '100%',
                            backgroundColor: '#000000a8',
                        }}   maskClosable={false} onCancel={this.handleCancel} width={500}>
                            <Row style={{ marginTop: '0.8%' }}>
                                <Col span={8} style={{ lineHeight: '32px' }}>
                                    <span >输入网点密码:</span>
                                </Col>
                                <Col span={8} style={{ lineHeight: '32px' }}>
                                    <Input value={this.state.password} onChange={e => this.setState({ 'password': e.target.value })}
                                           style={{ width: '65%' }} />
                                </Col>
                            </Row>
                        </Modal>

                        <Modal title="修改阈值" visible={this.state.visible2} onOk={this.handleOk2} maskClosable={false} onCancel={this.handleCancel2} width={500}>
                            <Row style={{ marginTop: '0.8%' }}>
                                <Col span={6} style={{ lineHeight: '32px' }}>
                                    <span >额定电流值:</span>
                                </Col>
                                <Col span={18} style={{ lineHeight: '32px' }}>
                                    <Input value={this.state.maxCurrent} onChange={e => this.setState({ 'maxCurrent': e.target.value })}
                                           style={{ width: '40%' }} /> <font color="#FF0000">* 范围1-63，默认63。</font>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '0.8%' }}>
                                <Col span={6} style={{ lineHeight: '32px' }}>
                                    <span >过压值(V):</span>
                                </Col>
                                <Col span={18} style={{ lineHeight: '32px' }}>
                                    <Input value={this.state.maxVoltage} onChange={e => this.setState({ 'maxVoltage': e.target.value })}
                                           style={{ width: '40%' }} /> <font color="#FF0000">* 范围235-265，默认265</font>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '0.8%' }}>
                                <Col span={6} style={{ lineHeight: '32px' }}>
                                    <span >欠压值(V):</span>
                                </Col>
                                <Col span={18} style={{ lineHeight: '32px' }}>
                                    <Input value={this.state.minVoltage} onChange={e => this.setState({ 'minVoltage': e.target.value })}
                                           style={{ width: '40%' }} /> <font color="#FF0000"> * 范围175-205，默认175</font>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '0.8%' }}>
                                <Col span={6} style={{ lineHeight: '32px' }}>
                                    <span >漏电预警值(mA):</span>
                                </Col>
                                <Col span={18} style={{ lineHeight: '32px' }}>
                                    <Input value={this.state.leakValue} onChange={e => this.setState({ 'leakValue': e.target.value })}
                                           style={{ width: '40%' }} /> <font color="#FF0000"> * 范围1-1800</font>
                                </Col>
                            </Row>

                        </Modal>


                    </div>
                )}
            />
        ) : undefined);

        return (
            <div style={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '20px', paddingBottom: '20px;' }}>
                <Row span={24} style={{ background: '#5a7fa5', marginBottom: 16 }} >
                    <Col span={24}>
                        <Row>
                            <Col span={5}>
                                <p style={{ float: 'left', paddingTop: 10, paddingLeft: 20, fontFamily: 'Microsoft YaHei', fontSize: 18, fontWeight: 'bold' }}>线路列表</p>
                            </Col>
                            <Col span={12}>
                                <Row>
                                    <Col span={24} style={{ textAlign: 'center' }}>
                                        <Row style={{ lineHeight: '50px', fontFamily: 'Microsoft YaHei', fontSize: 14 }}>
                                            <Col span={24} >
                                                <span>当前设备状态：</span>
                                                <span>{this.state.online}&nbsp;</span><span>&nbsp;|&nbsp;&nbsp;</span>
                                                <span>上网方式：</span>
                                                <span>{this.state.devAccessDetail}</span>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={7}>
                                <Row>
                                    <Col span={12}><span style={{ float: 'right', lineHeight: '50px', fontFamily: 'Microsoft YaHei', fontSize: 14 }}>当前设备:</span></Col>
                                    <Col span={12}>
                                        <Select value={this.state.device} onChange={this.deviceChange}
                                            //onChange={value => this.setState({'energyUnitStatus': value})}
                                                style={{ width: '65%', float: 'left', marginLeft: 10, paddingTop: 10 }}>
                                            {this.state.deviceList}
                                        </Select>
                                        {/*开始*/}

{/*                                        <TreeSelect
                                            style={{ width: '100%' }}
                                            value={this.state.value}
                                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                            treeData={this.state.treeData}
                                            placeholder="Please select"
                                            treeDefaultExpandAll
                                            onChange={this.onChangeTree}
                                        />*/}
                                        {/*结束*/}
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                {lineChose}
                <Row style={{ float:"right",  marginRight : 30}}>
                   {/* <div style={{marginRight: 10, marginTop: 5}}> 共计 {this.state.total} 条数据</div>*/}
                    <Pagination  current={this.state.current} onChange={this.onChangePagination} total={this.state.total}

                    />
{/*                    pagination={{
                    total: total,
                    pageSize: pageSize1,
                    showTotal: function () {
                        return <div style={{marginRight: 10, marginTop: 5}}> 共计 {this.total} 条数据</div>
                    }
                    }}*/}
                </Row>

            </div>
        );
    }
    //线路编辑方法
    handleOk = () => {
        const { measPointName, measPointId } = this.state;
        if (measPointName === "") {
            message.error("线路名称不能为空");
            return;
        }
        console.log("measPointName", measPointName)
        console.log("measPointid", this.state.measPointId)
        reqwest({
            url: '/console/jalasmart/updateLineName',
            method: 'GET',
            credentials: 'include',
            data: {
                measPointId: this.state.measPointId,
                measPointName: encodeURI(measPointName)
            }
        }).then((data) => {
            var ds = eval('(' + data + ')');
            if (ds.result) {
                message.success("线路信息修改成功");
                this.setState({
                    visible: false,
                    tasktimer: true,
                }, () => {
                    // this.deviceChange();\
                    this.deviceChange(this.state.gateWayId);
                    //this.getDeviceInfo();

                    // this.getDeviceInfoById();
                    // this.getLineInfo(this.state.gateWayId);
                })
            } else {
                message.error("线路信息修改失败");
            }

        })
    }

    //确认设置
    handleOk2 = (item, e) => {
        const { maxCurrent, maxVoltage,minVoltage,leakValue ,switchLineParameter} = this.state;
        // maxCurrent : ' ',   //额定电流值
        //     maxVoltage : ' ',   // 过压值
        //     minVoltage  : ' ',   // 欠压值
        //     leakValue  : ' ',    // 漏电预警值

        if (maxCurrent === "") {
            message.error("额定电流值不能为空");
            return;
        }
        if (maxVoltage === "") {
            message.error("过压值不能为空");
            return;
        }
        if (minVoltage === "") {
            message.error("欠压值不能为空");
            return;
        }
        if (leakValue === "") {
            message.error("漏电预警值不能为空");
            return;
        }
        reqwest({
            url: '/console/jalasmart/updateThreshold',
            method: 'GET',
            credentials: 'include',
            data: {
                measPointId: this.state.LineId, // 线路ID
                gatewayId:  this.state.gateWayId, // 网关ID
                lineFlag : this.state.lineFlag,  // 是否三相

                maxCurrent: maxCurrent,
                maxVoltage: maxVoltage,
                minVoltage: minVoltage,
                leakValue : leakValue,
                switchLineParameter  : switchLineParameter
            }
        }).then((data) => {

            var ds=eval('('+data+')');
            if(ds[0].result === 1){
                message.success('修改成功');
                this.setState({
                    visible2: false,
                    tasktimer: true,

                });
            }else{
                message.error('修改失败');
            }

        })
    }


    handleCancel = () => {
        this.setState({
            visible: false,
            verification: false,
            tasktimer: true,

        }, () => {
            // this.deviceChange();\
            console.log("点击了取消",this.state.gateWayId);

            // this.getLineInfo(value);
            // this.deviceChange(this.state.gateWayId);
            // this.setState({
            //     device: this.state.gateWayId,
            //     gateWayId: this.state.gateWayId,
            // }, () => {
            //     this.getDeviceInfoById();
            //     this.getLineInfo(this.state.gateWayId);
            // })

        })

    }

    handleCancel2 = () => {
        this.setState({
            visible2: false,
            tasktimer: true,
        })
    }


    switchChange = (item, checked, event) => {
        console.log("itemId:", checked);
        this.setState({
            delcount:1,
            // isEnableGas : checked ,
        },()=>{
            console.log("sadasd",this.state.isEnableGas)
        })
        // if(checked === false){
        //     this.state({
        //         isEnableGas : true ,
        //     })
        // }else{
        //     this.state({
        //         isEnableGas : false ,
        //     })
        // }


        this.setState({
            verification: true,
            measPointId: item.id,
            measPointName: item.accessMeasureName,
            password :'',
            WhichPassword: 3,
            switchs:item,
            switchsChecked : checked,
        })
    }





    switchChange1 = (item, checked, event) => {
        const { switchs } = this.state;
        if (this.state.switchsChecked === false) {
            this.setState({
                isEnableGas : false ,
                verification: false,
                RegSecondDivs: '#f5f5f5'
            }, () => {
                this.controlSwitch(checked, switchs);
            })
        } else {
            this.setState({
                isEnableGas : true ,
                verification: false,
                RegSecondDivs: 'rgba(255,255,255,1)'
            }, () => {
                this.controlSwitch(checked, switchs);
            })
        }
    }
    controlSwitch = (checked, id) => {
        this.setState({
            tasktimer: true,
        })


        console.log("id", id);
        const { gateWayId } = this.state;
        reqwest({
            url: '/console/jalasmart/controlSwitch',
            method: 'GET',
            credentials: 'include',
            data: {
                checked: this.state.switchsChecked === true ? 1 : 0,
                lineId: id,
                devId: gateWayId,
            }
        }).then((data) => {
            var ds = eval('(' + data + ')');
            if (ds.result) {
                message.success("线路命令下发成功");
                console.log("下发调用")
                this.getLineInfo();


            } else {
                message.error("线路命令下发失败");
            }
        })
    }
    getDetailInfo = (item, e) => {
        console.log("dsadas", item.id);
        const { gateWayId } = this.state;
        console.log("gateWayId  : ", gateWayId);
        window.location.href = '/console/jalasmart/jalaMeasDataLatestInfoTable?id=' + item.id + '&devId=' + gateWayId;
    }
    openDeit = (item, e) => {
        console.log("修改线路", item.id);
        console.log("itemopenDeit", item.id);
        console.log("修改线路的网关  : ", this.state.gateWayId);
        this.setState({
            tasktimer : false ,
            verification: true,
            measPointId: item.id,
            measPointName: item.accessMeasureName,
            password :'',
            WhichPassword: 1,
        })

        // e.preventDefault();
        // this.setState({
        //     visible: true,
        //     measPointId: item.id,
        //     measPointName: item.accessMeasureName
        // })
    }



    handleOkverification  =(item, e) => {
        this.setState({
            tasktimer: false,
        })
        console.log("验证密码" ,this.state.password);

        // e.preventDefault();
        reqwest({
            url: '/console/jalasmart/isVerification',
            method: 'GET',
            credentials: 'include',
            data: {
                measPointId: this.state.gateWayId, // sn
                password : this.state.password,
            }
        }).then((data) => {
            var ds=eval('('+data+')');
            if(ds[0].result == 1){

                if(this.state.WhichPassword ===1){
                    console.log("验证密码单项啊啊啊" ,this.state.measPointId);
                    this.setState({
                        verification: false,
                        visible: true,
                        // measPointId: item.id,
                        measPointName: item.accessMeasureName
                    })
                }
                if(this.state.WhichPassword ===2){
                    this.openDeit21();
                }
                if(this.state.WhichPassword ===3){
                    this.switchChange1();

                }

            }
            if(ds[0].result == 0){
                message.warning('密码输入错误！');



            }
            if(ds[0].result == 2){
                message.warning('无网点信息，请先添加网点');
            }

        })
    }






    openDeit2 = (item, e) => {
        console.log("item", item);
        this.setState({
            verification: true,
            measPointId: item.id,
            measPointName: item.accessMeasureName,
            password :'',
            WhichPassword: 2,
            tasktimer: false,

        })
    }

    // 打开设置
    openDeit21= (item, e) => {
        console.log("item", item);
        console.log("e", e);
        const { gateWayId } = this.state;
        // maxCurrent : ' ',   //额定电流值
        //     maxVoltage : ' ',   // 过压值
        //     minVoltage  : ' ',   // 欠压值
        //     leakValue  : ' ',    // 漏电预警值
        reqwest({
            url: '/console/jalasmart/queryThreshold',
            method: 'GET',
            credentials: 'include',
            data: {
                measPointId: this.state.measPointId, // 线路ID measPointId
                gatewayId:  this.state.gateWayId, // 网关ID
                lineFlag : this.state.lineFlag,  // 是否三相
            }
        }).then((data) => {

            var ds = eval('('+data+')');
            console.log("ds" ,ds);
            console.log("maxCurrent",ds[0].Max);
            console.log("maxVoltage",ds[0].Over);
            console.log("minVoltage :", ds[0].Under);
            console.log("leakValue :", ds[0].LeakValue);
            console.log("switchLineParameter :", ds[0].id);


            this.setState({
                    tasktimer: false,
                    verification: false,
                    LineId:this.state.measPointId,
                    maxCurrent: ds[0].Max,
                    maxVoltage: ds[0].Over,
                    minVoltage: ds[0].Under,
                    leakValue :  ds[0].LeakValue,
                    switchLineParameter :  ds[0].id,

                }
                /*            ,()=>{
                 this.state.lineData.map(items=>
                 console.log(items)
                 );
                 }*/
            )

        })
        this.setState({
            visible2: true,
            measPointId: this.state.measPointId,
            measPointName: this.state.measPointName
        })
    }
    getDeviceInfoById() {
        const { device } = this.state;
        reqwest({
            url: '/console/jalasmart/getRunAccessGatewayQuery',
            method: 'GET',
            credentials: 'include',
            data: {
                id: device
            }
        }).then((data) => {
            this.setState({
                online: data[0].online === true ? '在线' : '离线'
            })
        })
    }
    deviceChange = (value) => {
        console.log("定时");
        if( this.state.tasktimer== false){
            return ;
        }

        //alert(value);
        this.setState({
            device: value,
            gateWayId: value,
        }, () => {
            this.getDeviceInfoById();
            this.getLineInfo();
        })
    }
    getDeviceInfo = () => {
        reqwest({
            url: '/console/jalasmart/getRunAccessGatewayQuery',
            method: 'GET',
            credentials: 'include',
            data: {
                id: ''
            }
        }).then((data) => {
            // var ds=eval('('+data+')');
            // console.log("data1",ds[0])
            this.setState({ deviceList: data.map(option => <Option key={option.id}>{option.devAccessName}</Option>), device: data[0].devAccessName, gateWayId: data[0].id }, () => {
                this.getLineInfo();
            });
        })
    }
    getLineInfo = () => {
        const { lineFlag,gateWayId } = this.state;
        console.log("lineFlag", lineFlag);
        reqwest({
            url: '/console/jalasmart/getRunAccessGateway',
            method: 'GET',
            credentials: 'include',
            data: {
                id: gateWayId,
                current : this.state.current,
            }
        }).then((data) => {
            var ds = data;
            console.log("刷新成功")
            var ds1 = eval('('+ds[0].devAccessDetail+')');
            this.setState({
                lineData: ds[0].result,
                online: ds[0].online === true ? '在线' : '离线',
                devAccessDetail: ds1.lan === null ? null : ds1.lan,
                lineFlag: ds[0].result[0].elecPhaseCount,
                total: ds[0].total,
            },()=>{
                /*                if(this.state.lineData.length === 1){
                 console.log("只有一条线路  有多条线路")
                 }else{

                 }*/

/*                if(ds[0].total !== null && ds[0].total !== "null" ){
                    this.setState({
                        total: ds[0].total,
                    })

                }*/
                this.state.lineData.map(items=>
                    console.log(items)
                );
            })
            // console.log("Linedata1", data);
            // console.log("Line elecPhaseCount :", data[0].elecPhaseCount);
        })
    }



/*    onChangeTree = value => {
        console.log(value);
        this.setState({ value });
    };*/

    //树的下拉框 展示
/*    getTree  = () => {
        reqwest({
            url: '/console/jalasmart/getDeviceTree',
            method: 'GET',
            credentials: 'include',
            data: {
                id: ''
            }
        }).then((data) => {
            // treeData : data
            console.log("data全部的值是======", data);
            console.log("返回的数据是====", data);
            this.setState({
                treeData : data
            })
        })

    }*/



}
ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <JalaSmartLineTable />
    </LocaleProvider>,
    document.getElementById("root")
)