import co from 'co'
import { removeMessageFromCache } from './MessageProcessor'
import messageKinds from '../constants/MessageKinds'
import RNFetchBlob from 'react-native-fetch-blob'
import { storageRef, ref } from '../constants/firebase'
import { filepathByFilename } from '../utils/Cache'
import deliveryStatus from '../constants/MessageDeliveryStatus'
import firebase from 'firebase'
import * as _ from 'lodash'

const PERIOD = 1000

const Blob = RNFetchBlob.polyfill.Blob
const File = RNFetchBlob.polyfill.File

window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = RNFetchBlob.polyfill.Blob

export default class Sender {
  constructor (message) {
    this.message = message
  }

  * addNotification (m) {
    if (m.to) {
      const notifyData = {
        from: m.userId,
        to: m.to,
        channelId: m.channelId,
        kind: m.kind,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        body: m.body
      }
      yield ref.child('notify').child(m.id).set(notifyData)
    }
  }

  run () {
    const self = this
    const m = _.assign({}, this.message)
    co(function * () {
      let path
      try {
        switch (m.kind) {

          case messageKinds.TEXT:
            yield ref.child('channels').child(m.channelId).child('messages').child(m.id).update(m)
            // m.deliveryStatus = deliveryStatus.DELIVERED
            // m.deliveredAt = firebase.database.ServerValue.TIMESTAMP
            yield ref.child('channels').child(m.channelId).child('messages').child(m.id).update(m)
            yield removeMessageFromCache(m.userId, m.id)
            yield self.addNotification(m)
            break

          case messageKinds.IMAGE:
            const imageId = m.attributes.imageId
            const mime = m.attributes.mime
            path = filepathByFilename(m.attributes.filename)
            const rnfbURI = RNFetchBlob.wrap(path)
            const blobImg = yield Blob.build(rnfbURI, {type: mime + ';base64'})
            const snapshot = yield storageRef.child('chat').child(imageId).put(blobImg, { contentType: mime })
            const downloadURL = snapshot.downloadURL
            yield ref.child('channels').child(m.channelId).child('messages').child(m.id).update(m)
            m.attributes.url = downloadURL
            // m.deliveryStatus = deliveryStatus.DELIVERED
            // m.deliveredAt = firebase.database.ServerValue.TIMESTAMP
            yield ref.child('channels').child(m.channelId).child('messages').child(m.id).update(m)
            yield removeMessageFromCache(m.userId, m.id)
            yield self.addNotification(m)
            break

          case messageKinds.AUDIO:
            const audioId = m.attributes.audioId
            const contentType = m.attributes.mime
            const filename = m.attributes.filename
            path = filepathByFilename(filename)
            const data = yield RNFetchBlob.fs.readFile(path, 'base64')
            if (data) {
              const file = yield File.build(filename, data, {type: contentType})
              const snapshot = yield storageRef.child('chat').child(audioId).put(file, { contentType: contentType })
              const downloadURL = snapshot.downloadURL
              yield ref.child('channels').child(m.channelId).child('messages').child(m.id).update(m)
              m.attributes.url = downloadURL
              // m.deliveryStatus = deliveryStatus.DELIVERED
              // m.deliveredAt = firebase.database.ServerValue.TIMESTAMP
              yield ref.child('channels').child(m.channelId).child('messages').child(m.id).update(m)
              yield removeMessageFromCache(m.userId, m.id)
              yield self.addNotification(m)
            } else {
              console.log('no data in cache')
            }
            break

          default:
            console.log('can`t send the message with kind', m.kind)
        }
      } catch (e) {
        switch (e.code) {
          case 'storage/unknown':
            setTimeout(self.run, PERIOD)
            break
          default:
            yield removeMessageFromCache(m.userId, m.id)

        }
      }
    }).catch((error) => {
      setTimeout(this.process, PERIOD)
    })
  }

}
