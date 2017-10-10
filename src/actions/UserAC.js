import * as types from '../constants/actionsTypes'

export function receiveUser (user) {
  return {
    type: types.RECEIVE_USER,
    user
  }
}

export function receiveUsers (users) {
  return {
    type: types.RECEIVE_USERS,
    users
  }
}
