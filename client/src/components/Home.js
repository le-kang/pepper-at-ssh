import React, { Component } from 'react'
import Banner from './Banner';
import { Query } from 'react-apollo'
import { Animated } from 'react-animated-css'
import VisibilitySensor from 'react-visibility-sensor'

import { GET_CURRENT_USER } from '../queries'
import styles from '../styles/Home.module.css'
import pepperRobot from '../assets/images/pepper-robot.png'
import sydneyStartupHub from '../assets/images/sydney-startup-hub.jpg'
import storyboard from '../assets/images/storyboard.png'
import magiclabLogo from '../assets/images/magiclab-blue-logo.png'

const sections = [
  {
    header: 'Who is Pepper?',
    image: pepperRobot,
    description: 'Pepper is the future of social technology. '
      + 'Made by Softbank Robotics in Japan, this adorable robot stands at 1.2 metres with its expressive humanoid figure. '
      + 'The tablet on its chest helps Pepper display information. '
      + 'The ability to navigate, see, listen and talk naturally with camera, speech and animation modules '
      + 'makes Pepper an excellent receptionist and friend.',
    layout: 'row'
  }, {
    header: 'What is Pepper Hub?',
    image: sydneyStartupHub,
    description: 'Pepper Hub is a social robotics research study aimed to answer the question: '
      + '“How might we use Social Robots to enhance the customer experience in the Sydney Startup Hub environment?”. '
      + 'To do this, our team has designed a receptionist program for Pepper '
      + 'to recognise, greet and assist startup founders in their daily endeavours.',
    layout: 'row'
  }, {
    header: 'How does Pepper Hub work?',
    image: storyboard,
    description: 'Pepper Hub brings a state-of-the-art robotic companion system to the startup workspace '
      + 'to provide a modern take on the receptionist. With face recognition software, '
      + 'Pepper will be able to recognise, greet, notify and make arrangements for founders, with minimal setup.',
    layout: 'column'
  }, {
    header: 'Who is the Magic Lab?',
    image: magiclabLogo,
    description: 'The Innovation and Enterprise Research Laboratory (a.k.a. The Magic Lab) '
      + 'at University of Technology Sydney is the Southern hemisphere’s leading Social Robotics Lab. '
      + 'Our lab includes academic researchers, PhD students and undergraduate students performing research and development '
      + 'around innovative and disruptive technology, such as Social Robotics. '
      + 'Our aim is to drive innovation for social good and work with industry to undertake research that benefits society.',
    layout: 'row'
  }
]

class Home extends Component {
  renderSesions = () => {
    return sections.reduce((acc, cur, i) => {
      acc.push(
        <VisibilitySensor key={`session-${i}`} partialVisibility offset={{ top: 200, bottom: 200 }}>
          {({ isVisible }) => (
            <div className={styles.section}>
              <div className={styles.header}>{cur.header}</div>
              <div className={styles.wrapper} style={{ flexDirection: cur.layout }}>
                <Animated animationIn="slideInLeft" className={styles.image} isVisible={isVisible}>
                  <img alt="" src={cur.image} style={{ maxHeight: cur.layout === 'row' ? 240 : 'auto' }} />
                </Animated>
                <Animated animationIn="slideInRight" className={styles.description} isVisible={isVisible}>
                  <p>{cur.description}</p>
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
          <Banner key="banner" user={data.me} loading={loading} />
        ].concat(this.renderSesions())}
      </Query>
    )
  }
}

export default Home