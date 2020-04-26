import React from 'react';
import { useTracked } from './../../Store';

const AppInlineProfile = (props) => {

  const [state] = useTracked();

  return (
    <div className="profile">
      <div>
        <img src="/assets/layout/images/logo.png" alt="logo" />
      </div>
      <a className="profile-link">
        <span className="username">{state.user.name}</span>
      </a>
    </div>
  );
}

export default React.memo(AppInlineProfile);
