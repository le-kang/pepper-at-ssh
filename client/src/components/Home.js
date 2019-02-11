import React, { Component } from 'react'
import Banner from './Banner';
import { Query } from 'react-apollo'
import { Animated } from 'react-animated-css'
import { Element } from 'react-scroll'
import VisibilitySensor from 'react-visibility-sensor'

import { GET_CURRENT_USER } from '../queries'
import styles from '../styles/Home.module.css'
import pepperRobot from '../assets/images/pepper-robot.png'
import pepperHub from '../assets/images/pepper-hub.png'
import sydneyStartupHub from '../assets/images/sydney-startup-hub.png'
import pepperAtUTS from '../assets/images/pepper-at-uts.png'
// import storyboard from '../assets/images/storyboard.png'
import magiclabLogo from '../assets/images/magiclab-blue-logo.png'

const sections = [
  {
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
    header: 'Who We Are',
    image: magiclabLogo,
    description:
      <p>
        The Innovation and Enterprise Research Laboratory (a.k.a. The Magic Lab) at University of Technology Sydney
        is the Southern hemisphere’s leading Social Robotics Lab. Our lab includes academic researchers, PhD students and undergraduate students
        performing research and development around innovative and disruptive technology, such as Social Robotics.
        Our aim is to drive innovation for social good and work with industry to undertake research that benefits society.
      </p>
  },
  {
    header: 'What We Do',
    image: magiclabLogo,
    description:
      <p>
        In order to realise the potential and future value social robots may present, we conduct studies to better understand the opportunities and challenges
        that implementing a social robot application may bring to an environment.
        <br />
        This includes exploring technical challenges, such as speech recognition, text-to-speech, computer vision and mapping,
        and societal challenges, such as user acceptance, user experience, privacy, ethics and social impact.
      </p>
  }
]

class Home extends Component {
  renderSections = () => {
    return sections.reduce((acc, cur, i) => {
      acc.push(
        <VisibilitySensor key={`session-${i}`} partialVisibility offset={{ top: 200, bottom: 200 }}>
          {({ isVisible }) => (
            <div className={styles.section}>
              <div className={styles.header}>{cur.header}</div>
              <div className={styles.wrapper} style={{ flexDirection: cur.layout }}>
                <Animated animationIn="slideInLeft" className={styles.image} isVisible={isVisible}>
                  <img alt="" src={cur.image} style={{ maxHeight: cur.description ? 250 : 'auto' }} />
                </Animated>
                <Animated animationIn="slideInRight" className={styles.description} isVisible={isVisible}>
                  {cur.description}
                </Animated>
              </div>
            </div>
          )}
        </VisibilitySensor>
      )
      return acc
    }, [])
  }

  render() {
    return (
      <Query query={GET_CURRENT_USER} fetchPolicy="network-only">
        {({ loading, data = {} }) => [
          <Banner key="banner" user={data.me} loading={loading} />,
          <Element name="main">
            {this.renderSections()}
          </Element>
        ]}
      </Query>
    )
  }
}

export default Home