import React, { Component, PropTypes } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ListView
} from 'react-native'

import { VIEWPORT } from '../../constants'
import Separator from '../Separator'
import { dynamicSize, getFontSize } from '../../utils/DynamicSize'
import screens from '../../constants/Screens'
const Chevron_Icon =  require('../../assets/images/RightChevron.png')

export default class ListContractors extends Component {

  constructor (props) {
    super(props)
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows(this.props.contractorInfo),
    }
  }

  showContractorInfo() {
    this.props.navigator.push({
      screen: screens.CONTRACTORINFO,
      title: 'Contractor Information',
      backButtonTitle: ' ',
      navigatorStyle: {
        navBarHidden: false
      }
    })
  }

  renderRow(data, sectionID, rowID) {
		return (
      <TouchableOpacity
            style={styles.listItemView}
            onPress={() => this.showContractorInfo()}
      >
          <View style={styles.userPhotoView}>
              <Image source={data.uri} style={styles.userImageView}/>
          </View>
          <View style={styles.listContentView}>
              <View>
                  <Text style={styles.companyNameText}>
                    {data.name}
                  </Text>
              </View>
              <View style={styles.horizontalView}>
                  <Text style={styles.addressText}>
                    {data.address}
                  </Text>
                  <Text style={styles.addressText}>
                    {data.licenseNumber}
                  </Text>
              </View>
              <View style={styles.horizontalView}>
                  <Text style={styles.addressText}>
                    Skills:
                  </Text>
                  <Text style={styles.detailText}>
                    {data.skill}
                  </Text>
              </View>
          </View>
          <View style={styles.chevronView}>
            <Image source={Chevron_Icon} style={styles.chevronImage}/>
          </View>
      </TouchableOpacity>
    );
	}

  _renderSeparator(sectionID, rowID) {
		return (
			<View key={`${sectionID}-${rowID}`}>
				<Separator color={"#C3C2C7"} width={VIEWPORT.width} height={1}/>
			</View>
		);
	}

  render () {
    return (
      <View style={styles.flexible}>
        <ListView
            dataSource={this.state.dataSource}
            renderRow={this.renderRow.bind(this)}
            renderSeparator={this._renderSeparator.bind(this)} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  flexible: {
    width: VIEWPORT.width,
    height: VIEWPORT.height
  },
  listItemView: {
    width: VIEWPORT.width,
    height: dynamicSize(140),
    flexDirection: 'row'
  },
  userPhotoView: {
    width: dynamicSize(80),
    height: dynamicSize(150),
    alignItems: 'center',
  },
  userImageView: {
    width: dynamicSize(60),
    height: dynamicSize(60),
    resizeMode: 'cover',
    borderRadius: dynamicSize(30),
    marginTop: dynamicSize(30)
  },
  listContentView: {
    width: VIEWPORT.width - dynamicSize(110),
    height: dynamicSize(170),
    flexDirection: 'column',
    marginTop: dynamicSize(10)
  },
  companyNameText: {
    fontSize: getFontSize(16),
    color: '#588BE7',
    marginTop: dynamicSize(5)
  },
  addressText: {
    fontSize: getFontSize(14),
    color: '#727272'
  },
  detailText: {
    fontSize: getFontSize(14),
    color: '#727272',
    marginLeft: dynamicSize(5),
    width: VIEWPORT.width - dynamicSize(140)
  },
  chevronView: {
    width: dynamicSize(30),
    height: dynamicSize(170),
    alignItems: 'center',
    marginTop: dynamicSize(50)
  },
  chevronImage: {
    width: dynamicSize(14),
    height: dynamicSize(24),
    resizeMode: 'contain',
  },
  spaceView: {
    width: VIEWPORT.width,
    height: dynamicSize(100),
  },
  horizontalView: {
    flexDirection: 'row'
  }
})

ListContractors.defaultProps = {
  contractorInfo: [
    {
      uri: require('../../assets/images/DefaultUser.png'),
      name: 'MAHER DEVELOPMENT INC',
      address: 'Los Angeles, CA',
      licenseNumber: 'CA_468612',
      skill: [ 
        'B General Building Contractor', 
        'C21 Building Moving', 
        'Demolition C2 Insulation and Acoustical C16 Fire Protection Contractor'
      ]
    },
    {
      uri: require('../../assets/images/user1.jpg'),
      name: "JOE'S CONSTRUCTION COMPANY",
      address: 'Los Angeles, CA',
      licenseNumber: 'CA_212112',
      skill: [ 
        'B General Building Contractor', 
        'C21 Building Moving', 
        'Demolition C2 Insulation and Acoustical C16 Fire Protection Contractor'
      ]
    },
    {
      uri: require('../../assets/images/user2.jpeg'),
      name: 'GOLDEN HAMMER',
      address: 'Los Angeles, CA',
      licenseNumber: 'CA_378491',
      skill: [ 
        'B General Building Contractor', 
        'C21 Building Moving', 
        'Demolition C2 Insulation and Acoustical C16 Fire Protection Contractor'
      ]
    },
  ]
}

ListContractors.propTypes = {

}
