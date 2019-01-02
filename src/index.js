import server from './server'

const options = {
  port: process.env.PORT || 4000,
  endpoint: '/graphql',
  subscriptions: '/subscriptions',
  playground: '/playground'
}

if (process.env.NODE_ENV !== 'production') {
  options.cors = {
    origin: true,
    credentials: true
  }
}

server.start(options, ({ port }) =>
  console.log(`Server started, listening on port ${port} for incoming requests.`)
)