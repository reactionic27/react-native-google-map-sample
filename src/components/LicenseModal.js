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
import { SearchBar, CheckBox } from 'react-native-elements'
import { dynamicSize, getFontSize } from '../utils/DynamicSize'
import { NAVIGATOR_HEIGHT, STATUS_BAR_HEIGHT, STATUS_BAR_COLOR, VIEWPORT } from '../constants'

export default class LicenseModal extends Component {

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

  renderPickerRow(data, sectionID, rowID) {
 		return (
 			<TouchableOpacity 
          style={styles.pickerlistContainer}
          onPress={()=> this.itemSelected(data, rowID)}>
         <View style={styles.pickerLeftView}>
           <Text style={styles.namestyle}>
             {data.name}
           </Text>
           <Text style={styles.typestyle}>
             {data.type}
           </Text>
         </View>
         <CheckBox
              center
              key={rowID}
              checkedIcon='check'
              uncheckedIcon='circle-o'
              checked={this.props.statepredefinedlicenses[rowID].checked}
              containerStyle={styles.checkView}
              onPress={() => this.itemSelected(data, rowID)}
         />
 			</TouchableOpacity>
 		);
 	}
  
  _renderPickerSeparator(sectionID, rowID) {
		return (
			<View key={`${sectionID}-${rowID}`}>
				<Separator color={"#F3F3F3"} width={VIEWPORT.width} height={1}/>
			</View>
		); 
  }

  itemSelected(data, rowID) {
    const statepredefinedlicenses = this.props.statepredefinedlicenses
    statepredefinedlicenses[rowID].checked = !statepredefinedlicenses[rowID].checked
    this.setState({statepredefinedlicenses: statepredefinedlicenses})
  }

  render () {
    const { visible, closeModal, statepredefinedlicenses,  } = this.props;
    const ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    const pickerdataSource =  ds1.cloneWithRows(this.props.statepredefinedlicenses)
    return (
      <Modal 
        animationType={'none'}
        transparent={true}
        visible={this.props.visible}>
        <View style={styles.addLicenseModalContainer}>
          <View style={styles.modalNavBar}>
            <View style={styles.leftView}>
            </View>
            <View style={styles.centerView}>
              <Text style={styles.namestyle}>
                Select License Type
              </Text>
            </View>
            <View style={styles.rightView}>
              <TouchableOpacity onPress={()=> closeModal()}>
                <Text style={styles.confirmBtn}>
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <SearchBar
            lightTheme
            placeholder='Search'
            containerStyle={styles.searchBarContainer}
            inputStyle={styles.searchInput}
            icon={{ color: '#9B9B9B' }}
          />
          <View>
            <ListView
              dataSource={pickerdataSource}
              renderRow={this.renderPickerRow.bind(this)}
              renderSeparator={this._renderPickerSeparator.bind(this)} 
              style={styles.pickerList}/>                 
          </View>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  flexible: {
    flexGrow: 1
  },
  listContainer: {
    width: VIEWPORT.width,
    height: dynamicSize(80),
    backgroundColor: 'white',
    justifyContent: 'center'
  },
  namestyle: {
    marginLeft: dynamicSize(15),
    fontSize: getFontSize(18),
    color: '#6E717C'
  },
  typestyle: {
    marginLeft: dynamicSize(15),
    fontSize: getFontSize(14),
    color: '#6E717C'
  },
  addText: {
    fontSize: getFontSize(18),
    color: 'white'
  },
  addLicenseModalContainer: {
    width: VIEWPORT.width,
    height: VIEWPORT.height,  
    backgroundColor: 'white'
  },
  modalNavBar: {
     width: VIEWPORT.width,
     height: NAVIGATOR_HEIGHT + STATUS_BAR_HEIGHT,
     paddingTop: STATUS_BAR_HEIGHT,
     justifyContent: 'center',
     alignItems: 'center',
     shadowColor: '#000000', 
     shadowOpacity: 0.8, 
     shadowRadius: 1,
     shadowOffset: { width: 0, height: 1 }, 
     flexDirection: 'row'
  },
  leftView: {
    width: dynamicSize(50),
    height: NAVIGATOR_HEIGHT + STATUS_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerView: {
    width: VIEWPORT.width - dynamicSize(100),
    height: NAVIGATOR_HEIGHT + STATUS_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightView: {
    width: dynamicSize(50),
    height: NAVIGATOR_HEIGHT + STATUS_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmBtn: {
    fontSize: getFontSize(14),
    color: '#e8003f'
  },
  pickerList: {
     marginTop: dynamicSize(10)
  },
  pickerlistContainer: {
     width: VIEWPORT.width,
     height: dynamicSize(80),
     backgroundColor: 'white',
     flexDirection: 'row',
     justifyContent: 'center'
  },
  pickerLeftView: {
     width: VIEWPORT.width - dynamicSize(50),
     height: dynamicSize(80),
     justifyContent: 'center',
     marginLeft: dynamicSize(20)
  },
  searchBarContainer: {
    width: VIEWPORT.width,
    backgroundColor: '#C9C9CE'
  },
  checkView: {
    width: dynamicSize(50), 
    backgroundColor: 'transparent', 
    borderWidth: 0
  },
  searchInput: {
    textAlign: 'center',
    backgroundColor: 'white'
  },
})

LicenseModal.propTypes = {

}
