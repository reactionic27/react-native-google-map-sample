import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  ListView,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
import { SearchBar } from 'react-native-elements'
import screens from '../constants/Screens'
import { NAVIGATOR_HEIGHT, STATUS_BAR_HEIGHT, VIEWPORT } from '../constants'
import Separator from '../components/Separator'
import { dynamicSize, getFontSize } from '../utils/DynamicSize'
import * as _ from 'lodash'
import { createChannel } from '../controllers/ChatProcessor'

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

class Channels extends Component {
  constructor (props) {
    super(props)

    const ds = new ListView.DataSource({
			rowHasChanged: (row1, row2) => row1 !== row2,
		})
    this.state = {
      channleList:  ds.cloneWithRows(this.props.channels),
    }
  }

  renderRow (data, sectionID, rowID) {
    return (
      <TouchableOpacity 
            style={styles.channelListContainer}
            onPress={() => this.goChat(data, rowID)}
      >
        <View style={styles.pickerLeftView}>
          <Text style={styles.namestyle}>
            {data.id}
          </Text>
          <Text style={styles.phonenumberstyle}>
            {data.phoneNumber}
          </Text>
        </View>
			</TouchableOpacity>
    )
  }

  _renderSeparator(sectionID, rowID) {
		return (
			<View key={`${sectionID}-${rowID}`}>
				<Separator color={"#C3C2C7"} width={VIEWPORT.width} height={1}/>
			</View>
		); 
	}

  goChat(data, rowID) {
    const { dispatch, navigator } = this.props
    dispatch(createChannel(data.id))
    const channels = this.props.channels
    const channelDetail = _.values(channels)
    navigator.push({
      screen: screens.CHAT,
      title: 'Chat',
      backButtonTitle: ' ',
      navigatorStyle: {
        navBarHidden: false
      },
      passProps: {
        channelId: channelDetail[rowID].channelId
      }
    })
  }

  render () {
    const users = this.props.users
    _.unset(users, this.props.user.id)
    const dataSource = ds.cloneWithRows(_.values(users))
    return (
      <View style={styles.flexible}>
        <View style={styles.searchView}>
            <SearchBar
              lightTheme
              placeholder='Search'
              containerStyle={styles.searchBarContainer}
              inputStyle={styles.searchInput}
              icon={{ color: '#9B9B9B' }}
            />
        </View>
        <ScrollView>
          <View style={styles.container}>
            <ListView
              dataSource={dataSource}
              renderRow={this.renderRow.bind(this)}
              renderSeparator={this._renderSeparator.bind(this)} 
            />
          </View>
        </ScrollView>
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
  searchView: {
    width: VIEWPORT.width,
  },
  searchBarContainer: {
    width: VIEWPORT.width,
    backgroundColor: '#C9C9CE'
  },
  searchInput: {
    textAlign: 'center',
    backgroundColor: 'white'
  },
  navBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOffset: {
      height: 1,
      width: 0
    },
    shadowRadius: 1,
    shadowColor: '#000000',
    shadowOpacity: 0.4,
    height: NAVIGATOR_HEIGHT,
    zIndex: 1
  },
  navTitle: {
    fontSize: 14,
    color: '#4A4A4A',
    fontWeight: '300',
    flexGrow: 4,
    textAlign: 'center'
  },
  container: {
    flexGrow: 1,
    height: VIEWPORT.height - NAVIGATOR_HEIGHT - STATUS_BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'stretch'
  },
  channelListContainer: {
    width: VIEWPORT.width,
    height: dynamicSize(60),
    justifyContent: 'center'
  },
  namestyle: {
    marginLeft: dynamicSize(15),
    fontSize: getFontSize(18),
    color: '#6E717C'
  },
  phonenumberstyle: {
    marginLeft: dynamicSize(15),
    fontSize: getFontSize(14),
    color: '#6E717C'
  }
})

Channels.navigatorStyle = {
  navBarHidden: false,
  statusBarBlur: false
}

Channels.defaultProps = {
  channels: [
    {
      name: 'Klass Heinrich',
      phoneNumber: '+15005550006',
    },
    {
      name: 'Rich Vann',
      phoneNumber: '+79092290305',
    },
    {
      name: 'Shelley Nash',
      phoneNumber: '+13109009941',
    },
    {
      name: 'Noel Mason',
      phoneNumber: '+15743190275',
    },
    {
      name: 'Kenny Davis',
      phoneNumber: '+15005550004',
    },
    {
      name: 'Estelle Moreno',
      phoneNumber: '+15005550004',
    },
    {
      name: 'Jeannie Harris',
      phoneNumber: '+15005550006',
    },
  ]
}

Channels.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigator: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  users: PropTypes.object.isRequired,
  channels: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  users: state.users,
  user: state.user,
  channels: state.channels
})

export default connect(mapStateToProps)(Channels)
