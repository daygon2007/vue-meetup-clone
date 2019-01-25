<template>
    <v-dialog width="350px" persistent v-model="editDialog">
        <v-btn accent slot="activator">
            Edit Date
        </v-btn>
        <v-card>
            <v-container>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-card-title>Edit Meetup Date</v-card-title>
                    </v-flex>
                </v-layout>
                <v-divider></v-divider>
                <v-layout row wrap>
                    <v-flex xs12>
                        <v-date-picker v-model="editableDate" style="width:100%" actions>
                            <template slot-scope="{save, cancel}">
                                <v-btn class="blue--text darken-1" flat @click.native="editDialog = false">Close</v-btn>
                                <v-btn class="primary" flat @click.native="onSaveChanges">save</v-btn>
                            </template>
                        </v-date-picker>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
    var moment = require('moment')
    export default {
      props: ['meetup'],
      data () {
        return {
          editDialog: false,
          editableDate: null
        }
      },
      methods: {
        onSaveChanges () {
          const newDate = new Date(this.meetup.date)
          const newDay = new Date(this.editableDate).getUTCDate()
          const newMonth = new Date(this.editableDate).getUTCMonth()
          const newYear = new Date(this.editableDate).getUTCFullYear()
          newDate.setUTCDate(newDay)
          newDate.setUTCMonth(newMonth)
          newDate.setUTCFullYear(newYear)
          console.log('New Date: ' + newDate)
          // newDate.setHours(newDate.getHours() + (newDate.getTimezoneOffset() / 60))
          this.$store.dispatch('updateMeetupData', {
            id: this.meetup.id,
            date: newDate
          })
          this.editDialog = false
        }
      },
      created () {
        this.editableDate = moment(this.meetup.date).format('YYYY-MM-DD')
        console.log('Actual Meetup Date:' + this.meetup.date)
      }
    }
</script>