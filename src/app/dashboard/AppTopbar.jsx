import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ToolsSidebar from './../common/ToolsSidebar';

const AppTopbar = (props) => {

  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <div>
      <ToolsSidebar visible={sidebarVisible} position="right" onHide={() => setSidebarVisible(false)}/>
      <div className="layout-topbar clearfix">
        <a className="layout-menu-button" onClick={props.onToggleMenu}>
          <span className="pi pi-bars" />
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

          <a onClick={() => setSidebarVisible(true)}>
            <span className="layout-topbar-item-text">Tools</span>
            <span className="layout-topbar-icon pi pi-briefcase" />
          </a>
        </div>
      </div>
    </div>
  );
}

AppTopbar.propTypes = {
  onToggleMenu: PropTypes.func.isRequired,
};

export default React.memo(AppTopbar);
