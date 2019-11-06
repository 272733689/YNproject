import  React,{Component}from 'react';
import  ReactDOM from 'react-dom';
import {Upload, Icon, Modal , Layout,Menu} from 'antd';
// import { Player } from 'video-react';
import ReactPlayer from 'react-player'
import './css/VideoMonitor.css';
import reqwest from 'reqwest';
const { Header, Footer, Sider, Content } = Layout;
const { SubMenu } = Menu;
class TestYnag  extends Component{
    state = {
        previewVisible: false,
        previewImage: '',
        fileList: [
            {
                uid: '-1',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
                uid: '-2',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
                uid: '-3',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
                uid: '-4',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
            {
                uid: '-5',
                name: 'image.png',
                status: 'done',
                url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
            },
        ],
    };

    handleCancel = () =>{
        this.setState({

            previewVisible: false });

    }

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) =>{
        this.setState({ fileList });
    }

    onDownload =()=>{
        console.log("点击了下载文件");
        alert("a哈哈哈哈");

    }



    //   加载页面时 触发
    componentDidMount() {

    };

    getBase64(file) {
    return new Promise((resolve, reject) => {
        console.log("点击了");
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}





    render() {
        const { previewVisible, previewImage, fileList } = this.state;
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <div className="clearfix">
                <Upload
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                    onDownload ={this.onDownload}
                    showUploadList={{showPreviewIcon: false,showDownloadIcon :true ,showRemoveIcon:false}}
                >

                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>

        )
    }


}

export default TestYnag;

ReactDOM.render(<TestYnag/>, document.getElementById("root"));


// ReactDOM.render(
//     <EnergyOverviewOperator />,
//     document.getElementById('root')
// )

// ReactDOM.render(
//     <LocaleProvider locale={zhCN}>
//         <videoMonitor/>
//     </LocaleProvider>,
//     document.getElementById('root')
// )