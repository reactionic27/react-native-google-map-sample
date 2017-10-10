import configureStore from './store'
import { Provider } from 'react-redux'
import { AlertIOS } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { appInitialized } from './actions/initAC'
import { NAV_ROOT_AUTH, NAV_ROOT_MAIN, NAV_ROOT_LOADING } from './constants/NavState'
import screens from './constants/Screens'
const store = configureStore()
import FCM from 'react-native-fcm'
import { receiveFcmToken } from './actions/FCMTokenAC'

import { registerScreens } from './containers'
registerScreens(store, Provider)

// notice that this is just a simple class, it's not a React component
export default class App {
  constructor () {
    this.updateId = 0
    // since react-redux only works on components, we need to subscribe this class manually
    store.subscribe(this.onStoreUpdate.bind(this))
    store.dispatch(appInitialized())

    FCM.requestPermissions()
    FCM.getFCMToken().then(token => {
      if (token) store.dispatch(receiveFcmToken(token))
        // store fcm token in your server
    })
    this.notificationUnsubscribe = FCM.on('notification', (notif) => {
      // AlertIOS.alert(
      //     'Notification',
      //     // notif.aps.alert,
      //     notif.notification.body,
      //     [{text: 'OK', onPress: () => console.log('OK Pressed!')}]
      // )
      // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
    })
    this.refreshUnsubscribe = FCM.on('refreshToken', (token) => {
      if (token) store.dispatch(receiveFcmToken(token))
      // fcm token may not be available on first load, catch it here
    })

  }

  onPushNotificationRegister (deviceToken) {
  //  setDeviceToken(deviceToken)
    // AlertIOS.alert(
    //   'Registered For Remote Push',
    //   `Device Token: ${deviceToken}`,
    //   [{
    //     text: 'Dismiss',
    //     onPress: null
    //   }]
    // )
  }

  _onRegistrationError (error) {
    AlertIOS.alert(
      'Failed To Register For Remote Push',
      `Error (${error.code}): ${error.message}`,
      [{
        text: 'Dismiss',
        onPress: null
      }]
    )
  }

  _onRemoteNotification (notification) {
    AlertIOS.alert(
      'Push Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null
      }]
    )
  }

  _onLocalNotification (notification) {
    AlertIOS.alert(
      'Local Notification Received',
      'Alert message: ' + notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null
      }]
    )
  }

  onStoreUpdate () {
    const { root, updateId } = store.getState().app
    // handle a root change
    // if your app doesn't change roots in runtime, you can remove onStoreUpdate() altogether
    if (this.currentRoot !== root || this.updateId !== updateId) {
      this.currentRoot = root
      this.updateId = updateId
      this.startApp(root)
    }
  }

  startApp (root) {
    switch (root) {
      case NAV_ROOT_LOADING:
        Navigation.startSingleScreenApp({
          screen: {
            screen: screens.LOADING
          }
        })
        return

      case NAV_ROOT_AUTH:
        Navigation.startSingleScreenApp({
          screen: {
            screen: screens.AUTH
          }
        })
        return

      case NAV_ROOT_MAIN:
        Navigation.startTabBasedApp({
          tabs: [
            {
              label: 'Find Contractor', // tab label as appears under the icon in iOS (optional)
              screen: screens.FIND_CONTRACTOR, // unique ID registered with Navigation.registerScreen
              icon: require('./assets/images/search-icon.png'), // local image asset for the tab icon unselected state (optional on iOS)
              selectedIcon: require('./assets/images/search-icon.png'), // local image asset for the tab icon selected state (optional, iOS only. On Android, Use `tabBarSelectedButtonColor` instead)
              title: 'Find a Sub contractor', // title of the screen as appears in the nav bar (optional)
              navigatorStyle: {
                navBarTextColor: '#4A4A4A',
              }, // override the navigator style for the tab screen, see "Styling the navigator" below (optional),
              // navigatorButtons: {} // override the nav buttons for the tab screen, see "Adding buttons to the navigator" below (optional)
            },
            {
              label: 'Messages',
              screen: screens.CHANNELS,
              icon: require('./assets/images/message-icon.png'),
              selectedIcon: require('./assets/images/message-icon.png'),
              title: 'Users',
              navigatorStyle: {
                navBarTextColor: '#4A4A4A',
              }
            },
            {
              label: 'Profile',
              screen: screens.PROFILE,
              icon: require('./assets/images/account-icon.png'),
              selectedIcon: require('./assets/images/account-icon.png'),
              title: 'Settings',
              navigatorStyle: {
                navBarTextColor: '#4A4A4A',
              }
            },
          ],
          tabsStyle: { // optional, add this if you want to style the tab bar beyond the defaults
            tabBarButtonColor: '#D8D8D8', // optional, change the color of the tab icons and text (also unselected)
            tabBarSelectedButtonColor: '#FC5C64', // optional, change the color of the selected tab icon and text (only selected)
            tabBarBackgroundColor: '#F9F9F9', // optional, change the background color of the tab bar
          },
          passProps: {}, // simple serializable object that will pass as props to all top screens (optional)
          animationType: 'fade' // optional, add transition animation to root change: 'none', 'slide-down', 'fade'
        })
        return

      default:
        console.error('Unknown app root')
    }
  }
}
