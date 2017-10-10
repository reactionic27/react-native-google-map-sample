import { ref } from '../constants/firebase'
import * as _ from 'lodash'
import firebase from 'firebase'
import { receiveChannel, setLoadingEarlier } from '../actions/ChannelsAC'
import { receiveMessage } from '../actions/MessagesAC'
import { initMessageProcessor } from './MessageProcessor'

const INITIAL_MESSAGE_COUNT = 20
const listeners = []


export function initChatProcessor (userId) {
  return function * (dispatch, getState) {

    ref.child('users').child(userId).child('channels').on('child_added', (snapshot) => {
      const channelId = snapshot.key

      ref.child('channels').child(channelId).child('info').on('value', (channelInfoSN) => {
        const channelInfo = channelInfoSN.val()
        if (channelInfo) dispatch(receiveChannel(channelInfo))
      })
      listeners.push(ref.child('channels').child(channelId).child('info'))

      ref.child('channels').child(channelId).child('messages').orderByChild('createdAt').limitToLast(INITIAL_MESSAGE_COUNT).on('child_added', (messageSN) => {
        const m = messageSN.val()
        dispatch(receiveMessage(m))
      })
      listeners.push(ref.child('channels').child(channelId).child('messages').orderByChild('createdAt').limitToLast(INITIAL_MESSAGE_COUNT))

      ref.child('channels').child(channelId).child('messages').orderByChild('createdAt').limitToLast(INITIAL_MESSAGE_COUNT).on('child_changed', (messageSN) => {
        const m = messageSN.val()
        dispatch(receiveMessage(m))
      })
      listeners.push(ref.child('channels').child(channelId).child('messages').orderByChild('createdAt').limitToLast(INITIAL_MESSAGE_COUNT))
    })

    listeners.push(ref.child('users').child(userId).child('channels'))

    dispatch(initMessageProcessor(userId))
  }
}

export function createChannel (friendId) {
  return function * (dispatch, getState) {
    const state = getState()
    const user = state.user
    const friend = state.users[friendId]

    const userId = user.id
    let channelId = userId + '_' + friendId
    if (userId > friendId) channelId = friendId + '_' + userId

    if (true || !user.channels || !_.has(user.channels, channelId)) {
      const channel = {
        info: {
          channelId,
          createdAt: firebase.database.ServerValue.TIMESTAMP,
          members: {
            [user.id]: 1,
            [friend.id]: 0
          }
        }
      }
      yield ref.child('channels').child(channelId).update(channel)
      yield ref.child('users').child(user.id).child('channels').child(channelId).set(firebase.database.ServerValue.TIMESTAMP)
      yield ref.child('users').child(friend.id).child('channels').child(channelId).set(firebase.database.ServerValue.TIMESTAMP)
    }
  }
}

export function loadEarlier (channelId, currentCount) {
  return function * (dispatch, getState) {
    dispatch(setLoadingEarlier(channelId, true))
    try {
      const messagesSN =
        yield ref.child('channels').child(channelId).child('messages')
          .orderByChild('createdAt')
          .limitToLast(INITIAL_MESSAGE_COUNT + currentCount)
          .once('value')
      const messages = messagesSN.val()
      const state = getState()
      const storeMessages = state.messages[channelId]
      for (const mId in messages) {
        if (!_.has(storeMessages, mId)) dispatch(receiveMessage(messages[mId]))
      }
      dispatch(setLoadingEarlier(channelId, false))
    } catch (e) {
      dispatch(setLoadingEarlier(channelId, false))
    }
  }
}

export function onDisconnectChatProcessor () {
  for (const l of listeners) {
    l.off()
  }
  listeners2 = []
}
