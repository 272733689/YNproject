/*
   光伏电站新增修改弹窗
 */
import React from 'react';
import {Divider, Row, Col} from 'antd';
import '../component/record.css';
class DeviceDetail extends React.Component {
    constructor(props) {
        super(props);
        var ds=props.ds;
         console.log("DeviceDetail",ds)
        var ds1=eval('('+ds.ceDevProps+')');

        this.state = {
            mdrCode:ds1.mdrCode,
            modelCode:ds1.modelCode,
            moduleCount:ds1.moduleCount,
            sortNo:ds1.sortNo,
            deviceSpec1:ds1.deviceSpec,
            operationDate:ds1.operationDate,
            commAddr:ds.devMeterCommAddr,
            terminName:ds.devTermCommAddr,
            terminalId:ds.termId,
            manageUnit:ds.ceResName,
            meterId:ds.meterId,
            version:ds.version,
            schemeName:ds.tmplName,
            schemeId:'',
            CT:ds.ctRate,
            PT:ds.ptRate,
            eleMeter:ds1.meter_type,
            deviceSpec:ds1.deviceSpec,
            branchCount:ds1.branchCount,
            moduleType:ds1.moduleType,
            moduleArea:ds1.moduleArea
        }

    }


    componentWillReceiveProps(nextProps) {

        var ds=nextProps.ds;

        var ds1=eval('('+ds.ceDevProps+')');

        this.setState({
            mdrCode:ds1.mdrCode,
            modelCode:ds1.modelCode,
            moduleCount:ds1.moduleCount,
            sortNo:ds1.sortNo,
            deviceSpec1:ds1.deviceSpec,
            operationDate:ds1.operationDate,
            commAddr:ds.devMeterCommAddr,
            terminName:ds.devTermCommAddr,
            terminalId:ds.termId,
            manageUnit:ds.ceResName,
            meterId:ds.meterId,
            version:ds.version,
            schemeName:ds.tmplName,
            schemeId:'',
            CT:ds.ctRate,
            PT:ds.ptRate,
            eleMeter:ds1.meter_type,
            deviceSpec:ds1.deviceSpec,
            branchCount:ds1.branchCount,
            moduleType:ds1.moduleType,
            moduleArea:ds1.moduleArea
        });
    }

