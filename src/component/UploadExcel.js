import React from 'react';
import { Upload, Button, Icon,message,Row,Modal} from 'antd';

class UploadExcel extends React.Component{
    constructor(props) {
        super(props);

    }
    componentWillReceiveProps(nextProps){

    }
    state={
        stationId:'',
    }
    render(){
        const props = {
            name: 'file',
            action: '/console/terminalFiles/bulkImport',
            headers: {
                authorization: 'authorization-text',
            },

            onChange:(info)=> {

                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                    console.log("response",info.file.response)
                    console.log("response",info.file.response.uid)
                    this.sendMessage(info.file.response.name,info.file.response.status);
                    //this onChange是箭头函数的话  this是指向这个类里面的属性 方法 如果不是箭头函数的话指向的是这个类以外，整个js的方法!
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.response} file upload failed.`);
                }
            },

        };
        return(
            <Upload {...props}>
                <Button  type="primary">
                    <Icon type="upload" /> 上传文件
                </Button>
            </Upload>
        );
    }
    sendMessage=(name,status)=>{
        console.log('ds',status);
        console.log('name',name);
       // this.props.fn(uid,name,phone,phoneList);
    }

}
export default UploadExcel;
