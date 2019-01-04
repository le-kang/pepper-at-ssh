import React, { Component } from 'react'
import { Route, Switch, Link, Redirect, withRouter } from 'react-router-dom'
import { Icon, Breadcrumb, Divider } from 'antd';

import Home from './Home'
import Login from './Login'
import Register from './Register'
import Profile from './Profile'
import ForgotPassword from './ForgotPassword'
import ResetPassword from './ResetPassword'
import styles from '../styles/App.module.css'
import magiclabLogo from '../assets/images/magiclab-white-logo.png'
import sydneyStartupHubLogo from '../assets/images/sydney-startup-hub-logo.png'

const navigations = {
  '/login': { prev: '/', name: 'Login' },
  '/register': { prev: '/', name: 'Register' },
  '/profile': { prev: '/', name: 'My Profile' },
  '/forgot-password': { prev: '/login', name: 'Forgot Password' }
}

class App extends Component {
  renderBreadcrumb = () => {
    const { location: { pathname } } = this.props
    if (!navigations[pathname]) return null // No need for breadcrumb on home page
    const items = [
      <Breadcrumb.Item key="/">
        <Link to="/">Home</Link>
      </Breadcrumb.Item>
    ]
    let prev = navigations[pathname].prev
    while (prev !== '/') {
      items.push(
        <Breadcrumb.Item key={prev}>
          <Link to={prev}>{navigations[prev].name}</Link>
        </Breadcrumb.Item>
      )
      prev = navigations[prev].prev
    }
    items.push(<Breadcrumb.Item key={pathname}>{navigations[pathname].name}</Breadcrumb.Item>)
    return (
      <div className={styles.breadcrumb}>
        <Breadcrumb separator=">" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {items}
        </Breadcrumb>
      </div>
    )
  }

  render() {
    return (
      [
        <header key="header" className={styles.header}>
          <img alt="magiclab" src={magiclabLogo} height="120" />
          <Divider className={styles.divider} type="vertical" />
          <img alt="sydney startup hub" src={sydneyStartupHubLogo} height="120" />
        </header>,
        <main key="main" className={styles.main}>
          {this.renderBreadcrumb()}
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/profile" component={Profile} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password/:token" component={ResetPassword} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </main>,
        <footer key="footer" className={styles.footer}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Icon type="copyright" /> 2019 The Magic Lab
          </div>
        </footer>
      ]
    );
  }
}

export default withRouter(App)
