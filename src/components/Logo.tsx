import React from 'react';

import 'styles/Logo.css'

import logo from 'assets/logo.svg';

const Logo = () => (
  <div className="Logo">
    <div className="Logo-icon-box">
    <img src={logo} className="Logo-icon" alt="logo" />
    </div>
    <span className="Logo-title">FOVA Energy</span>
  </div>
)

export default Logo;
