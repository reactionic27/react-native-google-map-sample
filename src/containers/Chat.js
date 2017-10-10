import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  AppState,
  StatusBar
} from 'react-native'
import { connect } from 'react-redux'
import { dynamicSize, getFontSize } from '../utils/DynamicSize'
import { NAVIGATOR_HEIGHT, STATUS_BAR_HEIGHT, STATUS_BAR_COLOR, VIEWPORT } from '../constants'
import AccountButton from '../components/AccountButton'
import BackButton from '../components/BackButton'
import SimpleButton from '../components/Common/SimpleButton'
import * as _ from 'lodash'
import { GiftedChat, Composer, Time } from 'react-native-gifted-chat'
import ListPopover from '../components/Common/ListPopover'
import ImagePicker from 'react-native-image-crop-picker'
import CachedImage from '../components/CachedImage'
import AudioPlayer from '../components/chat/AudioPlayer'
import deliveryStatus from '../constants/MessageDeliveryStatus'
import {
  sendTextMessage,
  sendImageMessage,
  sendAudioMessage,
  markMessageAsRead,
  updateTyping
} from '../controllers/MessageProcessor'
import { loadEarlier } from '../controllers/ChatProcessor'
import screens from '../constants/Screens'
import Icon from 'react-native-vector-icons/EvilIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import * as Animatable from 'react-native-animatable'
import messageKinds from '../constants/MessageKinds'
import TextMessage from '../components/chat/TextMessage'

class Chat extends Component {

  constructor (props) {
    super(props)
    const user = props.user
    const channel = props.channels[props.channelId]
    this.state = {
      messages: {},
      menuIsVisible: false,
      channel,
      isTyping: false,
      currentAppState: AppState.currentState
    }
  }

