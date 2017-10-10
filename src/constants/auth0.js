import Auth0Lock from 'react-native-lock'
import Auth0 from 'react-native-auth0'
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from '../../config'

export const lock = new Auth0Lock({clientId: AUTH0_CLIENT_ID, domain: AUTH0_DOMAIN})

const auth0 = new Auth0(AUTH0_DOMAIN)
export const authentication = auth0.authentication(AUTH0_CLIENT_ID)
