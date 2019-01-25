<template>
  <v-container>
    <v-layout row wrap class="mb-3">
      <v-flex xs12 sm6 column class="text-sm-right text-xs-center">
        <v-btn large router to="/meetups" class="info">Explore Meetups</v-btn>
      </v-flex>
      <v-flex xs12 sm6 column class="text-sm-left text-xs-center">
        <v-btn large router to="/meetups/create" class="info">Organize Meetup</v-btn>
      </v-flex>
    </v-layout>
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
    <v-layout row wrap v-if="!loading">
      <v-flex xs12>
        <v-carousel style="cursor: pointer;">
          <v-carousel-item
            v-for="(item,i) in meetups"
            :key="item.id"
            :src="item.imgUrl"
            @click="onLoadMeetup(item.id)"
          >
            <div class="slide-title">{{item.title}}</div>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    computed: {
      meetups () {
        return this.$store.getters.loadedMeetups
      },
      loading () {
        return this.$store.getters.loading
      }
    },
    methods: {
      onLoadMeetup (id) {
        this.$router.push('/meetups/' + id)
      }
    },
    mounted () {
    }
  }
</script>

<style scoped>
  .slide-title{
    position: absolute;
    bottom: 50px;
    background-color: rgba(0,0,0,0.5);
    color: #fff;
    left:50%;
    transform: translateX(-50%);
    font-size: 2em;
    padding: 15px 30px;
    border-radius: 5px 5px 0 0;
  }
</style>
