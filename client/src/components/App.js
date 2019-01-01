import React, { Component } from 'react'
import { Route, Switch, Link, withRouter } from 'react-router-dom'
import { Icon, Breadcrumb } from 'antd';

import Home from './Home'
import Login from './Login'
import Register from './Register'
import Profile from './Profile'
import styles from '../styles/App.module.css'

const routerMap = {
  '/login': 'Login',
  '/register': 'Register',
  '/profile': 'My Profile'
}

class App extends Component {
  render() {
    return (
      [
        <header key="header" className={styles.header} />,
        <main key="main" className={styles.main}>
          {this.props.location.pathname !== '/' &&
            <div className={styles.breadcrumb}>
              <Breadcrumb separator=">" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Breadcrumb.Item>
                  <Link to="/">Home</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {routerMap[this.props.location.pathname]}
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          }
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/profile" component={Profile} />
          </Switch>
        </main>,
        <footer key="footer" className={styles.footer}>
          <Icon type="copyright" /> 2019 The Magic Lab
        </footer>
      ]
    );
  }
}

export default withRouter(App)
