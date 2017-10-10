import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ListView,
  Modal,
  StatusBar,
  TouchableOpacity,
} from 'react-native'
import { connect } from 'react-redux'
import { SearchBar, CheckBox } from 'react-native-elements'
import screens from '../constants/Screens'
import { NAVIGATOR_HEIGHT, STATUS_BAR_HEIGHT, STATUS_BAR_COLOR, VIEWPORT } from '../constants'
import { dynamicSize, getFontSize } from '../utils/DynamicSize'
import Separator from '../components/Separator'
import LicenseModal from '../components/LicenseModal'

class License extends Component {

  static navigatorButtons = {
    rightButtons: [
      {
        icon: require('../assets/images/bluePlus.png'),
        id: 'add'
      },
    ]
  };

  constructor (props) {
    super(props)
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this.state = {
      stateLicenses: this.props.licenses,
      statepredefinedlicenses: this.props.predefinedlicenses,
      addLicenseModalVisible: false,
      licensevalueSelected: [],
    }
  }

  componentDidMount () {
    this.props.navigator.toggleTabs({
      to: 'hidden',
      animated: false
    })
  }

  componentWillReceiveProps (nextProps) {

  }

  componentWillUnmount () {
    this.props.navigator.toggleTabs({
      to: 'shown',
      animated: false
    })
  }

  onNavigatorEvent(event) {
    if (event.type == 'NavBarButtonPress') {
      if (event.id == 'add') {
          this.setState({addLicenseModalVisible: true})
      }
    }
  }

  renderRow(data, sectionID, rowID) {
		return (
			<View style={styles.listContainer}>
        <Text style={styles.namestyle}>
          {data.name}
        </Text>
        <Text style={styles.typestyle}>
          {data.type}
        </Text>
			</View>
		);
	}

  _renderSeparator(sectionID, rowID) {
		return (
			<View key={`${sectionID}-${rowID}`}>
				<Separator color={"#C3C2C7"} width={VIEWPORT.width} height={1}/>
			</View>
		);
	}

  confirmDone() {
    const tempLicenseArray = this.state.statepredefinedlicenses
    const selectedArray = []
    tempLicenseArray.map((value, i) => {
      if(value.checked){
        selectedArray.push(value)
      }
    })
    this.setState({
      stateLicenses: this.state.stateLicenses.concat(selectedArray),
      statepredefinedlicenses: this.props.predefinedlicenses,
      addLicenseModalVisible: false,
    })    
    const tempPreLicenseArray = this.state.statepredefinedlicenses
    const selectedPreArray = []
    tempPreLicenseArray.map((value, i) => {
      value.checked = false
    })
    this.setState({
      statepredefinedlicenses : tempPreLicenseArray
    })
  }

  render () {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    const dataSource =  ds.cloneWithRows(this.state.stateLicenses)
    return (
      <View style={styles.flexible}>
        <View>
          <ListView
            dataSource={dataSource}
            renderRow={this.renderRow.bind(this)}
            renderSeparator={this._renderSeparator.bind(this)} />
        </View>
        <LicenseModal
          visible={this.state.addLicenseModalVisible}
          closeModal={() => this.confirmDone()}
          statepredefinedlicenses={this.state.statepredefinedlicenses}/>
      </View>
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

License.defaultProps = {
  licenses: [
    {
      name: 'B-General Building',
      type: 'Contractor',
      checked: false
    },
    {
      name: 'C-10 Painting and Decorating',
      type: 'Building',
      checked: false
    },
    {
      name: 'C-9 Drywall',
      type: 'Electronic',
      checked: false
    },
    {
      name: 'C54- Tile',
      type: 'Ceramic and Mosaic',
      checked: false
    },
  ],
  predefinedlicenses: [
     {
       name: 'A-Name',
       type: 'A-Type',
       checked: false
     },
     {
       name: 'B-Name',
       type: 'B-Type',
       checked: false
     },
     {
       name: 'C-Name',
       type: 'C-Type',
       checked: false
     },
     {
       name: 'D-Name',
       type: 'D-Type',
       checked: false
     },
     {
       name: 'E-Name',
       type: 'E-Type',
       checked: false
     },
     {
       name: 'F-Name',
       type: 'F-Type',
       checked: false
     },
  ]  
}

License.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigator: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({

})
export default connect(mapStateToProps)(License)
