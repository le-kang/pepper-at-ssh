import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import * as serviceWorker from './serviceWorker'

import App from './components/App'
import 'animate.css/animate.min.css'
import './index.css'

const httpLink = createHttpLink({
  uri: process.env.NODE_ENV === 'production' ? '/graphql' : `http://${window.location.hostname}:4000/graphql`,
  credentials: process.env.NODE_ENV === 'production' ? 'same-origin' : 'include'
})

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
})

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
