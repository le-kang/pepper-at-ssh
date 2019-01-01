import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, Form, Icon, Input, Button, Checkbox } from 'antd';

import styles from '../styles/Login.module.css'

class Login extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="container">
        <Card title={<h3>Pepper Hub</h3>} hoverable className={styles.login}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item>
              {getFieldDecorator('email', {
                rules: [{ required: true, message: 'Please input your email!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Email" />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: false,
              })(
                <Checkbox>Remember me</Checkbox>
              )}
              {/* <Link to='/forgot-password'>Forgot password</Link> */}
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Log in
              </Button>
              Or <Link to='/register'>register now!</Link>
            </Form.Item>
          </Form>
        </Card>
      </div>
    )
  }
}

export default Form.create()(Login)