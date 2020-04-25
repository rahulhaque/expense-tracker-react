import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ToolsSidebar from "../common/ToolsSidebar";

export class AppTopbar extends Component {

  static defaultProps = {
    onToggleMenu: null
  };

  static propTypes = {
    onToggleMenu: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = {
      visible: false
    }
  }

  render() {
    return (
      <div>
        <ToolsSidebar visible={this.state.visible} position="right" onHide={e => this.setState({visible: false})}/>
        <div className="layout-topbar clearfix">
          <a className="layout-menu-button" onClick={this.props.onToggleMenu}>
            <span className="pi pi-bars"/>
          </a>
          <div className="layout-topbar-icons">
            {/*<span className="layout-topbar-search">*/}
            {/*<InputText type="text" placeholder="Search"/>*/}
            {/*<span className="layout-topbar-search-icon pi pi-search"/>*/}
            {/*</span>*/}
            {/*<a>*/}
            {/*<span className="layout-topbar-item-text">Events</span>*/}
            {/*<span className="layout-topbar-icon pi pi-calendar"/>*/}
            {/*<span className="layout-topbar-badge">5</span>*/}
            {/*</a>*/}
            {/*<Link to="/app/setting">*/}
            {/*<span className="layout-topbar-item-text">Settings</span>*/}
            {/*<span className="layout-topbar-icon pi pi-cog"/>*/}
            {/*</Link>*/}

            <a onClick={() => this.setState({visible: true})}>
              <span className="layout-topbar-item-text">Tools</span>
              <span className="layout-topbar-icon pi pi-briefcase"/>
            </a>
          </div>
        </div>
      </div>
    );
  }
}