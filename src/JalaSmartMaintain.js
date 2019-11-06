
import  React,{Component}from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider, Select, Table, Row, Col, Button, Input, Modal, Tabs ,message,Popconfirm} from 'antd';
import reqwest from 'reqwest';
import zhCN from 'antd/lib/locale-provider/zh_CN';
 // import './auditing.less';
 import './record.css';
import 'moment/locale/zh-cn';
const pageSize = 10;
const { TextArea } = Input;
const TabPane = Tabs.TabPane;
const confirm = Modal.confirm;
const Option = Select.Option;

class JalaSmartMaintain extends React.Component {
//     class JalaSmartMaintain  extends Component{
  state = {
    pagination: { pageSize: pageSize },
    current: '1',
      dataSource:[],
    devAccessName: '',
      /*分割线*/
      device: '',
      deviceList: [],
      /*分割线*/
      details : false , // 弹出的madel 框 是否可编辑
      style1: {display:"block"},

      visible:false, // 编辑
      username:"",
      password :"",
      ceCustIntroValue:"", // 网点名称
      ceCustAddrValue : "", // 网点地址
      contacterValue : "" ,  // 联系人员
      contactPhoneValue : "" , // 联系电话
      snValue : "" , /// 设备的sn 码
      custId:"",

      statusValue:1, // 使用这个字段判断弹出框 是编辑的还是新增的

      loading: false, //图片上传



  }
  componentWillMount() {
         this.getData();
      // this.getDeviceInfo();
  }

        getData  = () => {
            reqwest({
                url:'/console/jalaNetwork/queryNetwork',
                method:"GET",
                credentials:'include',

            }).then((data)=>{
                var ds=eval('('+data+')');
                this.setState({
                    dataSource:ds,
                })
            })
        }

    deviceChange = (value) => {
        this.setState({
            device: value,
            gateWayId: value,
        }, () => {
            this.getDeviceInfoById();
            // this.getLineInfo(value);
        })
    }

        //添加网点
        showModal = () => {
            this.setState({
                ceCustIntroValue:"", // 网点名称
                ceCustAddrValue : "", // 网点地址
                contacterValue : "" ,  // 联系人员
                contactPhoneValue : "", // 联系电话
                snValue : "" , /// 设备的sn 码
                username: "",
                password : "",

                visible: true,
                statusValue: 1,
                style1: {display:"block"},
            });
        };

      // 添加网点的modal 点击确认
        handleOk = e => {
            // message.warning('请填写任务单号');
            // message.success('执行成功');
            if(this.state.statusValue ===1){

            var re = /^[0-9]+.?[0-9]*/;//判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
            var parent=/^[A-Za-z]+$/;   //验证只能是英文

            var isVali =/^[0-9a-zA-Z]*$/g ; // 登录账号 和密码只能是英文 和数字



            if(!isVali.test(this.state.username) ){
                //不是英文和数字
                console.log("不是英文和数字");
                if(!re.test(this.state.username) ){
                    console.log("不是数字");
                    if(!parent.test(this.state.username) ){
                        console.log("不是英文");
                        message.warning('登录账号 只能为英文与数字！');
                        return;
                    }
                }
            }
                if((/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.state.contactPhoneValue)) || (/^0\d{2,3}-?\d{7,8}$/.test(this.state.contactPhoneValue))){

                }else{
                    message.warning('联系电话格式有误，请重新填写！');
                    return;
                }

                // System.out.println(tel.matches(reg)?"合法":"非法");

                var re1 = /^[0-9]+.?[0-9]*/;//判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
                var parent1=/^[A-Za-z]+$/;   //验证只能是英文

                var isVali1 =/^[0-9a-zA-Z]*$/g ; // 登录账号 和密码只能是英文 和数字

                if(!isVali1.test(this.state.password) ){
                    //不是英文和数字
                    console.log("不是英文和数字");
                    if(!re1.test(this.state.password) ){
                        console.log("不是数字");
                        if(!parent1.test(this.state.password) ){
                            console.log("不是英文");
                            message.warning('登录密码 只能为英文与数字！');
                            return;
                        }
                    }
                }


            if (this.state.ceCustIntroValue ===null || this.state.ceCustIntroValue ==='') {
                message.warning('请填写网点名称！');
            }else if(this.state.ceCustAddrValue === null || this.state.ceCustAddrValue === ''){
                message.warning('请填写网点地址！');
            }else if(this.state.contacterValue === null || this.state.contacterValue === ''){
                message.warning('请填写联系人员！');
            }else if(this.state.contactPhoneValue === null || this.state.contactPhoneValue ===''){
                message.warning('请填写联系电话！');
            }else if(!re.test(this.state.contactPhoneValue) ){
                message.warning('联系电话格式错误！');
            }else if (this.state.snValue === null || this.state.snValue === ''){
                message.warning('请填写设备SN码！');
            }else{

            reqwest({
                url:'/console/jalaNetwork/addNetwork',
                method:"POST",
                credentials:'include',
                data: {
                    ceCustIntroValue: this.state.ceCustIntroValue, // 网点名称
                    ceCustAddrValue :this.state.ceCustAddrValue , // 网点地址
                    contacterValue :this.state.contacterValue  ,  // 联系人员
                    contactPhoneValue :this.state.contactPhoneValue , // 联系电话
                    snValue : this.state.snValue,  // 设备的sn 码  去掉所有的空格
                    username: this.state.username,
                    password : this.state.password,
                }
                // var str = this.state.selectPointName.replace(/(^\s*)|(\s*$)/g, '');//去除空格;

            }).then((data)=>{
                var ds=eval('('+data+')');
                if(ds[0].result === 1){
                    message.success('新增成功');
                    this.setState({
                        visible: false,
                    }, () => {
                        this.getData();
                    });
                }else if(ds[0].result === 0){
                    message.error('sn码错误');
                }else if(ds[0].result === 2){
                    message.error('网点用户名重复');
                }else{
                    message.error('新增失败');
                     }
                     })
            }
         }

