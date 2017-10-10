import * as types from '../constants/actionsTypes.js'
import * as _ from 'lodash'

const initialState = {}

export default function reducer (state = initialState, action = '') {
  switch (action.type) {
    case types.RECEIVE_PATH:
      return {
        [action.filename]: action.filepath,
        ...state
      }
    case types.DELETE_PATH:
      const newState = _.assign({}, state)
      _.unset(newState, action.filename)
      return newState
    default :
      return state
  }
}
