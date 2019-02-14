import gql from 'graphql-tag'

const GET_USER = gql`
  query GetUser {
    user {
      id
      email
      name
      mobile
      companyName
      loginWith
      verified
    }
  }
`

export { GET_USER }