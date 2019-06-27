import * as firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
if (!firebase.apps.length) {
  const config = {
    apiKey: 'AIzaSyAfIVf0kXDx-4PXCDZeaaBXLd-mb_9bPNE',
    authDomain: 'vuejs-567f0.firebaseapp.com',
    databaseURL: 'https://vuejs-567f0.firebaseio.com',
    projectId: 'vuejs-567f0',
    storageBucket: 'gs://vuejs-567f0.appspot.com/',
    messagingSenderId: '555371730640'
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
