import React, { Component } from 'react'
import { Button, Icon } from 'antd'
import styles from '../styles/Home.module.css'

class Home extends Component {
  render() {
    return (
      [
        <div key="banner" className={styles.banner}>
          <div className={styles.bannerContent}>
            <h1 className={styles.bannerHeader}>Pepper Hub</h1>
            <Button className={styles.bannerButton} type="primary" ghost>SIGN IN</Button>
            <Button className={styles.bannerButton} type="primary">REGISTER</Button>
          </div>
          <div className={styles.bannerArrow}>
            <p style={{ marginBottom: 0 }}>Learn more</p>
            <Icon type="caret-down" style={{ fontSize: '2em' }} />
          </div>
        </div>
        // <section key="section-1" />,
        // <section key="section-2" />,
        // <section key="section-3" />,
        // <section key="section-4" />,
        // <footer key="footer" />
      ]
    )
  }
}

export default Home