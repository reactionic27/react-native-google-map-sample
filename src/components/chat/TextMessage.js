import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native'
import { MessageText } from 'react-native-gifted-chat'
import LinkPreview from 'react-native-link-preview'
import * as _ from 'lodash'

class TextMessage extends Component {

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    const text = this.props.currentMessage.text
    LinkPreview.getPreview(text)
      .then(data => {
        if (!this.unmounted) {
          this.setState({
            linkInfo: data
          })
        }
      })
      .catch(err => console.log('--------> error:', text, err))
  }

  componentWillUnmount () {
    this.unmounted = true
  }

  renderImage (info) {
    if (info.images.length > 0) {
      let uri = info.images[0]
      if (_.startsWith(uri, '//')) uri = 'https:' + uri
      return (
        <Image
          source={{ uri: uri }}
          style={styles.image}
        />
      )
    }
  }


  renderLinkInfo (position) {
    if (this.state.linkInfo) {
      return (
        <View style={styles.linkInfoContainer}>
          {this.renderImage(this.state.linkInfo)}
          <Text style={[styles.description, {color: (position === 'left') ? 'gray' : 'white'}]}>
            {this.state.linkInfo.description}
          </Text>
        </View>
      )
    } else {
      return
    }
  }

  render () {
    const { position, currentMessage } = this.props
    return (
      <View>
        <MessageText
          position={position}
          currentMessage={currentMessage}
        />
        {this.renderLinkInfo(position)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  linkInfoContainer: {
    margin: 10,
    width: 200,
    flexDirection: 'row'
  },
  image: {
    flexGrow: 1,
    width: 60,
    height: 60,
    resizeMode: 'contain'
  },
  description: {
    flexGrow: 6,
    marginRight: 10,
    marginLeft: 10
  }
})

TextMessage.propTypes = {
  position: PropTypes.string.isRequired,
  currentMessage: PropTypes.object.isRequired
}

export default TextMessage
