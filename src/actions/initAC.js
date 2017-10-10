'use strict'
import { ref, auth } from '../constants/firebase'
import * as _ from 'lodash'
import * as types from '../constants/actionsTypes'
import * as navStates from '../constants/NavState'
import { lock } from '../constants/auth0'
import { authWithToken } from './authAC'
import { initChatProcessor, onDisconnectChatProcessor } from '../controllers/ChatProcessor'
import { receiveUsers, receiveUser } from './UserAC'
import firebase from 'firebase'

export function changeAppRoot (root, force = false) {
  return {
    type: types.ROOT_CHANGED,
    root: root,
    force
  }
}

export function userDefault (authData, phoneNumber) {
  return {
    id: phoneNumber,
    firebaseId: authData.uid,
    createdAt: firebase.database.ServerValue.TIMESTAMP
  }
}

function createDBUser (user) {
  ref.child('users').child(user.id).update(user)
}

export function initUser (authData) {
  return function * (dispatch, getState) {
    const state = getState()
    const uid = authData.uid
    let phoneNumber
    if (_.has(state, 'profile.extraInfo.phone_number')) {
      phoneNumber = state.profile.extraInfo.phone_number
      ref.child('phoneByUid').child(uid).set(phoneNumber)
    } else {
      const sn = yield ref.child('phoneByUid').child(uid).once('value')
      phoneNumber = sn.val()
    }

    if (phoneNumber) {
      const userSN = yield ref.child('users').child(phoneNumber).once('value')
      const user = userSN.val()
      if (!user) {
        const user = userDefault(authData, phoneNumber)
        createDBUser(user)
        dispatch(receiveUser(user))
      } else {
        yield ref.child('users').child(phoneNumber).child('firebaseId').set(uid)
        dispatch(receiveUser(user))
      }

      dispatch(changeAppRoot(navStates.NAV_ROOT_MAIN))
      dispatch(initChatProcessor(phoneNumber))

      // update users FCM token
      if (state.fcmToken) {
        yield ref.child('users').child(phoneNumber).child('fcmToken').set(state.fcmToken)
      }
    } else {
      console.error('there is no phone number')
    }
  }
}

export function fetchUsers () {
  return function * (dispatch, getState) {
    const usersSN = yield ref.child('users').once('value')
    const users = usersSN.val()
    if (users) {
      dispatch(receiveUsers(users))
    }
  }
}

export function appInitialized () {
  return function * (dispatch, getState) {
    dispatch(changeAppRoot(navStates.NAV_ROOT_LOADING))

    ref.child('.info/connected').on('value', (snap) => {
      if (snap.val() === true) {
        const user = getState().user
        if (user.id) dispatch(initChatProcessor(user.id))
      } else {
        onDisconnectChatProcessor()
      }
    })

    auth.onAuthStateChanged((authData) => {
      if (authData) {
        lock.hide(() => console.log('lock is hiden'))
        // dispatch(receiveAuthData(authData))
        dispatch(initUser(authData))
        dispatch(fetchUsers())
      } else {
        dispatch(changeAppRoot(navStates.NAV_ROOT_LOADING))
        lock.show({
          connections: ['sms']
        }, (err, profile, token) => {
          dispatch(authWithToken(profile, token))
        })
//        dispatch(changeAppRoot(navStates.NAV_ROOT_AUTH))
      //  dispatch(logout())
      }
    })
  }
}
