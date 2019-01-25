module.exports = {
  debug: true,
  /*
  ** Headers of the page
  */
  head: {
    title: 'meetup',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js + Vuetify.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ]
  },
  plugins: [
    { src: '~/plugins/firebase.js', ssr: false },
    { src: '~/plugins/vuetify.js', ssr: true},
    { src: '~/plugins/filters.js', ssr: false },
    { src: '~/plugins/alert.js', ssr: true },
    { src: '~/plugins/edit-meetup.js', ssr: true },
    { src: '~/plugins/register.js', ssr: true },
    { src: '~/plugins/loadMeetups.js', ssr: false }
  ],
  css: ['~/assets/style/app.styl'],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    extend (config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
