import React from 'react'
import NavLink from './NavLink'
import './Nav.css'

export default ({ handlePopupOpen }) => (
  <nav className="Nav">
    <div className="Nav--Container container">
      <NavLink to="/" exact>
        Home
      </NavLink>
    </div>
  </nav>
)
