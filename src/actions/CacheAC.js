import { RECEIVE_PATH, DELETE_PATH } from '../constants/actionsTypes'

export function receivePath (filename, filepath) {
  return {
    type: RECEIVE_PATH,
    filename,
    filepath
  }
}

export function deletePath (filename) {
  return {
    type: DELETE_PATH,
    filename
  }
}