  componentDidMount () {
    AppState.addEventListener('change', this._handleAppStateChange.bind(this))
    this.markMessagesAsRead(this.props.messages)
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this._handleAppStateChange)
    if (this.timerId) clearTimeout(this.timerId)
  }

  _handleAppStateChange (currentAppState) {
    this.setState({ currentAppState })
    this.markMessagesAsRead(this.props.messages)
  }

  message2Gifted (m) {
    const gMessage = {
      _id: m.id,
      text: m.body,
      createdAt: m.createdAt,
      user: {
        _id: m.userId
      },
      kind: m.kind,
      deliveryStatus: m.deliveryStatus,
      attributes: m.attributes
    }
    if (m.kind === messageKinds.IMAGE) {
      gMessage.image = 'http://127.0.0.1'
      if (_.has(m.attributes, 'url')) gMessage.image = m.attributes.url
    }
    return gMessage
  }

  markMessagesAsRead (allMessages) {
    if (this.state.currentAppState === 'active') {
      const { dispatch, user, channelId } = this.props
      const messages = allMessages[channelId]
      for (const mId in messages) {
        const m = messages[mId]
        if (m.userId !== user.id && (m.deliveryStatus !== deliveryStatus.READ)) {
          dispatch(markMessageAsRead(m))
        }
      }
    } else {
      console.log('markMessagesAsRead canceled because app state is', this.state.currentAppState)
    }
  }

  componentWillReceiveProps (nextProps) {
    this.markMessagesAsRead(nextProps.messages)
    const channel = nextProps.channels[nextProps.channelId]
    if (_.has(channel, ['typing', this.friendId])) {
      const typingTime = channel.typing[this.friendId]
      if (this.timerId) clearTimeout(this.timerId)
      const timeNow = _.now()
      const delay = typingTime + 5000 - timeNow
      if (delay > 0) {
        this.setState({
          typingTime
        })
        this.timerId = setTimeout(this.removeTypingTime.bind(this), delay)
      }
    } else {
    }
  }

  removeTypingTime () {
    this.setState({
      typingTime: null
    })
  }

  onSend (messages) {
    const { dispatch, channelId } = this.props
    const channel = this.state.channel
    if (channel) {
      for (let m of messages) {
        dispatch(sendTextMessage(channelId, m.text, this.friendId))
      }
    } else {
      console.warn('onSend: channel does not exist')
    }
  }

  handleOnPressActionButton () {
    this.setState({
      menuIsVisible: !this.state.menuIsVisible
    })
  }

  onMenuItemClick (item) {
    const { dispatch, channelId } = this.props

    this.setState({
      menuIsVisible: false
    })

    if (item === 'Camera') {
      ImagePicker.openCamera({
//        width: 300,
//        height: 400,
//        cropping: true,
        includeBase64: true
      }).then(image => {
        dispatch(sendImageMessage(channelId, image, this.friendId))
      })
    } else if (item === 'Album') {
      ImagePicker.openPicker({
        multiple: true,

//        width: 300,
//        height: 400,
//        cropping: true
        includeBase64: true
      }).then(images => {
        for (let img of images) {
          dispatch(sendImageMessage(channelId, img, this.friendId))
        }
      })
    } else if (item === 'Audio') {
      const { navigator } = this.props
      navigator.showLightBox({
        screen: screens.AUDIO_RECORDER,
        passProps: {
          onClose: () => {
            navigator.dismissLightBox()
          },
          onSend: (filename) => {
            dispatch(sendAudioMessage(channelId, filename, this.friendId))
          }
        },
        style: {
          backgroundBlur: 'light', // 'dark' / 'light' / 'xlight' / 'none' - the type of blur on the background
          backgroundColor: '#ddeefc80' // tint color for the background, you can specify alpha here (optional)
        }
      })
    }
  }

  renderActions () {
    return (
      <View>
        <ListPopover
          list={['Camera', 'Album', 'Audio']}
          onClick={this.onMenuItemClick.bind(this)}
          isVisible={this.state.menuIsVisible}
          containerStyle={{
            position: 'absolute',
            bottom: 5,
            left: 5,
            width: 100,
            borderStyle: 'solid',
            borderWidth: 1,
            borderRadius: 5,
            marginBottom: 0
          }}
        />
        <SimpleButton
          width={45}
          height={45}
          label={'+'}
          backgroundColor={'#DEDEDE'}
          handleOnPress={this.handleOnPressActionButton.bind(this)}
        />
      </View>
    )
  }

  onImageClick (messageId) {
    const { navigator, messages, channelId, cache } = this.props
    const rawMessages = messages[channelId]
    const imageMessages = []
    for (const mId in rawMessages) {
      const m = rawMessages[mId]
      if (m.kind === messageKinds.IMAGE) {
        imageMessages.push(m)
      }
    }
    const sortedImageMessages = _.sortBy(imageMessages, (o) => -o.createdAt)
    let index = 0
    const filepaths = []
    for (const i in sortedImageMessages) {
      const m = sortedImageMessages[i]
      const filepath = cache[m.attributes.filename]
      if (filepath) {
        filepaths.push('file:///' + filepath)
        if (m.id === messageId) index = filepaths.length - 1
      }
    }
    navigator.showModal({
      screen: screens.IMAGE_VIEWER,
      passProps: {
        images: filepaths,
        initialPage: {index}
      },
      navigatorStyle: {},
      navigatorButtons: {}
    })
  }

  renderMessageImage (data) {
    const curMsg = data.currentMessage
    const url = curMsg.attributes.url
    return (
      <View>
        <CachedImage
          width={200}
          height={300}
          url={url}
          filename={curMsg.attributes.filename}
          onClick={() => this.onImageClick(curMsg._id)}
        />
      </View>
    )
  }

  renderMessageText (data) {
    const curMsg = data.currentMessage
    if (curMsg.kind === messageKinds.AUDIO && curMsg.attributes.filename !== '') {
      return (
        <AudioPlayer
          filename={curMsg.attributes.filename}
          url={curMsg.attributes.url}
        />
      )
    } else {
      return (
        <TextMessage
          position={data.position}
          currentMessage={curMsg}
        />
      )
    }
  }

  onType () {
    const { dispatch, channelId, user } = this.props
    const timeNow = _.now()
    if (!this.typingLastSendingTime || timeNow - this.typingLastSendingTime > 3000) {
      dispatch(updateTyping(channelId, user.id))
      this.typingLastSendingTime = timeNow
    }
  }

  renderComposer (props) {
    const self = this
    const onChange = (v) => {
      self.onType(v)
      props.onChange(v)
    }
    return (
      <Composer
        {...props}
        onChange={onChange}
      />
    )
  }

  renderFooter (data) {
    let msg = ''
    const timeNow = _.now()
    if (this.state.typingTime && timeNow - this.state.typingTime < 5000) msg = this.friendId + ' is typing...'
    return (
      <Text style={styles.typingMessage}>{msg}</Text>
    )
  }

  renderMessageTime (props) {
    const currentMessage = props.currentMessage
    if (currentMessage.user._id === this.props.user.id) {
      switch (currentMessage.deliveryStatus) {
        case deliveryStatus.UNSENT:
          const AnimatedIcon = Animatable.createAnimatableComponent(Icon)
          return (
            <View style={styles.messageTimeContainer}>
              <Time {...props} />
              <AnimatedIcon
                style={styles.messageSpiner}
                name={'spinner-3'}
                color={'white'}
                size={16}
                //  transition={'rotate'}
                easing={'linear'}
                iterationCount={'infinite'}
                duration={2000}
                animation={'rotate'}
                direaction={'alternate'}
              />
            </View>
          )

        case deliveryStatus.DELIVERED:
          return (
            <View style={styles.messageTimeContainer}>
              <Time {...props} />
              <MaterialIcon
                style={styles.messageSpiner}
                name={'done'}
                color={'white'}
                size={16}
              />
            </View>
          )

        case deliveryStatus.READ:
          return (
            <View style={styles.messageTimeContainer}>
              <Time {...props} />
              <MaterialIcon
                style={styles.messageSpiner}
                name={'done-all'}
                color={'white'}
                size={16}
              />
            </View>
          )

        default:
          return (
            <Time {...props} />
          )
      }
    } else {
      return (
        <Time {...props} />
      )
    }
  }

  onLoadEarlier () {
    const { dispatch, channelId, messages } = this.props
    const rawMessages = messages[channelId]
    dispatch(loadEarlier(channelId, _.keys(rawMessages).length))
  }

  render () {
    const { channelId, messages, channels } = this.props
    const channel = channels[channelId]
    const rawMessages = messages[channelId]
    const user = this.props.user
    const giftedMessages = []
    for (const mId in rawMessages) {
      giftedMessages.push(this.message2Gifted(rawMessages[mId]))
    }
    const sortedGiftedMessages = _.sortBy(giftedMessages, (m) => -m.createdAt)
    
    return (
      <View style={styles.flexible}>
        <StatusBar barStyle={'default'}/>
        <GiftedChat
          messages={sortedGiftedMessages}
          onSend={this.onSend.bind(this)}
          renderActions={this.renderActions.bind(this)}
          renderMessageImage={this.renderMessageImage.bind(this)}
          renderMessageText={this.renderMessageText.bind(this)}
          renderComposer={this.renderComposer.bind(this)}
          renderFooter={this.renderFooter.bind(this)}
          renderTime={this.renderMessageTime.bind(this)}
          loadEarlier
          isLoadingEarlier={channel.loadingEarlier}
          onLoadEarlier={this.onLoadEarlier.bind(this)}
          user={{
            _id: user.id
          }}
        />        
      </View>
    )
  }

}

const styles = StyleSheet.create({
  flexible: {
    flexGrow: 1
  },
  leftNav: {
    flexGrow: 1
  },
  statusBar: {
    height: STATUS_BAR_HEIGHT,
    backgroundColor: STATUS_BAR_COLOR
  },
  typingMessage: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5
  },
  messageTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
  messageSpiner: {
    marginRight: 5,
    marginBottom: 5
  },
  chatview: {
    marginTop: NAVIGATOR_HEIGHT,
    borderWidth: 1
  }
})

Chat.navigatorStyle = {
  navBarHidden: true,
  statusBarBlur: true
}

Chat.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigator: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  channels: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  cache: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  user: state.user,
  users: state.users,
  channels: state.channels,
  messages: state.messages,
  cache: state.cache
})
export default connect(mapStateToProps)(Chat)
