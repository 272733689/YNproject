import { Upload, Icon, Modal } from 'antd';
import  React from 'react';
import  loadsh from 'lodash';
import  ReactDOM from 'react-dom';




class  UploadPicture extends  React.Component{
    constructor(props) {
        console.log('child');
        super(props);
        if(props.count>1)
        {
            return;
        }
        this.setState({attachId:props.attachId,file:props.file},()=>{

        });
    }

    componentWillReceiveProps(nextProps){
        //console.log('PicturesWall-componentWillReceiveProps(nextProps)');
        this.setState({attachId:nextProps.attachId,flag:nextProps.previewImage}, () => {
            console.log("nextProps.previewImage",nextProps.previewImage)
            if(this.state.flag==='1')
            {
                this.setState({
                    previewImage: '',

                    file:[],
                })
            }

        });
    }
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [],
        file:[],
        flag:'',
    };

    handleCancel = () => this.setState({ previewVisible: false },()=>{
        console.log('sss');
    })

    handlePreview = (file) => {
        this.setState({
            previewImage: file.url || file.thumbUrl,
            previewVisible: true,
        },()=>{
            console.log('dasda')
        });
    }

    // handleChange = (file,fileList) =>{
    //     console.log('file',this.props.file);
    //     console.log('file1',file.response);
    //     console.log('fileList',fileList);
    //     this.props.change(file);
    //     var jsonData = JSON.stringify(file.response);
    //     var ds =eval('('+jsonData+')');
    //     for(var p in ds)
    //     {
    //         this.sendMessage(ds[p].url);
    //     }
    // }
    handleChange = ({ file,fileList }) => this.setState({ fileList,file },()=>{

        this.props.change(file,fileList);
        var jsonData = JSON.stringify(file.response);
        var ds =eval('('+jsonData+')');
        for(var p in ds)
        {
            //console.log("previewImage",previewImage)
            this.sendMessage(ds[p].url);
        }
    })
    removePicure=(file)=>{
        console.log('remove',file);
    }
    render(){
        const { previewVisible, previewImage, fileList } = this.state;
        console.log("previewImage",this.props.fileList)
        console.log("file",this.props.file)
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        console.log('attachId11',this.props.attachId);
        return (
            <div className="clearfix">
                <Upload
                    action={this.props.url}
                    listType="picture-card"
                    fileList={this.props.fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    onRemove={this.removePicure}
                >
                    {/*{fileList.length >= 3 ? null : uploadButton}*/}
                    <div>
                        <Icon type="plus" />
                        <div className="ant-upload-text">Upload</div>
                    </div>
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel} style={{ width:700,height:700, verticalAlign: 'middle',marginTop:'3.5%'}}>
                    <img alt="example" style={{ width:'100%'}} src={previewImage} />
                </Modal>
            </div>
        );

   }
    sendMessage=(url)=>{
        console.log('ds',url);
        this.props.fn(url);
    }
}
export default  UploadPicture;