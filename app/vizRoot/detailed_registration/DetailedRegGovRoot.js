import React, { Component } from 'react';
import Layout from '../Layout' ;
import DetailedRegGovMap from './DetailedRegGovMap' ;
import ActiveRegistered from './ActiveRegistered' ;
import counterpart  from 'counterpart';
import Translate    from 'react-translate-component';
import axios from 'axios' ;
import config from '../../config'
import ThemeRadio from './containers/pickFilter/ThemeRadio' ;

import { connect } from "react-redux";
import { getPopValue } from "../../actions/index";
import { bindActionCreators } from "redux";

class DetailedRegGovRoot extends Component {
    
    constructor(props) {
        super(props);
        this.state={shape:g_mun_shapes,shapeIsLoaded:false, key:1,}
    }
    
    componentWillMount() {
        let qString=config.apiUrl+"/api/dailyins/detailed_gov_10-07";
        axios({
            method: 'get',
            url: qString,
            headers: {
                'name': 'Isie',
                'password': 'Isie@ndDi'
            }
        })
        .then(response=>{
            this.setState({shape:JSON.parse(response.data.data),key:2,shapeIsLoaded:true
            });
        }
        )
        .catch(function (error) {
            console.log(error);
        });

    }
    componentWillReceiveProps(nextProps) {
        
    }
    
    render() {
        return (
            <div>
                <Layout/>
                <ThemeRadio/>
                {   this.props.radioFilterPicker=="pop" ?
                    <DetailedRegGovMap shape={this.state.shape} shapeIsLoaded={this.state.shapeIsLoaded} key={this.state.key} />
                    :
                    <ActiveRegistered shape={this.state.shape} shapeIsLoaded={this.state.shapeIsLoaded} key={this.state.key+1}/>
                }
            </div>
        );
    }
}

function mapStateToProps(state) {

  console.log("youhoooo DetailedRegGovRoot",state);
  return {
    radioFilterPicker:state.radioFilterPicker,
  };
}

export default connect(mapStateToProps)(DetailedRegGovRoot);