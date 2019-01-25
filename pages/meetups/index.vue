<template>
    <v-container>
        <v-layout row wrap align-center justify-center v-for="meetup in meetups" :key="meetup.id" class="mb-2">
            <v-flex xs12 md5>
                <v-card class="grey darken-3">
                    <v-container fluid>
                        <v-layout row wrap>
                            <v-flex xs12 md4>
                                <v-img
                                    :src="meetup.imgUrl"
                                    height="130px"
                                ></v-img>
                            </v-flex>
                            <v-flex xs12 md8>
                                <v-card-title primary-title>
                                    <div>
                                      <h3 class="headline white--text">{{ meetup.title }}</h3>
                                      <span class="white--text">{{ meetup.date | date }}</span>
                                    </div>
                                </v-card-title>
                                <v-card-actions>
                                    <v-btn :to="'/meetups/' + meetup.id"><v-icon left light>arrow_forward</v-icon>View Meetup</v-btn>
                                </v-card-actions>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  export default {
    computed: {
      meetups () {
        return this.$store.getters.loadedMeetups
      }
    }
  }
</script>