import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import { updateCache, refreshCache } from '../controllers/MessageProcessor'

class CachedImage extends Component {

  constructor (props) {
    super(props)
    this.state = {
      error: false,
      loading: true,
      progress: 0
    }
  }

  updateCache (props) {
    const { cache, dispatch, filename, url } = props
    const filepath = cache[filename]
    if (!filepath) {
      dispatch(updateCache(filename, url))
    }
  }

  componentDidMount () {
    this.updateCache(this.props)
  }

  componentWillReceiveProps (nextProps) {
    this.updateCache(nextProps)
  }

  renderLoader () {
    return (
      <View style={styles.progress}>
        <Text>{this.state.progress}%</Text>
        <ActivityIndicator style={{marginLeft: 5}} />
      </View>
    )
  }

  handleOnClick () {
    this.props.onClick()
  }


  onError (e) {
    const { dispatch, filename, url } = this.props

    if (e.nativeEvent.error === 'No image data' && !this.refreshSent) {
      dispatch(refreshCache(filename, url))
      this.refreshSent = true
    }

    // this.setState({
    //   error: e.nativeEvent.error,
    //   loading: false
    // })
  }

  onProgress (e) {
    this.setState({
      progress: Math.round(100 * e.nativeEvent.loaded / e.nativeEvent.total)
    })
  }

  render () {
    const { width, height, cache, filename } = this.props
    const filepath = cache[filename]
    if (this.state.error) {
      return (
        <Text>{this.state.error}</Text>
      )
    } else if (!filepath) {
      return this.renderLoader()
    } else {
      return (
        <TouchableOpacity onPress={this.handleOnClick.bind(this)} >

          <Image
            source={{ uri: filepath }}
            style={[ styles.image, { width, height } ]}
            resizeMode={'contain'}
            onLoadStart={(e) => this.setState({loading: true})}
            onError={this.onError.bind(this)}
            onProgress={this.onProgress.bind(this)}
            onLoad={() => this.setState({loading: false, error: false})}
          />

        </TouchableOpacity>
      )
    }
  }
}

const styles = StyleSheet.create({
  image: {
    margin: 10,
    overflow: 'visible'
  },
  progress: {
    flexGrow: 1,
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width: 100
  }
})

CachedImage.defaultProps = {
  width: 300,
  height: 400,
  onClick: () => { return }
}

CachedImage.propTypes = {
  url: PropTypes.string,
  filename: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  onClick: PropTypes.func,
  onNoImageData: PropTypes.func
}
const mapStateToProps = state => ({
  cache: state.cache
})

export default connect(mapStateToProps)(CachedImage)
