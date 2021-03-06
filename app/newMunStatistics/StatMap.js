import React, { Component } from 'react';
import { Map, Popup, TileLayer, GeoJSON, FeatureGroup, Tooltip,LayersControl } from 'react-leaflet';
import axios from 'axios' ;
import IrieMarker from './IrieMarker' ; 
import config from '../config'
import Control from 'react-leaflet-control';
import MapKey from './MapKey' ;
import MapInfo from './MapInfo' ;
import ReactLoading from 'react-loading';

import { connect } from "react-redux";
import { getPopValue } from "../actions/index";
import { bindActionCreators } from "redux";

class StatMap extends Component {
    constructor(props){
        super(props);
        this.state={
            feature:"",shape:g_mun_shapes,key:1,Irie:[],seats:"" ,population:"" ,
            etat:"" ,gouv_name:"",destroy:true,grades:["New","Extended","Old"],
            keytitle:"Municipality color Representation",colorfun:this.getColor,
            allpop:0,allarea:0,shapeIsLoaded:false
        }
    }
    
    componentWillMount() {
        let qString=config.apiUrl+"/api/shape/AllShapesOld";
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
            console.log('we got shape data frm db');
            console.log(response);
            this.setState({shape:JSON.parse(response.data.data),key:2,shapeIsLoaded:true});
            }
        )
        .catch(function (error) {
            console.log(error);
        });

        let qString2=config.apiUrl+"/api/iries/";
            axios({
                method: 'get',
                url: qString2,
                headers: {
                    'name': 'Isie',
                    'password': 'Isie@ndDi'
                }
            })
        .then(response=>{
            console.log('we got polling data frm db');
            this.setState({Irie:response.data});
            }
        )
        .catch(function (error) {
            console.log(error);
        });
    
    }

     getColor(d,c1) {
        if      (d >2)      {return (c1[2]); }
        else if (d >1)      {return (c1[1]);}
        else if (isNaN(d))    {return ('white')}
        else                  {return (c1[0]);}
	}

    style(feature) {
        //check for what we have checked as filter subject : Population || state ||
            const etat = this.props.stateFilter;
            if(etat=="All") {
                if(feature.properties.state=="extended"){
                    var ETAT = 1;
                }else if(feature.properties.state=="new"){
                    var ETAT = 2;
                }else{
                    var ETAT = 3;
                }
            }
            if ((feature.properties.state=="extended")&&(etat=="Extended")){
                var ETAT = 1;
            }else if ((feature.properties.state=="new")&&(etat=="New")){
                var ETAT = 2;
            }else if ((feature.properties.state=="old")&&(etat=="Old")){
                var ETAT = 3;
            }
           
            
            return {
                fillColor: this.getColor(ETAT,this.props.mapColorState),
                color: 'black',
                weight: 2,
                fillOpacity: 0.8
            };

	}

    highlightFeature(e) {
	    const layer = e.target;
        const property = layer.feature.properties;
     this.setState({destroy:false,seats:property.chair,population:property.POP,etat:property.etat,gouv_name:property.LABEL});
    return layer.setStyle( {
        weight: 2,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
	}
    resetFeature(e) {
	    var layer = e.target;
	     layer.setStyle({
	        weight: 5
	    });
                this.setState({destroy:true});
	}

    render() {
        const position = [34.855360, 8.8049795];
        return (
            <div>
                {this.state.shapeIsLoaded ? <Map  maxZoom={23} center={position} zoom={7} className="initialposition" style={{height: "100vh", width: "100vw",position:"relative",zIndex:0}}>
                    <TileLayer
                    url='https://api.mapbox.com/styles/v1/hunter-x/cixhpey8700q12pnwg584603g/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaHVudGVyLXgiLCJhIjoiY2l2OXhqMHJrMDAxcDJ1cGd5YzM2bHlydSJ9.jJxP2PKCIUrgdIXjf-RzlA'
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <GeoJSON
                    key={"a"+this.state.key}
                    data= {this.state.shape}
                    style={this.style.bind(this)} 
                    onEachFeature={
                        (feature, layer) => {
                            layer.bindTooltip(feature.properties.LABEL,{ permanent: false,className:"tooltipnamear",direction:"center" })
                            layer.on({mouseover: this.highlightFeature.bind(this)});
                            layer.on({mouseout: this.resetFeature.bind(this)});   
                    }    
                    }
                    />

                    {this.props.checkedIrieButton?
                         <FeatureGroup color='purple'>
                            {this.state.Irie.map(function(object, i){
                                //console.log(object.latlon);
                                //console.log(object);
                                return <IrieMarker data={object.data} key={i} />;
                            })}
                        </FeatureGroup>:
                        <div/>
                    }
                {/**/}
                    <Control position="bottomright" >
                        <MapKey colorSet={this.props.mapColorState} grades={this.state.grades} getColor={this.state.colorfun} keyTitle={this.state.keytitle} />
                    </Control>
                    <Control position="topright" >
                        <MapInfo shape={this.state.shape}  colorSet={this.props.mapColorState}/>
                    </Control>
                    {/*show the information Div*/}
                    {(this.state.destroy==false)?<div className="one">{this.state.population}</div>: <div>aaaaa</div> }
                </Map>
                :
                <div>
                    <div className="col-md-7"></div>
                    <div className="col-md-5" style={{marginTop:"40vh"}}>
                        <h2>"Loading Map"</h2>
                        <ReactLoading type="bars" color="#444" className="react-Loader" delay={0} />
                    </div>
                </div>
            }
            </div>
        );
    }
}

function mapStateToProps(state) {
  // Whatever is returned will show up as props
  // inside of StatMap
  console.log("youhoooo",state.changeMapColorState);
  return {
    checkedIrieButton:state.irieCheckbox,
    mapColorState:state.changeMapColorState,
    stateFilter:state.stateFilter,
  };
}

// Promote BookList from a component to a container - it needs to know
// about this new dispatch method, selectBook. Make it available
// as a prop.
export default connect(mapStateToProps)(StatMap);

