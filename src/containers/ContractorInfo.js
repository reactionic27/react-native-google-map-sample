import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  AppState,
  ScrollView,
  Image
} from 'react-native'
import { connect } from 'react-redux'
import { NAVIGATOR_HEIGHT, STATUS_BAR_HEIGHT, STATUS_BAR_COLOR, VIEWPORT } from '../constants'
import { dynamicSize, getFontSize } from '../utils/DynamicSize'

const ProfileIcon = require('../assets/images/DefaultUser.png')

class ContractorInfo extends Component {

  constructor (props) {
    super(props)
    this.state = {

    }

  }

  componentDidMount () {
    this.props.navigator.toggleTabs({
      to: 'hidden',
      animated: false
    })
  }

  componentWillReceiveProps (nextProps) {

  }

  componentWillUnmount () {
    this.props.navigator.toggleTabs({
      to: 'shown',
      animated: false
    })
  }

  render () {
    return (
      <View style={styles.flexible}>
        <ScrollView contentContainerStyle={styles.entireView}>
          <View style={styles.profileView}>
            <View style={styles.photoView}>
              <Image source={ProfileIcon} style={styles.userphoto}/>
            </View>
            <View style={styles.infoView}>
              <Text style={styles.company}>
                MAHER DEVELOPMENT INC
              </Text>
              <Text style={styles.location}>
                Los Angeles, CA
              </Text>
            </View>
            <View style={styles.skillSeparator}>
              <Text style={styles.skillText}>
                Skills
              </Text>
            </View>
            <View>
              <ScrollView contentContainerStyle={styles.skillsetView} horizontal={true} showsHorizontalScrollIndicator={false}>
                <View style={styles.skillView}>
                  <Text style={styles.skillText}>
                    B General Building Contractor
                  </Text>
                </View>
                <View style={styles.skillView}>
                  <Text style={styles.skillText}>
                    B General Building Contractor
                  </Text>
                </View>
                <View style={styles.skillView}>
                  <Text style={styles.skillText}>
                    B General Building Contractor
                  </Text>
                </View>
                <View style={styles.skillView}>
                  <Text style={styles.skillText}>
                    B General Building Contractor
                  </Text>
                </View>
                <View style={styles.skillView}>
                  <Text style={styles.skillText}>
                    B General Building Contractor
                  </Text>
                </View>
              </ScrollView>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  flexible: {
    flexGrow: 1
  },
  entireView: {
    width: VIEWPORT.width,
    backgroundColor: 'transparent'
  },
  profileView: {
    width: VIEWPORT.width,
    height: dynamicSize(250),
    backgroundColor: 'white',
  },
  photoView: {
    width: VIEWPORT.width,
    height: dynamicSize(150),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  userphoto: {
    width: dynamicSize(100),
    height: dynamicSize(100),
    resizeMode: 'contain',
    borderRadius: dynamicSize(50)
  },
  infoView: {
    width: VIEWPORT.width,
    height: dynamicSize(100),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  company: {
    fontSize: getFontSize(16),
    color: '#588BE7'
  },
  location: {
    fontSize: getFontSize(12),
    color: '#5F5F5F',
    marginTop: dynamicSize(5)
  },
  skillSeparator: {
    width: VIEWPORT.width,
    height: dynamicSize(50),
    paddingLeft: dynamicSize(10),
    backgroundColor: '#F0F0F0',
    justifyContent: 'center'
  },
  skillText: {
    fontSize: getFontSize(12),
    color: 'black',
  },
  skillsetView: {
    height: dynamicSize(100),
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  skillView: {
    width: dynamicSize(100),
    height: dynamicSize(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    marginLeft: dynamicSize(10),
    marginTop: dynamicSize(20),
    borderWidth: 1
  }
})

ContractorInfo.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigator: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({

})
export default connect(mapStateToProps)(ContractorInfo)
