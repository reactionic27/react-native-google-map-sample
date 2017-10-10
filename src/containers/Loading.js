import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator
} from 'react-native'
import { VIEWPORT } from '../constants'

export default class Loading extends Component {
  render () {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
        <ActivityIndicator/>
      </View>
    )
  }
}

Loading.navigatorStyle = {
  navBarHidden: true,
  statusBarBlur: true
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    height: VIEWPORT.height,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
