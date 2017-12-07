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
      service: '',
      ttl: '',
      host: '',
    };
    this.change = this.change.bind(this);
    this.updateTtl = this.updateTtl.bind(this);
    this.updateHost = this.updateHost.bind(this);
    this.updateParams = this.updateParams.bind(this);
    this.updateService = this.updateService.bind(this);
    this.createCommand = this.createCommand.bind(this);
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
  updateService(e) {
    this.setState({
      service: e.target.value,
    });
  }

  createCommand() {
    const { command, host, params, ttl, service } = this.state;
    const key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    this.setState({
      alert1: <div className="alert alert-primary" role="alert">
        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        Command is send!
      </div>,
    });
    axios.get(`/api/create?command=${command}&service=${service}&host=${host}&key=${key}&data=${JSON.stringify({params,ttl})}`)
      .then(() => {
        this.setState({
          alert2: <div className="alert alert-primary" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            Command is create!
          </div>,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  sendCommand() {
    const { command, host, params, ttl, service } = this.state;
    const key = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    this.props.addCommand({
      key,
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
    axios.get(`/api/launch?command=${command}&service=${service}&host=${host}&key=${key}&data=${JSON.stringify({params,ttl})}`)
      .then(() => {
        // this.props.setCommandList(response.data._data);
        this.setState({
          alert2: <div className="alert alert-primary" role="alert">
            <button type="button" className="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
            Command is started!
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
            <option value="openvas">Openvas</option>
            <option value="hydra">Hydra</option>
          </select><br/>
          <label htmlFor="host">Host</label>
          <input id="host" value={this.state.host} onChange={this.updateHost}/><br/>
          {
            this.state.command === 'ping'
              ? <div><label htmlFor="ttl">TTL</label><input id="ttl" value={this.state.ttl} onChange={this.updateTtl}/></div>
              : this.state.command === 'nmap'
                ? <div><label htmlFor="params">Keys</label><input id="params" value={this.state.params} onChange={this.updateParams}/></div>
                : this.state.command === 'hydra'
                ? <div><label htmlFor="service">Service</label>
                <input id="service" value={this.state.service} onChange={this.updateService} /><br/>
                <label htmlFor="params">Keys</label><input id="params" value={this.state.params} onChange={this.updateParams}/>
                </div>
                : null
          }
          <br/>
          <button className="btn btn-danger" onClick={this.sendCommand.bind(this)}>Execute command</button>
          <button className="btn btn-primary" onClick={this.createCommand}>Create command</button>
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
