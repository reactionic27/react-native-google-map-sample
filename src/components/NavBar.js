import React, { Component, PropTypes } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native'
import { NAVIGATOR_HEIGHT, STATUS_BAR_HEIGHT, STATUS_BAR_COLOR, VIEWPORT } from '../constants'

import AccountButton from './AccountButton'
import BackButton from './BackButton'

export default class NavBar extends Component {

  render () {
    return (
      <View style={styles.navBar}>
        <View />
        <Text style={styles.navTitle}>Find Contractor</Text>
        <View />
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
  }
})

NavBar.defaultProps = {
  // color: 'black'
  backButton: false,

}

NavBar.propTypes = {
  // onClick: PropTypes.func.isRequired,
  // color: PropTypes.string
}
