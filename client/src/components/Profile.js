import React, { Component } from 'react'
import { Redirect, withRouter } from 'react-router-dom'
import { Menu, Card, Spin, Alert, Form, Input, Button, Icon, Modal, notification } from 'antd'
import QRCode from 'qrcode.react'
import { Query, Mutation } from 'react-apollo'
import { Animated } from 'react-animated-css'

import { GET_USER } from '../queries'
import { UPDATE_PROFILE, SEND_QR_CODE, CHANGE_PASSWORD, DEACTIVATE_ACCOUNT } from '../mutations'
import Title from './Title'
import styles from '../styles/Profile.module.css'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentForm: 'details'
    }
  }

  handleMenuItemClick = (key, deactivateAccount) => {
    if (key === 'deactivate') {
      const { history } = this.props
      Modal.confirm({
        title: 'Are your sure to deactivate this account?',
        content: 'You will not be able to access your account after deactivation. You will need to contact us to reactivate your account.',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk() {
          deactivateAccount().then(() => {
            notification.success({ message: 'Your account has been deactivated successfully.' })
            history.push('/')
          })
        }
      })
      return
    }
    this.setState({ currentForm: key })
  }

  sendQRCode = (to, remoteCall) => {
    remoteCall({ variables: { to } })
      .then(() => {
        notification.success({ message: 'Your QR code has been sent to your ' + to })
      })
      .catch((error) => {
        notification.error({
          message: 'Request failed',
          description: error.graphQLErrors.length ? error.graphQLErrors[0].message : 'A network error has occurred, please try again later',
          duration: 0
        })
      })
  }

  handleSubmit = (e, currentForm, mutation) => {
    e.preventDefault();
    const { form } = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const variables = currentForm === 'details' ? { data: values } : values
        mutation({ variables })
          .then(() => {
            notification.success({ message: 'Operation succeeded' })
            currentForm === 'security' && form.resetFields()
          })
          .catch((error) => {
            notification.error({
              message: 'Update request failed',
              description: error.graphQLErrors.length ? error.graphQLErrors[0].message : 'A network error has occurred, please try again later',
              duration: 0
            })
            currentForm === 'details' && form.resetFields()
          })
      }
    });
  }

  confirmPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('Passwords do not match!')
    } else {
      callback()
    }
  }

  checkPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && form.getFieldValue('confirmPassword')) {
      form.validateFields(['confirmPassword'], { force: true })
    }
    callback();
  }

  renderForm = (form, user, loading) => {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 }
    }

    if (form === 'details') {
      return [
        <Form.Item
          key="name"
          {...formItemLayout}
          label="Name"
        >
          {getFieldDecorator('name', {
            initialValue: user.name,
            rules: [{ required: true, message: 'Please input your name!' }],
          })(
            <Input />
          )}
        </Form.Item>,
        <Form.Item
          key="mobile"
          {...formItemLayout}
          label="Mobile Number"
        >
          {getFieldDecorator('mobile', {
            initialValue: user.mobile,
            rules: [{ pattern: /^[0-9]{8}$/, message: 'Invalid Australian mobile number' }]
          })(
            <Input addonBefore="04" />
          )}
        </Form.Item>,
        <Form.Item
          key="companyName"
          {...formItemLayout}
          label="Company/Startup Name"
        >
          {getFieldDecorator('companyName', {
            initialValue: user.companyName,
          })(
            <Input />
          )}
        </Form.Item>,
        user.loginWith ?
          <Form.Item
            key="loginWith"
            {...formItemLayout}
            label="How Pepper Will Recognise you"
          >
            <span style={{ textTransform: 'uppercase', padding: 8, border: '1px solid #e8e8e8' }}>
              {user.loginWith}
            </span>
          </Form.Item> : '',
        <Form.Item key="button">
          <Button type="primary" htmlType="submit" loading={loading}>
            {loading ? 'Updating Information' : 'Update Information'}
          </Button>
        </Form.Item>
      ]
    } else if (form === 'security') {
      return [
        <Form.Item
          key="currentPassword"
          {...formItemLayout}
          label="Current Password"
        >
          {getFieldDecorator('currentPassword', {
            rules: [{
              required: true, message: 'Please input your current password!',
            }],
          })(
            <Input type="password" />
          )}
        </Form.Item>,
        <Form.Item
          key="newPassword"
          {...formItemLayout}
          label="New Password"
        >
          {getFieldDecorator('newPassword', {
            rules: [{
              required: true, message: 'Please input a new password!',
            }, {
              min: 8, message: 'Minimum 8 characters'
            }, {
              validator: this.checkPassword
            }],
          })(
            <Input type="password" />
          )}
        </Form.Item>,
        <Form.Item
          key="confirmPassword"
          {...formItemLayout}
          label="Password"
        >
          {getFieldDecorator('confirmPassword', {
            rules: [{
              required: true, message: 'Please confirm the new password!',
            }, {
              validator: this.confirmPassword
            }],
          })(
            <Input type="password" />
          )}
        </Form.Item>,
        <Form.Item key="button">
          <Button type="primary" htmlType="submit" loading={loading}>
            {loading ? 'Changing Password' : 'Change Password'}
          </Button>
        </Form.Item>
      ]
    }
  }

  render() {
    const { history } = this.props;
    return (
      <Animated className="container" animationIn="zoomInUp">
        <Query query={GET_USER} fetchPolicy="network-only">
          {({ loading, error, data }) => {
            if (loading) return <Spin size="large" tip="Loading profile..." style={{ margin: 'auto' }} />
            if (!data.user) return <Redirect to="/" />
            if (error) {
              return (
                <Alert
                  className={styles.alert}
                  type="error"
                  message={error.graphQLErrors.length ? error.graphQLErrors[0].message : 'A network error has occurred, please try again later'}
                  showIcon
                  closeText="Go home"
                  onClose={() => history.push('/')}
                />
              )
            }
            return (
              <div className={styles.profile}>
                <div className={styles.nav}>
                  <Title className={styles.title} />
                  <Mutation
                    mutation={DEACTIVATE_ACCOUNT}
                    update={(cache) => {
                      cache.writeQuery({
                        query: GET_USER,
                        data: { user: null }
                      })
                    }}
                  >
                    {(deactivateAccount, { loading }) => (
                      <Menu
                        className={styles.menu}
                        onClick={({ key }) => this.handleMenuItemClick(key, deactivateAccount)}
                        selectedKeys={[this.state.currentForm]}
                        mode="inline"
                      >
                        <Menu.Item key="details">Personal Details</Menu.Item>
                        <Menu.Item key="security" disabled={loading}>Change Password</Menu.Item>
                        <Menu.Item key="deactivate" disabled={loading}>Deactivate my account</Menu.Item>
                      </Menu>
                    )}
                  </Mutation>
                </div>
                <div className={styles.content}>
                  {!data.user.verified &&
                    <Alert
                      className={styles.alert}
                      type="error"
                      message="You need to show the QR code to Pepper at Sydney Startup Hub to complete registration"
                      showIcon
                      icon={<Icon type="exclamation-circle" />}
                      closable
                    />}
                  <Mutation
                    mutation={this.state.currentForm === 'details' ? UPDATE_PROFILE : CHANGE_PASSWORD}
                    update={(cache, { data }) => {
                      data.updateProfile && cache.writeQuery({
                        query: GET_USER,
                        data: { user: data.updateProfile }
                      })
                    }}
                  >
                    {(mutation, { loading }) => (
                      <Form className={styles.form} onSubmit={(e) => this.handleSubmit(e, this.state.currentForm, mutation)}>
                        {this.renderForm(this.state.currentForm, data.user, loading)}
                      </Form>
                    )}
                  </Mutation>
                  {this.state.currentForm === 'details' &&
                    <div className={styles.qrcode}>
                      <Mutation mutation={SEND_QR_CODE}>
                        {(sendQRCode) => (
                          <Card
                            style={{ width: 200, margin: '0 auto 24px' }}
                            bodyStyle={{ padding: 16 }}
                            cover={<QRCode value={data.user.id} size={198} />}
                            actions={[
                              <span
                                onClick={() => this.sendQRCode('mobile', sendQRCode)}
                                style={{ display: 'inline-block', lineHeight: '22px' }}
                              >
                                <Icon type="mobile" /> Mobile
                              </span>,
                              <span
                                onClick={() => this.sendQRCode('email', sendQRCode)}
                                style={{ display: 'inline-block', lineHeight: '22px' }}
                              >
                                <Icon type="mail" /> Email
                              </span>
                            ]}
                          >
                            <Card.Meta
                              title="My QR code"
                              description="Send this QR code to:"
                            />
                          </Card>
                        )}
                      </Mutation>
                    </div>
                  }
                </div>
              </div>
            )
          }}
        </Query>
      </Animated>
    )
  }
}

export default Form.create()(withRouter(Profile))