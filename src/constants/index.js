import {
  Dimensions,
  Navigator
} from 'react-native'

export const NAVIGATOR_HEIGHT = Navigator.NavigationBar.Styles.General.NavBarHeight
export const VIEWPORT = Dimensions.get('window')
export const SUBMIT_BUTTON_HEIGHT = VIEWPORT.height * 0.082
export const STATUS_BAR_HEIGHT = 20
export const STATUS_BAR_COLOR = '#EEEEEE'
export const FREE_HEIGHT = VIEWPORT.height - NAVIGATOR_HEIGHT - SUBMIT_BUTTON_HEIGHT - STATUS_BAR_HEIGHT
