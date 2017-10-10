import React, { Component, PropTypes } from 'react'
import {
  ListView,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  View
} from 'react-native'
const SCREEN_HEIGHT = Dimensions.get('window').height
const noop = () => {}
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => (r1 !== r2)})

class ListPopover extends Component {

  constructor (props) {
    super(props)
    this.state = {
      dataSource: ds.cloneWithRows(props.list)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.list !== this.props.list) {
      this.setState({
        dataSource: ds.cloneWithRows(nextProps.list)
      })
    }
  }

  handleClick (data) {
    this.props.onClick(data)
    this.props.onClose()
  }

  renderRow (rowData) {
    const separatorStyle = this.props.separatorStyle || DefaultStyles.separator
    const rowTextStyle = this.props.rowText || DefaultStyles.rowText

    let separator = <View style={separatorStyle} />
    if (rowData === this.props.list[0]) {
      separator = null
    }

    let row = <Text style={rowTextStyle}>{rowData}</Text>
    if (this.props.renderRow) {
      row = this.props.renderRow(rowData)
    }

    return (
      <View>
        {separator}
        <TouchableOpacity onPress={() => this.handleClick(rowData)}>
          {row}
        </TouchableOpacity>
      </View>
    )
  }

  renderList () {
    let maxHeight = {}
    if (this.props.list.length > 12) {
      maxHeight = {height: SCREEN_HEIGHT * 3 / 4}
    }
    return (
      <ListView
        style={maxHeight}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => this.renderRow(rowData)}
        automaticallyAdjustContentInsets={false}
      />
    )
  }

  render () {
    const containerStyle = this.props.containerStyle || DefaultStyles.container
    const popoverStyle = this.props.popoverStyle || DefaultStyles.popover

    if (this.props.isVisible) {
      return (
        <TouchableOpacity onPress={this.props.onClose}>
          <View style={containerStyle}>
            <View style={popoverStyle}>
              {this.renderList()}
            </View>
          </View>
        </TouchableOpacity>
      )
    } else {
      return (<View />)
    }
  }
}

ListPopover.propTypes = {
  list: PropTypes.array.isRequired,
  isVisible: PropTypes.bool,
  onClick: PropTypes.func,
  onClose: PropTypes.func,
  separatorStyle: PropTypes.object,
  rowText: PropTypes.object,
  renderRow: PropTypes.func,
  containerStyle: PropTypes.object,
  popoverStyle: PropTypes.object
}

ListPopover.defaultProps = {
  list: [''],
  isVisible: false,
  onClick: noop,
  onClose: noop
}

const DefaultStyles = StyleSheet.create({
  container: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  popover: {
    margin: 10,
    borderRadius: 3,
    padding: 3,
    backgroundColor: '#ffffff'
  },
  rowText: {
    padding: 10
  },
  separator: {
    height: 0.5,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: '#CCC'
  }
})

export default ListPopover
