<template>
    <v-container>
        <v-layout row>
            <v-flex xs11 offset-md1>
                <h1>Create a new Meetup</h1>
            </v-flex>
        </v-layout>
        <v-layout row>
            <v-flex xs12>
                <v-form @submit.prevent="onCreateMeetup">
                    <v-layout row wrap>
                        <v-flex xs12 md4 offset-md1>
                            <v-text-field
                                name="title"
                                label="Title"
                                id="title"
                                v-model="title"
                                required></v-text-field>
                        </v-flex>
                        <v-flex xs12 md4 offset-md1>
                            <v-text-field
                                name="location"
                                label="Location"
                                id="location"
                                v-model="location"
                                required></v-text-field>
                        </v-flex>
                        <v-flex xs12 md4 offset-md1>
                            <v-btn raised class="primary" @click="onPickFile">Upload Image</v-btn>
                            <input type="file" style="display:none" ref="fileInput" accept="image/*" @change="onFilePicked">
                        </v-flex>
                        <v-flex xs12 md4 offset-md1>
                            <v-img
                                :src="imgUrl"
                                height="150px"
                                ></v-img>
                        </v-flex>
                        <v-flex xs12 md4 offset-md1>
                            <v-textarea
                                name="description"
                                label="Description"
                                id="description"
                                v-model="description"
                                
                                required></v-textarea>
                        </v-flex>
                    </v-layout>
                    <v-layout row wrap>
                        <v-flex xs12 md4 offset-md1>
                            <h3>Choose a Date</h3>
                            <v-date-picker landscape v-model="date"></v-date-picker>
                        </v-flex>
                        <v-flex xs12 md4 offset-md1>
                            <h3>Choose a Time</h3>
                            <v-time-picker landscape v-model="time"></v-time-picker>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs11 offset-xs1 >
                            <v-btn class="primary" :disabled="!formIsValid" type="submit">Create Meetup</v-btn>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
  var moment = require('moment')
  export default {
    data () {
      return {
        title: '',
        location: '',
        imgUrl: '',
        description: '',
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HH:mm'),
        image: null
      }
    },
    computed: {
      formIsValid () {
        return this.title !== '' &&
               this.location !== '' &&
               this.imgUrl !== '' &&
               this.description !== ''
      },
      submittableDateTime () {
        const date = new Date(this.date)
        date.setHours(date.getHours() + (date.getTimezoneOffset() / 60))
        if (typeof this.time === 'string') {
          const hours = this.time.match(/^(\d+)/)[1]
          const minutes = this.time.match(/:(\d+)/)[1]
          console.log('Hours: ' + hours)
          console.log('Minutes: ' + minutes)
          date.setHours(hours)
          date.setMinutes(minutes)
        } else {
          date.setHours(moment(this.time).format('hh'))
          date.setMinutes(moment(this.time).format('mm'))
        }
        return date
      }
    },
    methods: {
      onCreateMeetup () {
        if (!this.formIsValid) {
          return
        }
        if (!this.image) {
          return
        }
        const meetupData = {
          title: this.title,
          location: this.location,
          image: this.image,
          description: this.description,
          date: this.submittableDateTime
        }
        this.$store.dispatch('createMeetup', meetupData)
        this.$router.push('/meetups')
      },
      onPickFile () {
        this.$refs.fileInput.click()
      },
      onFilePicked (event) {
        const files = event.target.files
        let filename = files[0].name
        if (filename.lastIndexOf('.') <= 0) {
          return alert('Please add valid file!')
        }
        const fileReader = new FileReader()
        fileReader.addEventListener('load', () => {
          this.imgUrl = fileReader.result
        })
        fileReader.readAsDataURL(files[0])
        this.image = files[0]
      }
    },
    middleware: 'auth-guard'
  }
</script>