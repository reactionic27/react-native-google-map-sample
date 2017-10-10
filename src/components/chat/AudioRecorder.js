import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'
import Icon from 'react-native-vector-icons/Foundation'
import { AudioRecorder as AR, AudioUtils } from 'react-native-audio'
import * as _ from 'lodash'

export default class AudioRecorder extends Component {

  constructor (props) {
    super(props)
    this.state = {
      recording: false,
      currentTime: 0.0,
      stoppedRecording: false,
      stoppedPlaying: false,
      playing: false,
      finished: null
    }
  }

  onClose () {
    this.props.onClose()
  }

  prepareRecordingPath (audioPath) {
    AR.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'Low',
      AudioEncoding: 'aac',
      AudioEncodingBitRate: 32000
    })
  }

  componentDidMount () {
    const audioPath = AudioUtils.DocumentDirectoryPath + '/' + _.now() + '.aac'
    this.prepareRecordingPath(audioPath)
    AR.onProgress = (data) => {
      this.setState({
        currentTime: Math.floor(data.currentTime * 10) / 10
      })
    }
    AR.onFinished = (data) => {
      if (data.status === 'OK') {
        this.setState({
          finished: data.audioFileURL
        })
        if (this.needSend) {
          this.send()
        }
      }
    }
  }

  componentWillUnmount () {
    AR.finishedSubscription.remove()
    AR.progressSubscription.remove()
  }

  _record () {
    if (this.state.stoppedRecording) {
      const audioPath = AudioUtils.DocumentDirectoryPath + '/' + _.now() + '.aac'
      this.prepareRecordingPath(audioPath)
    }
    AR.startRecording()
    this.setState({
      recording: true,
      playing: false
    })
  }

  _stop () {
    if (this.state.recording) {
      AR.stopRecording()
      this.setState({stoppedRecording: true, recording: false})
    } else if (this.state.playing) {
      AR.stopPlaying()
      this.setState({playing: false, stoppedPlaying: true})
    }
  }

  _pause () {
    if (this.state.recording) {
      AR.pauseRecording()
      this.setState({stoppedRecording: true, recording: false})
    } else if (this.state.playing) {
      AR.pausePlaying()
      this.setState({playing: false, stoppedPlaying: true})
    }
  }

  _play () {
    if (this.state.recording) {
      this._stop()
      this.setState({recording: false})
    }
    AR.playRecording()
    this.setState({playing: true})
  }

  _renderButton (title, onPress, active, color) {
    return (
      <Icon.Button
        name={title}
        size={50}
        width={50}
        color={color}
        onPress={onPress}
        backgroundColor={'transparent'}
      />
    )
  }

  renderControls () {
    return (
      <View style={styles.controlsContainer}>
        {this._renderButton('record', () => { this._record() }, this.state.recording, '#900')}
        {this._renderButton('stop', () => { this._stop() }, true, '#444')}
        {this._renderButton('pause', () => { this._pause() }, true, '#444')}
        {this._renderButton('play', () => { this._play() }, this.state.playing, '#444')}
      </View>
    )
  }

  send () {
    this.props.onSend(this.state.finished)
    this.props.onClose()
  }

  apply () {
    this._stop()
    if (this.state.finished && this.state.currentTime > 0) {
      this.send()
    } else {
      this.needSend = true
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon.Button name={'x'} size={30} color={'gray'} backgroundColor={'transparent'} onPress={this.onClose.bind(this)} />
        </View>
        <View style={styles.main}>
          {this.renderControls()}
          <View style={styles.bottomContainer}>
            <Text style={styles.progressText}>{this.state.currentTime}s</Text>
            <Icon.Button
              name={'music'}
              size={30}
              //width={50}
              height={50}
              color={'black'}
              onPress={this.apply.bind(this)}
              backgroundColor={'#8F8'}
            >
              Send
            </Icon.Button>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 200,
    backgroundColor: 'white',
    flexDirection: 'column'
  },
  header: {
    height: 50,
    alignItems: 'flex-end'
  },
  main: {
    alignItems: 'center'
  },
  controlsContainer: {
    flexDirection: 'row'
  },
  progressText: {
//    paddingTop: 10,
    width: 100,
    fontSize: 36,
    color: '#88f'
  },
  bottomContainer: {
    height: 60,
    width: 160,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

AudioRecorder.defaultProps = {
  onSend: () => { return }
}

AudioRecorder.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSend: PropTypes.func
}
