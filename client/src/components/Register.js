import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Card, Spin, Alert, Icon, Form, Input, Button } from 'antd';
import { Mutation } from 'react-apollo'

import { CURRENT_USER } from '../queries'
import { REGISTER } from '../mutations'
import styles from '../styles/Register.module.css'

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordVisiable: false
    }
  }

  togglePassword = () => {
    this.setState({ passwordVisiable: !this.state.passwordVisiable })
  }

  handleRegitration = (e, register) => {
    e.preventDefault();
    const { form, history } = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        register({ variables: { data: { ...values, mobile: `04${values.mobile}` } } })
          .then(() => { history.push('/') })
          .catch(() => { })
      }
    });
  }

  render() {
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
    };

    return (
      <div className="container">
        <Card title={<h3>Pepper Hub</h3>} hoverable className={styles.register}>
          <Mutation
            mutation={REGISTER}
            refetchQueries={[{ query: CURRENT_USER }]}
          >
            {(register, { loading, error }) => (
              <Spin spinning={loading} size="large" tip="Registration in progress">
                {!loading && error && error.graphQLErrors.map(({ message }, i) => (
                  <Alert key={i} type="error" showIcon message={message} closable />
                ))}
                <Form onSubmit={(e) => this.handleRegitration(e, register)}>
                  <Form.Item
                    {...formItemLayout}
                    label="Email"
                  >
                    {getFieldDecorator('email', {
                      rules: [{
                        type: 'email', message: 'Invalid Email address!',
                      }, {
                        required: true, message: 'Please input your Email!',
                      }],
                    })(
                      <Input />
                    )}
                  </Form.Item>
                  <Form.Item
                    {...formItemLayout}
                    label="Password"
                  >
                    {getFieldDecorator('password', {
                      rules: [{
                        required: true, message: 'Please input your password!',
                      }, {
                        min: 8, message: 'Minium 8 characters'
                      }],
                    })(
                      <Input
                        type={this.state.passwordVisiable ? 'input' : 'password'}
                        suffix={<Icon type={this.state.passwordVisiable ? 'eye-invisible' : 'eye'} onClick={() => this.togglePassword()} />}
                      />
                    )}
                  </Form.Item>
                  <Form.Item
                    {...formItemLayout}
                    label="Name"
                    extra="This is what pepper will use to address you"
                  >
                    {getFieldDecorator('name', {
                      rules: [{ required: true, message: 'Please input your name!' }],
                    })(
                      <Input />
                    )}
                  </Form.Item>
                  <Form.Item
                    {...formItemLayout}
                    label="Mobile Number"
                    extra="This is how we will send you notifications if you use the Pepper checkin service"
                  >
                    {getFieldDecorator('mobile', {
                      rules: [{ pattern: /^[0-9]{8}$/, message: 'Invalid Australian mobile number' }]
                    })(
                      <Input addonBefore="04" maxLength={8} />
                    )}
                  </Form.Item>
                  <Form.Item
                    {...formItemLayout}
                    label="Company/Startup Name"
                  >
                    {getFieldDecorator('companyName')(
                      <Input />
                    )}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ width: '100%' }}>Register</Button>
                  </Form.Item>
                  <Form.Item>
                    Already registered? <Link to='/login'>Login here</Link>
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

export default Form.create()(Register)