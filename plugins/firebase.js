import * as firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
if (!firebase.apps.length) {
  const config = {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: ''
  }
  firebase.initializeApp(config)
}
export default ({ store, user }) => {
  store.dispatch('loadMeetups')
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      store.dispatch('autoSignIn', user)
      store.dispatch('fetchUserData')
    }
  })
}
