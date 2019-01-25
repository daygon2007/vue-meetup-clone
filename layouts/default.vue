<template>
  <v-app>
    <v-navigation-drawer v-model="sideNav" fixed app dark>
      <v-list>
        <v-list-tile v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-list-tile-action>
            <v-icon left>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content right>{{item.title}}</v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="userIsAuthenticated" @click="onLogout">
          <v-list-tile-action>
            <v-icon left>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content right>Logout</v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app dark class="primary">
      <v-toolbar-side-icon @click.native.stop="sideNav = !sideNav"></v-toolbar-side-icon>
      <v-toolbar-title><nuxt-link to="/" tag="span" style="cursor: pointer;">Vue/Nuxt Firebase Meetup App</nuxt-link></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat v-for="item in menuItems" :key="item.title" router :to="item.link"><v-icon>{{item.icon}}</v-icon>{{item.title}}</v-btn>
        <v-btn flat v-if="userIsAuthenticated" @click="onLogout"><v-icon>exit_to_app</v-icon>Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
   <main>
     <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
   </main>
  </v-app>
</template>

<script>
  export default {
    data () {
      return {
        sideNav: false
      }
    },
    computed: {
      menuItems () {
        let menuItems = [
          { icon: 'face', title: 'Sign Up', link: '/signup' },
          { icon: 'lock_open', title: 'Sign In', link: '/signin' }
        ]
        if (this.userIsAuthenticated) {
          menuItems = [
            { icon: 'supervisor_account', title: 'View Meetups', link: '/meetups' },
            { icon: 'room', title: 'Organize Meetup', link: '/meetups/create' },
            { icon: 'person', title: 'Profile', link: '/user' }
          ]
        }
        return menuItems
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      }
    },
    methods: {
      onLogout () {
        this.$store.dispatch('logout')
      }
    }
  }
</script>
