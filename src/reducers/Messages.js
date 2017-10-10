import * as types from '../constants/actionsTypes.js'
import * as _ from 'lodash'

const initialState = {}

export default function reducer (state = initialState, action = '') {
  let newState

  switch (action.type) {

    case types.RECEIVE_MESSAGE:
      return _.set(_.assign({}, state), [action.message.channelId, action.message.id], action.message)

    case types.REMOVE_MESSAGE:
      newState = _.assign({}, state)
      _.unset(newState, [action.message.channelId, action.message.id])
      return newState

    case types.LOGOUT:
      return initialState

    default :
      return state
  }
}
