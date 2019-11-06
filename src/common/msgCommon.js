/**
 * 提示信息公共
 */

import {message,Row,Col} from 'antd';

var methods={
    get(messages,type){
       if(type==="error")
       {
           message.error(messages,5);
       }else if(type==="success"){
           message.success(messages,5);
       }else if(type==="info"){
           message.info(messages,5);
       }else if(type==="warning")
       {
           message.warning(messages,5);
       }
    },
    getRow(count)
    {
        for(var i=0;i<count;i++)
        {
            <Row>
                <Col span={3}>
                   aa
                </Col>
                <Col span={9}>
                    aa
                </Col>
                <Col span={3}>
                   aaa
                </Col>
                <Col span={9}>
                   sd
                </Col>
            </Row>
        }
    }
}

export default methods;