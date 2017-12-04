import React from "react";
import { connect } from "react-redux";
import axios from "axios";

import CommandListItem from "./CommandListItem";
import { setCommandList } from "../actions/commandActions";

class CommandList extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      elements: []
    };
  }

  componentWillMount() {
    const result = [];
    for (const elem of this.props.commands) {
      result.push(<CommandListItem
        key={`${elem.timeStart}-${elem.command}`}
        host={elem.host}
        command={elem.command}
        timeStart={elem.timeStart}
        timeEnd={elem.timeEnd}
        value={elem.value}
        status={elem.status} />);
    }
    this.setState({
      elements: result
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.commands !== this.props.commands) {
      const result = [];
      for (const elem of nextProps.commands) {
        result.push(<CommandListItem
          key={`${elem.timeStart}-${elem.command}`}
          host={elem.host}
          command={elem.command}
          timeStart={elem.timeStart}
          timeEnd={elem.timeEnd}
          value={elem.value}
          status={elem.status}
          task={elem.task}
          tasks={elem.tasks}
          percent={elem.percent}/>);
      }
      this.setState({
        elements: result
      });
    }
  }

  updateList() {
    axios.get("/api/list")
      .then(response => {
        this.props.setCommandList(response.data._data);
        const result = [];
        let i = 0;
        for (const elem of this.props.commands) {
          result.push(<CommandListItem key={i}
                                       host={elem.host}
                                       command={elem.command}
                                       timeStart={elem.timeStart}
                                       timeEnd={elem.timeEnd}
                                       value={elem.value}
                                       status={elem.status} />);
          i++;
        }
        this.setState({
          elements: result
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    return (
      <div>
        <h1>Command list</h1>
        <div role="button" onClick={this.updateList.bind(this)}><b>Update list</b></div>
        <div className="row">
          <CommandListItem
              key={-1}
              host="Host"
              command="Command"
              timeStart="Time Start"
              timeEnd="Time end"
              value="Result"
              status="Status"
            />
          {this.state.elements}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    commands: state.commands
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCommandList: value => dispatch(setCommandList(value))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommandList);
