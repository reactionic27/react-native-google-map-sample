import * as types from '../constants/actionsTypes.js'

const initialState = {}

export default function reducer (state = initialState, action = '') {
  switch (action.type) {
    case types.RECEIVE_PROFILE:
      return action.profile
    case types.LOGOUT:
      return initialState
    default :
      return state
  }
}
