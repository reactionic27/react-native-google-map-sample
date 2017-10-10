import {
  StyleSheet,
  View,
} from 'react-native'
import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { VIEWPORT } from '../../constants'
import * as screens from '../../constants/Screens'
import MapView from 'react-native-maps'
import * as _ from 'lodash'

const Marker1_Icon =  require('../../assets/images/3.png');

const ASPECT_RATIO = VIEWPORT.width / VIEWPORT.height
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;

class MapContractors extends Component {

  constructor (props) {
    super(props)

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
    }
  }

  render () {
    const { region } = this.state;
    return (
      <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={region}
          >
            <MapView.Marker 
                key={Math.random()}
                coordinate={this.props.markers[1].coordinate}
                title={this.props.markers[1].title}
                description={this.props.markers[1].Description}
                image={Marker1_Icon}
            />
          </MapView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop: 50,
    height: VIEWPORT.height-50,
    width: VIEWPORT.width,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  map: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center'
  },
  plainView: {
    width: 60,
  },
  customView: {
    width: 140,
    height: 100,
  },
})

MapContractors.defaultProps = {
  markers: [
    {
      title: 'Contractor',
      Description: '1',
      coordinate: {
        latitude: LATITUDE + SPACE,
        longitude: LONGITUDE + SPACE,
      },
    },
    {
      title: 'Contractor',
      Description: '2',
      coordinate: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
      },
    },
    {
      title: 'Contractor',
      Description: '3',
      coordinate: {
        latitude: LATITUDE + SPACE,
        longitude: LONGITUDE - SPACE,
      },
    },
    {
      title: 'Contractor',
      Description: '4',
      coordinate: {
        latitude: LATITUDE + 0.7 * SPACE,
        longitude: LONGITUDE - 0.6 * SPACE,
      },
    },
    {
      title: 'Contractor',
      Description: '5',
      coordinate: {
        latitude: LATITUDE + 1.1 * SPACE,
        longitude: LONGITUDE + 1.5 * SPACE,
      },
    },
    {
      title: 'Contractor',
      Description: '6',
      coordinate: {
        latitude: LATITUDE - 1.7 * SPACE,
        longitude: LONGITUDE - 1.6 * SPACE,
      },
    },
    {
      title: 'Contractor',
      Description: '7',
      coordinate: {
        latitude: LATITUDE - 2.1 * SPACE,
        longitude: LONGITUDE - 2.3 * SPACE,
      },
    },
    {
      title: 'Contractor',
      Description: '8',
      coordinate: {
        latitude: LATITUDE - 1.8 * SPACE,
        longitude: LONGITUDE + 1.4 * SPACE,
      },
    },
    {
      title: 'Contractor',
      Description: '9',
      coordinate: {
        latitude: LATITUDE - 1.1 * SPACE,
        longitude: LONGITUDE - 1.5 * SPACE,
      },
    },
    {
      title: 'Contractor',
      Description: '9',
      coordinate: {
        latitude: LATITUDE + 1.6 * SPACE,
        longitude: LONGITUDE + 1.9 * SPACE,
      },
    },
  ],
}

MapContractors.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({

})

export default connect(mapStateToProps)(MapContractors)
