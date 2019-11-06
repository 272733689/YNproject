import { Upload, Icon, message,Modal } from 'antd';
import  React from 'react';
import  ReactDOM from 'react-dom';
const { Dragger } = Upload;


class UploadFiles extends React.Component{

    constructor(props) {
        console.log('props.fileList',props.fileList);
        super(props);
        this.state = {
            previewVisible: false,
            previewFile: '',
            fileList:props.fileList,
            file:[],
            flag:'',
        };
    }

    componentWillReceiveProps(nextProps){
        //console.log('PicturesWall-componentWillReceiveProps(nextProps)');
        // this.setState({attachId:nextProps.attachId,flag:nextProps.previewImage}, () => {
        //     console.log("nextProps.previewImage",nextProps.previewImage)
        this.setState({
            fileList:nextProps.fileList,
        })
        //
        // });
    }


    handlePreview = (file) => {
        console.log("file",file.url)
        if(file.url!==null &&file.url!=="")
        {
            window.location.href=file.url;
        }else{
            window.location.href=file.response[0].url;
        }

        // this.setState({
        //     previewImage: file.url || file.thumbUrl,
        //     previewVisible: true,
        // },()=>{
        //     console.log('dasda')
        // });
    }
    handleChange = ({ file,fileList }) => this.setState({ fileList,file },()=>{
        console.log("file",file)
        if(file.status==='done')
        {
            this.props.change(file,fileList);
        }

        this.setState({
            fileList:fileList,
        })
        var jsonData = JSON.stringify(file.response);
        var ds =eval('('+jsonData+')');
        for(var p in ds)
        {
            //console.log("previewImage",previewImage)
            // this.sendMessage(ds[p].url);
        }
    })
    render(){

        const { previewVisible, previewFile, fileList } = this.state;
        console.log("render",fileList)
        const props = {
            name: 'file',
            multiple: true,
            action: '/console/kngfStationFiles/saveOssAttach',
            onChange:this.handleChange,
            // const { status } = info.file;
            // if (status !== 'uploading') {
            //     console.log(info.file, info.fileList);
            // }
            // if (status === 'done') {
            //     console.log("info",info)
            //     _this.setState({
            //         fileList:info.fileList
            //     })
            //     var jsonData = JSON.stringify(info.file.response);
            //     var ds =eval('('+jsonData+')');
            //     for(var p in ds)
            //     {
            //         console.log("previewImage",ds[p].url);
            //
            //
            //     }
            // } else if (status === 'error') {
            //     message.error(`${info.file.name} file upload failed.`);
            // }
            // },
            onPreview:this.handlePreview,
        };

        return(

            <div className="clearfix">
                <Dragger {...props} fileList={this.state.fileList}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">点击或者拖拽文件到当前位置进行上传</p>
                    <p className="ant-upload-hint">

                    </p>
                </Dragger>
            </div>
        );
    }
}
export  default  UploadFiles;