import React from 'react'
import { Link } from 'react-router-dom'

import pepperLogo from '../assets/images/pepper-face.png'

export default (props) => (
  <Link to="/">
    <h3 {...props}>
      <img className='logo' alt="" src={pepperLogo} height="48" />
      Pepper Hub
    </h3>
  </Link>
)