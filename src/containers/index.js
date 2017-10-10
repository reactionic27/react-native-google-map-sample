import { Navigation } from 'react-native-navigation'
import screens from '../constants/Screens'
import Auth from './Auth'
import Main from './Main'
import Menu from './Menu'
import Profile from './Profile'
import License from './License'
import ConnectSocial from './ConnectSocial'
import ContactInfo from './ContactInfo'
import ProfileView from './ProfileView'
import Loading from './Loading'
import FindContractor from './FindContractor'
import ContractorInfo from './ContractorInfo'
import Channels from './Channels'
import Chat from './Chat'
import ImageViewer from './ImageViewer'
import AudioRecorder from '../components/chat/AudioRecorder'

// register all screens of the app (including internal ones)
export function registerScreens (store, Provider) {
  Navigation.registerComponent(screens.AUTH, () => Auth, store, Provider)
  Navigation.registerComponent(screens.MAIN, () => Main, store, Provider)
  Navigation.registerComponent(screens.MENU, () => Menu, store, Provider)
  Navigation.registerComponent(screens.PROFILE, () => Profile, store, Provider)
  Navigation.registerComponent(screens.LICENSE, () => License, store, Provider)
  Navigation.registerComponent(screens.CONNECTSOCIAL, () => ConnectSocial, store, Provider)
  Navigation.registerComponent(screens.CONTACTINFO, () => ContactInfo, store, Provider)
  Navigation.registerComponent(screens.PROFILEVIEW, () => ProfileView, store, Provider)
  Navigation.registerComponent(screens.LOADING, () => Loading, store, Provider)
  Navigation.registerComponent(screens.FIND_CONTRACTOR, () => FindContractor, store, Provider)
  Navigation.registerComponent(screens.CONTRACTORINFO, () => ContractorInfo, store, Provider)
  Navigation.registerComponent(screens.CHANNELS, () => Channels, store, Provider)
  Navigation.registerComponent(screens.CHAT, () => Chat, store, Provider)
  Navigation.registerComponent(screens.IMAGE_VIEWER, () => ImageViewer, store, Provider)
  Navigation.registerComponent(screens.AUDIO_RECORDER, () => AudioRecorder, store, Provider)
}
