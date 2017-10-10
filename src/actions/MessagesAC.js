import {
  RECEIVE_MESSAGE,
  REMOVE_MESSAGE,
  REPLACE_UNSENT_TO_DELIVERED
} from '../constants/actionsTypes'

export function receiveMessage (message) {
  return {
    type: RECEIVE_MESSAGE,
    message
  }
}

export function removeMessage (message) {
  return {
    type: REMOVE_MESSAGE,
    message
  }
}
