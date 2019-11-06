import React,{Component} from 'react';
import {Map,Marker,Markers} from 'react-amap';
import Geolocation from 'react-amap-plugin-geolocation'
let geocoder;
let placeSearch;
class StationMap extends Component{
    constructor(props) {
        super(props);
        console.log('searchByName',props.searchName)
        this.setState({searchByName:props.searchName,why:props.searchName}, () => {


        });
    }
    componentWillReceiveProps(nextProps){

            this.setState({searchByName:nextProps.searchName}, () => {
                });
            }
    state = {
        zoom:13.5,
        position:[120,30],
        dragEnable:true,
        zoomEnable:true,
        citycode:'',
        adcode:'',
        province:'',
        city:'',
        district:'',
        addr:'',
        currentLocation:'',
        latitude:'',
        longitude:'',
        currentLocation:'',
        searchByName:'',
        center:{
            longitude:'120' ,
            latitude:'30' ,
        },
        why:'',
        markers:null

    };


    render () {
        let _this=this;
        const plugins = [
            'MapType',
            'Scale',
            'OverView',
            {
                name: 'ToolBar',
                options: {
                    visible: true,  // 不设置该属性默认就是 true
                    onCreated(ins){
                        console.log(ins);
                    },
                },
            }
        ]

           let center={'longitude':'','latitude':''};

            console.log("searchByNamesss",_this.state.searchByName)
            console.log("_this.state.why",_this.state.why)
            let v =_this.state.searchByName;
            console.log('v',v);
            //关键字查询
            if(placeSearch){
                placeSearch.search(v,function(status,result){
                    if(status=='complete'){
                        var list = result.poiList;
                        var pois = list.pois;
                        if(pois.length>0){
                            _this.setState({position:pois[0].location},
                                ()=>{
                                    console.log("searchName",_this.state.searchByName)
                                })
                        }
                        const markerEvents = {
                            click: (markerInstance) => {
                                // _this.props.form.setFieldsValue({'dizhi':markerInstance.lnglat.lng+','+markerInstance.lnglat.lat});
                            }
                        }
                    }
                });
        }
        const events = {
            created(instance){
                //console.log('created',instance);
                AMap.plugin('AMap.Geocoder',() => {
                    geocoder = new AMap.Geocoder({
                        city: "010"//城市，默认：“全国”
                    });
                })
                AMap.service(["AMap.PlaceSearch"], function() {
                    if(!placeSearch){
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
                _this.setState({
                    position: lnglat,
                    currentLocation: 'loading...'
                });
               geocoder&&geocoder.getAddress(lnglat, (status, result) => {
                    console.log(result);
                    if (status === 'complete'){
                        if (result.regeocode){
                            var add=result.regeocode.formattedAddress;
                            var province=result.regeocode.addressComponent.province;
                            var city=result.regeocode.addressComponent.city;
                            var district=result.regeocode.addressComponent.district;
                            var aa=add.replace(province,"");
                            var bb=aa.replace(city,"");
                            var addr=bb.replace(district,"");
                            _this.setState({
                                // currentLocation: result.regeocode.formattedAddress || '未知地点',
                                citycode:result.regeocode.addressComponent.citycode,
                                adcode:result.regeocode.addressComponent.adcode,
                                province:province,
                                city:city,
                                district:district,
                                addr:addr,
                                latitude:e.lnglat.getLat(),
                                longitude:e.lnglat.getLng(),
                                currentLocation: result.regeocode.formattedAddress,
                                position: lnglat,
                            },()=>{
                                console.log("lat",this.state.latitude)
                                console.log("longitude",this.state.longitude)
                                _this.sendMessage();
                            });
                        } else {
                            _this.setState({
                                currentLocation: '未知地点'
                            });
                        }
                    } else {
                        _this.setState({
                            currentLocation: '未知地点'
                        });
                    }
                })
            }
        }
        const markerEvents = {};


        return(
            <div style={{position:'absolute',width: '100%', height: 400}}>
                <Map center={this.state.position} events={events} plugins={plugins}>
                    <Marker position={this.state.position} events={markerEvents}  />
                </Map>
            </div>
        )
    };
    sendMessage=()=>{
        const{citycode,adcode,province,city,district,addr,latitude,longitude,currentLocation}=this.state;
        this.props.fn(citycode,adcode,province,city,district,addr,latitude,longitude,currentLocation);
    }
}

export default StationMap;