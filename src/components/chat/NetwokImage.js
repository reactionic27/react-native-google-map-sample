import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native'
import * as _ from 'lodash'

export default class NetworkImage extends Component {

  constructor (props) {
    super(props)
    this.state = {
      error: false,
      loading: false,
      progress: 0,
      events: [],
      prefetchedSource: props.source + '&t=' + _.now(),
      mountTime: _.now()
    }
  }

  renderLoader () {
    if (this.state.loading) {
      return (
        <View style={styles.progress}>
          <Text>{this.state.progress}%</Text>
          <ActivityIndicator style={{marginLeft: 5}} />
        </View>
      )
    }
  }

  handleOnClick () {
    this.props.onClick()
  }

  // _loadEventFired (event) {
  //   this.setState((state) => {
  //     return state.events = [...state.events, event]
  //   })
  // }

  render () {
    const { width, height, source } = this.props
    if (this.state.error) {
      return (
        <Text>{this.state.error}</Text>
      )
    } else {
      return (
        <TouchableOpacity onPress={this.handleOnClick.bind(this)} >

          <Image
            source={{ uri: source }}
            style={[ styles.image, { width, height } ]}
            resizeMode={'contain'}
            onLoadStart={(e) => this.setState({loading: true})}
            onError={(e) => this.setState({error: e.nativeEvent.error, loading: false})}
            onProgress={(e) => this.setState({progress: Math.round(100 * e.nativeEvent.loaded / e.nativeEvent.total)})}
            onLoad={() => this.setState({loading: false, error: false})}>
            {this.renderLoader()}
          </Image>

          {/* <View>
            <Image
            source={{ uri: source }}
            //  style={[styles.base, {overflow: 'visible'}]}
            style={[ styles.image, { width, height } ]}
            onLoadStart={() => this._loadEventFired(`✔ onLoadStart (+${new Date() - mountTime}ms)`)}
            onProgress={(e) => this.setState({progress: Math.round(100 * e.nativeEvent.loaded / e.nativeEvent.total)})}
            onLoad={(event) => {
            // Currently this image source feature is only available on iOS.
            if (event.nativeEvent.source) {
            const url = event.nativeEvent.source.url
            this._loadEventFired(`✔ onLoad (+${new Date() - mountTime}ms) for URL ${url}`)
            } else {
            this._loadEventFired(`✔ onLoad (+${new Date() - mountTime}ms)`)
            }
            }}
            onLoadEnd={() => {
            this._loadEventFired(`✔ onLoadEnd (+${new Date() - mountTime}ms)`)
            this.setState({startLoadPrefetched: true}, () => {
            console.log('run prefetchTask')
            prefetchTask.then(() => {
            this._loadEventFired(`✔ Prefetch OK (+${new Date() - mountTime}ms)`)
            }, (error) => {
            this._loadEventFired(`✘ Prefetch failed (+${new Date() - mountTime}ms)`)
            })
            })
            }}
            />
            {this.state.startLoadPrefetched ?
            <Image
            source={{ uri: prefetchedSource }}
            //                style={[styles.base, {overflow: 'visible'}]}
            style={[ styles.image, { width, height } ]}
            onLoadStart={() => this._loadEventFired(`✔ (prefetched) onLoadStart (+${new Date() - mountTime}ms)`)}
            onLoad={() => this._loadEventFired(`✔ (prefetched) onLoad (+${new Date() - mountTime}ms)`)}
            onLoadEnd={() => this._loadEventFired(`✔ (prefetched) onLoadEnd (+${new Date() - mountTime}ms)`)}
            />
            : null}
            {this.renderLoader()}
            <Text style={{marginTop: 20}}>
            {this.state.events.join('\n')}
            </Text>
          </View>*/}
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

NetworkImage.defaultProps = {
  width: 300,
  height: 400,
  onClick: () => { return }
}

NetworkImage.propTypes = {
  source: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  onClick: PropTypes.func
}
