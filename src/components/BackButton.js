import React, { Component, PropTypes } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native'

export default class BackButton extends Component {

  render () {
    return (
      <TouchableOpacity onPress={this.props.onClick} style={styles.container}>
        <Image source={require('../assets/images/Back.png')} style={[styles.img, {tintColor: this.props.color}]} />
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1
  },
  img: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
    marginLeft: 15,
    marginRight: 10
  }
})

BackButton.defaultProps = {
  color: 'black'
}

BackButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string
}
