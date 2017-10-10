import { AsyncStorage } from 'react-native'
import * as _ from 'lodash'
import { receiveMessage } from '../actions/MessagesAC'
import messageKinds from '../constants/MessageKinds'
import Sender from './Sender'
import {
  addImageToCache,
  filepathByFilename,
  documentFilepathByFilename,
  fileExists,
  deleteFile,
  downloadToCache,
  downloadToCacheAudio
} from '../utils/Cache'
import { receivePath, deletePath } from '../actions/CacheAC'
import RNFS from 'react-native-fs'
import deliveryStatus from '../constants/MessageDeliveryStatus'
import generate from 'firebase-auto-ids'
import { ref } from '../constants/firebase'
import firebase from 'firebase'

function makeCacheKey (userId) {
  return `unsent_${userId}`
}

export function * clearCache (userId) {
  yield AsyncStorage.removeItem(makeCacheKey(userId))
}

function * addMesageToCache (m) {
  try {
    const key = makeCacheKey(m.userId)
    const curMessagesRaw = yield AsyncStorage.getItem(key)
    let messages = JSON.parse(curMessagesRaw)
    if (!messages) messages = {}
    _.set(messages, m.id, m)
    const value = JSON.stringify(messages)
    yield AsyncStorage.setItem(key, value)
    return true
  } catch (e) {
    console.warn('add message to cache error:', e)
    return false
  }
}

export function * removeMessageFromCache (userId, messageId) {
  try {
    const key = makeCacheKey(userId)
    const curMessagesRaw = yield AsyncStorage.getItem(key)
    let messages = JSON.parse(curMessagesRaw)
    if (!messages) messages = {}
    _.unset(messages, messageId)
    const value = JSON.stringify(messages)
    yield AsyncStorage.setItem(key, value)
  } catch (e) {
    console.warn('remove message to cache error:', e)
  }
}

export function sendTextMessage (channelId, text, friendId) {
  return function * (dispatch, getState) {
    const state = getState()
    const user = state.user
    const messageId = generate(_.now)
    const message = {
      id: messageId,
      channelId,
      kind: messageKinds.TEXT,
      body: text,
      createdAt: _.now(),
      userId: user.id,
      deliveryStatus: deliveryStatus.UNSENT,
      attributes: {},
      to: friendId
    }
    const isAddedToCache = yield addMesageToCache(message)
    if (isAddedToCache) {
      dispatch(receiveMessage(message))
      const s = new Sender(message)
      s.run()
    }
  }
}

export function sendImageMessage (channelId, image, friendId) {
  return function * (dispatch, getState) {
    const state = getState()
    const user = state.user
    const messageId = generate(_.now)
    const timeNow = _.now()
    const imageId = timeNow + '_' + state.user.phoneNumber
    const filename = imageId + '.' + _.split(image.mime, '/')[1]
    yield addImageToCache(filename, image.data)
    const message = {
      id: messageId,
      channelId,
      kind: messageKinds.IMAGE,
      body: '',
      createdAt: timeNow,
      userId: user.id,
      attributes: {
        filename,
        mime: image.mime,
        imageId: imageId
      },
      deliveryStatus: deliveryStatus.UNSENT,
      to: friendId
    }
    const isAddedToCache = yield addMesageToCache(message)
    if (isAddedToCache) {
      const filepath = filepathByFilename(filename)
      dispatch(receivePath(filename, filepath))
      dispatch(receiveMessage(message))
      const s = new Sender(message)
      s.run()
    }
  }
}

export function sendAudioMessage (channelId, filepath, friendId) {
  return function * (dispatch, getState) {
    const state = getState()
    const user = state.user
    const messageId = generate(_.now)
    const timeNow = _.now()
    const audioId = _.now() + '_' + state.user.phoneNumber
    const pathAr = _.split(filepath, '/')
    const filename = pathAr[pathAr.length - 1]
    const newFilename = audioId + '.aac'
    const documentFilepath = documentFilepathByFilename(filename)
    const cacheFilepath = filepathByFilename(newFilename)
    const fileExistsRes = yield fileExists(documentFilepath)
    if (fileExistsRes) {
      try {
        yield RNFS.moveFile(documentFilepath, cacheFilepath)
      } catch (e) {
        console.warn('moveFile error', e)
      }
      const contentType = 'audio/aac'
      const message = {
        id: messageId,
        channelId,
        kind: messageKinds.AUDIO,
        body: 'Audio',
        createdAt: timeNow,
        userId: user.id,
        attributes: {
          filename: newFilename,
          mime: contentType,
          audioId: audioId
        },
        deliveryStatus: deliveryStatus.UNSENT,
        to: friendId
      }
      const isAddedToCache = yield addMesageToCache(message)
      if (isAddedToCache) {
        dispatch(receivePath(newFilename, cacheFilepath))
        dispatch(receiveMessage(message))
        const s = new Sender(message)
        s.run()
      }
    } else {
      console.warn('can`t send audio file: file does not exist')
    }
  }
}

export function initMessageProcessor (userId) {
  return function * (dispatch, getState) {
    try {
      // fetch messages from cache
      const key = makeCacheKey(userId)
      const messagesRaw = yield AsyncStorage.getItem(key)
      if (messagesRaw) {
        const messages = JSON.parse(messagesRaw)
        for (const mId in messages) {
          const m = messages[mId]
          dispatch(receiveMessage(m))
          const s = new Sender(m)
          s.run()
        }
      }
    } catch (e) {
      console.log('initMessageProcessor error:', e)
    }
  }
}

export function markMessageAsRead (m) {
  return function * (dispatch, getState) {
    try {
      yield ref.child('channels').child(m.channelId).child('messages').child(m.id).child('deliveryStatus').set(deliveryStatus.READ)
    } catch (e) {
      console.log('markMessageAsRead error', e)
    }
  }
}

export function updateTyping (channelId, userId) {
  return function * (dispatch, getState) {
    yield ref.child('channels').child(channelId).child('info/typing').child(userId).set(firebase.database.ServerValue.TIMESTAMP)
  }
}

export function updateCache (filename, url, isAudio = false) {
  return function * (dispatch, getState) {
    if (url) {
      const filepath = filepathByFilename(filename)
      const fileExistsRes = yield fileExists(filepath)
      if (fileExistsRes) {
        dispatch(receivePath(filename, filepath))
      } else {
        let res
        if (isAudio) {
          res = yield downloadToCacheAudio(filename, url)
        } else {
          res = yield downloadToCache(filename, url)
        }
        if (res) {
          dispatch(receivePath(filename, filepath))
        }
      }
    }
  }
}


export function refreshCache (filename, url, isAudio = false) {
  return function * (dispatch, getState) {
    if (url) {
      const filepath = filepathByFilename(filename)
      dispatch(deletePath(filename))
      yield deleteFile(filepath)
      dispatch(updateCache(filename, url, isAudio))
    }
  }
}
