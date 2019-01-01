import React, { Component } from 'react'
import { Menu, Card, Form, Input, Button } from 'antd'
import QRCode from 'qrcode.react'

import styles from '../styles/Profile.module.css'

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentForm: 'details'
    }
  }

  handleClick = (e) => {
    this.setState({ currentForm: e.key })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
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

  renderForm(form) {
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: { span: 24 },
      wrapperCol: { span: 24 }
    };

    if (form === 'details') {
      return [
        <Form.Item
          key="name"
          {...formItemLayout}
          label="Name"
        >
          {getFieldDecorator('name', {
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
          {getFieldDecorator('companyName')(
            <Input />
          )}
        </Form.Item>,
        <Form.Item key="button">
          <Button type="primary" htmlType="submit">Update Information</Button>
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
              min: 8, message: 'Minium 8 characters'
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
          <Button type="primary" htmlType="submit">Change Password</Button>
        </Form.Item>
      ]
    }
  }

  render() {
    return (
      <div className="container">
        <div className={styles.profile}>
          <Menu
            className={styles.menu}
            onClick={this.handleClick}
            defaultSelectedKeys={[this.state.currentForm]}
            mode="inline"
          >
            <Menu.Item key="details">Personal Details</Menu.Item>
            <Menu.Item key="security">Change Password</Menu.Item>
          </Menu>
          <div className={styles.content}>
            <Form className={styles.form} onSubmit={this.handleSubmit}>
              {this.renderForm(this.state.currentForm)}
            </Form>
            {this.state.currentForm === 'details' &&
              <div className={styles.qrcode}>
                <Card
                  hoverable
                  style={{ width: 200, margin: '8px auto' }}
                  cover={<QRCode value="test" size={198} style={{ margin: '0 auto' }} />}
                >
                  <Card.Meta title="My QR Code" description="Pepper can use this to identify you" />
                </Card>
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Form.create()(Profile)