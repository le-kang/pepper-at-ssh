import '@babel/polyfill'
import server from './express'

// const options = {
//   port: process.env.PORT || 4000,
//   endpoint: '/graphql',
//   subscriptions: '/subscriptions',
//   playground: '/playground',
//   cors: {
//     origin: true,
//     credentials: true
//   }
// }

// server.start(options, ({ port }) =>
//   console.log(`Server started, listening on port ${port} for incoming requests.`)
// )

const port = process.env.PORT || 4000

server.listen(port, () =>
  console.log(`Server started, listening on port ${port} for incoming requests.`)
)