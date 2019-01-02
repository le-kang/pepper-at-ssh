import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Button, Icon, message } from 'antd'
import { Mutation } from 'react-apollo'

import { CURRENT_USER } from '../queries'
import { LOGOUT } from '../mutations'
import styles from '../styles/Banner.module.css'

class Banner extends Component {
  renderButtons() {
    const { user, history } = this.props
    if (!user) {
      return [
        <Button
          key="login"
          className={styles.button}
          type="primary"
          ghost
          onClick={() => history.push('/login')}
        >
          Login
        </Button>,
        <Button
          key="register"
          className={styles.button}
          type="primary"
          onClick={() => history.push('/register')}
        >
          Register
        </Button>
      ]
    } else {
      return (
        <Mutation
          mutation={LOGOUT}
          update={(cache) => {
            cache.writeQuery({
              query: CURRENT_USER,
              data: { me: null }
            })
          }}
        >
          {(logout, { loading }) => [
            <Button
              key="profile"
              className={styles.button}
              type="primary"
              ghost
              disabled={loading}
              onClick={() => history.push('/profile')}
            >
              Profile
            </Button>,
            <Button
              key="logout"
              className={styles.button}
              type="primary"
              disabled={loading}
              onClick={() => { logout().then(() => this.sayGoodbye(user.name)) }}
            >
              Logout
            </Button>
          ]}
        </Mutation>
      )
    }
  }

  sayGoodbye(name) {
    message.config({ top: 120 })
    message.success(`Logout successfully. See you next time, ${name}`)
  }

  renderGreeting() {
    const { user } = this.props;
    const hour = new Date().getHours();
    if (!user) return null;
    const period = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
    return <p className={styles.greeting}>{`Good ${period}, ${user.name}`}</p>
  }

  render() {
    return (
      <div className={styles.banner}>
        <div className={styles.wrapper}>
          <div style={{ margin: 'auto' }}>
            <h1>Pepper Hub</h1>
            {this.renderGreeting()}
            {this.renderButtons()}
          </div>
        </div>
        <div className={styles.arrow}>
          <p style={{ marginBottom: 0 }}>Learn more</p>
          <Icon type="caret-down" style={{ fontSize: '2em' }} />
        </div>
      </div>
    )
  }
}

export default withRouter(Banner)