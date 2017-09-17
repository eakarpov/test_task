import React from "react";
import { connect } from "react-redux";

import Navbar from "./components/Navbar";
import Launcher from "./components/Launcher";
import CommandList from "./components/CommandList";

class App extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    const value = this.props.view ? <Launcher/> : <CommandList/>;
    return (
      <div className="wrapper">
        <Navbar
        />
        <div className="container-fluid">
          {value}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    view: state.viewChooser
  };
};

export default connect(mapStateToProps)(App);
