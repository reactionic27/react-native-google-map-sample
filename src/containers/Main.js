import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import { NAVIGATOR_HEIGHT, STATUS_BAR_HEIGHT, STATUS_BAR_COLOR, VIEWPORT } from '../constants'
import AccountButton from '../components/AccountButton'
import screens from '../constants/Screens'

class Main extends Component {

  openDrawer () {
    this.props.navigator.toggleDrawer({
      side: 'right', // the side of the drawer since you can have two, 'left' / 'right'
      animated: true, // does the toggle have transition animation or does it happen immediately (optional)
      to: 'open' // optional, 'open' = open the drawer, 'closed' = close it, missing = the opposite of current state
    })
  }

  renderNavBar () {
    return (
      <View style={styles.navBar}>
        {/* <SearchBar /> */}
        <View style={styles.leftNav} />
        <Text style={styles.navTitle}>Main</Text>
        <AccountButton onClick={this.openDrawer.bind(this)} />
      </View>
    )
  }

  handleOnFindContractor () {
    this.props.navigator.push({
      screen: screens.FIND_CONTRACTOR
    })
  }

  handleOnChats () {
    this.props.navigator.push({
      screen: screens.CHANNELS
    })
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        {this.renderNavBar()}
        <ScrollView>
          <View style={styles.container}>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={this.handleOnFindContractor.bind(this)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                FIND CONTRACTOR
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={this.handleOnChats.bind(this)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>
                CHATS
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>

      </View>
    )
  }

}

const styles = StyleSheet.create({
  leftNav: {
    flexGrow: 1
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: STATUS_BAR_COLOR
  },
  navBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: {
      height: 1,
      width: 0
    },
    shadowRadius: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    height: NAVIGATOR_HEIGHT,
    zIndex: 1
  },
  navTitle: {
    fontSize: 14,
    color: '#4A4A4A',
    fontWeight: '300',
    flexGrow: 4,
    textAlign: 'center'
  },
  container: {
    flexGrow: 1,
    height: VIEWPORT.height - NAVIGATOR_HEIGHT - STATUS_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    width: 200,
    height: 60,
    backgroundColor: '#1BB125',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0F6715',
    borderRadius: 6,
    margin: 10
  },
  buttonText: {
    color: 'white',
    fontSize: 18
  }
})

Main.navigatorStyle = {
  navBarHidden: true,
  statusBarBlur: true
}

Main.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigator: PropTypes.object.isRequired
}

const mapStateToProps = state => ({})
export default connect(mapStateToProps)(Main)
