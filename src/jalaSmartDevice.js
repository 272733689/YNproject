import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider, Select, Table, Row, Col, Button, Input, DatePicker, Modal, Collapse, Tabs, Icon, message, Badge, InputNumber, Menu, Dropdown, Popconfirm, Layout, Breadcrumb } from 'antd';
import reqwest from 'reqwest';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import './auditing.less';
import 'moment/locale/zh-cn';
import moment from 'moment';
import edit from './img/edit.png';
import deletes from './img/delete.png';
const pageSize = 10;

const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;

class JalaSmartDevice extends React.Component {
    state = {
        pagination: { pageSize: pageSize },
        ceshiData: [],
        visible: false,
        visible1: false,
        current: '1',
        dataSource: [],
        devAccessName: '',
        deviceId: '',
        deviceNo: '',

        recordValue:'',
        verification:false, //验证
        password :'',
        WhichPassword:1,
        recordDelValue:'',
    }
    componentWillMount() {
        this.getInitState();
    }
    getInitState = () => {

        this.getJaladeviceList();
    }

    render() {
        // const data = [];
        // for (let i = 0; i < 46; i++) {
        //   data.push({ key: i, devAccessName: `Edward King ${i}`, measPointCount: 32, factory: `London, Park Lane no. ${i}`, }); }
        const columns = [
            { title: <div style={{ fontWeight: 'bold', textAlign: 'center' }}> 序号</div>, dataIndex: 'index', key: 'index', className: 'jalaTitle' },
            { title: <div style={{ fontWeight: 'bold', textAlign: 'center' }}>id</div>, dataIndex: 'id', key: 'id', className: 'cls_hidden' },
            { title: <div style={{ fontWeight: 'bold', textAlign: 'center' }}> 设备编号</div>, dataIndex: 'devAccessNo', key: 'devAccessNo', className: 'jalaTitle' },
            { title: <div style={{ fontWeight: 'bold', textAlign: 'center' }}> 设备名称</div>, dataIndex: 'devAccessName', key: 'devAccessName', className: 'jalaTitle' },
            { title: <div style={{ fontWeight: 'bold', textAlign: 'center' }}> 线路数量</div>, dataIndex: 'measPointCount', key: 'measPointCount', className: 'jalaTitle' },
            {
                title: <div style={{ fontWeight: 'bold', textAlign: 'center' }}> 状态</div>,
                dataIndex: 'online',
                key: 'online',
                className: 'jalaTitle',
                render: (text, record) => (
                    <span>{record.online === true ? "在线" : "离线"}</span>
                )
            },
            {
                title: <div style={{ fontWeight: 'bold', textAlign: 'center' }}> 操作</div>, className: 'jalaTitle',
                render: (text, record) => (
                    <span>
            {/* <a href="javascript:;"><Icon type="edit" theme="twoTone" style={{ fontSize: '20px' }} onClick={this.updateDevice} /></a>&nbsp;&nbsp;
             <a href="javascript:;"><Icon type="delete" theme="outlined" twoToneColor="#eb2f96" style={{ fontSize: '20px' }} onClick={this.delDevice} /></a>&nbsp;&nbsp; */}
                        <a href="#" onClick={this.updateDevice.bind(this, record)}><span><img src={edit} style={{ width: 33, height: 33 }} /></span></a>&nbsp;&nbsp;
                        <Popconfirm title="确定要删除这台设备吗?" onConfirm={this.delDevice.bind(this, record)} okText="确定" cancelText="取消">
              <a href="#"><span><img src={deletes} style={{ width: 24, height: 24 }} /></span></a>
            </Popconfirm>
          </span>
                ),
            },
        ];
        var pageSize1 = this.state.pagination.pageSize;
        var total = this.state.pagination.total;
        return (
            <div style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '10px', paddingBottom: '10px;' }}>
                <Row>
                    <Row style={{ background: '#5a7fa5', height: 50 }}>
                        <Col span={24}>
                            <Row>
                                <Col span={17}>
                                    <span style={{ float: 'left', paddingTop: 10, paddingLeft: 20, fontFamily: 'Microsoft YaHei', fontSize: 18, fontWeight: 'bold' }}>设备列表</span>
                                </Col>
                                <Col span={7} style={{ marginTop: '10px' }}>
                                    <Row span={24}>
                                        <Col span={24}>
                      <span>
                     {/*   <Button type="primary" style={{ float: 'right', marginRight: 15 }} onClick={this.addDevice} >添加设备</Button>*/}
                      </span>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Table
                        rowKey="key"
                        columns={columns}
                        dataSource={this.state.dataSource}
                        bordered
                        //pagination={this.state.pagination}
                        onChange={this._BhandleTableChange}
                        pagination={{
                            total: total,
                            pageSize: pageSize1,
                            showTotal: function () {
                                return <div style={{ marginRight: 10, marginTop: 5 }}> 共计 {total} 条数据</div>
                            }
                        }}
                    />
                </Row>
                <Modal title="添加设备信息" visible={this.state.visible} maskClosable={false} onOk={this.handleOk} onCancel={this.handleCancel} width={600}>
                    <Row style={{ marginTop: '0.8%' }}>
                        <Col span={4}>
                            <span style={{ lineHeight: '32px' }}>设备名称:</span>
                        </Col>
                        <Col span={8}>
                            <Input value={this.state.chargedeviceNo} onChange={(e) => { this.setState({ 'chargedeviceNo': e.target.value }) }} style={{ width: '90%' }} />
                        </Col>
                        <Col span={4}>
                            <span style={{ lineHeight: '32px' }}>设备编号:</span>
                        </Col>
                        <Col span={8}>
                            <Input value={this.state.deviceNo} onChange={e => { this.setState({ 'deviceNo': e.target.value }) }} style={{ width: '90%' }} />
                        </Col>
                    </Row>

