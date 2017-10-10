import * as types from '../constants/actionsTypes.js'
import * as _ from 'lodash'

const initialState = {}

export default function reducer (state = initialState, action = '') {
  switch (action.type) {

    case types.RECEIVE_CHANNEL:
      return _.set(_.assign({}, state), action.channel.channelId, action.channel)

    case types.REMOVE_CHANNEL:
      const newState = _.assign({}, state)
      _.unset(newState, action.channelId)
      return newState

    case types.LOGOUT:
      return initialState

    case types.SET_LOADING_EARLIER:
      return _.set(_.assign({}, state), [action.channelId, 'loadingEarlier'], action.value)

    default :
      return state
  }
}
