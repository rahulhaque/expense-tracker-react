import React, {Component} from 'react';
import {AppContext} from "./../../context/ContextProvider";

export class AppInlineProfile extends Component {

  static contextType = AppContext;

  constructor() {
    super();
    this.state = {
      expanded: false
    };
    this.onClick = this.onClick.bind(this);
  }

  onClick(event) {
    this.setState({expanded: !this.state.expanded});
    event.preventDefault();
  }

  render() {
    return (
      <div className="profile">
        <div>
          <img src="/assets/layout/images/logo.png" alt=""/>
        </div>
        <a className="profile-link" onClick={this.onClick}>
          <span className="username">{this.context.state.user.name}</span>
        </a>
      </div>
    );
  }
}