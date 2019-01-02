import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Spin, Alert, Card, Form, Icon, Input, Button, Checkbox } from 'antd';
import { Mutation } from 'react-apollo'

import { CURRENT_USER } from '../queries'
import { LOGIN } from '../mutations'
import styles from '../styles/Login.module.css'

class Login extends Component {
  handleLogin = (e, login) => {
    e.preventDefault();
    const { form, history } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        login({ variables: values })
          .then(() => { history.push('/') })
          .catch(() => { })
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="container">
        <Card title={<h3>Pepper Hub</h3>} hoverable className={styles.login}>
          <Mutation
            mutation={LOGIN}
            refetchQueries={[{ query: CURRENT_USER }]}
          >
            {(login, { loading, error }) => (
              <Spin spinning={loading} size="large" tip="Authentication in progress">
                {!loading && error && error.graphQLErrors.map(({ message }, i) => (
                  <Alert key={i} type="error" showIcon message={message} closable />
                ))}
                <Form onSubmit={e => this.handleLogin(e, login)}>
                  <Form.Item>
                    {getFieldDecorator('email', {
                      rules: [{ required: true, message: 'Please input your email!' }],
                    })(
                      <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Email"
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('password', {
                      rules: [{ required: true, message: 'Please input your password!' }],
                    })(
                      <Input
                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        type="password"
                        placeholder="Password"
                      />
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('rememberMe', {
                      valuePropName: 'checked',
                      initialValue: false,
                    })(
                      <Checkbox>Remember me</Checkbox>
                    )}
                    {/* <Link to='/forgot-password'>Forgot password</Link> */}
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }} disabled={loading}>
                      Log in
                    </Button>
                    Or <Link to='/register' disabled={loading}>register now!</Link>
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

export default Form.create()(Login)