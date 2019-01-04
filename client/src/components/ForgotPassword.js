import React, { Component } from 'react'
import { Spin, Alert, Card, Form, Icon, Input, Button, notification } from 'antd';
import { Mutation } from 'react-apollo'

import { FORGOT_PASSWORD } from '../mutations'
import Title from './Title'

class ForgotPassword extends Component {
  handleForgotPassword = (e, forgotPassword) => {
    e.preventDefault();
    const { form, history } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        forgotPassword({ variables: values })
          .then(() => {
            notification.success({
              message: 'Thanks! ',
              description: 'If there\'s an account associated with this email, we\'ll send the password reset instructions immediately.'
            })
            history.push('/login')
          })
          .catch(() => { })
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="container">
        <Card className="page-card" title={<Title />} hoverable style={{ maxWidth: 400 }}>
          <Mutation mutation={FORGOT_PASSWORD}>
            {(forgotPassword, { loading, error }) => (
              <Spin spinning={loading} size="large">
                {!loading && error && error.graphQLErrors.map(({ message }, i) => (
                  <Alert key={i} type="error" showIcon message={message} closable />
                ))}
                {!loading && error && error.networkError &&
                  <Alert type="error" showIcon message="A network error has occurred, please try again later" closable />
                }
                <Form onSubmit={(e) => this.handleForgotPassword(e, forgotPassword)}>
                  <p>A reset password link will be sent to the following email address</p>
                  <Form.Item>
                    {getFieldDecorator('email', {
                      rules: [{ required: true, message: 'Please input your email!' }]
                    })(
                      <Input
                        prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Email"
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} disabled={loading}>
                      Send Me Email
                    </Button>
                  </Form.Item>
                </Form>
              </Spin>
            )}
          </Mutation>
        </Card>
      </div>
    )
  }
}

export default Form.create()(ForgotPassword)