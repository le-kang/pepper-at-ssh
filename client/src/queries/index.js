import gql from 'graphql-tag'

const GET_USER = gql`
  query GetUser ($id: String) {
    user(id: $id) {
      id
      email
      name
      mobile
      companyName
      loginWith
      verified
      freeCoffee
      disclaimer
    }
  }
`

export { GET_USER }