                </Modal>
                <Modal title="修改设备信息" visible={this.state.visible1} maskClosable={false} onOk={this.handleOk1} onCancel={this.handleCancel1} width={600}>
                    <Row style={{ marginTop: '0.8%' }}>
                        <Col span={4}>
                            <span style={{ lineHeight: '32px' }} >设备名称:</span>
                        </Col>
                        <Col span={8}>
                            <Input value={this.state.devAccessName} onChange={e => { this.setState({ 'devAccessName': e.target.value }) }} style={{ width: '90%' }} />
                        </Col>
                    </Row>
                </Modal>

                <Modal title="密码验证" visible={this.state.verification} onOk={this.handleOkverification} maskClosable={false} onCancel={this.handleCancel} width={500}>
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

            </div>
        )
    }
    getJaladeviceList = () => {
        const pagination = { ...this.state.pagination };
        pagination.current = 1;
        this.setState({
            pagination,
        }, () => {
            this.getRunAccessGatewayQuery();
        })

    }
    //分页
    _BhandleTableChange = (pagination, filters, sorter) => {
        const pager = { ...this.state.pagination };
        pager.current = pagination.current;
        console.log('pager', pagination.current)
        this.setState({
            pagination: pager,
        }, () => {
            console.log("pagination", this.state.pagination)
            this.getRunAccessGatewayQuery();
        });
    }

    //增加设备(弹出框)
    // addDevice = () => {
    //   this.setState({
    //     visible: true
    //   });
    // };
    handleOk = () => {
        const { devAccessName, deviceNo } = this.state;
        var regx = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
        if (deviceNo === "") {
            message.error("设备编号不能为空");
            return;
        }
        if (regx.test(deviceNo)) {
            message.error("设备编号只能是英文或数字");
            return;
        }
        // if (devAccessName == "") {
        //   message.error("设备名称不能为空");
        //   return;
        // }
        //发送请求
        reqwest({
            url: '/console/jalasmart/addRunAccessGatewayDevice',
            method: 'GET',
            credentials: 'include',
            data: {
                devAccessNo: deviceNo,
                newDevAccessName: encodeURI(devAccessName),
            }

        }).then((data) => {
            console.log("dataAdd", data)
            var ds = eval('(' + data + ')');
            if (ds.result) {
                message.success("设备新增成功");
                this.setState({
                    visible: false,
                    devAccessNo: '',
                    newDevAccessName: '',
                }, () => {
                    this.getJaladeviceList();
                })
            } else {
                message.error("设备新增失败");
            }


        })
    };
    handleCancel = () => {
        console.log('点击了取消');
        this.setState({
            visible: false,
            verification:false, //验证
        });
    };



    updateDevice = (record, e) => {
        this.setState({
            verification: true,
            password :'',
            WhichPassword: 1,
            recordValue:record,

        })
    };

    delDevice = (record, e) => {
        this.setState({
            verification: true,
            password :'',
            WhichPassword: 2,
            recordDelValue:record,

        })
    };


    addDevice = (record, e) => {
        this.setState({
            visible : true,
            // verification: true,
            // password :'',
            // WhichPassword: 3,
            // recordDelValue:record,

        })
    };


    handleOkverification  =(item, e) => {
        const { recordValue } = this.state;
        let Values ="";
        if(this.state.WhichPassword ===1){
            Values=this.state.recordValue
        }
        if(this.state.WhichPassword ===2){
            Values=this.state.recordDelValue
        }
        console.log("验证密码" ,this.state.password);
        // e.preventDefault();
        reqwest({
            url: '/console/jalasmart/isVerification',
            method: 'GET',
            credentials: 'include',
            data: {
                measPointId: Values.id, // sn
                password : this.state.password,
            }
        }).then((data) => {
            var ds=eval('('+data+')');
            if(ds[0].result == 1){
                this.setState({
                    verification: false,
                })
                if(this.state.WhichPassword ===1){
                    this.updateDevice2();
                }
                if(this.state.WhichPassword ===2){
                    this.delDevice2();
                }
                if(this.state.WhichPassword ===3){
                    this.setState({
                        visible: true
                    });
                    this.handleOk2();
                }



            }
            if(ds[0].result == 0){
                message.warning('密码输入错误！');
            }
            if(ds[0].result == 2){
                message.warning('无网点信息，请先添加网点');
            }
        })
    };



    //编辑设备(弹出框)
    updateDevice2 = (record, e) => {
        const { recordValue } = this.state;
        console.log('record', record);
        this.setState({
            visible1: true,
            deviceId: recordValue.id,
            devAccessName: recordValue.devAccessName
        });
    };
    handleOk1 = () => {
        const { devAccessName, deviceId } = this.state;

        if (devAccessName == "") {
            message.error("设备名称不能为空");
            return;
        }
        reqwest({
            url: '/console/jalasmart/updateRunAccessGatewayDevice',
            method: 'GET',
            credentials: 'include',
            data: {
                id: deviceId,
                devAccessName: encodeURI(devAccessName)
            }
        }).then((data) => {
            var ds = eval('(' + data + ')');
            if (ds.result) {
                message.success("设备信息修改成功");
                this.setState({
                    visible1: false,
                    deviceId: '',
                    devAccessName: ''
                }, () => {
                    this.getJaladeviceList();
                })
            } else {
                message.error("设备信息修改失败");
            }
        })
    };
    handleCancel1 = () => {
        console.log('点击了取消');
        this.setState({
            visible1: false,
            deviceId: '',
            devAccessName: ''
        });
    };

    //删除对话框
    delDevice2 = (record, e) => {
        const { recordDelValue } = this.state;

        e.preventDefault(); //阻止自动提交表单
        reqwest({
            url: '/console/jalasmart/deleteRunAccessGatewayDevice',
            method: "GET",
            credentials: 'include',
            data: {
                id: recordDelValue.id,
            }
        }).then((data) => {
            var ds = eval('(' + data + ')');
            if (ds.result) {
                message.success("删除成功");
                this.getJaladeviceList();
            } else {
                message.success("删除失败");
            }
        })
    }

    //设备列表查询
    getRunAccessGatewayQuery = () => {
        const { current } = this.state;
        //发送请求
        reqwest({
            url: '/console/jalasmart/getRunAccessGatewayDeviceQuery',
            method: 'GET',
            credentials: 'include',
            data: {
                start: this.state.pagination.current,
            }
        }).then((data) => {
            var ds = eval('(' + data + ')');
            const pagination = { ...this.state.pagination }
            pagination.total = ds[0].total;
            this.setState({
                pagination,
                dataSource: ds[0].rows,
            })
            console.log("pagination00 : ", pagination);
        })
    }
}
ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        <JalaSmartDevice />
    </LocaleProvider>,
    document.getElementById('root')
);