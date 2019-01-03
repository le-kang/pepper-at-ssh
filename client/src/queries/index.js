import gql from 'graphql-tag'

const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    me {
      id
      name
    }
  }
`

const GET_PROFILE = gql`
  query GetProfile {
    profile {
      id
      name
      mobile
      companyName
      verified
    }
  }
`

export { GET_CURRENT_USER, GET_PROFILE }