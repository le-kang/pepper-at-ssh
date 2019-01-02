import gql from 'graphql-tag'

const LOGIN = gql`
  mutation Login($email: String!, $password: String!, $rememberMe: Boolean!) {
    login(email: $email, password: $password, rememberMe: $rememberMe)
  }
`

const REGISTER = gql`
  mutation Register($data: CreateUserInput!) {
    register(data: $data)
  }
`

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`

export { LOGIN, REGISTER, LOGOUT }