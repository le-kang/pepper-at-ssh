import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Button, Icon } from 'antd'

import styles from '../styles/Banner.module.css'

class Banner extends Component {
  render() {
    return (
      <div className={styles.banner}>
        <div className={styles.wrapper}>
          <div style={{ margin: 'auto' }}>
            <h1>Pepper Hub</h1>
            <Button
              className={styles.button}
              type="primary"
              ghost
              onClick={() => this.props.history.push('/login')}
            >
              SIGN IN
            </Button>
            <Button
              className={styles.button}
              type="primary"
              onClick={() => this.props.history.push('/register')}
            >
              REGISTER
            </Button>
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