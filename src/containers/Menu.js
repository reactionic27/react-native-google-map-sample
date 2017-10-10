import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  View
} from 'react-native'
import { connect } from 'react-redux'
import { logout } from '../actions/authAC'
import { VIEWPORT } from '../constants'
import co from 'co'
import { printDocument, printCache, clearAudioCache } from '../utils/Cache'
import { clearCache } from '../controllers/MessageProcessor'

class Menu extends Component {

  logOut () {
    this.props.dispatch(logout())
  }

  printDocument () {
    co(printDocument())
  }

  printCache () {
    co(printCache())
  }

  clearAudioCache () {
    co(clearAudioCache())
  }

  clearMessagesCache () {
    const { user } = this.props
    co(clearCache(user.id))
  }

  render () {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.logoutBox} onPress={this.logOut.bind(this)}>
          <Image source={require('../assets/images/logout.png')} style={styles.logoutIcon} />
          <Text>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBox} onPress={this.printDocument.bind(this)}>
          <Text>Print document</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBox} onPress={this.printCache.bind(this)}>
          <Text>Print cache</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBox} onPress={this.clearAudioCache.bind(this)}>
          <Text>Clear audio cache</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutBox} onPress={this.clearMessagesCache.bind(this)}>
          <Text>Clear messages cache</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20
  },
  logoutBox: {
    height: VIEWPORT.height * 0.06,
    alignItems: 'center',
    flexDirection: 'row',
    paddingLeft: 32
  },
  logoutIcon: {
    width: 19,
    resizeMode: 'contain',
    marginRight: 18
  }
})

Menu.propTypes = {
  dispatch: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  navigator: PropTypes.object.isRequired,
  channels: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.user,
  channels: state.channels
})

export default connect(mapStateToProps)(Menu)
