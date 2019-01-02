import React, { Component } from 'react'
import Banner from './Banner';
import { Query } from 'react-apollo'

import { CURRENT_USER } from '../queries'
// import styles from '../styles/Home.module.css'


class Home extends Component {
  render() {
    return (
      <Query query={CURRENT_USER}>
        {({ loading, data }) => {
          if (loading) return null
          const user = data.me
          return ([
            <Banner key="banner" user={user} />
            // <section key="section-1" />,
            // <section key="section-2" />,
            // <section key="section-3" />,
            // <section key="section-4" />,
          ])
        }}
      </Query>
    )
  }
}

export default Home