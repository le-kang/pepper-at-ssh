import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
import styles from '../styles/App.module.css'

class App extends Component {
  render() {
    return (
      [
        <header key="header" className={styles.header} />,
        <main key="main" className={styles.main}>
          <Switch>
            <Route exact path="/" component={Home} />
          </Switch>
        </main>
      ]
    );
  }
}

export default App
