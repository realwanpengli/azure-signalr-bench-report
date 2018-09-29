import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import "bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const os = require('os');
const constant = require('../../../util/constant.js');

export default class TableSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            table: <table></table>
        };
    }

    async componentDidMount() {
        let csvData = null;
        try {
            let res = await fetch(constant.UTIL_READ_FILE + '?path=' + this.props.tablePath);
            csvData = await res.text();
        } catch (error) {
            console.log(error);
            return;
        }
        let lines = csvData.split(os.EOL);
        let matrix = lines.map(line => line.split(','));
        let table = this.createTable(matrix);
        this.setState({table: table});
    }

    createTable(matrix) {
        let header = this.createRowInTable(matrix[0], true);
        let rows = matrix.slice(1).map((row, i) => this.createRowInTable(row, i, false));
        let table = (<table className="table table-bordered table-responsive"><tbody>{header}{rows}</tbody></table>);
        return table;
    }

    createRowInTable(row, ind, isHeader) {
        let ths = row.map((item, i) => isHeader ? (<th key={i}>{item}</th>) : (<td key={i}>{item}</td>));
        return (<tr key={ind}>{ths}</tr>);
    }

    render() {
        return (
            <div>
                {this.state.table}
            </div>
        );
    }
}
