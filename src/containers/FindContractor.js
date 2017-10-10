import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ListView,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  StatusBar,
  Modal
} from 'react-native'
import { connect } from 'react-redux'
import {CustomSegmentedControl} from 'react-native-custom-segmented-control'
/**
 * ### Search bar
 *
 * Add Search bar from React Native elements
 *
 */
import { SearchBar} from 'react-native-elements'
import { dynamicSize, getFontSize } from '../utils/DynamicSize'
import { NAVIGATOR_HEIGHT, STATUS_BAR_HEIGHT, STATUS_BAR_COLOR, VIEWPORT } from '../constants'
import * as _ from 'lodash'
import { createChannel } from '../controllers/ChatProcessor'
import MapContractors from '../components/Contractors/MapContractors'
import FilterModal from '../components/FilterModal'
import ListContractors from '../components/Contractors/ListContractors'
import Separator from '../components/Separator'
const ASPECT_RATIO = VIEWPORT.width / VIEWPORT.height

class FindContractor extends Component {

  constructor (props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      setSelectedSegment: 0,
      filterModalVisible: false,
      dataSource: ds.cloneWithRows(this.props.filterOptions),
      filterSelected: [],
    }
  }

  renderSegmentView () {
    const segmentStyles = {
      selectedLineHeight: 2,
      fontSize: 16,
      fontWeight: 'bold',
      segmentBackgroundColor: '#FFFFFF',
      segmentTextColor: '#C2C2C2',
      segmentHighlightTextColor: '#0F0F0F',
      selectedLineColor: '#588BE7',
      selectedLineAlign: 'bottom',
      selectedLineMode: 'full',
      selectedTextColor: '#0F0F0F',
      selectedLinePaddingWidth: VIEWPORT.width / 4,
      segmentFontFamily: 'Roboto-Regular'
    }

   const animationStyle = {
      duration: 0.2,
      damping: 0,
      animationType: 'default',
      initialDampingVelocity: 0
    }

    return (
      <View>
          <CustomSegmentedControl
              style={ styles.controlStyle }
              textValues={['List','Map']}
              selected={0}
              segmentedStyle={ segmentStyles }
              animation={animationStyle}
              onSelectedWillChange={(event)=> {
                  this.setState({
                    setSelectedSegment: event.nativeEvent.selected
                  })
              }}
          />
          {this.state.setSelectedSegment == 0 ? <ListContractors navigator={this.props.navigator}/> : <MapContractors/> }
      </View>
    )
  }

  onFilter() {
    this.setState({filterModalVisible: true})
  }

  closeFilter() {
    this.setState({filterModalVisible: false})
  }

  filterReset() {
      this.setState({filterSelected: []})
  }

  render () {
    return (
      <View style={styles.flexible}>
        <StatusBar barStyle="default"/>
        <View style={styles.searchView}>
          <View style={styles.searchLeftView}>
            <SearchBar
              lightTheme
              round
              placeholder='Search'
              containerStyle={styles.searchBarContainer}
              inputStyle={styles.searchInput}
              icon={{ color: '#9B9B9B' }}
            />
          </View>
          <View style={styles.searchRightView}>
            <TouchableOpacity 
                style={styles.filterTouchView}
                onPress={() => this.onFilter()}>
              <Text style={styles.filterText}>
                Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View>
          {this.renderSegmentView()}
        </View>
        <FilterModal dataSource={this.state.dataSource} 
                     visible={this.state.filterModalVisible}
                     filterSelected = {this.state.filterSelected}
                     closeModal={() => this.closeFilter()}
                     filterReset={() => this.filterReset()}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  flexible: {
    flexGrow: 1,
  },
  searchView: {
    flexDirection: 'row',
    width: VIEWPORT.width,
    height: dynamicSize(50),
    alignItems: 'center',
    marginTop: dynamicSize(20),
  },
  searchLeftView: {
    height: dynamicSize(50),
  },
  searchRightView: {
    height: dynamicSize(50),
    backgroundColor: 'white',
    marginLeft: -28,
  },
  searchBarContainer: {
      width: VIEWPORT.width-dynamicSize(90),
      backgroundColor: 'white',
      borderBottomWidth: 0,
      borderTopWidth: 0,
      height: dynamicSize(30),
      marginLeft: 5,
  },
  searchInput: {
      width: VIEWPORT.width-dynamicSize(90),
      backgroundColor: '#F7F7F7',
      textAlign: 'left',
      height: dynamicSize(30),
      borderWidth: 1,
      borderColor: '#D1D1D1',
      fontSize: getFontSize(14),
  },
  icon: {
    color: '#9B9B9B',
  },
  filterTouchView: {
    width: dynamicSize(100),
    height: dynamicSize(30),
    justifyContent: 'center',
    alignItems: 'center',
    // borderTopRightRadius: dynamicSize(16),
    // borderBottomRightRadius: dynamicSize(16),
    borderColor: '#D1D1D1',
    backgroundColor: 'white',
    borderWidth: 1,
    marginTop: 8,
  },
  filterText: {
    fontSize: getFontSize(12),
    color: '#4B4B4B'
  },
  listViewContainer: {
    flexGrow: 1,
  },
  filtermodalContainer: {
     width: VIEWPORT.width,
     height: VIEWPORT.height,
     backgroundColor: 'rgba(0,0,0,0.5)'
  },
  filterContentView: {
    width: VIEWPORT.width - dynamicSize(50), 
    height: VIEWPORT.height - dynamicSize(100), 
    backgroundColor: 'white', 
    borderRadius: 5,
  },
  entireview: {
    flexDirection: 'row', 
    width: VIEWPORT.width
  },
  touchone: {
    width: VIEWPORT.width,
    height: dynamicSize(70),
  },
  touchtwo: {
    width: dynamicSize(40), 
    height: VIEWPORT.height,  
  },
  filterparent: {
    width: VIEWPORT.width - dynamicSize(40), 
    height: VIEWPORT.height
  },
  triangle: {
    marginLeft: VIEWPORT.width - dynamicSize(110),
  },
  buttonView: {
    width: VIEWPORT.width - dynamicSize(90), 
    height: dynamicSize(50),
    marginLeft: dynamicSize(20),
    flexDirection: 'row'
  },
  buttonLeft: {
    width: (VIEWPORT.width - dynamicSize(90)) /2, 
    height: dynamicSize(50),
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
  buttonRight: {
    width: (VIEWPORT.width - dynamicSize(90)) /2,
    height: dynamicSize(50),
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  confirmText: {
    fontSize: getFontSize(15),
    color: '#358DDF'
  },
  listContainer: {
    width: VIEWPORT.width - dynamicSize(50),
    height: dynamicSize(50),
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  namestyle: {
    marginLeft: dynamicSize(15),
    fontSize: getFontSize(16),
    color: '#6E717C',
  },
  nameView: {
    width: VIEWPORT.width - dynamicSize(100),
    height: dynamicSize(50),
    justifyContent: 'center',
    marginLeft: dynamicSize(20)
  },
  checkView: {
    width: dynamicSize(50), 
    backgroundColor: 'transparent', 
    borderWidth: 0
  },
  controlStyle: {
    backgroundColor: '#FFFFFF',
    height: 45,
    width: VIEWPORT.width/2
  }
})

FindContractor.navigatorStyle = {
  navBarHidden: true,
  statusBarBlur: false
}

FindContractor.defaultProps = {
  filterOptions: [
    {
      name: 'B-General Building Contractor',
    },
    {
      name: 'C10-Electrical',
    },
    {
      name: 'C33-Painting and Decoration',
    },
    {
      name: 'C29-Masony',
    },
    {
      name: 'C54-Tile(Ceramic and Mosaic)',
    },
    {
      name: 'B-General Building Contractor',
    },
    {
      name: 'C10-Electrical',
    },
    {
      name: 'C33-Painting and Decoration',
    },
    {
      name: 'C29-Masony',
    },
    {
      name: 'C54-Tile(Ceramic and Mosaic)',
    },
  ],
}

FindContractor.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigator: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  users: state.users,
  user: state.user
})
export default connect(mapStateToProps)(FindContractor)
