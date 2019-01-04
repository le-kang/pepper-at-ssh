import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Card, Spin, Alert, Icon, Form, Input, Button, Modal } from 'antd';
import { Query, Mutation } from 'react-apollo'

import { GET_CURRENT_USER } from '../queries'
import { REGISTER } from '../mutations'
import Title from './Title'

class Register extends Component {
  state = { passwordVisiable: false }

  togglePassword = () => {
    this.setState({ passwordVisiable: !this.state.passwordVisiable })
  }

  showNotification = () => {
    const { history } = this.props
    Modal.success({
      title: "You account has been created",
      content: "However, to complete your registration, "
        + "please show your QR code to Pepper at Sydney Startup Hub. "
        + "You can find your QR code in profile page.",
      onOk: () => {
        setTimeout(() => history.push('/'), 500)
      }
    })
  }

  handleRegitration = (e, register) => {
    e.preventDefault();
    const { form } = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        register({ variables: { data: values } })
          .then(() => {
            form.resetFields()
            this.showNotification()
          })
          .catch(() => { })
      }
    })
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
    }

    return (
      <Query query={GET_CURRENT_USER} fetchPolicy="network-only">
        {({ loading, data = {} }) => {
          if (loading) return <Spin size="large" style={{ margin: 'auto' }} />
          else if (data.me) return <Redirect to="/" />
          else return (
            <div className="container">
              <Card className="page-card" title={<Title />} hoverable>
                <Mutation mutation={REGISTER}>
                  {(register, { loading, error }) => (
                    <Spin spinning={loading} size="large" tip="Registration in progress">
                      {!loading && error && error.graphQLErrors.map(({ message }, i) => (
                        <Alert key={i} type="error" showIcon message={message} closable />
                      ))}
                      {!loading && error && error.networkError &&
                        <Alert type="error" showIcon message="A network error has occurred, please try again later" closable />
                      }
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
                              suffix={
                                <Icon
                                  type={this.state.passwordVisiable ? 'eye-invisible' : 'eye'}
                                  onClick={() => this.togglePassword()}
                                />
                              }
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
        }}
      </Query>
    )
  }
}

export default Form.create()(Register)