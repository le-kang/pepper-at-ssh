import gql from 'graphql-tag'

const LOGIN = gql`
  mutation Login($email: String!, $password: String!, $rememberMe: Boolean!) {
    login(email: $email, password: $password, rememberMe: $rememberMe) {
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

const REGISTER = gql`
  mutation Register($data: CreateUserInput!) {
    register(data: $data) {
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

const UPDATE_PROFILE = gql`
  mutation UpdateProfile($data: UpdateUserInput!) {
    updateProfile(data: $data) {
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

const SEND_QR_CODE = gql`
  mutation SendQRCode($to: String!) {
    sendQRCode(to: $to)
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

const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($email: String!) {
    forgotPassword(email: $email)
  }
`

const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $password: String!) {
    resetPassword(token: $token, password: $password)
  }
`

const DEACTIVATE_ACCOUNT = gql`
  mutation deactivateAccount {
    deactivateAccount
  }
`

export {
  LOGIN,
  REGISTER,
  UPDATE_PROFILE,
  SEND_QR_CODE,
  CHANGE_PASSWORD,
  LOGOUT,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  DEACTIVATE_ACCOUNT
}