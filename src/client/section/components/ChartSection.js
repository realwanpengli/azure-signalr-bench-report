import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'chart.js'
var ChartConfigGenerator = require('../components/ChartConfigGenerator.js')
export default class ChartSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chart: null
        };
    }

    componentDidMount() {
      let canvasCtx = document.getElementById(this.props.canvasId).getContext("2d");
      let filteredDataDict = ChartConfigGenerator.filter(this.props.counterDict, this.props.counterFilter);
      let percentData = ChartConfigGenerator.absoluteDataToPercentData(filteredDataDict);
      let canvasConfig = ChartConfigGenerator.generate(this.props.chartType, percentData, this.props.recordTimeList);
        let chart = new Chart(canvasCtx, canvasConfig);
      this.setState({chart: chart});
    }

    render() {
      return (
          <div >
        <div className="row">
            <div className="col-12">
              <canvas id={this.props.canvasId}>
              </canvas>
                  </div>
          </div>
              <div className="row">
              </div>
        </div>
      );
    }
}
