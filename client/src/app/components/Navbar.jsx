import React from "react";
import { connect } from "react-redux";

import { showList, showLauncher } from "../actions/viewChoice";

class Navbar extends React.Component {

  constructor(props, context) {
    super(props, context);
  }

  render() {
    return (
      <nav className="navbar navbar-inverse navbar-static-top">
        <div className="container-fluid" />
        <div className="navbar-header">
          <div to="/" role="button" onClick={this.props.showList} className="navbar-brand">
            <p>Test task</p>
          </div>
        </div>
        <div className="navbar-collapse collapse" id="main-navbar">
          <ul className="nav navbar-nav">
            <li><a role="button" tabIndex="-1" onClick={this.props.showLauncher}>Add command</a></li>
          </ul>
        </div>
      </nav>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    showList: () => dispatch(showList()),
    showLauncher: () => dispatch(showLauncher())
  };
};

const mapStateToProps = () => {
 return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Navbar);