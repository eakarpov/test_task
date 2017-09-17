import React from "react";
import axios from "axios";
import { connect } from "react-redux";

import { addCommand, setCommandList } from "../actions/commandActions";

class Launcher extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      alert1: undefined,
      alert2: undefined
    };
  }

  sendCommand() {
    const text = document.getElementById("commandName").value;
    const commentary = document.getElementById("commentary").value;
    const checked = document.getElementById("timeout").checked;
    this.props.addCommand({
      key: -2,
      commentary,
      command: text,
      timeStart: new Date().getTime(),
      timeEnd: undefined,
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
    axios.get(`/api/launch?command=${text}&commentary=${commentary}&checked=${checked}`)
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
          <input id="commandName" type="text"/><label htmlFor="commandName">Enter command</label><br/>
          <textarea id="commentary"/><label htmlFor="commentary">Enter commentary</label><br/>
          <input id="timeout" type="checkbox"/><label htmlFor="timeout">Set timeout</label><br/>
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
