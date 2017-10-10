import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator
} from 'react-native'
import Sound from 'react-native-sound'
import MultiSlider from '../MultiSlider/MultiSlider'
import Icon from 'react-native-vector-icons/Foundation'
import { updateCache } from '../../controllers/MessageProcessor'
import * as _ from 'lodash'

const STEPS_COUNT = 100

class AudioPlayer extends Component {

  constructor (props) {
    super(props)
    this.state = {
      isPlaying: false,
      value: 0,
      loading: true
    }

    this.initSound(props)
  }

  initSound (props) {
    const { cache, filename } = props
    const filepath = cache[filename]
    console.log('initSound', filename, filepath)
    if (!this.sound && filepath) {
      console.log('new sound for filepath', filename)
      this.sound = new Sound(filepath, '', (error) => {
        if (error) {
          console.log('failed to load the sound', error)
        } else { // loaded successfully
          const duration = this.sound.getDuration()
          this.setState({
            loading: false,
            duration,
            timerPeriod: duration / STEPS_COUNT * 1000
          })
          // if (duration > 0) this.timer = setInterval(this.updateCurrentTime.bind(this), duration / STEPS_COUNT * 1000)
          console.log('duration in seconds: ' + this.sound.getDuration() +
              'number of channels: ' + this.sound.getNumberOfChannels())
        }
      })
      console.log(this.sound)
    } else {
      console.log('there is no filepath', filename)
    }
  }

  componentWillUnmount () {
    console.log('componentWillUnmount')
    if (this.timer) {
      console.log('clear interval')
      clearInterval(this.timer)
      this.unmounted = true
    }
    if (this.sound) {
      this.sound.stop()
      this.sound.release()
    }
  }

  timerStop () {
    if (this.timer) clearInterval(this.timer)
  }

  timerStart () {
    this.timerStop()
    this.timer = setInterval(this.updateCurrentTime.bind(this), this.state.timerPeriod)
  }

  setCurrentTime (seconds, isPlaying) {
    if (!this.unmounted) {
      const v = seconds / this.state.duration
      if (v <= 1) {
      // console.log('currentTime', seconds, 'isPlaying', isPlaying, v)
        this.setState({
          value: v
        })
      }
    } else {
      console.log('component is not mounted')
    }
  }

  updateCurrentTime () {
    // console.log('updateCurrentTime')
    if (this.sound) {
      // console.log('getCurrentTime')
      this.sound.getCurrentTime(this.setCurrentTime.bind(this))
    }
  }

  updateCache (props) {
    const { cache, dispatch, filename, url } = props
    const filepath = cache[filename]
    console.log('update cache, filename', filename, 'filepath', filepath, 'url', url)
    if (_.isUndefined(filepath) && !_.isUndefined(url)) {
      dispatch(updateCache(filename, url, true))
    } else if (!_.isUndefined(filepath) && filepath) {
      console.log('nothing to update: everything fine')
    } else {
      console.log('audio file error')
      this.setState({
        error: 'the file was not uploaded'
      })
    }
  }

  componentDidMount () {
    this.updateCache(this.props)
  }

  componentWillReceiveProps (nextProps) {
    // console.log('CWRP')
      // this.updateCache(nextProps)
    if (!this.sound && nextProps.cache[nextProps.filename]) {
      this.initSound(nextProps)
    }
  }

  pause () {
    console.log('pause pressed')
    if (this.state.isPlaying && this.sound) {
      this.sound.pause()
      this.setState({
        isPlaying: false
      })
      this.timerStop()
    }
  }

  play () {
    console.log('play pressed')
    if (!this.state.isPlaying && this.sound) {
      this.setState({
        isPlaying: true
      })

      this.sound.play((success) => {
        console.log('successfully finished playing')
        this.setState({
          isPlaying: false
        })
        this.timerStop()
      })

      this.timerStart()
    }
  }

  handleValuesChangeFinish (data) {
    console.log('handleValuesChangeFinish', data)
    if (data && data.length > 0 && this.sound) {
      const pos = data[0]
      this.sound.setCurrentTime(this.state.duration / STEPS_COUNT * pos)
      this.setState({
        value: pos / STEPS_COUNT
      })
    }
  }

  onValuesChange (data) {
//    console.log('onValuesChange', data)
    // if (data && data.length > 0 && this.sound) {
    //   const pos = data[0]
    //   const newValue = pos / STEPS_COUNT
    //   if (newValue !== this.state.value) {
    //     this.setState({
    //       value: pos / STEPS_COUNT
    //     })
    //   }
    // }
  }

  renderControls () {
    if (this.state.isPlaying) {
      return (
        <Icon.Button
          name={'pause'}
          size={40}
          width={40}
          height={40}
          color={'#444'}
          onPress={this.pause.bind(this)}
          backgroundColor={'transparent'}
        />
      )
    } else {
      return (
        <Icon.Button
          name={'play'}
          size={40}
          width={40}
          height={40}
          color={'#444'}
          onPress={this.play.bind(this)}
          backgroundColor={'transparent'}
        />
      )
    }
  }

  renderLoader () {
    return (
      <View style={styles.progress}>
        <Text>{this.state.progress}%</Text>
        <ActivityIndicator style={{marginLeft: 5}} />
      </View>
    )
  }

  secToString (v) {
  //  console.log(v, Math.floor(v / 60))
    const mins = ('0' + Math.floor(v / 60)).slice(-2)
    const secs = ('0' + Math.floor(v - mins * 60)).slice(-2)
    return `${mins}:${secs}`
  }

  textProgress () {
    const curTime = this.state.duration * this.state.value
    // console.log('textProgress', this.state.duration, curTime, this.state.value)
    return `${this.secToString(curTime)} / ${this.secToString(this.state.duration)}`
  }

  render () {
    // console.log('render:', this.state.value)
    if (this.state.error) {
      return (
        <Text>{this.state.error}</Text>
      )
    } else if (this.state.loading) {
      return this.renderLoader()
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.durationContainer}>
            <Text style={styles.durationText}>
              {this.textProgress()}
            </Text>
          </View>
          <View style={styles.controls}>
            {this.renderControls()}
            <MultiSlider
              sliderLength={160}
              min={0}
              max={STEPS_COUNT}
              step={1}
              values={[Math.floor(this.state.value * STEPS_COUNT)]}
              onValuesChange={this.onValuesChange.bind(this)}
              onValuesChangeStart={this.pause.bind(this)}
              onValuesChangeFinish={this.handleValuesChangeFinish.bind(this)}
            />
          </View>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    width: 240,
    height: 60,
    flexDirection: 'column',
    backgroundColor: '#F2E33D'
  },
  controls: {
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start'
  },
  durationContainer: {
    width: 230,
    height: 20,
    alignItems: 'flex-end'
    // backgroundColor: 'gray'
  },
  sliderContainer: {
    width: 160
  },
  durationText: {
    fontSize: 12
  }
})

AudioPlayer.propTypes = {
  url: PropTypes.string,
  filename: PropTypes.string
}

const mapStateToProps = state => ({
  cache: state.cache
})

export default connect(mapStateToProps)(AudioPlayer)
