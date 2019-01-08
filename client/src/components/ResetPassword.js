import React, { Component } from 'react'
import { Card, Spin, Alert, Form, Input, Button, notification } from 'antd';
import { Mutation } from 'react-apollo'
import { Animated } from 'react-animated-css'

import { RESET_PASSWORD } from '../mutations'
import Title from './Title'

class ResetPassword extends Component {
  handleResetPassword(e, resetPassword) {
    e.preventDefault();
    const { form, history, match } = this.props;
    const { token } = match.params;
    form.validateFields((err, values) => {
      if (!err) {
        const { password } = values
        resetPassword({ variables: { token, password } })
          .then(() => {
            notification.success({
              message: 'Password reset succeeded',
              description: 'Please login with your new password'
            })
            history.push('/login')
          })
          .catch(() => { })
      }
    })
  }

  confirmPassword = (rule, value, callback) => {
    const { form } = this.props
    if (value && value !== form.getFieldValue('password')) {
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
    callback()
  }

  render() {
    const { history } = this.props
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    }

    return (
      <Animated className="container" animationIn="zoomInUp">
        <Card className="page-card" title={<Title />} hoverable>
          <Mutation mutation={RESET_PASSWORD}>
            {(resetPassword, { loading, error }) => (
              <Spin spinning={loading} size="large" tip="Password resetting in progress">
                <Form onSubmit={(e) => this.handleResetPassword(e, resetPassword)}>
                  {!loading && error &&
                    <Alert
                      type="error"
                      message="Password reset failed"
                      description={error.graphQLErrors.length ? error.graphQLErrors[0].message : 'A network error has occurred, please try again later'}
                      showIcon
                      closeText="Go home"
                      onClose={() => history.push('/')}
                    />}
                  <Form.Item
                    key="password"
                    {...formItemLayout}
                    label="New Password"
                  >
                    {getFieldDecorator('password', {
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
                  </Form.Item>
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
                  </Form.Item>
                  <Form.Item key="button" style={{ textAlign: 'right' }}>
                    <Button type="primary" htmlType="submit" disabled={loading}>
                      Reset Password
                  </Button>
                  </Form.Item>
                </Form>
              </Spin>
            )}
          </Mutation>
        </Card>
      </Animated>
    )
  }
}

export default Form.create()(ResetPassword)