import React from "react";
import axios from 'axios';

export default class CommandListItem extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  getStatus(statusCode) {
    switch (statusCode) {
      case -1: return "Error";
      case 0: return "Error";
      case 1: return "Executed";
      case 2: return "Proceeding";
      case 3: return "Created";
      case 4: return "Cancelled";
      default: return "Error";
    }
  }

  start(key) {
    axios.get(`/api/start?key=${key}`).then(res => {
      console.log(res.status, 'done');
    });
  }

  stop(key) {
    axios.get(`/api/stop?key=${key}`).then(res => {
      console.log(res.status, 'done');
    });
  }

  getTime(timeCode) {
    const time = new Date(timeCode);
    return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}:${time.getMilliseconds()}`;
  }

  render() {
    const status = typeof this.props.status === "string" ? this.props.status : this.getStatus(this.props.status);
    const timeValueStart = typeof this.props.timeStart === "string" ? this.props.timeStart : this.getTime(this.props.timeStart);
    const timeValueEnd = typeof this.props.timeEnd === "string" ? this.props.timeEnd : this.getTime(this.props.timeEnd);
    console.log(status, this.props.task);
    return (<div>
      <div className="col-md-2">{this.props.command}</div>
      <div className="col-md-2">{this.props.host}</div>
      <div className="col-md-1">{timeValueStart}</div>
      <div className="col-md-1">{timeValueEnd}</div>
      <div className="col-md-4">{this.props.value}</div>
      <div className="col-md-2">{status === 'Proceeding'
      ? this.props.task
        ? `${this.props.task}/${this.props.tasks} - ${this.props.percent}%`
        : status
      : status}{status !== 'Status' && status !== 'Executed' && status !== 'Cancelled'  
      ? <div>
      {status !== 'Proceeding' ? <button onClick={() => this.start(this.props.id)}>>  </button> : null}
      {status !== 'Created' ? <button onClick={() => this.stop(this.props.id)}>X</button> : null}</div>
      : null}
      </div>
    </div>);
  }
}