         if(this.state.statusValue ===2){    //编辑
             var re = /^[0-9]+.?[0-9]*/;//判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
             var parent=/^[A-Za-z]+$/;   //验证只能是英文
             var isVali =/^[0-9a-zA-Z]*$/g ; // 登录账号 和密码只能是英文 和数字
             if(!isVali.test(this.state.username) ){
                 //不是英文和数字
                 console.log("不是英文和数字");
                 if(!re.test(this.state.username) ){
                     console.log("不是数字");
                     if(!parent.test(this.state.username) ){
                         console.log("不是英文");
                         message.warning('登录账号 只能为英文与数字！');
                         return;
                     }
                 }
             }

             var re1 = /^[0-9]+.?[0-9]*/;//判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
             var parent1=/^[A-Za-z]+$/;   //验证只能是英文
             var isVali1 =/^[0-9a-zA-Z]*$/g ; // 登录账号 和密码只能是英文 和数字
             if(!isVali1.test(this.state.password) ){
                 //不是英文和数字
                 console.log("不是英文和数字");
                 if(!re1.test(this.state.password) ){
                     console.log("不是数字");
                     if(!parent1.test(this.state.password) ){
                         console.log("不是英文");
                         message.warning('登录密码 只能为英文与数字！');
                         return;
                     }
                 }
             }
             //验证手机号码


             if((/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.state.contactPhoneValue)) || (/^0\d{2,3}-?\d{7,8}$/.test(this.state.contactPhoneValue))){

             }else{
                 message.warning('联系电话格式有误，请重新填写！');
                 return;
             }


