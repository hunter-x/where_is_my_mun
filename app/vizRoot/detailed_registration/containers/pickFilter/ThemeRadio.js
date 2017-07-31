import React, { Component } from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Control from 'react-leaflet-control';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Checkbox from 'material-ui/Checkbox';

import { connect } from "react-redux";
import { getPickedFilter } from "../../../../actions/index";
import { bindActionCreators } from "redux";

import Translate from 'react-translate-component';

class ThemeRadio extends Component {
	constructor(props) {
		super(props);
		this.state={checkBoxValue:true,date:'_06_07'}
	}
	change(e,value){
		this.props.getPickedFilter(value)
	}
	
    render() {
		let styles=this.props.styles
		let defaultSelecteds=this.props.defaultSelected
		//console.log(defaultSelecteds);
        return (
             <div  style={styles}>
               <h4 >
                    Choose a Theme
                </h4> 
	            <RadioButtonGroup  name="reg&update" defaultSelected={defaultSelecteds} onChange={this.change.bind(this)} >
					<RadioButton
					labelStyle={{color:'black'}}
					value="pop"
					label="Registered vs Eligible"
					 style={{marginTop:"7px"}}
					 />
					<RadioButton
					labelStyle={{color:'black'}}
					value="active"
					label="Active Registered"				        
					style={{marginTop:"7px"}}
					/>
					<RadioButton
					labelStyle={{color:'black'}}
					value="profile"
					label="Voter Profile"				        
					style={{marginTop:"7px"}}
					/>
				</RadioButtonGroup>
					
             </div>
        );
    }
}

function mapDispatchToProps(dispatch) {

  return bindActionCreators({ getPickedFilter}, dispatch);
}
export default connect(null, mapDispatchToProps)(ThemeRadio);