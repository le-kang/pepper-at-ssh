import React, { Component } from 'react'
import Banner from './Banner';
import { Query } from 'react-apollo'

import { GET_CURRENT_USER } from '../queries'
// import styles from '../styles/Home.module.css'

class Home extends Component {
  render() {
    return (
      <Query query={GET_CURRENT_USER} fetchPolicy="network-only">
        {({ loading, data = {} }) => {
          const user = data.me
          return ([
            <Banner key="banner" user={user} loading={loading} />
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