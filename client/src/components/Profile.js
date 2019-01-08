import React, { Component } from 'react'
import { Menu, Card, Spin, Alert, Form, Input, Button, notification } from 'antd'
import QRCode from 'qrcode.react'
import { Query, Mutation } from 'react-apollo'
import { Animated } from 'react-animated-css'

import { GET_PROFILE } from '../queries'
import { UPDATE_PROFILE, CHANGE_PASSWORD } from '../mutations'
import Title from './Title'
import styles from '../styles/Profile.module.css'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentForm: 'details'
    }
  }

  handleMenuItemClick = (e) => {
    this.setState({ currentForm: e.key })
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
              message: 'Operation failed',
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

  renderForm = (form, data, loading) => {
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
            initialValue: data.name,
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
            initialValue: data.mobile,
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
            initialValue: data.companyName,
          })(
            <Input />
          )}
        </Form.Item>,
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
        <Query query={GET_PROFILE} fetchPolicy="network-only">
          {({ loading, error, data }) => {
            if (loading) {
              return <Spin size="large" tip="Loading profile..." style={{ margin: 'auto' }} />
            }
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
                  <Menu
                    className={styles.menu}
                    onClick={this.handleMenuItemClick}
                    defaultSelectedKeys={[this.state.currentForm]}
                    mode="inline"
                  >
                    <Menu.Item key="details">Personal Details</Menu.Item>
                    <Menu.Item key="security" disabled={loading}>Change Password</Menu.Item>
                  </Menu>
                </div>
                <div className={styles.content}>
                  {!data.profile.verified &&
                    <Alert
                      className={styles.alert}
                      type="info"
                      message="You need to show the QR code to Pepper at Sydney startup hub to complete registration"
                      showIcon
                      closable
                    />}
                  <Mutation mutation={this.state.currentForm === 'details' ? UPDATE_PROFILE : CHANGE_PASSWORD}>
                    {(mutation, { loading, data: _data = data }) => (
                      <Form className={styles.form} onSubmit={(e) => this.handleSubmit(e, this.state.currentForm, mutation)}>
                        {this.renderForm(this.state.currentForm, _data.profile || _data.updateProfile, loading)}
                      </Form>
                    )}
                  </Mutation>
                  {this.state.currentForm === 'details' &&
                    <div className={styles.qrcode}>
                      <Card
                        hoverable
                        style={{ width: 200, margin: '8px auto 24px' }}
                        cover={<QRCode value={data.profile.id} size={198} />}
                      >
                        <Card.Meta title="My QR Code" description="Pepper can use this to identify you" />
                      </Card>
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

export default Form.create()(Profile)