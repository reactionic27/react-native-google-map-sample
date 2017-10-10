import React, { Component, PropTypes } from 'react'
import {
  TouchableOpacity,
  StyleSheet,
  Image,
  TouchableHighlight,
  View,
  Text,
  ListView,
  Modal,
  StatusBar
} from 'react-native'

import Separator from './Separator'
import { CheckBox } from 'react-native-elements'
import Triangle from 'react-native-triangle'
import { dynamicSize, getFontSize } from '../utils/DynamicSize'
import { NAVIGATOR_HEIGHT, STATUS_BAR_HEIGHT, STATUS_BAR_COLOR, VIEWPORT } from '../constants'

export default class FilterModal extends Component {

  constructor (props) {
    super(props)

    this.state = {

    }
  }

  componentDidMount () {

  }

  componentWillReceiveProps (nextProps) {

  }

  componentWillUnmount () {

  }

  renderRow(data, sectionID, rowID) {
		return (
			<TouchableOpacity 
          style={styles.listContainer}
          onPress={()=> this.itemSelected(rowID)}
      >
          <View style={styles.nameView}>
              <Text style={styles.namestyle}>
                {data.name}
              </Text>
          </View>
          <CheckBox
              center
              key={rowID}
              checked={this.props.filterSelected[rowID]}
              checkedIcon='check'
              uncheckedIcon='circle-o'
              containerStyle={styles.checkView}
              onPress={()=> this.itemSelected(rowID)}
          />
			</TouchableOpacity>
		);
	}

  _renderSeparator(sectionID, rowID) {
		return (
			<View key={`${sectionID}-${rowID}`}>
				<Separator color={"#F3F3F3"} width={VIEWPORT.width - dynamicSize(50)} height={1}/>
			</View>
		); 
	}

  itemSelected(rowID) {
      filterSelected = this.props.filterSelected
      filterSelected[rowID] = !filterSelected[rowID]
      this.setState({filterSelected: filterSelected})
  }  

  render () {
    const { dataSource, visible, closeModal, filterSelected, filterReset } = this.props;
    return (
      <Modal 
        animationType={'none'}
        transparent={true}
        visible={this.props.visible}>
        <View style={styles.filtermodalContainer}>
            <StatusBar barStyle='light-content'/>
            <TouchableHighlight style={styles.touchone} activeOpacity={0} underlayColor={'transparent'} onPress={()=> closeModal()}>
              <View>
              </View>
            </TouchableHighlight>
            <View style={styles.entireview}>
              <TouchableHighlight style={styles.touchtwo} activeOpacity={0} underlayColor={'transparent'} onPress={()=> closeModal()}>
                  <View>
                  </View>
              </TouchableHighlight>
              <View style={styles.filterparent}>
                  <Triangle width={dynamicSize(10)} height={dynamicSize(10)} color={'#FFFFFF'} direction={'up'} style={styles.triangle}/>
                  <View style={styles.filterContentView}>
                    <View style={styles.buttonView}>
                      <View style={styles.buttonLeft}>
                        <TouchableOpacity onPress={()=> closeModal()}>
                          <Text style={styles.confirmText}>
                            Done
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.buttonRight}>
                        <TouchableOpacity onPress={()=> filterReset()}>
                          <Text style={styles.confirmText}>
                            Reset
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <Separator color={"#F3F3F3"} width={VIEWPORT.width - dynamicSize(50)} height={1}/>
                    <ListView
                      dataSource={dataSource}
                      renderRow={this.renderRow.bind(this)}
                      renderSeparator={this._renderSeparator.bind(this)} />
                  </View>
              </View>
            </View>
        </View>
      </Modal>
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
  }
})

FilterModal.propTypes = {

}
