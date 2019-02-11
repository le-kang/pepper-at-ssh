import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Spin, Button, Icon, notification } from 'antd'
import { Mutation } from 'react-apollo'
import { scroller } from 'react-scroll'
import { Animated } from 'react-animated-css'

import { LOGOUT } from '../mutations'
import styles from '../styles/Banner.module.css'
import pepperLogo from '../assets/images/pepper-face.png'

class Banner extends Component {
  renderButtons = () => {
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
        <Mutation mutation={LOGOUT}>
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

  sayGoodbye = (name) => {
    const { history } = this.props
    notification.success({ message: `Logout successfully. See you next time, ${name}` })
    history.push('/login')
  }

  renderGreeting = () => {
    const { user } = this.props;
    const hour = new Date().getHours();
    const period = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
    return <p className={styles.greeting}>{`Good ${period}, ${user.name}`}</p>
  }

  render() {
    const { user, loading } = this.props
    return (
      <div className={styles.banner}>
        {loading && <Spin size="large" style={{ margin: 'auto' }} />}
        {!loading &&
          <div className={styles.wrapper}>
            <Animated animationIn="fadeInUp" style={{ margin: 'auto' }}>
              <div className={styles.title}>
                <img alt="" src={pepperLogo} height="120" />
                <h1>Pepper Hub</h1>
              </div>
              {user && this.renderGreeting()}
              {this.renderButtons()}
            </Animated>
          </div>}
        <div className={styles.scroller}>
          <span
            style={{ cursor: 'pointer' }}
            onClick={() => scroller.scrollTo('main', { duration: 1000, smooth: "easeInOutQuint" })}
          >
            Learn more
            <br />
            <Icon type="caret-down" style={{ fontSize: '2em' }} />
          </span>
        </div>
      </div>
    )
  }
}

export default withRouter(Banner)