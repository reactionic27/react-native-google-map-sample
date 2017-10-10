import {
  RECEIVE_CHANNEL,
  REMOVE_CHANNEL,
  SET_LOADING_EARLIER
} from '../constants/actionsTypes'

export function receiveChannel (channel) {
  return {
    type: RECEIVE_CHANNEL,
    channel
  }
}

export function removeChannel (channel) {
  return {
    type: REMOVE_CHANNEL,
    sid: channel.channelId
  }
}

export function setLoadingEarlier (channelId, value) {
  return {
    type: SET_LOADING_EARLIER,
    channelId,
    value
  }
}
