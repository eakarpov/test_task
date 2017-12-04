import React from "react";

export default class CommandListItem extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  getStatus(statusCode) {
    switch (statusCode) {
      case -1: return "Error";
      case 0: return "Error";
      case 1: return "Executed";
      case 2: return "Proceeding";
      default: return "Error";
    }
  }

  getTime(timeCode) {
    const time = new Date(timeCode);
    return `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}:${time.getMilliseconds()}`;
  }

  render() {
    const status = typeof this.props.status === "string" ? this.props.status : this.getStatus(this.props.status);
    const timeValueStart = typeof this.props.timeStart === "string" ? this.props.timeStart : this.getTime(this.props.timeStart);
    const timeValueEnd = typeof this.props.timeEnd === "string" ? this.props.timeEnd : this.getTime(this.props.timeEnd);
    return (<div>
      <div className="col-md-2">{this.props.command}</div>
      <div className="col-md-3">{this.props.host}</div>
      <div className="col-md-1">{timeValueStart}</div>
      <div className="col-md-1">{timeValueEnd}</div>
      <div className="col-md-4">{this.props.value}</div>
      <div className="col-md-1">{status === 'Proceeding' ? this.props.task ? `${this.props.task}/${this.props.tasks} - ${this.props.percent}` : status : status}</div>
    </div>);
  }
}