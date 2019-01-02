import gql from 'graphql-tag'

const CURRENT_USER = gql`
  {
    me {
      id
      name
    }
  }
`

export { CURRENT_USER }