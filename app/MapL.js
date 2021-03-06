import React, { Component } from 'react';
import { Map,Marker, Popup, TileLayer, GeoJSON, FeatureGroup, Tooltip,LayersControl,Circle } from 'react-leaflet';
const { BaseLayer, Overlay } = LayersControl;
import { isEqual } from 'underscore';
import PollingCenter from './PollingCenter' ; 
import PollingFilter from './PollingFilter' ;
import RegSpotMarker from './RegSpotMarker' ;
import counterpart  from 'counterpart';
import Translate    from 'react-translate-component';
const _t = Translate.translate;
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import Download from 'material-ui/svg-icons/File/file-download';
import axios from 'axios' ;
import config from './config';
import Control from 'react-leaflet-control';
import MapKey from './MapKey' ;

import { Link  } from 'react-router';


class MapL extends Component {
  constructor(props){
    super (props);
    this.state=({center:[35.055360, 8.849795],zoom:7,polling:[],regSpot:[],oneIrie:[],munCoord:[],checkedPollingButton:false,checkedRegButton:false})
  }
  
  componentWillReceiveProps(nextProps) {
    //console.log(nextProps.gouv);
    if (isEqual(nextProps.markerpos, [0, 0])) {
      //console.log('00');
      //console.log(nextProps.shape);
        this.setState({polling:nextProps.polling})
    }else{
     this.setState({center:nextProps.markerpos,zoom:13,polling:nextProps.polling});
    }
    //get registration spots from server
    let qString=config.apiUrl+"/api/oneregspot/"+nextProps.gouv;
    axios({
        method: 'get',
        url: qString,
        headers: {
            'name': 'Isie',
            'password': 'Isie@ndDi'
        }
    })
    .then(response=>{
        //console.log(response.data.data)
        //console.log("regSpot",response.data);
        this.setState({regSpot:response.data});
        }
    )
    .catch(function (error) {
        console.log(error);
    });
    //get Irie List from db
    let qString2=config.apiUrl+"/api/irie/"+nextProps.gouv;
    axios({
        method: 'get',
        url: qString2,
        headers: {
            'name': 'Isie',
            'password': 'Isie@ndDi'
        }
    })
    .then(response=>{
        //console.log("irie",response.data);
        this.setState({oneIrie:response.data});
        }
    )
    .catch(function (error) {
        console.log(error);
    });      
    
    let qString3=config.apiUrl+"/api/onemuncoord/"+nextProps.gouv;
    axios({
        method: 'get',
        url: qString3,
        headers: {
            'name': 'Isie',
            'password': 'Isie@ndDi'
        }
    })
    .then(response=>{
        console.log("mun",response.data);
        this.setState({munCoord:response.data});
        }
    )
    .catch(function (error) {
        console.log(error);
    });      
  }
  setZoom(value){
    let center=value.split(";")
    this.setState({center:[center[0],center[1]],zoom:16});
  }
  style(feature) {
     return {
            fillColor: '#cadfae',
            color: 'red',weight: 2,
	    };
	}
  
  onEachFeature(feature, layer){
      layer.bindTooltip(feature.properties.LABEL,{ permanent: false,className:"tooltipnamear",direction:"center" })
 /*     //console.log("ccccccceeeeeeeeee",layer.getBounds().getCenter());
      var arr=this.state.municipalities;
      arr.push({data:{lat:layer.getBounds().getCenter().lat,lng:layer.getBounds().getCenter().lng,name:"Municipalité de  "+feature.properties.LABEL}})
     // console.log(arr);
      this.setState({ 
        municipalities: arr
      })*/
  }    
  render() {

    //console.log('RRREENNDDEERR');
    if (typeof this.props.shape==='string') {
     //console.log('changes');
      var shape = JSON.parse(this.props.shape)
      //console.log(typeof(shape));
    }else{
      //console.log('render MpL object');
      var shape =this.props.shape
    }
    const pin = L.icon({iconUrl: '/img/pin.svg',iconSize: [50, 50],iconAnchor: [40, 40]});

    var allreg=[]
    allreg=this.state.oneIrie.concat(this.state.regSpot,this.state.munCoord)

    return (
      <div>
      <RaisedButton 
        icon={<Download />} 
        containerElement={<Link to="/file/registration.pdf" target="_blank" onClick={(event) => {event.preventDefault(); window.open(this.makeHref("route"))}}/>}
        className="oneRegistrationDownload "  
        label={_t('Geocode.download')}
      />
      <Checkbox
        className="oneRegistrationCheck"
        key='reg'
        label={_t('Geocode.RegistrationCheck')}
        onCheck={event => this.setState({checkedRegButton:!this.state.checkedRegButton})}
      />
{/*      <hr className="pollingfilter" style={{width:"27%",top:"138px",backgroundColor:'black',height:"2px"}} />*/}
      <PollingFilter polling={this.props.polling} setZoom={this.setZoom.bind(this)} />
      <Checkbox
        className="onePollingCheck"
        key='poll'
        label={_t('Geocode.PollingCheck')}
        onCheck={event => this.setState({checkedPollingButton:!this.state.checkedPollingButton})}
      />

      <Map  id='map' ref='map' maxZoom={23}  flyTo={true} center ={this.state.center} zoom={this.state.zoom} className="initialposition two " style={{height:"80vh",position:"relative",zIndex:0}}>
                    <TileLayer
                    url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    
                    <Marker position= {this.props.markerpos} icon={pin} />
                    <GeoJSON
                    key={this.props.key}
                    data= {shape}
                    style={this.style.bind(this)} 
                    onEachFeature={this.onEachFeature.bind(this)}
                    
                    />
                    <LayersControl position="topright" className="one">
                     <BaseLayer checked name="Light">
                                <TileLayer
                                attribution="mapbox"
                                url="https://api.mapbox.com/styles/v1/hunter-x/cixhpey8700q12pnwg584603g/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaHVudGVyLXgiLCJhIjoiY2l2OXhqMHJrMDAxcDJ1cGd5YzM2bHlydSJ9.jJxP2PKCIUrgdIXjf-RzlA"
                                />
                        </BaseLayer>
                        <BaseLayer  name="Leaflet">
                                <TileLayer
                                attribution="Leaflet"
                                url="https://api.mapbox.com/styles/v1/mapbox/streets-v10/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaHVudGVyLXgiLCJhIjoiY2l2OXhqMHJrMDAxcDJ1cGd5YzM2bHlydSJ9.jJxP2PKCIUrgdIXjf-RzlA"
                                />
                        </BaseLayer>
                        <BaseLayer  name="OpenStreetMap">
                            <TileLayer
                                attribution="OpenStreetMap"
                            url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                            />
                        </BaseLayer>
                    </LayersControl>
                    {this.state.checkedPollingButton?
                          <FeatureGroup color='purple'>
                          {this.state.polling.map(function(object, i){
                            return <PollingCenter lat={object.latitude} lon={object.longitude} title={object.center} key={i} />;
                            })}
                        </FeatureGroup>:
                        <div/>}
                    {/*check for registration marker*/}
                    {this.state.checkedRegButton?
                          <FeatureGroup color='grey'>
                          <RegSpotMarker regData={allreg}  />
                        </FeatureGroup>:
                        <div/>
                    }
                    
                </Map>
               {this.state.checkedRegButton ?<MapKey />:<div></div>}
        </div>
    );
  }
}

export default MapL;