    render() {

        let detail=this.props.ds.ceResSortNo==="DEV_PV_MODULE"?(
            <Row className="detailCss">
                <Row style={{marginBottom:10,lineHeight:'32px'}}>
                    <Col span={7} >
                        <span style={{float:'left'}}>&emsp;&emsp;名称：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.manageUnit}
                         </span>
                    </Col>
                </Row>
                <Row style={{marginBottom:10,lineHeight:'32px'}}>

                    <Col span={7}>
                        <span style={{float:'left'}}>生产厂家：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.mdrCode}
                         </span>
                    </Col>
                    <Col span={7}>
                        <span style={{float:'left'}}>组件规格：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.moduleType}
                         </span><span style={{color:'red'}}>  (Wp)</span>
                    </Col>
                </Row>
                <Row style={{marginBottom:10,lineHeight:'32px'}}>

                    <Col span={7}>
                        <span style={{float:'left'}}>组件面积：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.moduleArea}
                         </span>
                    </Col>
                    <Col span={7}>
                        <span style={{float:'left'}}>组件数量：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.moduleCount}
                         </span>
                    </Col>
                </Row>
                <Divider style={{marginTop:0}}/>
            </Row>
        ):(this.props.ds.ceResSortNo==="DEV_PV_INVERTER"?(
            <Row className="detailCss">
                <Row style={{marginBottom:10,lineHeight:'32px'}}>
                    <Col span={7} >
                        <span style={{float:'left'}} className="detail">&emsp;&emsp;名称：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.manageUnit}
                         </span>
                    </Col>
                </Row>
                <Row style={{marginBottom:10,lineHeight:'32px'}}>

                    <Col span={7}>
                        <span style={{float:'left'}} className="detail">生产厂家：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.mdrCode}
                         </span>
                    </Col>
                    <Col span={7}>
                        <span style={{float:'left'}} className="detail">&emsp;&emsp;型号：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.modelCode}
                         </span>
                    </Col>
                </Row>
                <Row style={{marginBottom:10,lineHeight:'32px'}}>

                    <Col span={7}>
                        <span style={{float:'left'}} className="detail">&emsp;&emsp;编号：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.sortNo}
                         </span>
                    </Col>
                    <Col span={7}>
                        <span style={{float:'left'}} className="detail">&emsp;&emsp;规格：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.deviceSpec1}
                         </span><span style={{color:'red'}}>  (kWp)</span>
                    </Col>
                </Row>
                <Row style={{marginBottom:10,lineHeight:'32px'}}>

                    <Col span={7}>
                        <span style={{float:'left'}} className="detail">&emsp;组串数：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.moduleCount}
                         </span>
                    </Col>
                    <Col span={7}>
                        <span style={{float:'left'}} className="detail">投运日期：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.operationDate}
                         </span>
                    </Col>
                </Row>
                <Row style={{marginBottom:10,lineHeight:'32px'}}>

                    <Col span={7}>
                        <span style={{float:'left'}} className="detail">通讯地址：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.commAddr}
                         </span>
                    </Col>
                    <Col span={7}>
                        <span style={{float:'left'}} className="detail">关联终端：</span>
                        <span style={{marginLeft:5}}>
                            {this.state.terminName}
                         </span>
                    </Col>
                </Row>
                <Divider style={{marginTop:0}}/>
            </Row>
        ):(
            this.props.ds.ceResSortNo==="DEV_PV_CONFLUENCE_BOX"?(
                <Row className="detailCss">
                    <Row style={{marginBottom:10,lineHeight:'32px'}}>
                        <Col span={7} >
                            <span style={{float:'left'}}>&emsp;&emsp;名称：</span>
                            <span style={{marginLeft:5}}>
                               {this.state.manageUnit}
                            </span>
                        </Col>
                    </Row>
                    <Row style={{marginBottom:10,lineHeight:'32px'}}>

                        <Col span={7}>
                            <span style={{float:'left'}}>生产厂家：</span>
                            <span style={{marginLeft:5}}>
                               {this.state.mdrCode}
                             </span>
                        </Col>
                        <Col span={7}>
                            <span style={{float:'left'}}>&emsp;&emsp;型号：</span>
                            <span style={{marginLeft:5}}>
                            {this.state.modelCode}
                         </span>
                        </Col>
                    </Row>
                    <Row style={{marginBottom:10,lineHeight:'32px'}}>

                        <Col span={7}>
                            <span style={{float:'left'}}>&emsp;&emsp;编号：</span>
                            <span style={{marginLeft:5}}>
                            {this.state.sortNo}
                         </span>
                        </Col>
                        <Col span={7}>
                            <span style={{float:'left'}}>&emsp;&emsp;规格：</span>
                            <span style={{marginLeft:5}}>
                               {this.state.deviceSpec==='1'?'交流':'直流'}
                            </span>
                        </Col>
                    </Row>
                    <Row style={{marginBottom:10,lineHeight:'32px'}}>

                        <Col span={7}>
                            <span style={{float:'left'}}>&emsp;支路数：</span>
                            <span style={{marginLeft:5}}>
                               {this.state.branchCount}
                            </span>
                        </Col>
                        <Col span={7}>
                            <span style={{float:'left'}}>投运日期：</span>
                            <span style={{marginLeft:5}}>
                              {this.state.operationDate}
                            </span>
                        </Col>
                    </Row>
                    <Row style={{marginBottom:10,lineHeight:'32px'}}>

                        <Col span={7}>
                            <span style={{float:'left'}}>通讯地址：</span>
                            <span style={{marginLeft:5}}>
                              {this.state.commAddr}
                            </span>
                        </Col>
                        <Col span={7}>
                            <span style={{float:'left'}}>关联终端：</span>
                            <span style={{marginLeft:5}}>
                               {this.state.terminName}
                            </span>
                        </Col>
                    </Row>
                    <Divider style={{marginTop:0}}/>
                </Row>
            ):(
                this.props.ds.ceResSortNo==="DEV_PV_METERING_WATT_METER"?(
                    <Row className="detailCss">
                        <Row style={{marginBottom:10,lineHeight:'32px'}}>
                            <Col span={7} >
                                <span style={{float:'left'}} className="detail">&emsp;&emsp;名称：</span>
                                <span style={{marginLeft:5}}>
                                  {this.state.manageUnit}
                                </span>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:10,lineHeight:'32px'}}>

                            <Col span={7}>
                                <span style={{float:'left'}}>生产厂家：</span>
                                <span style={{marginLeft:5}}>
                                   {this.state.mdrCode}
                         </span>
                            </Col>
                            <Col span={7}>
                                <span style={{float:'left'}}>电表类型：</span>
                                <span style={{marginLeft:5}}>
                                  {this.state.eleMeter==='1'?'发电电表':this.state.eleMeter==='2'?'上网电表':'自发自用电表'}
                                </span>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:10,lineHeight:'32px'}}>

                            <Col span={7}>
                                <span style={{float:'left'}}>&emsp;&emsp;型号：</span>
                                <span style={{marginLeft:5}}>
                                  {this.state.modelCode}
                                </span>
                            </Col>
                            <Col span={7}>
                                <span style={{float:'left'}}>&emsp;&emsp;编号：</span>
                                <span style={{marginLeft:5}}>
                                   {this.state.sortNo}
                                </span>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:10,lineHeight:'32px'}}>

                            <Col span={7}>
                                <span style={{float:'left'}}>&emsp;&emsp;&nbsp;&nbsp;&nbsp;CT：</span>
                                <span style={{marginLeft:5}}>
                                   {this.state.CT}
                                </span>
                            </Col>
                            <Col span={7}>
                                <span style={{float:'left'}}>&emsp;&emsp;&nbsp;&nbsp;&nbsp;PT：</span>
                                <span style={{marginLeft:5}}>
                                  {this.state.PT}
                                </span>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:10,lineHeight:'32px'}}>

                            <Col span={7}>
                                <span style={{float:'left'}}>投运日期：</span>
                                <span style={{marginLeft:5}}>
                                   {this.state.operationDate}
                                 </span>
                            </Col>
                            <Col span={7}>
                                <span style={{float:'left'}}>通讯地址：</span>
                                <span style={{marginLeft:5}}>
                                   {this.state.commAddr}
                                </span>
                            </Col>
                        </Row>

                        <Row style={{marginBottom:10,lineHeight:'32px'}}>

                            <Col span={7}>
                                <span style={{float:'left'}}>关联终端：</span>
                                <span style={{marginLeft:5}}>
                                  {this.state.terminName}
                                </span>
                            </Col>
                            <Col span={7}>
                                <span style={{float:'left'}}>电价模板：</span>
                                <span style={{marginLeft:5}}>
                                   {this.state.schemeName}
                                </span>
                            </Col>
                        </Row>
                        <Divider style={{marginTop:0}}/>
                    </Row>
                ):(
                    <Row className="detailCss">
                        <Row style={{marginBottom:10,lineHeight:'32px'}}>
                            <Col span={7} >
                                <span style={{float:'left'}}>&emsp;&emsp;名称：</span>
                                <span style={{marginLeft:5}}>
                                   {this.state.manageUnit}
                                </span>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:10,lineHeight:'32px'}}>

                            <Col span={7}>
                                <span style={{float:'left'}}>生产厂家：</span>
                                <span style={{marginLeft:5}}>
                                  {this.state.mdrCode}
                                </span>
                            </Col>
                            <Col span={7}>
                                <span style={{float:'left'}}>&emsp;&emsp;型号：</span>
                                <span style={{marginLeft:5}}>
                                  {this.state.modelCode}
                                </span>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:10,lineHeight:'32px'}}>
                            <Col span={7}>
                                <span style={{float:'left'}}>&emsp;&emsp;编号：</span>
                                <span style={{marginLeft:5}}>
                                   {this.state.sortNo}
                                 </span>
                            </Col>
                            <Col span={7}>
                                <span style={{float:'left'}}>投运日期：</span>
                                <span style={{marginLeft:5}}>
                                   {this.state.operationDate}
                                 </span>
                            </Col>
                        </Row>
                        <Row style={{marginBottom:10,lineHeight:'32px'}}>

                            <Col span={7}>
                                <span style={{float:'left'}}>关联终端：</span>
                                <span style={{marginLeft:5}}>
                                    {this.state.terminName}
                                 </span>
                            </Col>
                            <Col span={7}>
                                <span style={{float:'left'}}>通讯地址：</span>
                                <span style={{marginLeft:5}}>
                                   {this.state.commAddr}
                                </span>
                            </Col>
                        </Row>
                        <Divider style={{marginTop:0}}/>
                    </Row>
                )
            )
        ))
        return(
            <Row>
             {detail}
            </Row>
        )
    }

}

export default DeviceDetail;