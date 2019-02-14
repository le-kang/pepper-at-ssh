import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Spin, Button, Alert, Icon, notification } from 'antd'
import { Mutation } from 'react-apollo'
import { scroller } from 'react-scroll'
import { Animated } from 'react-animated-css'

import { GET_USER } from '../queries'
import { LOGOUT } from '../mutations'
import Title from './Title'
import styles from '../styles/Banner.module.css'
import pepperLogo from '../assets/images/pepper-face.png'

class Banner extends Component {
  renderGreeting = () => {
    const { user } = this.props;
    const hour = new Date().getHours();
    const period = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
    return <p className={styles.greeting}>{`Good ${period}, ${user.name}`}</p>
  }

  render() {
    const { user, loading, history } = this.props
    return (
      <div className={styles.banner} style={{ marginBottom: user && !user.verified ? -30 : 0 }}>
        {loading && <Spin size="large" style={{ margin: 'auto' }} />}
        {!loading && !user &&
          <div className={styles.wrapper}>
            <Animated animationIn="fadeInUp" style={{ margin: 'auto' }}>
              <div className={styles.title}>
                <img alt="" src={pepperLogo} height="120" />
                <h1>Pepper Hub</h1>
              </div>
              <Button
                className={styles.button}
                type="primary"
                ghost
                onClick={() => history.push('/login')}
              >
                Login
              </Button>
              <Button
                className={styles.button}
                type="primary"
                onClick={() => history.push('/register')}
              >
                Register
              </Button>
            </Animated>
          </div>}
        {!loading && user &&
          <div className={styles.wrapper}>
            <div className={styles.header}>
              <Title noLink />
              {this.renderGreeting()}
              <Mutation
                mutation={LOGOUT}
                update={(cache, { data }) => {
                  cache.writeQuery({
                    query: GET_USER,
                    data: { user: null }
                  })
                }}
              >
                {(logout, { loading }) => (
                  <div>
                    <Button
                      type="primary"
                      icon="user"
                      ghost
                      disabled={loading}
                      onClick={() => history.push('/profile')}
                      style={{ marginRight: 8 }}
                    >
                      Profile
                    </Button>
                    <Button
                      type="primary"
                      icon="logout"
                      disabled={loading}
                      onClick={() => logout().then(() => {
                        const { history } = this.props
                        notification.success({ message: `Logout successfully. See you next time, ${user.name}` })
                        history.push('/login')
                      })}
                    >
                      Logout
                    </Button>
                  </div>
                )}
              </Mutation>
            </div>
            <div className={styles.content}>
              {!user.verified &&
                <Alert
                  message={<p style={{ fontSize: '1.5em' }}>Registration Notice</p>}
                  style={{ maxWidth: 600, maxHeight: '100%', overflowY: 'auto', margin: 'auto' }}
                  description={
                    <p style={{ marginTop: 16, fontSize: '1.2em'}}>
                      Please complete your registration by showing your QR code to Pepper at Sydney Startup Hub.
                      <br />
                      You can find your QR code from <Link to="/profile">Profile</Link>.
                    </p>
                  }
                  type="error"
                  showIcon
                  icon={<Icon type="exclamation-circle" style={{ fontSize: 32 }} />}
                />}
              {user.verified &&
                <Alert
                  message={<p style={{ fontSize: '1.5em' }}>Survey Invitation</p>}
                  style={{ maxWidth: 600, maxHeight: '100%', overflowY: 'auto', margin: 'auto' }}
                  description={
                    <p style={{ marginTop: 16, fontSize: '1.2em'}}>
                      Now that you’ve registered and interacted with Pepper we’d like to ask you some questions. 
                      <br />
                      We want to know how a social robot application could assist founders at Sydney Startup Hub. 
                      We’ve come up with two service concepts that we can build for Pepper, 
                      based on observations and interviews with people here at Startup Hub, and we want your feedback! 
                      <br />
                      Read below to find out more and vote which service would benefit you most.
                    </p>
                  }
                  type="info"
                  showIcon
                  icon={<Icon type="mail" theme="filled" style={{ fontSize: 32 }} />}
                />}
            </div>
            <div className="placeholder" />
            {!user.verified && <div className="placeholder" />}
          </div>}
        {!loading && (!user || (user && user.verified)) &&
          <div className={styles.scroller}>
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => scroller.scrollTo('main', { duration: 1000, smooth: "easeInOutQuint" })}
            >
              Learn more
            <Icon type="caret-down" style={{ fontSize: '2em', display: 'block' }} />
            </span>
          </div>}
      </div>
    )
  }
}

export default withRouter(Banner)