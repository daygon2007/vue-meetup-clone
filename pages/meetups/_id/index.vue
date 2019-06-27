<template>
    <v-container>
        <v-layout v-if="loading">
          <v-flex xs12 class="text-xs-center">
            <v-progress-circular
              indeterminate
              color="primary"
              width="7"
              size="70"
            ></v-progress-circular>
          </v-flex>
        </v-layout>
        <v-layout align-center justify-center row wrap v-if="meetup">
            <v-flex xs12 md8>
                <v-card>
                    <v-layout align-center justify-center row wrap>
                        <v-flex xs11>
                        <v-card-title class="pl-0 ml-0">
                            <h1 class="primary--text" >{{ meetup.title }}</h1>
                            <template v-if="userIsCreator">
                              <v-spacer></v-spacer>
                              <app-edit-meetup-details-dialog :meetup="meetup" v-if="meetup"></app-edit-meetup-details-dialog>
                            </template>
                        </v-card-title>
                            <v-img
                                :src="meetup.imgUrl"
                                height="400px"
                            ></v-img>
                            <v-card-text  class="pl-0 ml-0">
                                <div class="font-weight-bold info--text">{{ meetup.date | date }} - {{ meetup.location }}</div>
                                <div v-if="userIsCreator"><app-edit-meetup-date-dialog :meetup="meetup"></app-edit-meetup-date-dialog><app-edit-meetup-time-dialog :meetup="meetup"></app-edit-meetup-time-dialog></div>
                                <div>{{ meetup.description }}</div>
                            </v-card-text>
                            <div class="text-lg-right">
                            <v-card-actions class="pr-0 mr-0">
                                <v-spacer></v-spacer>
                                <app-register-dialog :meetupId="meetup.id" v-if="userIsAuthenticated && !userIsCreator"></app-register-dialog>
                            </v-card-actions>
                            </div>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  export default {
    props: ['id'],
    computed: {
      meetup () {
        return this.$store.getters.loadedMeetup(this.$route.params.id)
      },
      loading () {
        return this.$store.getters.loading
      },
      userIsAuthenticated () {
        return this.$store.getters.user !== null && this.$store.getters.user !== undefined
      },
      userIsCreator () {
        if (!this.userIsAuthenticated) {
          return false
        }
        return this.$store.getters.user.id === this.meetup.creatorId
      }
    }
  }
</script>
