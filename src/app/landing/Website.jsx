import React from 'react'
import LandingLayout from "./../layouts/LandingLayout";
import { Link } from "react-router-dom";

class Website extends React.Component {
  render() {
    return (
      <LandingLayout>
        <div className="p-grid p-nogutter p-align-center p-justify-center" style={{ height: '95vh' }}>
          <img src="/assets/layout/images/dollar.png" alt="" style={{ height: '20vh' }} />
          <div>
            <h1 className="color-title">Expense</h1>
            <h1 className="color-title">Manager</h1>
            <p>
              <Link to="/login">Login</Link><span className="color-title"> | </span><Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </LandingLayout>
    )
  }
}

export default Website;
