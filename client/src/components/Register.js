import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { Card, Spin, Alert, Icon, Form, Input, Button, Modal } from 'antd';
import { Query, Mutation } from 'react-apollo'
import { Animated } from 'react-animated-css'

import { GET_USER } from '../queries'
import { REGISTER } from '../mutations'
import Title from './Title'

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      passwordVisiable: false,
      showConsentInfo: !this.props.match.params.userId,
      consented: !!this.props.match.params.userId
    }
  }

  togglePassword = () => {
    this.setState({ passwordVisiable: !this.state.passwordVisiable })
  }

  showNotification = (user) => {
    const { history } = this.props
    const content = user.verified ?
      "Thanks for completing your registration. "
      + "Please follow the survey links to provide your feedback from interacting with Pepper." :
      "We have sent a QR code to your email address. "
      + "To finish your registration, please show your QR code to Pepper at Sydney Startup Hub reception. "
      + "You can also find your QR code on your profile page"
    Modal.success({
      title: "You account has been created",
      content,
      onOk: () => {
        setTimeout(() => history.push('/'), 500)
      }
    })
  }

  handleRegitration = (e, register) => {
    e.preventDefault();
    const { form, match } = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        register({ variables: { data: { ...values, id: match.params.userId } } })
          .then((res) => {
            form.resetFields()
            this.showNotification(res.data.register)
          })
          .catch(() => { })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { userId } = this.props.match.params

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
      <Query query={GET_USER} variables={{ id: userId }}>
        {({ loading, data = {} }) => {
          if (loading) return <Spin size="large" style={{ margin: 'auto' }} />
          else if (data.user && !userId) return <Redirect to="/" />
          else return (
            <Animated className="container" animationIn="zoomInUp">
              <Card className="page-card" title={<Title />} hoverable>
                {this.state.showConsentInfo &&
                  <div>
                    <p>Thanks for choosing to register!</p>
                    <p>Pepper Hub has been created for a research study so before
                    we begin we need you to review our Participant Information Sheet and provide your consent to proceed.</p>
                    <p>
                      <a href="./participant-information-sydney-startup-hub.pdf" target="_blank">
                        <strong>Read our Participant Information Sheet here.</strong>
                      </a>
                    </p>
                    <p>Once you have read the information sheet please confirm your consent below.</p>
                    <div style={{ height: 200, overflowY: 'auto', border: '1px solid #e8e8e8', padding: 8, marginBottom: 16 }}>
                      <h4 style={{ fontSize: '1.2em', marginBottom: '1.2em' }}>Social Robot Research Study at Sydney Startup Hub - Informed Consent Form</h4>
                      <p><strong>I confirm that</strong> I have read the <span style={{ textDecoration: 'underline' }}>Participant Information Sheet</span> for this study.</p>
                      <p><strong>I understand that</strong> the “<strong>Social Robot Research Study at Sydney Startup Hub</strong>”
                      is a research project being conducted by the Innovation and Enterprise Research Lab Team from UTS.</p>
                      <p><strong>I understand that</strong> the purpose of this study is to understand how a social robot may improve the experience for founders
                      at Sydney Startup Hub. This information assists the creation of a framework for user experience for human robot interaction</p>
                      <p><strong>I understand that</strong> I have been invited to participate in this research study because,
                      by being part of the Startup Hub Community, I can provide information regarding my preferences
                      and priorities for a social robot application in the Startup Hub.</p>
                      <p><strong>I understand that</strong> the only likely risk towards my participation in this research is my time as a participant.
                      My participation in this research is voluntary and I will not receive compensation for the time spent. </p>
                      <p><strong>I understand that</strong> I am free to withdraw my participation from this research study at any time I wish,
                      without consequences and without giving a reason.</p>
                      <p><strong>I understand that</strong> non-identifiable audio from any interaction with the robot will be recorded,
                      the transcript of which may be used in a publication, with any identifying information removed. </p>
                      <p><strong>I understand that</strong> video will only be recorded if I sign a separate consent form giving my approval for use. </p>
                      <p><strong>I agree that</strong> the research data gathered from this study may be published in a form that does not identify me in any way.</p>
                      <p><strong>I agree that</strong> Innovation and Enterprise Research Team has answered all my questions fully and clearly.
                      I am aware that I can contact the research team if I have any further questions or concerns about the research.</p>
                      <p><strong>I confirm that</strong> I meet the exclusion/inclusion criteria for this study. I am proficient in English and am over 18 years of age.</p>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <Button
                        type="primary"
                        ghost
                        onClick={() => this.setState({ showConsentInfo: false, consented: false })}
                      >
                        No, I don’t want to take part
                      </Button>
                      <Button
                        type="primary"
                        onClick={() => this.setState({ showConsentInfo: false, consented: true })}
                      >
                        Yes, I agree to participate in this study
                      </Button>
                    </div>
                  </div>}
                {!this.state.showConsentInfo && !this.state.consented &&
                  <div>
                    <p>No problem</p>
                    <p>If you change your mind, you ‘re free to come back and participate still.
                    We are here for the week at Startup Hub.</p>
                    <Link to="/">Go back to the home page.</Link>
                  </div>}
                {this.state.consented &&
                  <Mutation
                    mutation={REGISTER}
                    update={(cache, { data }) => {
                      cache.writeQuery({
                        query: GET_USER,
                        data: { user: data.register }
                      })
                    }}
                  >
                    {(register, { loading, error }) => (
                      <Spin spinning={loading} size="large" tip="Registration in progress">
                        {!loading && error && error.graphQLErrors.map(({ message }, i) => (
                          <Alert key={i} type="error" showIcon message={message} closable />
                        ))}
                        {!loading && error && error.networkError &&
                          <Alert type="error" showIcon message="A network error has occurred, please try again later" closable />
                        }
                        {!this.state.showConsentInfo && this.state.consented && !userId &&
                          <p>Great! Thanks for choosing to participate. Now you can register with Pepper!</p>}
                        <Form onSubmit={(e) => this.handleRegitration(e, register)}>
                          <Form.Item
                            {...formItemLayout}
                            label="Email"
                          >
                            {getFieldDecorator('email', {
                              initialValue: data.user.email,
                              rules: [{
                                type: 'email', message: 'Invalid Email address!',
                              }, {
                                required: true, message: 'Please input your Email!',
                              }],
                            })(
                              <Input readOnly={!!data.user.email} />
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
                                min: 8, message: 'Minimum 8 characters'
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
                              initialValue: data.user.name,
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
                              initialValue: data.user.mobile,
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
                  </Mutation>}
              </Card>
            </Animated>
          )
        }}
      </Query>
    )
  }
}

export default Form.create()(Register)