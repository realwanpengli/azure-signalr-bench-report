import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ChartSection from './components/ChartSection';
import TableSection from './components/TableSection';
const constant = require('../../util/constant');

export default class Section extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartSections: [],
            tableSections: []
         };
    }

    async componentDidMount() {
        try {
            let tablePath = this.props.sectionConfig[constant.SECTION_TABLE_PATH_LIST];
            if (tablePath && tablePath.length > 0) {
                this.createTableSections();
            }
            await this.createChartSections();
        } catch (error) {
            console.log(error);
        }
    }

    createTableSections() {
        let tablePathList = this.props.sectionConfig[constant.SECTION_TABLE_PATH_LIST];
        let tableList = tablePathList.map((path, i) => (<TableSection tablePath={path} key={i}/>));
        this.setState({ tableSections: tableList });
    }

    async createChartSections() {
        let chartConfigList = this.props.sectionConfig.charts;
        console.log('sectionConfig', this.props.sectionConfig);

        let chartSections = [];
        for (let i = 0; i < chartConfigList.length; i++) {
            let chartConfig = chartConfigList[i];
            let recordPath = this.props.sectionConfig[constant.SECTION_CONFIG_COUNTERS_PATH_KEY];
            let counterDict = await this.loadAndNormalizeRecord(recordPath);
            let recordTimeList = await this.getRecordTimeList(recordPath);
            let section = <ChartSection canvasId={chartConfig.id} counterDict={counterDict} recordTimeList={recordTimeList} 
            chartType={chartConfig.type} counterFilter={chartConfig.counter_filter} key={i}/>;
            chartSections.push(section);
        }

        this.setState({
            chartSections: chartSections
        });
    }

    async loadAndNormalizeRecord(recordPath) {
        try {
            var query = "?recordPath=" + recordPath;
            var res = await fetch(constant.SERVER_API_GET_COUNTER_DICT + query);
            var counterDict = await res.json();
            return counterDict;
        } catch (error) {
            console.log(error);
        }
    }

    async getRecordTimeList(recordPath) {
        try {
            var query = "?recordPath=" + recordPath;
            var res = await fetch(constant.SERVER_API_GET_RECORD_TIME_LIST + query);
            var recordTimeList = await res.json();
            return recordTimeList;
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div className="container-fluid">
                <div className='row'>
                    <div className='col-12'>
                        {this.props.sectionConfig.title}
                    </div>
                    <div className='col-12'>
                        {this.state.tableSections}
                    </div>
                    <div className='col-12'>
                        {this.state.chartSections}
                    </div>
                </div>
                <div className='row'>
                    {/* {this.props.chartType} */}
                </div>
            </div>
        );
    }
}
