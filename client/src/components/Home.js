import React, { Component } from 'react'
import { Button, Modal } from 'antd';
import { Query } from 'react-apollo'
import { Animated } from 'react-animated-css'
import { Element } from 'react-scroll'
import VisibilitySensor from 'react-visibility-sensor'

import Banner from './Banner';
import { GET_USER } from '../queries'
import styles from '../styles/Home.module.css'
import pepperRobot from '../assets/images/pepper-robot.png'
import pepperHub from '../assets/images/pepper-hub.png'
import sydneyStartupHub from '../assets/images/sydney-startup-hub.png'
import pepperAtUTS from '../assets/images/pepper-at-uts.png'
import magiclabLogo from '../assets/images/magiclab-blue-logo.png'
import pepperMagiclab from '../assets/images/pepper-magiclab.jpg'
import concept1 from '../assets/images/pepper-concept-1.png'
import storyboard1 from '../assets/images/storyboard-1.png'
import concept2 from '../assets/images/pepper-concept-2.png'
import storyboard2 from '../assets/images/storyboard-2.png'
import pepperSurvey from '../assets/images/pepper-survey.png'

class Home extends Component {
  renderSections = (loading, user) => {
    return [
      {
        show: !user,
        header: 'Who is Pepper?',
        image: pepperRobot,
        description:
          <p>
            Pepper is the future of social robot technology.
            Made by Softbank Robotics in Japan, this cute robot stands at 1.2 metres with its expressive humanoid figure.
            Pepper is safe for use with both adults and children due to it’s light weight and modest dimensions.
            The tablet on its chest helps Pepper display information.
            The ability to navigate, see, listen and talk naturally with camera, speech and animation modules makes
            Pepper an excellent collaborative or service robot for business or research.
          </p>
      },
      {
        show: !user,
        header: 'What is Pepper Hub?',
        image: pepperHub,
        description:
          <p>
            Pepper Hub is a social robotics research application incorporating robotics, mobile and web platforms, that we have built for research studies.
            The purpose of Pepper Hub is to provide services to founders at the Sydney Startup Hub.
            <br />
            You can access Pepper Hub on the web, mobile or just by talking to the social robot Pepper.
            Register with Pepper Hub to have a say in what services it provides!
          </p>
      },
      {
        show: !user,
        header: 'What is the Research Study at Startup Hub?',
        image: sydneyStartupHub,
        description:
          <p>
            Technology shapes the world we live in. Social robots have many advantages that can benefit society.
            However, understanding how people will use and feel about social robots in their day to day life is still unknown.
            While many research studies have focused on specific tasks for social robots within a lab,
            research studies outside the lab are few and difficult to perform.
            <br />
            We hope to change this by placing a social robot with a purposeful application at Sydney Startup Hub.
            Having a real life and useful application for interacting with the robot helps achieve meaningful results for research.
            The Startup Hub is a vibrant community where people are willing to engage with new technology and ideas,
            making it the perfect environment for innovative research.
          </p>
      },
      {
        show: !user,
        header: 'What\'s Involved?',
        image: pepperAtUTS,
        description:
          <p>
            We want to know how a social robot application could assist founders at Sydney Startup Hub.
            However, we aren’t building the application in isolation - we’re asking people to be involved in its design!
            <br />
            To do this we are asking people to register and interact with the robot, then select the service that they think would most benefit them.
            The initial services that are presented for the robot application are based on observations and interviews with people here at Startup Hub,
            as well as technological feasibility. Once we know which service is preferred we can then build and run further studies with that service.
            Along the way we collect survey information to understand people’s preferences and experience when interacting with robots.
            Everyone taking part has a chance to provide feedback on the potential of the technology.
          </p>
      },
      {
        show: !user,
        header: 'Who We Are',
        image: magiclabLogo,
        description:
          <p>
            The Innovation and Enterprise Research Laboratory (a.k.a. The Magic Lab) at University of Technology Sydney
            is one of the leading international social robotics lab. Our lab includes academic researchers, PhD students and undergraduate students
            performing research and development around innovative and disruptive technology, such as Social Robotics.
            Our aim is to drive innovation for social good and work with industry to undertake research that benefits society.
          </p>
      },
      {
        show: !user,
        header: 'What We Do',
        image: pepperMagiclab,
        description:
          <p>
            In order to realise the potential and future value social robots may present, we conduct studies to better understand the opportunities and challenges
            that implementing a social robot application may bring to an environment.
            <br />
            This includes exploring technical challenges, such as speech recognition, text-to-speech, computer vision and mapping,
            and societal challenges, such as user acceptance, user experience, privacy, ethics and social impact.
          </p>
      },
      {
        show: user && user.verified,
        header: 'Concept 1 - Check in with Pepper Hub',
        image: concept1,
        description:
          <div>
            <p>
              Concept 1 brings a state-of-the-art robotic companion system to the startup workspace to provide a modern take on:
            <strong>the concierge</strong>. Pepper is able to recognise, greet, notify and make arrangements for founders, with minimal setup.
            </p>
            <ol>
              <li>Pepper stands in reception desk/or lift area and greets visitors to the Startup hub.</li>
              <li>Pepper assists with questions and directs visitors to their meetings.</li>
              <li>Founders can inform Pepper if they are expecting a client.</li>
              <li>Founders can be notified by Pepper when their client arrives and choose where to have them directed to.</li>
            </ol>
            <Button
              type="primary"
              ghost
              onClick={() => Modal.info({
                width: '100%',
                title: 'Concept 1 - Storyboard',
                iconType: 'picture',
                okText: 'Close',
                content:
                  <div style={{ textAlign: 'center' }}>
                    <img alt="Concept 1 - Storyboard" src={storyboard1} style={{ width: '100%', maxWidth: '1000px', height: 'auto' }} />
                  </div>
              })}
            >
              See the storyboard
            </Button>
          </div>
      },
      {
        show: user && user.verified,
        header: 'Concept 2 - Founder Feedback with Pepper Hub',
        image: concept2,
        description:
          <div>
            <p>
              Concept 2 brings a state-of-the-art robotic companion system to the startup workspace to provide a modern take on: <strong>gaining product feedback.</strong>
              Pepper is able to recognise demographic segment requirements and (with permission) provide detailed analytics and usability feedback.
            </p>
            <ol>
              <li>Pepper works for founders by conducting surveys.</li>
              <li>Founders upload their survey questions and required demographics segment requirements to Pepper Hub’s website. </li>
              <li>Pepper surveys customers to Startup Hub, providing real time feedback to founders on their surveys. </li>
              <li>Interested customers can choose to meet with the founder to provide further feedback/ideas.</li>
            </ol>
            <Button
              type="primary"
              ghost
              onClick={() => Modal.info({
                width: '100%',
                title: 'Concept 2 - Storyboard',
                iconType: 'picture',
                okText: 'Close',
                content:
                  <div style={{ textAlign: 'center' }}>
                    <img alt="Concept 2 - Storyboard" src={storyboard2} style={{ width: '100%', maxWidth: '1000px', height: 'auto' }} />
                  </div>
              })}
            >
              See the storyboard
            </Button>
          </div>
      },
      {
        show: user && user.verified,
        header: 'Survey Link',
        image: pepperSurvey,
        description:
          <div>
            <p>
              Which service do you think would benefit you most?
              <br />
              Follow this link to our online survey and cast your vote.
              You also get a chance to leave your feedback and/or ideas for social robot applications and rate your experience registering with Pepper.
            </p>
            {user && <a
              href={`http://utsbusiness.az1.qualtrics.com/jfe/form/SV_7R6jsaoWDBvcWxL?id=${user.id}&v=${user.freeCoffee}&d=${user.disclaimer}&r=${user.loginWith}`}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Button type="primary" ghost>
                Pepper Hub Survey
              </Button>
            </a>}
            <p>After you have completed the survey please feel free to visit Pepper again!</p>
          </div>
      }
    ].reduce((acc, cur, i) => {
      if (!loading && cur.show) {
        acc.push(
          <VisibilitySensor key={`session-${i}`} partialVisibility offset={{ top: 200, bottom: 200 }}>
            {({ isVisible }) => (
              <div className={styles.section}>
                <div className={styles.header}>{cur.header}</div>
                <div className={styles.wrapper} style={{ flexDirection: cur.layout }}>
                  <Animated animationIn="slideInLeft" className={styles.image} isVisible={isVisible}>
                    <img alt="" src={cur.image} style={{ maxHeight: cur.description ? 250 : 'auto' }} />
                  </Animated>
                  {cur.description &&
                    <Animated animationIn="slideInRight" className={styles.description} isVisible={isVisible}>
                      {cur.description}
                    </Animated>}
                </div>
              </div>
            )}
          </VisibilitySensor>
        )
      }
      return acc
    }, [])
  }

  render() {
    return (
      <Query query={GET_USER} fetchPolicy="network-only">
        {({ loading, data = {} }) => {
          return [
            <Banner key="banner" user={data.user} loading={loading} />,
            <Element name="main" key="main">
              {this.renderSections(loading, data.user)}
            </Element>
          ]
        }}
      </Query>
    )
  }
}

export default Home