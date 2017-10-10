import {
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native'
import React, { Component, PropTypes } from 'react'
import {VIEWPORT} from '../../constants/'

export default class Button extends Component {
  render () {
    const {
      color,
      fontSize,
      handleOnPress,
      height,
      width,
      backgroundColor
    } = this.props

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={handleOnPress}
        style={[
          styles.container,
          {
            height: height,
            width: width,
            backgroundColor: backgroundColor
          },
          this.props.type === 'fullWidth' && styles.fullWidthContainer,
          this.props.type === 'fullWidth' && {backgroundColor: this.props.backgroundColor}
        ]}
      >
        <Text style={[
          styles.text,
          {color: color, fontSize: fontSize}
        ]}>
          {this.props.label}
        </Text>
      </TouchableOpacity>
    )
  }
}

// PropTypes and default props
Button.defaultProps = {
  color: '#107A86',
  fontSize: 12,
  backgroundColor: '#4A4A4A',
  height: 55,
  width: 55
}

Button.propTypes = {
  label: PropTypes.string,
  color: PropTypes.string,
  backgroundColor: PropTypes.string,
  fontSize: PropTypes.number,
  type: PropTypes.string,
  height: PropTypes.number,
  width: PropTypes.number,
  handleOnPress: PropTypes.func.isRequired
}

const styles = StyleSheet.create({
  container: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullWidthContainer: {
    width: VIEWPORT.width,
    left: 0,
    right: 0,
    backgroundColor: '#4A4A4A',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: '#107A86',
    fontSize: 12
  }
})
