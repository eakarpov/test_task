import React from "react";
import axios from "axios";
import { connect } from "react-redux";

import { addCommand, setCommandList } from "../actions/commandActions";

class Launcher extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      alert1: undefined,
      alert2: undefined,
      command: 'ping',
      params: '',
      ttl: '',
      host: '',
    };
    this.change = this.change.bind(this);
    this.updateTtl = this.updateTtl.bind(this);
    this.updateHost = this.updateHost.bind(this);
    this.updateParams = this.updateParams.bind(this);
  }

  change(e) {
    this.setState({
      command:e.target.value,
    });
  }
  updateTtl(e) {
    this.setState({
      ttl: e.target.value,
    });
  }
  updateHost(e) {
    this.setState({
      host: e.target.value,
    });
  }
  updateParams(e) {
    this.setState({
      params: e.target.value,
    });
  }

  sendCommand() {
    const { command, host, params, ttl } = this.state;
    this.props.addCommand({
      key: -2,
      command,
      host,
      timeStart: new Date().getTime(),
      timeEnd: undefined,
      data: { params, ttl },
      value: undefined,
      status: 2
    });
    this.setState({
      alert1: <div className="alert alert-primary" role="alert">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        Command is sent!
      </div>,
    });
    axios.get(`/api/launch?command=${command}&host=${host}&data=${JSON.stringify({params,ttl})}`)
      .then(response => {
        this.props.setCommandList(response.data._data);
        this.setState({
          alert2: <div className="alert alert-primary" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            Command is executed!
          </div>,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div className="row">
        <div className="container">
          {this.state.alert1}
          {this.state.alert2}
          <select name="commandName" onChange={this.change} value={this.state.command}>
            <option value="ping">Ping</option>
            <option value="nmap">Nmap</option>
          </select><br/>
          <label htmlFor="host">Host</label>
          <input id="host" value={this.state.host} onChange={this.updateHost}/><br/>
          {
            this.state.command === 'ping'
              ? <div><label htmlFor="ttl">TTL</label><input id="ttl" value={this.state.ttl} onChange={this.updateTtl}/></div>
              : <div><label htmlFor="params">Keys</label><input id="params" value={this.state.params} onChange={this.updateParams}/></div>
          }
          <br/>
          <button className="btn btn-danger" onClick={this.sendCommand.bind(this)}>Execute command</button>
        </div>
      </div>
    );
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    setCommandList: value => dispatch(setCommandList(value)),
    addCommand: value => dispatch(addCommand(value))
  };
};

const mapStateToProps = () => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Launcher);
