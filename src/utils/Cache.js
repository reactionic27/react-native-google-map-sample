import RNFS from 'react-native-fs'
import * as _ from 'lodash'
import RNFetchBlob from 'react-native-fetch-blob'

const CACHE_PATH = RNFS.CachesDirectoryPath + '/'
const DOCUMENT_PATH = RNFS.DocumentDirectoryPath + '/'

export function filepathByFilename (filename) {
  return CACHE_PATH + filename
}

export function documentFilepathByFilename (filename) {
  return DOCUMENT_PATH + filename
}


export function * printCache () {
  const files = yield RNFS.readDir(CACHE_PATH)
}

export function * printDocument () {
  const files = yield RNFS.readDir(DOCUMENT_PATH)
}

export function * addImageToCache (filename, image) {
  const filepath = CACHE_PATH + filename
  try {
    yield RNFS.writeFile(filepath, image, 'base64')
  } catch (e) {
    console.log('FAIL: addImage to cache', filename, 'error', e)
  }
}

export function * addAudioToCache (filename, audio) {
  const filepath = CACHE_PATH + filename
  try {
    yield RNFS.writeFile(filepath, audio, 'base64')
  } catch (e) {
    console.log('FAIL: addaddAudio to cache', filename, 'error', e)
  }
}

export function * getFilepath (filename) {
  const filepath = CACHE_PATH + filename
  try {
    const isExists = yield RNFS.exists(filepath)
    if (isExists) {
      return filepath
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}

export function * downloadToCache (filename, url) {
  try {
    const filepath = filepathByFilename(filename)
    const options = {
      fromUrl: url,          // URL to download file from
      toFile: filepath,           // Local filesystem path to save the file to
      // headers?: Headers;        // An object of headers to be passed to the server
      // background?: boolean;
      progressDivider: 10,
      begin: (res) => {
        console.log('------> download begin', res)
      },
      progress: (res) => {
        console.log('------> download progress', res)
      }
    }
    const downloadRes = yield RNFS.downloadFile(options)
    return true
  } catch (e) {
    return false
  }
}

export function * downloadToCacheAudio (filename, url) {
  try {
    const filepath = filepathByFilename(filename)
    const res = yield RNFetchBlob.fetch('GET', url)
    yield addAudioToCache(filename, res.data)
    return true
  } catch (e) {
    return false
  }
}

export function * readFileFromDocuments (filename) {
  const filepath = DOCUMENT_PATH + filename
  try {
    const isExist = yield RNFS.exists(filepath)
    if (isExist) {
      const res = yield RNFS.readFile(filepath, 'base64')
      return res
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}

export function * clearAudioCache () {
  const files = yield RNFS.readDir(CACHE_PATH)
  for (let file of files) {
    const ext = _.split(file.name, '.')[1]
    if (ext && ext === 'aac') {
      yield RNFS.unlink(file.path)
    }
  }
}

export function * fileExists (filepath) {
  const res = yield RNFS.exists(filepath)
  return res
}

export function * deleteFile (filepath) {
  const fileExists = yield RNFS.exists(filepath)
  if (fileExists) {
    yield RNFS.unlink(filepath)
  }
}
