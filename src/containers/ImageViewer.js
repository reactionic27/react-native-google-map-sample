import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'
import Gallery from 'react-native-gallery'
import BackButton from '../components/BackButton'
import { STATUS_BAR_COLOR, STATUS_BAR_HEIGHT, NAVIGATOR_HEIGHT } from '../constants'

export default class ImageViewer extends Component {

  renderNavBar () {
    return (
      <View style={styles.navBar}>
        <BackButton
          onClick={() => this.props.navigator.dismissModal({})}
          color={'white'}
        />
        <Text style={styles.navTitle} />
        <View />
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.statusBar} />
        {this.renderNavBar()}
        <Gallery
          style={{flexGrow: 1, backgroundColor: 'transparent'}}
          initialPage={1}
          pageMargin={10}
          images={this.props.images}
          onSingleTapConfirmed={() => {
          }}
          onGalleryStateChanged={(idle) => {
          }}
          onPageSelected={(page) => {
          }}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'black'
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: STATUS_BAR_COLOR
  },
  navBar: {
//    backgroundColor: 'white',
    position: 'absolute',
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
  }
})

ImageViewer.navigatorStyle = {
  navBarHidden: true,
  statusBarBlur: true
}

ImageViewer.propTypes = {
  images: PropTypes.array.isRequired,
  navigator: PropTypes.object.isRequired
}
