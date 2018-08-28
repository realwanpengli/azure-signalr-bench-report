import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Report from './Report';
import { HashRouter as Router, Route, Link, Switch } from 'react-router-dom'

const constant = require('../util/constant');

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reportList: [],
            reportIdList: []
        };
    }

    async componentDidMount() {
        let reportConfigList = await this.getReportConfigList();
        
    }
    
    async getReportConfigList() {
        try {
            let res = await fetch(constant.SERVER_API_GET_REPORT_CONFIG_LIST);
            let reportConfigList = await res.json();
            let reportList = await this.generateReportList(reportConfigList);
            let reportIdList = this.generateReportIdList(reportConfigList);
            this.setState({ reportList: reportList, reportIdList: reportIdList});
        } catch (error) {
            console.log(error);
        }
    }

    async generateReportList(reportConfigList) {
        return await Promise.all(reportConfigList.map(async (reportConfig, i) => {
            let sectionConfigPath = reportConfig[constant.REPORT_SECTION_PATH_KEY];
            let sectionConfig = await this.loadSectionConfig(sectionConfigPath);
            let id = reportConfig.id;
            let title = reportConfig.title;
            let report = <Report id={id} title={title} sectionConfig={sectionConfig} />;
            if (i == 0) return (<Route exact path={"/" + id} component={() => report} key={i} />);
            return (<Route path={"/" + id} component={() => report} key={i} />);
        }));
    }

    generateReportIdList(reportConfigList) {
        return reportConfigList.map((reportConfig, i) => {
            let id = reportConfig.id;
            return (<li key={i}><Link to={"/" + id}> {id} </Link></li>);
        });
    }

    async loadSectionConfig(sectionConfigPath) {
        try {
            // load section config
            let query = "?sectionConfigPath=" + sectionConfigPath;
            let res = await fetch(constant.SERVER_API_GET_SECTION_CONFIG_LIST + query);
            let sectionConfigList = await res.json();
            return sectionConfigList;
        } catch (error) {
            console.log(error);
        }
    }

    render() {
        return (
            <div>
                <Router>
                    <div>
                        <ul>
                            {this.state.reportIdList}
                        </ul>
                        <hr />
                        {this.state.reportList}
                    </div>
                </Router>
            </div>
        );
    }
}