               var re = /^[0-9]+.?[0-9]*/;//判断字符串是否为数字//判断正整数/[1−9]+[0−9]∗]∗/
             if (this.state.ceCustIntroValue ===null || this.state.ceCustIntroValue ==='') {
                 message.warning('请填写网点名称！');
             }else if(this.state.ceCustAddrValue === null || this.state.ceCustAddrValue === ''){
                 message.warning('请填写网点地址！');
             }else if(this.state.contacterValue === null || this.state.contacterValue === ''){
                 message.warning('请填写联系人员！');
             }else if(this.state.contactPhoneValue === null || this.state.contactPhoneValue ===''){
                 message.warning('请填写联系电话！');
             }else if(!re.test(this.state.contactPhoneValue) ){
                 message.warning('联系电话格式错误！');
             }else if (this.state.snValue === null || this.state.snValue === ''){
                 message.warning('请填写设备SN码！');
             }else{
                 reqwest({
                     url:'/console/jalaNetwork/updateNetwork',
                     method:"POST",
                     credentials:'include',
                     data: {
                         ceCustIntroValue: this.state.ceCustIntroValue, // 网点名称
                         ceCustAddrValue :this.state.ceCustAddrValue , // 网点地址
                         contacterValue :this.state.contacterValue  ,  // 联系人员
                         contactPhoneValue :this.state.contactPhoneValue , // 联系电话
                         snValue : this.state.snValue,  // 设备的sn 码  去掉所有的空格
                         custId:this.state.custId,
                         username: this.state.username,
                         password : this.state.password,
                     }
                     // var str = this.state.selectPointName.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
                 }).then((data)=>{
                     var ds=eval('('+data+')');
                     if(ds[0].result === 1){
                         message.success('修改成功');
                         this.setState({
                             visible: false,
                         }, () => {
                             this.getData();
                         });
                     }else if(ds[0].result === 0){
                         message.error('sn码错误');
                     }else if(ds[0].result === 2){
                         message.error('网点用户名重复');
                     }else{
                         message.error('修改失败');
                     }
                 })
             }


         }


        };


        //删除
        deleteStation=(record,e)=>{
            reqwest({
                url:'/console/jalaNetwork/deleteNetwork',
                method:"POST",
                credentials:'include',
                data: {
                    snValue : record.snValue,  // 设备的sn 码  去掉所有的空格
                    custId:record.id,
                }
                // var str = this.state.selectPointName.replace(/(^\s*)|(\s*$)/g, '');//去除空格;
            }).then((data)=>{
                var ds=eval('('+data+')');
                if(ds[0].result === 1){
                    message.success('删除成功');
                    this.setState({
                        visible: false,
                    }, () => {
                        this.getData();
                    });
                }else{
                    message.error('删除失败');
                }
            })



        }




      // 添加网点的modal 点击取消
        handleCancel = e => {
            console.log(e);
            this.setState({
                visible: false,
            });
        };

        // 修改网点
        edit= (value) => {
            this.setState({
                ceCustIntroValue:value.ceCustIntro, // 网点名称
                ceCustAddrValue : value.ceCustAddr, // 网点地址
                contacterValue : value.contacter ,  // 联系人员
                contactPhoneValue : value.contactPhone, // 联系电话
                snValue : value.snValue , /// 设备的sn 码
                custId: value.id,
                visible: true,
                statusValue: 2,
                details1 : true,
                style1: {display:"none"},
            });
        }

        //输入框 动态改变
        onChangeUsername= (e)=> {
            this.setState({
                username:e.target.value
            })
        }
        onChangePassword= (e)=> {
            this.setState({
                password:e.target.value
            })
        }


        onChangeCeCustIntro= (e)=> {
            this.setState({
                ceCustIntroValue:e.target.value
            })
        }
        onChangeCeCustAddr= (e)=> {
            this.setState({
                ceCustAddrValue:e.target.value
            })
        }

        onChangeContacterValue= (e)=> {
            this.setState({
                contacterValue:e.target.value
            })
        }
        onChangeContactPhoneValue= (e)=> {
            this.setState({
                contactPhoneValue:e.target.value
            })
        }
        onChangeSnValue = (e)=> {
            this.setState({
                snValue:e.target.value
            })
        }

        cancel=(e) =>{
            console.log(e);
            // message.error('Click on No');
        }


        render() {
      var pageSize1 = this.state.pagination.pageSize;
      var total = this.state.pagination.total;


//[{"result":[{"id":"24706810736803841","enableElec":false,"consElecSort":null,"consEleclevel":0,"parentElecCustId":null,"enableWater":false,"consWaterSort":null,"consWaterLevel":0,"parentWaterCustId":null,"enableGas":false,"consGasSort":null,"consGasLevel":0,"parentGasCustId":null,"enableHeat":false,"consHeatSort":null,"consHeatLevel":0,"parentHeatCustId":null,"ceCustAddr":"浙江省杭州市西湖区翠苑街道西湖区教师公寓华星世纪大楼","ceCustIntro":"顶顶顶顶","adcode":null,"citycode":null,"longitude":null,"latitude":null,"orgNo":null,"ceResClass":0,"ceResNo":null,"ceResStatus":null,"ceResName":null,"ceResAbbr":null,"elecCapacity":null,"voltageClass":null,"modifyVoltageClass":null,"sortSn":0,"valid":false,"gmtCreate":null,"gmtModified":null,"gmtInvalid":null,"version":0,"ceResSortName":null,"ceResSortNo":null,"ceCustId":null,"cePartArea":null,"cePartId":null,"ceCntrId":null,"parentId":null,"lowerCeResClass":null,"title":null,"key":null},{"id":"25788130032353290","enableElec":false,"consElecSort":null,"consEleclevel":0,"parentElecCustId":null,"enableWater":false,"consWaterSort":null,"consWaterLevel":0,"parentWaterCustId":null,"enableGas":false,"consGasSort":null,"consGasLevel":0,"parentGasCustId":null,"enableHeat":false,"consHeatSort":null,"consHeatLevel":0,"parentHeatCustId":null,"ceCustAddr":"浙江省杭州市西湖区翠苑街道西湖区教师公寓","ceCustIntro":"呃呃呃","adcode":null,"citycode":null,"longitude":null,"latitude":null,"orgNo":null,"ceResClass":0,"ceResNo":null,"ceResStatus":null,"ceResName":null,"ceResAbbr":null,"elecCapacity":null,"voltageClass":null,"modifyVoltageClass":null,"sortSn":0,"valid":false,"gmtCreate":null,"gmtModified":null,"gmtInvalid":null,"version":0,"ceResSortName":null,"ceResSortNo":null,"ceCustId":null,"cePartArea":null,"cePartId":null,"ceCntrId":null,"parentId":null,"lowerCeResClass":null,"title":null,"key":null}]}]

/*      const dataSource = [{
          id: '1',
          ceCustIntro: '杭州文三路店',
          ceCustAddr: '浙江省 杭州市 西湖区 文三西路口',
          contacter: '刘文文',
          contactPhone: '13888586688',
      }, {
          id: '2',
          ceCustIntro: '杭州文二路店',
          ceCustAddr: '浙江省 杭州市 西湖区 文二西路口',
          contacter: '刘秀秀',
          contactPhone: '13888586688',
      }];*/

      const columns = [/*{
          title: '序号',
          dataIndex: 'id',
          key: 'id',
          align: 'center',
          width: '5%',
          sorter: (a, b) => a.id - b.id,
          sortDirections: 'descend',
      },*/{
          title: '网点名称',
          dataIndex: 'ceCustIntro',
          key: 'ceCustIntro',
          align: 'center',
          width: '15%',
      }, {
          title: '网点地址 ',
          dataIndex: 'ceCustAddr',
          key: 'ceCustAddr',
          align: 'center',
          width: '15%',
      }, {
          title: '联系人员 ',
          dataIndex: 'contacter',
          key: 'contacter',
          align: 'center',
          width: '15%',
      }, {
          title: '联系电话 ',
          dataIndex: 'contactPhone',
          key: 'contactPhone',
          align: 'center',
          width: '15%',
      },{
          title: '登录账号 ',
          dataIndex: 'username',
          key: 'username',
          align: 'center',
          width: '15%',
      },{
          title: '设备的SN 码 ',
          dataIndex: 'snValue',
          key: 'snValue',
          align: 'center',
          width: '15%',
      },
          {
          title: '操作 ',
          dataIndex: 'caozuo',
          key: 'caozuo',
          align: 'center',
          width: '15%',
          render: (text, record) => (
              <span><span><a href="#" onClick={this.edit.bind(this, record)}>修改</a></span>&nbsp;&nbsp;&nbsp;

                  <Popconfirm title="是否确认删除？" onConfirm={this.deleteStation.bind(this, record)} onCancel={this.cancel} okText="是" cancelText="否">
                        <a href="#">删除</a>
                    </Popconfirm>
                </span>
          )


      }];
    return (
      <div style={{ paddingLeft: '30px', paddingRight: '30px', paddingTop: '10px', paddingBottom: '10px;' }}>
        <Row>
            <Row style={{ background: '#5a7fa5', height: 50 }}>
                <Col span={24}>
                    <Row>
                        <Col span={17}>
                            <span style={{ float: 'left', paddingTop: 10, paddingLeft: 20, fontFamily: 'Microsoft YaHei', fontSize: 18, fontWeight: 'bold' }}>网点维护</span>
                        </Col>
                        <Col span={7} style={{ marginTop: '10px' }}>
                            <Row span={24}>
                                <Col span={24}>
                      <span>
                        <Button type="primary"  style={{lineHeight:'32px',float:'right', marginTop:0,marginRight: 15 }} onClick={this.showModal}>添加网点</Button>
{/*
                        <Button type="primary" style={{ float: 'right', marginRight: 15 }} onClick={this.addDevice} >添加网点</Button>
*/}
                      </span>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>
            </Row>

          <Table
              style={{marginTop:10}}
              // rowKey="key" // 新加
              columns={columns}
               dataSource={this.state.dataSource}
              bordered
              pagination={{
                  total: total,
                  pageSize: pageSize1,
                  showTotal: function () {
                      return <div style={{marginRight: 10, marginTop: 5}}> 共计 {this.total} 条数据</div>
                  }
              }}
          />


          <Modal
              style={{top: 26, height:800}}
              width="800px"
              //  style={{height:800}}
              title="添加网点"
              visible={this.state.visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              // footer={this.state.footerValue}
              //  footer={this.onOk}
              okText="确认"
              cancelText="取消"
              destroyOnClose ="true" //窗口关闭时  销毁内容y
              maskClosable={false}
          >
              <Row   style={{marginRight: 100, marginTop: 5 }}>
                  <Col span={4}></Col>
                  <Col  style={this.state.style1} span={6}><font color="red">*</font>登录账号：</Col>
                  <Col   style={this.state.style1} span={12}> <Input  onkeyup="value=value.replace(/[^\w\.\/]/ig,'')"
                      placeholder="输入登陆名称" defaultValue={this.state.username} onChange={this.onChangeUsername}   disabled= {this.state.details}
                      value={this.state.username}/>  </Col>
              </Row>

              <Row  style={{marginRight: 100, marginTop: 5 }}>
                  <Col span={4}></Col>
                  <Col style={this.state.style1}
                       span={6}><font color="red">*</font>登录密码：</Col>
                  <Col  style={this.state.style1}  span={12}> <Input
                      placeholder="输入登陆密码" defaultValue={this.state.password} onChange={this.onChangePassword} disabled= {this.state.details}
                      value={this.state.password}/>  </Col>
              </Row>


            <Row style={{marginRight: 100, marginTop: 5}}>
              <Col span={4}></Col>
              <Col span={6}><font color="red">*</font>网点名称：</Col>
              <Col span={12}> <Input
                placeholder="输入网点名称" defaultValue={this.state.ceCustIntro} onChange={this.onChangeCeCustIntro} disabled= {this.state.details}
                                     value={this.state.ceCustIntroValue}/>  </Col>
            </Row>

            <Row style={{marginRight: 100, marginTop: 5}}>
              <Col span={4}></Col>
              <Col span={6}><font color="red">*</font>网点地址：</Col>
              <Col span={12}> <Input
                  placeholder="输入网点地址"  defaultValue={this.state.ceCustAddrValue}  onChange={this.onChangeCeCustAddr} disabled= {this.state.details}
                  value={this.state.ceCustAddrValue} />  </Col>
            </Row>

            <Row style={{marginRight: 100, marginTop: 5}}>
              <Col span={4}></Col>
              <Col span={6}><font color="red">*</font>联系人员：</Col>
              <Col span={12}> <Input placeholder="输入联系人员"  defaultValue={this.state.contacterValue}  onChange={this.onChangeContacterValue} disabled= {this.state.details}
                                     value={this.state.contacterValue}   />  </Col>
            </Row>

            <Row style={{marginRight: 100, marginTop: 5}}>
              <Col span={4}></Col>
              <Col span={6}><font color="red">*</font>联系电话：</Col>
              <Col span={12}> <Input placeholder="输入联系电话"  defaultValue={this.state.contactPhoneValue}  onChange={this.onChangeContactPhoneValue} disabled= {this.state.details}
                                     value={this.state.contactPhoneValue} />  </Col>
            </Row>

            <Row style={{marginRight: 100, marginTop: 5}}>
              <Col span={4}></Col>
              <Col span={6}>网关设备：</Col>
              <Col span={12}>
                  {/*<Input placeholder="输入接入网关的标识的SN码 添加多个 用，隔开"  defaultValue={this.state.snValue}  onChange={this.onChangeSnValue} disabled= {this.state.details}
                                     value={this.state.snValue} />*/}

                            <TextArea placeholder="输入接入网关的标识的SN码 添加多个 用，隔开" defaultValue={this.state.snValue}   onChange={this.onChangeSnValue} disabled= {this.state.details}
                                      value={this.state.snValue}   autosize={{ minRows: 5, maxRows: 50 }}
                            />


              </Col>
            </Row>

          </Modal>








        </Row>
      </div>
    )
  }

}


export default JalaSmartMaintain;

// ReactDOM.render(<JalaSmartMaintain/>, document.getElementById("root"));

ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <JalaSmartMaintain />
  </LocaleProvider>,
  document.getElementById('root')
);