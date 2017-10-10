import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'
import { connect } from 'react-redux'
import { authWithToken } from '../actions/authAC'
import { VIEWPORT } from '../constants'
import { lock } from '../constants/auth0'

class Auth extends Component {
  render () {
    lock.show({
      connections: ['sms']
    }, (err, profile, token) => {
      this.props.dispatch(authWithToken(profile, token))
    })
    return (
      <View style={styles.container}>
        <Text>Auth page</Text>
      </View>
    )
  }

}

Auth.navigatorStyle = {
//  navBarHidden: true,
//  statusBarBlur: true
}

Auth.propTypes = {
  dispatch: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: VIEWPORT.height,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const mapStateToProps = state => ({})
export default connect(mapStateToProps)(Auth)
