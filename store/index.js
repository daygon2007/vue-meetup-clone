import Vuex from 'vuex'
import * as firebase from 'firebase'

export const state = () => ({
  sidebar: false
})

export const mutations = {
  toggleSidebar (state) {
    state.sidebar = !state.sidebar
  }
}

export const createStore = () => {
  return new Vuex.Store({
    state: {
      loadedMeetups: [],
      user: null,
      loading: false,
      error: null
    },
    mutations: {
      registerUserForMeetup (state, payload) {
        const id = payload.id
        if (state.user.registeredMeetups.findIndex(meetup => meetup.id === id) >= 0) {
          return
        }
        state.user.registeredMeetups.push(id)
        state.user.fbKeys[id] = payload.fbKey
      },
      unregisterUserFromMeetup (state, payload) {
        const registeredMeetups = state.user.registeredMeetups
        registeredMeetups.splice(registeredMeetups.findIndex(meetup => meetup.id === payload), 1)
        Reflect.deleteProperty(state.user.fbKeys, payload)
      },
      setLoadedMeetups (state, payload) {
        state.loadedMeetups = payload
      },
      createMeetup (state, payload) {
        state.loadedMeetups.push(payload)
      },
      updateMeetup (state, payload) {
        const meetup = state.loadedMeetups.find(meetup => {
          return meetup.id === payload.id
        })
        if (payload.title) {
          meetup.title = payload.title
        }
        if (payload.description) {
          meetup.description = payload.description
        }
        if (payload.date) {
          meetup.date = payload.date
        }
      },
      setUser (state, payload) {
        state.user = payload
      },
      setLoading (state, payload) {
        state.loading = payload
      },
      setError (state, payload) {
        state.error = payload
      },
      clearError (state) {
        state.error = null
      }
    },
    actions: {
      registerUserForMeetup ({ commit, getters }, payload) {
        commit('setLoading', true)
        const user = getters.user
        console.log('the payload: ' + payload)
        firebase.database().ref('/users/' + user.id).child('/registrations/')
          .push(payload)
          .then(data => {
            console.log(data)
            commit('setLoading', false)
            commit('registerUserForMeetup', {
              id: payload,
              fbKey: data.key
            })
          })
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
          })
      },
      unregisterUserFromMeetup ({ commit, getters }, payload) {
        commit('setLoading', true)
        const user = getters.user
        if (!user.fbKeys) {
          console.log('This is false')
          return
        }
        const fbKey = user.fbKeys[payload]
        console.log('fbKey: ' + fbKey)
        firebase.database().ref('/users/' + user.id + '/registrations/').child(fbKey)
          .remove()
          .then(() => {
            commit('setLoading', false)
            console.log('Should be unregistered.')
            commit('unregisterUserFromMeetup', payload)
          })
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
          })
      },
      loadMeetups ({ commit }) {
        commit('setLoading', true)
        firebase.database().ref('meetups').once('value')
          .then((data) => {
            const meetups = []
            const obj = data.val() // Object with property:value pairs
            for (let key in obj) {
              meetups.push({
                id: key,
                title: obj[key].title,
                description: obj[key].description,
                imgUrl: obj[key].imgUrl,
                date: obj[key].date,
                location: obj[key].location,
                creatorId: obj[key].creatorId
              })
            }
            commit('setLoadedMeetups', meetups)
            commit('setLoading', false)
          })
          .catch((error) => {
            console.log(error)
            commit('setLoading', false)
          })
      },
      createMeetup ({ commit, getters }, payload) {
        const meetup = {
          title: payload.title,
          location: payload.location,
          description: payload.description,
          date: payload.date.toISOString(),
          creatorId: getters.user.id
        }
        let imageUrl
        let key
        firebase.database().ref('meetups').push(meetup)
          .then((data) => {
            key = data.key
            return key
          })
          .then(key => {
            const filename = payload.image.name
            const ext = filename.slice(filename.lastIndexOf('.'))
            return firebase.storage().ref('meetups/' + key + ext).put(payload.image)
          })
          .then(fileData => {
            return firebase.storage().ref(fileData.metadata.fullPath).getDownloadURL().then((url) => {
              imageUrl = url
              return firebase.database().ref('meetups').child(key).update({ imgUrl: imageUrl })
            })
          })
          .then(() => {
            commit('createMeetup', {
              ...meetup,
              imgUrl: imageUrl,
              id: key
            })
          })
          .catch((error) => {
            console.log(error)
          })
      },
      updateMeetupData ({ commit }, payload) {
        commit('setLoading', true)
        const updateObj = {}
        if (payload.title) {
          updateObj.title = payload.title
        }
        if (payload.description) {
          updateObj.description = payload.description
        }
        if (payload.date) {
          updateObj.date = payload.date
        }
        firebase.database().ref('meetups').child(payload.id).update(updateObj)
          .then(() => {
            commit('setLoading', false)
            commit('updateMeetup', payload)
          })
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
          })
      },
      signUserUp ({ commit }, payload) {
        commit('setLoading', true)
        commit('clearError')
        firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              commit('setLoading', false)
              const newUser = {
                id: user.user.uid,
                registeredMeetups: [],
                fbKeys: {}
              }
              commit('setUser', newUser)
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              commit('setError', error)
              console.log(error)
            }
          )
      },
      signUserIn ({ commit }, payload) {
        commit('setLoading', true)
        commit('clearError')
        firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
          .then(
            user => {
              commit('setLoading', false)
              const newUser = {
                id: user.user.uid,
                registeredMeetups: [],
                fbKeys: {}
              }
              commit('setUser', newUser)
            }
          )
          .catch(
            error => {
              commit('setLoading', false)
              commit('setError', error)
              console.log(error)
            }
          )
      },
      autoSignIn ({ commit }, payload) {
        commit('setUser', {
          id: payload.uid,
          registeredMeetups: [],
          fbKeys: {}
        })
      },
      fetchUserData ({ commit, getters }) {
        commit('setLoading', true)
        firebase.database().ref('/users/' + getters.user.id + '/registrations/').once('value')
          .then(data => {
            const dataPairs = data.val()
            let registeredMeetups = []
            let swappedPairs = {}
            for (
              let key in dataPairs) {
              registeredMeetups.push(dataPairs[key])
              swappedPairs[dataPairs[key]] = key
            }
            const updatedUser = {
              id: getters.user.id,
              registeredMeetups: registeredMeetups,
              fbKeys: swappedPairs
            }
            commit('setLoading', false)
            commit('setUser', updatedUser)
          })
          .catch(error => {
            console.log(error)
            commit('setLoading', false)
          })
      },
      logout ({ commit }) {
        firebase.auth().signOut()
        commit('setUser', null)
      }
    },
    getters: {
      loadedMeetups (state) {
        return state.loadedMeetups.sort((meetupA, meetupB) => {
          return meetupA.date > meetupB.date
        })
      },
      featuredMeetups (state, getters) {
        return getters.loadedMeetups.slice(0, 5)
      },
      loadedMeetup (state) {
        return (meetupId) => {
          return state.loadedMeetups.find((meetup) => {
            return meetup.id === meetupId
          })
        }
      },
      user (state) {
        return state.user
      },
      loading (state) {
        return state.loading
      },
      error (state) {
        return state.error
      }
    }
  })
}

export default createStore
