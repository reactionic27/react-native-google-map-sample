import { auth } from '../constants/firebase'
import { LOGOUT, RECEIVE_PROFILE } from '../constants/actionsTypes'
import { changeAppRoot } from './initAC'
import * as navStates from '../constants/NavState'
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../../config'

export function logoutAction () {
  return {
    type: LOGOUT
  }
}

export function receiveProfile (profile) {
  return {
    type: RECEIVE_PROFILE,
    profile
  }
}

export function logout () {
  return function * (dispatch, getState) {
    // onDisconnect()
    dispatch(logoutAction())
    yield auth.signOut()
  }
}

export function authWithToken (profile, token) {
  return function * (dispatch, getState) {
    try {
      dispatch(changeAppRoot(navStates.NAV_ROOT_LOADING))
      dispatch(receiveProfile(profile))

      const formBody = []
      formBody.push(encodeURIComponent('api_type') + '=' + encodeURIComponent('firebase'))
      formBody.push(encodeURIComponent('client_id') + '=' + encodeURIComponent(AUTH0_CLIENT_ID))
      formBody.push(encodeURIComponent('grant_type') + '=' + encodeURIComponent('urn:ietf:params:oauth:grant-type:jwt-bearer'))
      formBody.push(encodeURIComponent('id_token') + '=' + encodeURIComponent(token.idToken))
      const body = formBody.join('&')
      const request = new XMLHttpRequest()
      const url = `https://${AUTH0_DOMAIN}/delegation`
      request.open('POST', url, true)
      request.setRequestHeader('Accept', 'application/json')
      request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
      request.onreadystatechange = (e) => {
        if (request.readyState !== 4) {
          return
        }

        if (request.status === 200) {
          const result = JSON.parse(request.responseText)
          try {
            auth.signInWithCustomToken(result.id_token)
          } catch (er) {
            console.warn(er)
            dispatch(changeAppRoot(navStates.NAV_ROOT_LOADING))
          }
        } else {
          console.warn('error', request)
          dispatch(changeAppRoot(navStates.NAV_ROOT_LOADING))
        }
      }
      request.send(body)
    } catch (err) {
      console.log('getDelegationToken error', err)
    }
  }
}
