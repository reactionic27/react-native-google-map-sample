import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View
} from 'react-native'
import { connect } from 'react-redux'
import screens from '../constants/Screens'
import { logout } from '../actions/authAC'
import { dynamicSize, getFontSize } from '../utils/DynamicSize'
import { List, ListItem, Button } from 'react-native-elements'

class Profile extends Component {
  constructor (props) {
    super(props)
    this.state = {

    }
  }

  componentDidMount () {

  }

  logOut () {
    this.props.dispatch(logout())
  }

  _onConnectSocial () {
    const { navigator } = this.props
    navigator.push({
      screen: screens.CONNECTSOCIAL,
      title: 'Connect Social',
      backButtonTitle: ' ',
      navigatorStyle: {
        navBarHidden: false
      }
    })
  }

  _onContactInfo () {
    const { navigator } = this.props
    navigator.push({
      screen: screens.CONTACTINFO,
      title: 'Contact Information',
      backButtonTitle: ' ',
      navigatorStyle: {
        navBarHidden: false
      }
    })
  }

  _onViewLicense () {
    const { navigator } = this.props
    navigator.push({
      screen: screens.LICENSE,
      title: 'Your License',
      backButtonTitle: ' ',
      navigatorStyle: {
        navBarHidden: false,
        
      }
    })
  }

  _onViewProfile () {
    const { navigator } = this.props
    navigator.push({
      screen: screens.PROFILEVIEW,
      title: 'Profile',
      backButtonTitle: ' '
    })
  }

  render () {
    const { secondSettingsItems } = this.props
    return (
      <View style={styles.container}>
        <List containerStyle={styles.spaceView}>
          <ListItem
            title={'Connect Social'}
            titleStyle={styles.titlePadding}
            leftIcon={{ name: 'share' }}
            onPress={() => this._onConnectSocial()}
          />
          <ListItem
            title={'Contact Info'}
            titleStyle={styles.titlePadding}
            leftIcon={{ name: 'mail-outline' }}
            onPress={() => this._onContactInfo()}
          />
        </List>

        <List containerStyle={styles.spaceView}>
          <ListItem
            title={'Your Licenses'}
            titleStyle={styles.titlePadding}
            leftIcon={{ name: 'build' }}
            onPress={() => this._onViewLicense()}
          />
          <ListItem
            title={'Profile'}
            titleStyle={styles.titlePadding}
            leftIcon={{ name: 'perm-identity' }}
            onPress={() => this._onViewProfile()}
          />
        </List>

        <Button
          raised
          fontWeight={'200'}
          iconRight
          fontSize={getFontSize(12)}
          backgroundColor={'#e8003f'}
          icon={{name: 'input'}}
          title={'LOGOUT'}
          onPress={() => this.logOut()}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#eaeaea'
  },
  titlePadding: {
    marginLeft: dynamicSize(15)
  },
  spaceView: {
    marginBottom: dynamicSize(20)
  }
})

Profile.defaultProps = {

}

Profile.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired,
  channels: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.user,
  channels: state.channels
})

export default connect(mapStateToProps)(Profile)
