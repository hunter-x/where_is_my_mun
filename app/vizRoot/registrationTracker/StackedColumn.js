import React, { Component } from 'react';
var Highcharts = require('highcharts');
import HighchartInit from './HighchartInit' ;
class StackedColumn extends Component {
constructor(props) {
    super(props);
    this.state={options:{}}
}

componentWillMount() {
    var allpop=this.props.allpop;
    this.setState({
        options:{
            chart: {
                type: 'bar',
                width: 300,
                height:200
            },
            title: {
                text: this.props.charttitle
            },
            xAxis: {
                categories: this.props.title
            },
            yAxis: {
                min: 0,
                title: {
                    text: this.props.ytitle
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            credits: false,
            legend: {
                reversed: true
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
            },
            plotOptions: {
            bar: {
                            dataLabels: {
                                enabled: true,
                                color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                            }
            },
                series: {
                    stacking: 'normal'
                }
            },
            series: [{
                name: 'New',
                data: [this.props.newMunNumber],color:this.props.colorSet[0]
            },{
                name: 'Extended',
                data: [this.props.extMunNumber],color:this.props.colorSet[3]
            },{
                name: 'Old',
                data: [this.props.oldMunNumber],color:this.props.colorSet[5]
            } ]
        }
    });
}
componentWillReceiveProps(nextProps) {
    console.log("nextProps",nextProps);
        var allpop=this.props.allpop;

    this.setState({
        options:{
            chart: {
                type: 'column',
                width: 300,
                height:250
            },
            title: {
                text: nextProps.charttitle
            },
            xAxis: {
                categories: nextProps.title
            },
            yAxis: {
                min: 0,
                title: {
                    text: nextProps.ytitle
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
            credits: false,
            legend: {
                align: 'right',
                x: 5,
                verticalAlign: 'top',
                y: 18,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                headerFormat: '<b>{point.x}</b><br/>',
                pointFormat: '{series.name}: {point.y}'+nextProps.spec+'<br/>Total: {point.stackTotal}'+nextProps.spec
            },
            plotOptions: {
                column: {
                    stacking: 'percent',
                    dataLabels: {
                        enabled: true,
                        formatter:function() {
                            var pcnt = (this.y / allpop) * 100;
                            return Highcharts.numberFormat(pcnt) + '%';
                        },
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
                    }
                }
            },
            series: [{
                name: 'New',
                data: [nextProps.newpop],color:nextProps.colorSet[1]
            },{
                name: 'Extended',
                data: [nextProps.extpop],color:nextProps.colorSet[0]
            },{
                name: 'Old',
                data: [nextProps.oldpop],color:nextProps.colorSet[2]
            } ]
        }
    });
}


    
    render() {
        return (
            <HighchartInit key={this.props.colorSet[0]+this.props.spec} options={this.state.options}/>
        );
    }
}

export default StackedColumn;