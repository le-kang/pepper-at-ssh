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

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($data: UpdateUserInput!) {
    updateProfile(data: $data)
  }
`

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($currentPassword: String!, $newPassword: String!) {
    changePassword(currentPassword: $currentPassword, newPassword: $newPassword)
  }
`

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`

export { LOGIN, REGISTER, UPDATE_PROFILE, CHANGE_PASSWORD, LOGOUT }