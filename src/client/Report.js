import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Section from './section/Section'
const constant = require('../util/constant');

export default class Report extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionConfigList: []
        };
    }

    async componentDidMount() {
        try {
            var sectionConfigList = this.props.sectionConfig;
            this.setState({
                sectionConfigList: sectionConfigList
            });
        } catch (error) {
            console.log(error);
        }
    }


    createSections() {
        if (this.state.sectionConfigList == null || this.state.sectionConfigList == undefined) return;
        var sections = [];
        for (let i = 0; i < this.state.sectionConfigList.length; i++) {
            sections.push(<Section sectionConfig={this.state.sectionConfigList[i]} key={i}/>);
        }
        return sections;
    }

    render() {
        return (
            <div id={this.props.id} className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <h1>{this.props.title}</h1>
                        <h1>Azure SignalR Service Performance Report v1</h1>
                    </div>
                </div>
                <div className="row">
                    {this.createSections()}
                </div>
            </div>
        );
    }
}
