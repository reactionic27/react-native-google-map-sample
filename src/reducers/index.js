import { combineReducers } from 'redux'
import app from './App'
import user from './User'
import profile from './Profile'
import users from './Users'
import channels from './Channels'
import cache from './Cache'
import messages from './Messages'
import fcmToken from './FCMToken'

export default combineReducers({
  app,
  user,
  profile,
  users,
  channels,
  cache,
  messages,
  fcmToken
})
